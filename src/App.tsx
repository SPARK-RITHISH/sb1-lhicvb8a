import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { DepartmentProvider } from './context/DepartmentContext';
import { StudentProvider } from './context/StudentContext';
import { AttendanceProvider } from './context/AttendanceContext';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <DepartmentProvider>
        <StudentProvider>
          <AttendanceProvider>
            <AppRoutes />
          </AttendanceProvider>
        </StudentProvider>
      </DepartmentProvider>
    </AuthProvider>
  );
}

export default App;