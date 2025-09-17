import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ClipboardList, 
  FileText, 
  Building,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useDepartments } from '../../context/DepartmentContext';
import { useStudents } from '../../context/StudentContext';
import { useAttendance } from '../../context/AttendanceContext';
import { getCurrentWeekDates, getCurrentMonthDates, formatDisplayDate } from '../../utils/date-utils';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Section from '../../components/ui/Section';
import Button from '../../components/ui/Button';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  linkTo?: string;
}> = ({ title, value, icon, trend, trendUp, linkTo }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            {trend && (
              <p className={`text-xs mt-2 flex items-center ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="mr-1">
                  {trendUp ? <TrendingUp size={14} /> : <TrendingUp className="transform rotate-180" size={14} />}
                </span>
                {trend}
              </p>
            )}
          </div>
          <div className="p-3 bg-indigo-100 rounded-full">
            {icon}
          </div>
        </div>
        
        {linkTo && (
          <div className="mt-4">
            <Link to={linkTo} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View details →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const { departments } = useDepartments();
  const { students } = useStudents();
  const { attendanceRecords } = useAttendance();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const today = new Date().toISOString().split('T')[0];
  const { startDate: weekStart, endDate: weekEnd } = getCurrentWeekDates();
  const { startDate: monthStart, endDate: monthEnd } = getCurrentMonthDates();
  
  const attendanceCountByStatus = (
    startDate: string,
    endDate: string,
    status: string
  ) => {
    return attendanceRecords.filter(
      record => 
        record.status === status && 
        record.date >= startDate && 
        record.date <= endDate
    ).length;
  };
  
  const getAttendanceStats = () => {
    let startDate = today;
    let endDate = today;
    
    if (selectedPeriod === 'week') {
      startDate = weekStart;
      endDate = weekEnd;
    } else if (selectedPeriod === 'month') {
      startDate = monthStart;
      endDate = monthEnd;
    }
    
    const present = attendanceCountByStatus(startDate, endDate, 'present');
    const absent = attendanceCountByStatus(startDate, endDate, 'absent');
    const late = attendanceCountByStatus(startDate, endDate, 'late');
    const excused = attendanceCountByStatus(startDate, endDate, 'excused');
    const total = present + absent + late + excused;
    
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return {
      present,
      absent,
      late,
      excused,
      total,
      presentPercentage
    };
  };
  
  const stats = getAttendanceStats();
  
  const recentActivity = [
    {
      id: 1,
      action: "Attendance taken",
      department: "Computer Science",
      time: "10 minutes ago",
      detail: "First Year - Period 1"
    },
    {
      id: 2,
      action: "Student added",
      department: "Electrical Engineering",
      time: "2 hours ago",
      detail: "John Smith (EE2023015)"
    },
    {
      id: 3,
      action: "Report generated",
      department: "Mechanical Engineering",
      time: "Yesterday",
      detail: "Monthly attendance report"
    }
  ];
  
  return (
    <div className="space-y-6">
      <Section
        title="Welcome to GASC Attendance Management System"
        description="Track and manage student attendance efficiently"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button 
              variant={selectedPeriod === 'today' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setSelectedPeriod('today')}
            >
              Today
            </Button>
            <Button 
              variant={selectedPeriod === 'week' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setSelectedPeriod('week')}
            >
              This Week
            </Button>
            <Button 
              variant={selectedPeriod === 'month' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setSelectedPeriod('month')}
            >
              This Month
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={students.length}
            icon={<Users size={24} className="text-indigo-600" />}
            trend="5% increase"
            trendUp={true}
            linkTo="/students"
          />
          <StatCard
            title="Departments"
            value={departments.length}
            icon={<Building size={24} className="text-indigo-600" />}
            linkTo="/departments"
          />
          <StatCard
            title="Attendance Rate"
            value={`${stats.presentPercentage}%`}
            icon={<ClipboardList size={24} className="text-indigo-600" />}
            trend={stats.presentPercentage > 80 ? "Good attendance" : "Needs improvement"}
            trendUp={stats.presentPercentage > 80}
            linkTo="/reports"
          />
          <StatCard
            title="Total Records"
            value={stats.total}
            icon={<FileText size={24} className="text-indigo-600" />}
            linkTo="/attendance"
          />
        </div>
      </Section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pt-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Present</span>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {stats.presentPercentage}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.present}</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-800">Absent</span>
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.absent}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-800">Late</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.late}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">Excused</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {stats.total > 0 ? Math.round((stats.excused / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.excused}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-500">Attendance Distribution</h4>
                    <p className="text-xs text-gray-500">
                      {selectedPeriod === 'today' ? formatDisplayDate(today) : 
                       selectedPeriod === 'week' ? `${formatDisplayDate(weekStart)} - ${formatDisplayDate(weekEnd)}` :
                       `${formatDisplayDate(monthStart)} - ${formatDisplayDate(monthEnd)}`}
                    </p>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="flex rounded-full h-2.5 overflow-hidden">
                      <div className="bg-green-600" style={{ width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%` }}></div>
                      <div className="bg-yellow-500" style={{ width: `${stats.total > 0 ? (stats.late / stats.total) * 100 : 0}%` }}></div>
                      <div className="bg-blue-500" style={{ width: `${stats.total > 0 ? (stats.excused / stats.total) * 100 : 0}%` }}></div>
                      <div className="bg-red-600" style={{ width: `${stats.total > 0 ? (stats.absent / stats.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap mt-3 text-xs gap-x-4">
                    <div className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-1 rounded-full bg-green-600"></span>
                      <span className="text-gray-600">Present</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-1 rounded-full bg-yellow-500"></span>
                      <span className="text-gray-600">Late</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-1 rounded-full bg-blue-500"></span>
                      <span className="text-gray-600">Excused</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 inline-block mr-1 rounded-full bg-red-600"></span>
                      <span className="text-gray-600">Absent</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Quick Actions</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/attendance">
                      <Button leftIcon={<ClipboardList size={16} />}>
                        Take Attendance
                      </Button>
                    </Link>
                    <Link to="/students/add">
                      <Button variant="outline" leftIcon={<Users size={16} />}>
                        Add Student
                      </Button>
                    </Link>
                    <Link to="/reports">
                      <Button variant="outline" leftIcon={<FileText size={16} />}>
                        Generate Report
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivity.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivity.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200\" aria-hidden="true"></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-800">
                                <span className="font-medium">{activity.action}</span> - {activity.department}
                              </p>
                              <p className="text-sm text-gray-500">{activity.detail}</p>
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-gray-500">
                              <time>{activity.time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 text-center">
                <Link to="/activity" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View all activity →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;