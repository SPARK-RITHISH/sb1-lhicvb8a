export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Year {
  id: string;
  name: string;
  code: string;
}

export const academicYears = [
  { id: '1', name: 'First Year', code: 'FY' },
  { id: '2', name: 'Second Year', code: 'SY' },
  { id: '3', name: 'Third Year', code: 'TY' },
  { id: '4', name: 'PG First Year', code: 'PG1' },
  { id: '5', name: 'PG Second Year', code: 'PG2' },
];

export interface Student {
  id: string;
  name: string;
  regNumber: string;
  departmentId: string;
  yearId: string;
  email?: string;
  phoneNumber?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  period: number;
  status: AttendanceStatus;
  departmentId: string;
  yearId: string;
}

export interface AttendanceRecord {
  student: Student;
  periods: {
    [key: number]: AttendanceStatus;
  };
}

export interface AttendanceReportFilter {
  departmentId?: string;
  yearId?: string;
  startDate?: string;
  endDate?: string;
}