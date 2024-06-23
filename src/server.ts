import express from 'express';
import { PrismaClient } from '@prisma/client'
import cors from 'cors';

import { convertHourStringToMinute } from './utils/convert-hours-to-string-to-minutes';
import { convertMinutesToHourString } from './utils/convert-hour-string-to-minute';
          
const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
    log:['query']
});

app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include:{
            _count:{
                select:{
                    ads:true,
                }
            }
        }
    });

    return res.json(games);
});

app.post('/ads', (req, res) => {
    return res.json({});
});

app.post('/games/:id/ads',async (req, res) => {
    const gameId = req.params.id;
    const body = req.body;

    const ad = await prisma.ad.create({
        data:{
            gameId,
            name : body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays:body.weekDays,
            useVoiceChannel:body.useVoiceChannel,
            hourStart:convertHourStringToMinute(body.hourStart),
            hourEnd:convertHourStringToMinute(body.hourEnd),
        }
    })

    return res.status(201).json(ad);
});

app.get('/games/:id/ads', async (req:any, res:any) => {
    const gamedId = req.params.id;

    const ads = await prisma.ad.findMany({
        select:{
            id:true,
            name:true,
            weekDays:true,
            useVoiceChannel:true,
            yearsPlaying:true,
            hourStart:true,
            hourEnd:true
        },
        where:{
            gameId:gamedId
        },
        orderBy:{
            createdAt:'desc'
        }
    });

    res.json(ads.map(ad=>{
        return{
            ...ad,
            weekDays:ad.weekDays.split(','),
            hourStart:convertMinutesToHourString(ad.hourStart),
            hourEnd:convertMinutesToHourString(ad.hourEnd)
        }
    }));
});

app.get('/ads/:id/discord', async (req:any, res:any) => {
    const adId = req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select:{
            discord:true
        },
        where:{
            id:adId
        }
    })

    res.json({
        discord:ad.discord
    });
});

app.listen(3333);
