import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Search, Filter } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { useDepartments } from '../../context/DepartmentContext';
import { academicYears } from '../../types';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { students } = useStudents();
  const { departments } = useDepartments();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    departmentId: '',
    yearId: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({ departmentId: '', yearId: '' });
  };
  
  const filteredStudents = students.filter(student => {
    // Apply search term filter
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply department and year filters
    const matchesDepartment = filters.departmentId ? student.departmentId === filters.departmentId : true;
    const matchesYear = filters.yearId ? student.yearId === filters.yearId : true;
    
    return matchesSearch && matchesDepartment && matchesYear;
  });
  
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown Department';
  };
  
  const getYearName = (yearId: string) => {
    const year = academicYears.find(y => y.id === yearId);
    return year ? year.name : 'Unknown Year';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">Manage all students in the system</p>
        </div>
        <Button 
          onClick={() => navigate('/students/add')} 
          leftIcon={<Plus size={16} />}
        >
          Add Student
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search students by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<Filter size={16} />}
          className={showFilters ? 'bg-gray-100' : ''}
        >
          Filters
        </Button>
      </div>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Department"
              options={[
                { value: '', label: 'All Departments' },
                ...departments.map(dept => ({ value: dept.id, label: dept.name }))
              ]}
              value={filters.departmentId}
              onChange={(value) => handleFilterChange('departmentId', value)}
            />
            
            <Select
              label="Academic Year"
              options={[
                { value: '', label: 'All Years' },
                ...academicYears.map(year => ({ value: year.id, label: year.name }))
              ]}
              value={filters.yearId}
              onChange={(value) => handleFilterChange('yearId', value)}
            />
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="mb-1"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reg Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.regNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getDepartmentName(student.departmentId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getYearName(student.yearId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{student.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => navigate(`/students/edit/${student.id}`)}
                        leftIcon={<Edit size={16} />}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredStudents.length}</span> students
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;