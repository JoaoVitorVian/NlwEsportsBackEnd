export function convertMinutesToHourString(number: number){
 const  hours = Math.floor(number / 60);

 const minutes = number % 60;

 return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

}