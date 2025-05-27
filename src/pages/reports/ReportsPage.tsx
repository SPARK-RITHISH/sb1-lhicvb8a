import React, { useState } from 'react';
import { Calendar, Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useDepartments } from '../../context/DepartmentContext';
import { useStudents } from '../../context/StudentContext';
import { useAttendance } from '../../context/AttendanceContext';
import { academicYears, AttendanceReportFilter, Department } from '../../types';
import { formatDisplayDate, getCurrentWeekDates, getCurrentMonthDates } from '../../utils/date-utils';
import { exportAttendanceToExcel } from '../../utils/excel-export';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const ReportsPage: React.FC = () => {
  const { departments, getDepartment } = useDepartments();
  const { students } = useStudents();
  const { getProcessedAttendanceRecords } = useAttendance();
  
  const [filters, setFilters] = useState<AttendanceReportFilter>({
    departmentId: '',
    yearId: '',
    startDate: getCurrentWeekDates().startDate,
    endDate: getCurrentWeekDates().endDate
  });
  
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const setReportPeriod = (type: 'weekly' | 'monthly') => {
    setReportType(type);
    
    if (type === 'weekly') {
      const { startDate, endDate } = getCurrentWeekDates();
      setFilters(prev => ({ ...prev, startDate, endDate }));
    } else {
      const { startDate, endDate } = getCurrentMonthDates();
      setFilters(prev => ({ ...prev, startDate, endDate }));
    }
  };
  
  const toggleStudentExpansion = (studentId: string) => {
    const newExpandedStudents = new Set(expandedStudents);
    
    if (newExpandedStudents.has(studentId)) {
      newExpandedStudents.delete(studentId);
    } else {
      newExpandedStudents.add(studentId);
    }
    
    setExpandedStudents(newExpandedStudents);
  };
  
  const generateReport = () => {
    if (!filters.departmentId || !filters.yearId) {
      return;
    }
    
    const department = getDepartment(filters.departmentId);
    const year = academicYears.find(y => y.id === filters.yearId)?.name || '';
    
    if (!department) return;
    
    const records = getProcessedAttendanceRecords(
      filters.startDate || '',
      filters.endDate || '',
      filters.departmentId,
      filters.yearId
    );
    
    const dateRange = [];
    let currentDate = new Date(filters.startDate || '');
    const endDate = new Date(filters.endDate || '');
    
    while (currentDate <= endDate) {
      dateRange.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    exportAttendanceToExcel(records, dateRange, department, year);
  };
  
  const getAttendanceStats = () => {
    if (!filters.departmentId || !filters.yearId) {
      return { present: 0, absent: 0, late: 0, excused: 0, total: 0 };
    }
    
    const records = getProcessedAttendanceRecords(
      filters.startDate || '',
      filters.endDate || '',
      filters.departmentId,
      filters.yearId
    );
    
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    
    records.forEach(record => {
      Object.values(record.periods).forEach(status => {
        if (status === 'present') presentCount++;
        else if (status === 'absent') absentCount++;
        else if (status === 'late') lateCount++;
        else if (status === 'excused') excusedCount++;
      });
    });
    
    const total = presentCount + absentCount + lateCount + excusedCount;
    
    return {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      excused: excusedCount,
      total
    };
  };
  
  const stats = getAttendanceStats();
  
  const getAttendanceRecords = () => {
    if (!filters.departmentId || !filters.yearId) {
      return [];
    }
    
    return getProcessedAttendanceRecords(
      filters.startDate || '',
      filters.endDate || '',
      filters.departmentId,
      filters.yearId
    );
  };
  
  const records = getAttendanceRecords();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-gray-500 mt-1">Generate and view attendance reports</p>
        </div>
        <Button 
          onClick={generateReport}
          leftIcon={<Download size={16} />}
          disabled={!filters.departmentId || !filters.yearId}
        >
          Export to Excel
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <Select
                options={[
                  { value: '', label: 'Select Department' },
                  ...departments.map(dept => ({ value: dept.id, label: dept.name }))
                ]}
                value={filters.departmentId || ''}
                onChange={(value) => handleFilterChange('departmentId', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <Select
                options={[
                  { value: '', label: 'Select Year' },
                  ...academicYears.map(year => ({ value: year.id, label: year.name }))
                ]}
                value={filters.yearId || ''}
                onChange={(value) => handleFilterChange('yearId', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button 
              variant={reportType === 'weekly' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setReportPeriod('weekly')}
            >
              This Week
            </Button>
            <Button 
              variant={reportType === 'monthly' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setReportPeriod('monthly')}
            >
              This Month
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {filters.departmentId && filters.yearId ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700">Present</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.present}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                  </p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-700">Absent</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.absent}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}%
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-700">Late</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.late}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0}%
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">Excused</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.excused}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.excused / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Attendance Distribution</h4>
                  <p className="text-xs text-gray-500">
                    {formatDisplayDate(filters.startDate || '')} - {formatDisplayDate(filters.endDate || '')}
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Report</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col\" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reg Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Present
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Absent
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Late
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Excused
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {records.map((record) => {
                        // Count attendance by status
                        let presentCount = 0;
                        let absentCount = 0;
                        let lateCount = 0;
                        let excusedCount = 0;
                        
                        Object.values(record.periods).forEach(status => {
                          if (status === 'present') presentCount++;
                          else if (status === 'absent') absentCount++;
                          else if (status === 'late') lateCount++;
                          else if (status === 'excused') excusedCount++;
                        });
                        
                        const total = presentCount + absentCount + lateCount + excusedCount;
                        const isExpanded = expandedStudents.has(record.student.id);
                        
                        return (
                          <React.Fragment key={record.student.id}>
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{record.student.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{record.student.regNumber}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm text-gray-500">{presentCount}</div>
                                {total > 0 && (
                                  <div className="text-xs text-gray-400">
                                    {Math.round((presentCount / total) * 100)}%
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm text-gray-500">{absentCount}</div>
                                {total > 0 && (
                                  <div className="text-xs text-gray-400">
                                    {Math.round((absentCount / total) * 100)}%
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm text-gray-500">{lateCount}</div>
                                {total > 0 && (
                                  <div className="text-xs text-gray-400">
                                    {Math.round((lateCount / total) * 100)}%
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm text-gray-500">{excusedCount}</div>
                                {total > 0 && (
                                  <div className="text-xs text-gray-400">
                                    {Math.round((excusedCount / total) * 100)}%
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={() => toggleStudentExpansion(record.student.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  {isExpanded ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-gray-50">
                                <td colSpan={7} className="px-6 py-4">
                                  <div className="text-sm text-gray-500">
                                    <h4 className="font-medium text-gray-700 mb-2">Detailed Attendance</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                      {Object.entries(record.periods).map(([period, status]) => (
                                        <div 
                                          key={`${record.student.id}-${period}`}
                                          className={`p-2 rounded-md border ${
                                            status === 'present' ? 'bg-green-50 border-green-200 text-green-800' :
                                            status === 'absent' ? 'bg-red-50 border-red-200 text-red-800' :
                                            status === 'late' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                            'bg-blue-50 border-blue-200 text-blue-800'
                                          }`}
                                        >
                                          <div className="flex items-center">
                                            {status === 'present' && <CheckCircle size={14} className="mr-1" />}
                                            {status === 'absent' && <XCircle size={14} className="mr-1" />}
                                            {status === 'late' && <Filter size={14} className="mr-1" />}
                                            {status === 'excused' && <Calendar size={14} className="mr-1" />}
                                            <span>Period {period}: {status}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No attendance records found for the selected filters.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">Please select a department and year to view attendance reports.</p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;