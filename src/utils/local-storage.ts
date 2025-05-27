import { User, Department, Student, Attendance } from '../types';

const STORAGE_KEYS = {
  USER: 'ams-user',
  DEPARTMENTS: 'ams-departments',
  STUDENTS: 'ams-students',
  ATTENDANCE: 'ams-attendance'
};

// User storage
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Department storage
export const saveDepartments = (departments: Department[]): void => {
  localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
};

export const getDepartments = (): Department[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
  return data ? JSON.parse(data) : [];
};

export const addDepartment = (department: Department): void => {
  const departments = getDepartments();
  departments.push(department);
  saveDepartments(departments);
};

// Student storage
export const saveStudents = (students: Student[]): void => {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return data ? JSON.parse(data) : [];
};

export const addStudent = (student: Student): void => {
  const students = getStudents();
  students.push(student);
  saveStudents(students);
};

export const getStudentsByDepartmentAndYear = (departmentId: string, yearId: string): Student[] => {
  const students = getStudents();
  return students.filter(
    student => student.departmentId === departmentId && student.yearId === yearId
  );
};

// Attendance storage
export const saveAttendance = (attendanceRecords: Attendance[]): void => {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
};

export const getAttendance = (): Attendance[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return data ? JSON.parse(data) : [];
};

export const addAttendanceRecord = (record: Attendance): void => {
  const attendance = getAttendance();
  attendance.push(record);
  saveAttendance(attendance);
};

export const updateAttendanceRecord = (updatedRecord: Attendance): void => {
  const attendance = getAttendance();
  const index = attendance.findIndex(
    record => 
      record.studentId === updatedRecord.studentId && 
      record.date === updatedRecord.date && 
      record.period === updatedRecord.period
  );
  
  if (index !== -1) {
    attendance[index] = updatedRecord;
    saveAttendance(attendance);
  }
};

export const getAttendanceByDateAndPeriod = (
  date: string,
  period: number,
  departmentId?: string,
  yearId?: string
): Attendance[] => {
  const attendance = getAttendance();
  return attendance.filter(record => {
    let match = record.date === date && record.period === period;
    if (departmentId) match = match && record.departmentId === departmentId;
    if (yearId) match = match && record.yearId === yearId;
    return match;
  });
};

export const getAttendanceByDateRange = (
  startDate: string,
  endDate: string,
  departmentId?: string,
  yearId?: string
): Attendance[] => {
  const attendance = getAttendance();
  return attendance.filter(record => {
    let match = record.date >= startDate && record.date <= endDate;
    if (departmentId) match = match && record.departmentId === departmentId;
    if (yearId) match = match && record.yearId === yearId;
    return match;
  });
};