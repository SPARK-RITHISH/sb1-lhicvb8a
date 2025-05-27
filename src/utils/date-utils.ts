import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const getCurrentWeekDates = () => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const end = endOfWeek(today, { weekStartsOn: 1 });
  
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    days: eachDayOfInterval({ start, end }).map(date => formatDate(date))
  };
};

export const getCurrentMonthDates = () => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    days: eachDayOfInterval({ start, end }).map(date => formatDate(date))
  };
};

export const getDatesBetween = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return eachDayOfInterval({ start, end }).map(date => formatDate(date));
};

export const getMonthName = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM yyyy');
};