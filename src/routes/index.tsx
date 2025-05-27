import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import Layout from '../components/layout/Layout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import DepartmentsPage from '../pages/departments/DepartmentsPage';
import StudentsPage from '../pages/students/StudentsPage';
import AddStudentPage from '../pages/students/AddStudentPage';
import TakeAttendancePage from '../pages/attendance/TakeAttendancePage';
import ReportsPage from '../pages/reports/ReportsPage';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth route wrapper (redirects to dashboard if already authenticated)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />
        },
        {
          path: 'departments',
          element: <DepartmentsPage />
        },
        {
          path: 'students',
          element: <StudentsPage />
        },
        {
          path: 'students/add',
          element: <AddStudentPage />
        },
        {
          path: 'students/edit/:id',
          element: <AddStudentPage />
        },
        {
          path: 'attendance',
          element: <TakeAttendancePage />
        },
        {
          path: 'reports',
          element: <ReportsPage />
        }
      ]
    },
    {
      path: '/login',
      element: (
        <AuthRoute>
          <LoginPage />
        </AuthRoute>
      )
    },
    {
      path: '/signup',
      element: (
        <AuthRoute>
          <SignupPage />
        </AuthRoute>
      )
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);
  
  return <RouterProvider router={router} />;
};

export default AppRoutes;