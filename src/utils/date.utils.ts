
const pad0 = (str: string | number) => str.toString().padStart(2, '0');

export const miniDateUtils = {
    convertDate(date: Date) {
        return date.getFullYear() + "-" 
            + pad0(date.getMonth() + 1) 
            + "-" + pad0(date.getDate());
    },
    convertTime(date: Date) {
        return pad0(date.getHours()) + ":" 
            + pad0(date.getMinutes()) + ":" 
            + pad0(date.getSeconds());
    },
    convertDateAndTime(date: Date) {
        return miniDateUtils.convertDate(date) 
            + ' ' + miniDateUtils.convertTime(date);  
    }
}