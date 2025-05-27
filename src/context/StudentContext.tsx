import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student } from '../types';
import { getStudents, saveStudents } from '../utils/local-storage';

interface StudentContextType {
  students: Student[];
  isLoading: boolean;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  getStudent: (id: string) => Student | undefined;
  getStudentsByDepartment: (departmentId: string) => Student[];
  getStudentsByDepartmentAndYear: (departmentId: string, yearId: string) => Student[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load students from localStorage
    const loadedStudents = getStudents();
    
    if (loadedStudents.length === 0) {
      // Add some sample students for demo purposes
      const sampleStudents: Student[] = [
        { 
          id: '1', 
          name: 'John Doe', 
          regNumber: 'CS2020001', 
          departmentId: '1', // Computer Science
          yearId: '2', // Second Year
          email: 'john.doe@example.com' 
        },
        { 
          id: '2', 
          name: 'Jane Smith', 
          regNumber: 'CS2020002', 
          departmentId: '1', // Computer Science
          yearId: '2', // Second Year
          email: 'jane.smith@example.com' 
        },
        { 
          id: '3', 
          name: 'Michael Johnson', 
          regNumber: 'EE2021001', 
          departmentId: '2', // Electrical Engineering
          yearId: '1', // First Year
          email: 'michael.j@example.com' 
        }
      ];
      
      setStudents(sampleStudents);
      saveStudents(sampleStudents);
    } else {
      setStudents(loadedStudents);
    }
    
    setIsLoading(false);
  }, []);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString()
    };
    
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    const updatedStudents = students.map(student => 
      student.id === id ? { ...student, ...studentData } : student
    );
    
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
  };

  const getStudent = (id: string) => {
    return students.find(student => student.id === id);
  };

  const getStudentsByDepartment = (departmentId: string) => {
    return students.filter(student => student.departmentId === departmentId);
  };

  const getStudentsByDepartmentAndYear = (departmentId: string, yearId: string) => {
    return students.filter(
      student => student.departmentId === departmentId && student.yearId === yearId
    );
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        isLoading,
        addStudent,
        updateStudent,
        getStudent,
        getStudentsByDepartment,
        getStudentsByDepartmentAndYear
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};