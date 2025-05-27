import React, { createContext, useContext, useState, useEffect } from 'react';
import { Department } from '../types';
import { getDepartments, saveDepartments } from '../utils/local-storage';

interface DepartmentContextType {
  departments: Department[];
  isLoading: boolean;
  addDepartment: (department: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  getDepartment: (id: string) => Department | undefined;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const DepartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load departments from localStorage
    const loadedDepartments = getDepartments();
    
    if (loadedDepartments.length === 0) {
      // Add some default departments if none exist
      const defaultDepartments: Department[] = [
        { id: '1', name: 'Computer Science', code: 'CS' },
        { id: '2', name: 'Electrical Engineering', code: 'EE' },
        { id: '3', name: 'Mechanical Engineering', code: 'ME' },
        { id: '4', name: 'Civil Engineering', code: 'CE' }
      ];
      
      setDepartments(defaultDepartments);
      saveDepartments(defaultDepartments);
    } else {
      setDepartments(loadedDepartments);
    }
    
    setIsLoading(false);
  }, []);

  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newDepartment: Department = {
      ...department,
      id: Date.now().toString()
    };
    
    const updatedDepartments = [...departments, newDepartment];
    setDepartments(updatedDepartments);
    saveDepartments(updatedDepartments);
  };

  const updateDepartment = (id: string, departmentData: Partial<Department>) => {
    const updatedDepartments = departments.map(dept => 
      dept.id === id ? { ...dept, ...departmentData } : dept
    );
    
    setDepartments(updatedDepartments);
    saveDepartments(updatedDepartments);
  };

  const getDepartment = (id: string) => {
    return departments.find(dept => dept.id === id);
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        isLoading,
        addDepartment,
        updateDepartment,
        getDepartment
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartments must be used within a DepartmentProvider');
  }
  return context;
};