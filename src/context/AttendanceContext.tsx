import React, { createContext, useContext, useState, useEffect } from 'react';
import { Attendance, AttendanceStatus, Student, AttendanceRecord } from '../types';
import { 
  getAttendance, 
  saveAttendance, 
  getAttendanceByDateAndPeriod, 
  getAttendanceByDateRange 
} from '../utils/local-storage';
import { useStudents } from './StudentContext';
import { getDatesBetween } from '../utils/date-utils';

interface AttendanceContextType {
  attendanceRecords: Attendance[];
  isLoading: boolean;
  markAttendance: (
    studentId: string,
    date: string,
    period: number,
    status: AttendanceStatus,
    departmentId: string,
    yearId: string
  ) => void;
  getAttendanceForDate: (
    date: string,
    period: number,
    departmentId?: string,
    yearId?: string
  ) => Attendance[];
  getAttendanceForDateRange: (
    startDate: string,
    endDate: string,
    departmentId?: string,
    yearId?: string
  ) => Attendance[];
  getProcessedAttendanceRecords: (
    startDate: string,
    endDate: string,
    departmentId: string,
    yearId: string
  ) => AttendanceRecord[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { students, getStudent } = useStudents();

  useEffect(() => {
    // Load attendance records from localStorage
    const loadedRecords = getAttendance();
    setAttendanceRecords(loadedRecords);
    setIsLoading(false);
  }, []);

  const markAttendance = (
    studentId: string,
    date: string,
    period: number,
    status: AttendanceStatus,
    departmentId: string,
    yearId: string
  ) => {
    // Check if record already exists
    const existingRecord = attendanceRecords.find(
      record => 
        record.studentId === studentId && 
        record.date === date && 
        record.period === period
    );
    
    if (existingRecord) {
      // Update existing record
      const updatedRecords = attendanceRecords.map(record => 
        (record.studentId === studentId && record.date === date && record.period === period)
          ? { ...record, status }
          : record
      );
      
      setAttendanceRecords(updatedRecords);
      saveAttendance(updatedRecords);
    } else {
      // Create new record
      const newRecord: Attendance = {
        id: Date.now().toString(),
        studentId,
        date,
        period,
        status,
        departmentId,
        yearId
      };
      
      const updatedRecords = [...attendanceRecords, newRecord];
      setAttendanceRecords(updatedRecords);
      saveAttendance(updatedRecords);
    }
  };

  const getAttendanceForDate = (
    date: string,
    period: number,
    departmentId?: string,
    yearId?: string
  ) => {
    return getAttendanceByDateAndPeriod(date, period, departmentId, yearId);
  };

  const getAttendanceForDateRange = (
    startDate: string,
    endDate: string,
    departmentId?: string,
    yearId?: string
  ) => {
    return getAttendanceByDateRange(startDate, endDate, departmentId, yearId);
  };

  const getProcessedAttendanceRecords = (
    startDate: string,
    endDate: string,
    departmentId: string,
    yearId: string
  ): AttendanceRecord[] => {
    // Get all attendance records for the date range, department, and year
    const records = getAttendanceByDateRange(startDate, endDate, departmentId, yearId);
    
    // Get all students for the department and year
    const relevantStudents = students.filter(
      student => student.departmentId === departmentId && student.yearId === yearId
    );
    
    // Create a map of attendance records by student ID
    const attendanceByStudent: { [studentId: string]: { [key: string]: AttendanceStatus } } = {};
    
    records.forEach(record => {
      if (!attendanceByStudent[record.studentId]) {
        attendanceByStudent[record.studentId] = {};
      }
      
      attendanceByStudent[record.studentId][record.period] = record.status;
    });
    
    // Create the final processed records
    return relevantStudents.map(student => {
      const studentAttendance = attendanceByStudent[student.id] || {};
      
      return {
        student,
        periods: studentAttendance
      };
    });
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        isLoading,
        markAttendance,
        getAttendanceForDate,
        getAttendanceForDateRange,
        getProcessedAttendanceRecords
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};