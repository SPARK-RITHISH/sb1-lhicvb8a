import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useDepartments } from '../../context/DepartmentContext';
import { useStudents } from '../../context/StudentContext';
import { useAttendance } from '../../context/AttendanceContext';
import { academicYears, Student, AttendanceStatus } from '../../types';
import { formatDisplayDate } from '../../utils/date-utils';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const TakeAttendancePage: React.FC = () => {
  const { departments } = useDepartments();
  const { students, getStudentsByDepartmentAndYear } = useStudents();
  const { markAttendance, getAttendanceForDate } = useAttendance();
  
  const [filters, setFilters] = useState({
    departmentId: '',
    yearId: '',
    date: new Date().toISOString().split('T')[0],
    period: 1
  });
  
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: AttendanceStatus }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  useEffect(() => {
    if (filters.departmentId && filters.yearId) {
      const filteredStudents = getStudentsByDepartmentAndYear(filters.departmentId, filters.yearId);
      setSelectedStudents(filteredStudents);
      
      // Load existing attendance records
      const existingRecords = getAttendanceForDate(
        filters.date,
        filters.period,
        filters.departmentId,
        filters.yearId
      );
      
      // Initialize attendance status
      const initialStatus: { [key: string]: AttendanceStatus } = {};
      
      filteredStudents.forEach(student => {
        const record = existingRecords.find(r => r.studentId === student.id);
        initialStatus[student.id] = record?.status || 'absent';
      });
      
      setAttendanceStatus(initialStatus);
    } else {
      setSelectedStudents([]);
      setAttendanceStatus({});
    }
  }, [filters, getStudentsByDepartmentAndYear, getAttendanceForDate]);
  
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSaveMessage('');
  };
  
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    setSaveMessage('');
  };
  
  const handleBulkStatusChange = (status: AttendanceStatus) => {
    const updatedStatus = { ...attendanceStatus };
    
    selectedStudents.forEach(student => {
      updatedStatus[student.id] = status;
    });
    
    setAttendanceStatus(updatedStatus);
    setSaveMessage('');
  };
  
  const handleSaveAttendance = async () => {
    if (!filters.departmentId || !filters.yearId) {
      setSaveMessage('Please select department and year');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save attendance for each student
      for (const student of selectedStudents) {
        const status = attendanceStatus[student.id] || 'absent';
        
        await markAttendance(
          student.id,
          filters.date,
          filters.period,
          status,
          filters.departmentId,
          filters.yearId
        );
      }
      
      setSaveMessage('Attendance saved successfully');
    } catch (error) {
      setSaveMessage('Error saving attendance');
      console.error('Error saving attendance:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const getStatusClasses = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excused':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'absent':
        return <XCircle size={16} className="text-red-600" />;
      case 'late':
        return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'excused':
        return <Clock size={16} className="text-blue-600" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Take Attendance</h1>
          <p className="text-gray-500 mt-1">Record student attendance</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Date</CardTitle>
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
                value={filters.departmentId}
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
                value={filters.yearId}
                onChange={(value) => handleFilterChange('yearId', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <Select
                options={[
                  { value: '1', label: 'Period 1' },
                  { value: '2', label: 'Period 2' },
                  { value: '3', label: 'Period 3' },
                  { value: '4', label: 'Period 4' },
                  { value: '5', label: 'Period 5' }
                ]}
                value={filters.period.toString()}
                onChange={(value) => handleFilterChange('period', parseInt(value, 10))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedStudents.length > 0 ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Attendance Sheet: {formatDisplayDate(filters.date)} - Period {filters.period}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<CheckCircle size={16} />}
                  onClick={() => handleBulkStatusChange('present')}
                >
                  Mark All Present
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<XCircle size={16} />}
                  onClick={() => handleBulkStatusChange('absent')}
                >
                  Mark All Absent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reg Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.regNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                              attendanceStatus[student.id] === 'present'
                                ? getStatusClasses('present')
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                              attendanceStatus[student.id] === 'absent'
                                ? getStatusClasses('absent')
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <XCircle size={16} className="mr-1" />
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                              attendanceStatus[student.id] === 'late'
                                ? getStatusClasses('late')
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <AlertTriangle size={16} className="mr-1" />
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'excused')}
                            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                              attendanceStatus[student.id] === 'excused'
                                ? getStatusClasses('excused')
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Clock size={16} className="mr-1" />
                            Excused
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSaveAttendance}
                isLoading={isSaving}
              >
                Save Attendance
              </Button>
            </div>
            
            {saveMessage && (
              <div className={`mt-4 p-3 rounded-md ${
                saveMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {saveMessage}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        filters.departmentId && filters.yearId ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">No students found for the selected department and year.</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">Please select a department and year to view attendance sheet.</p>
          </div>
        )
      )}
    </div>
  );
};

export default TakeAttendancePage;