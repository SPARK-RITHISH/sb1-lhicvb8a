import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ClipboardList, 
  FileText, 
  Settings, 
  BookOpen,
  Building
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center p-2 text-base font-medium rounded-lg transition-colors',
          isActive
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-700 hover:bg-gray-100'
        )
      }
    >
      <div className="w-6 h-6 flex items-center justify-center mr-3 text-gray-500">
        {icon}
      </div>
      <span>{children}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 w-64 h-screen pt-16 pb-4 bg-white border-r border-gray-200 transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <div className="space-y-2 mt-4">
            <SidebarLink to="/" icon={<Home size={20} />} end>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/departments" icon={<Building size={20} />}>
              Departments
            </SidebarLink>
            <SidebarLink to="/students" icon={<Users size={20} />}>
              Students
            </SidebarLink>
            <SidebarLink to="/attendance" icon={<ClipboardList size={20} />}>
              Take Attendance
            </SidebarLink>
            <SidebarLink to="/reports" icon={<FileText size={20} />}>
              Reports
            </SidebarLink>
            <hr className="my-2 border-gray-200" />
            <SidebarLink to="/settings" icon={<Settings size={20} />}>
              Settings
            </SidebarLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;