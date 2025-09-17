import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center">
              <img 
                src="image.png" 
                alt="College Logo" 
                className="h-12 w-12 mr-3"
              />
              <div>
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-indigo-700">
                  GASC
                </span>
                <span className="block text-sm font-medium text-gray-500">
                  Attendance Management System
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center">
            <button className="p-1 mr-4 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100">
              <Bell size={20} />
            </button>
            
            <div className="relative">
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
                <div className="relative w-10 h-10 overflow-hidden bg-indigo-100 rounded-full">
                  <User className="absolute w-6 h-6 text-gray-600 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={logout}
                  leftIcon={<LogOut size={18} />}
                >
                  <span className="sr-only md:not-sr-only md:ml-2">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
