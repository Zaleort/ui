import es from '@/locale/es';

const utils = {
  useUtc: false,
  getFullYear(date: Date) {
    return this.useUtc ? date.getUTCFullYear() : date.getFullYear();
  },

  getMonth(date: Date) {
    return this.useUtc ? date.getUTCMonth() : date.getMonth();
  },

  getDate(date: Date) {
    return this.useUtc ? date.getUTCDate() : date.getDate();
  },

  getDay(date: Date) {
    return this.useUtc ? date.getUTCDay() : date.getDay();
  },

  getHours(date: Date) {
    return this.useUtc ? date.getUTCHours() : date.getHours();
  },

  getMinutes(date: Date) {
    return this.useUtc ? date.getUTCMinutes() : date.getMinutes();
  },

  setFullYear(date: Date, value: number) {
    return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value);
  },

  setMonth(date: Date, value: number) {
    return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value);
  },

  setDate(date: Date, value: number) {
    return this.useUtc ? date.setUTCDate(value) : date.setDate(value);
  },

  compareDates(date1: Date, date2: Date) {
    const d1 = new Date(date1.getTime());
    const d2 = new Date(date2.getTime());

    if (this.useUtc) {
      d1.setUTCHours(0, 0, 0, 0);
      d2.setUTCHours(0, 0, 0, 0);
    } else {
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
    }

    return d1.getTime() === d2.getTime();
  },

  isValidDate(date: Date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false;
    }
    return !isNaN(date.getTime());
  },

  getDayNameAbbr(date: Date, days: any) {
    if (typeof date !== 'object') {
      throw TypeError('Invalid Type');
    }

    return days[this.getDay(date)];
  },

  getMonthName(month: number | Date, months: any) {
    if (!months) {
      throw Error('missing 2nd parameter Months array');
    }
    if (typeof month === 'object') {
      return months[this.getMonth(month)];
    }
    if (typeof month === 'number') {
      return months[month];
    }

    throw TypeError('Invalid type');
  },

  getMonthNameAbbr(month: number | Date, monthsAbbr: string) {
    if (!monthsAbbr) {
      throw Error('missing 2nd paramter Months array');
    }
    if (typeof month === 'object') {
      return monthsAbbr[this.getMonth(month)];
    }
    if (typeof month === 'number') {
      return monthsAbbr[month];
    }
    throw TypeError('Invalid type');
  },

  daysInMonth(year: number, month: number) {
    return /8|3|5|10/.test(month.toString()) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31;
  },

  getNthSuffix(day: number) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return 'st';
      case 2:
      case 22:
        return 'nd';
      case 3:
      case 23:
        return 'rd';
      default:
        return 'th';
    }
  },

  formatDate(date: Date, format: string, translation: any) {
    translation = (!translation) ? es : translation;
    const year = this.getFullYear(date);
    const month = this.getMonth(date) + 1;
    const day = this.getDate(date);
    const str = format
      .replace(/dd/, (`0${day}`).slice(-2))
      .replace(/d/, day.toString())
      .replace(/yyyy/, year.toString())
      .replace(/yy/, String(year).slice(2))
      .replace(/MMMM/, this.getMonthName(this.getMonth(date), translation.months))
      .replace(/MMM/, this.getMonthNameAbbr(this.getMonth(date), translation.monthsAbbr))
      .replace(/MM/, (`0${month}`).slice(-2))
      .replace(/M(?!a|ä|e)/, month.toString())
      .replace(/su/, this.getNthSuffix(this.getDate(date)))
      .replace(/D(?!e|é|i)/, this.getDayNameAbbr(date, translation.days));
    return str;
  },

  createDateArray(start: number | Date, end: number | Date) {
    const dates = [];
    while (start <= end) {
      dates.push(new Date(start));
      start = this.setDate(new Date(start), this.getDate(new Date(start)) + 1);
    }
    return dates;
  },

  validateDateInput(val: any) {
    return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number';
  },
};

export const makeDateUtils = (useUtc: boolean) => ({ ...utils, useUtc });

export default {
  ...utils,
};
