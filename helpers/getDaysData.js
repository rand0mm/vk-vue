function dateToYMD(time) {
    var d = time.getDate();
    var m = time.getMonth() + 1;
    var y = time.getFullYear();
    return  (d <= 9 ? '0' + d : d) + '-'+(m <= 9 ? '0' + m : m) + '-' + y;
}

export const getCurrentMonth = (changeMonth) =>{
    const dayMilliseconds = 24 * 60 * 60 * 1000;
    let changeMonthValue = 0;
    if(changeMonth < 0) changeMonthValue = -28
    if(changeMonth  > 4) changeMonthValue = 28
    let arr = [[], [], [], []]
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 7; i++) {
            let date = new Date();
            let dayWeek = [7, 1, 2, 3, 4, 5, 6][date.getDay()];
            date.setTime(date.getTime() - dayMilliseconds * (dayWeek - 1));
            let rate = i + ((j - 1) * 7)
            date.setTime(date.getTime() + (dayMilliseconds * (rate + changeMonthValue)))
            arr[j].push(dateToYMD(date))
        }
    }
    return arr;
}

export const changeDate = (value, change, plus) => {
    const dayMilliseconds = 24 * 60 * 60 * 1000;
    let dateStr = String(value)
    let date = new Date(dateStr.substring(0, 4), Number(dateStr.substring(4, 6)) - 1, dateStr.substring(6, 8));
    if(plus) {
        date.setTime(date.getTime() + dayMilliseconds * change);

    } else {
        date.setTime(date.getTime() - dayMilliseconds * change);
    }
    return formatDate(dateToYMD(date), true)
}

export const formatDate = (str, toId) => {
    if(toId) {
        console.log(str)
        let id = str.split('-').reverse().join('')
        return Number(id)
    }
    let newStr = str.split('-')
    return newStr[0]+'.'+newStr[1]
}

export const hoursFormat = (number) => {
    return number.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  };