import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, AtSign, Phone, Hash, Building, BookOpen } from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { useDepartments } from '../../context/DepartmentContext';
import { academicYears } from '../../types';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';

interface StudentFormData {
  name: string;
  regNumber: string;
  departmentId: string;
  yearId: string;
  email: string;
  phoneNumber: string;
}

const AddStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { addStudent } = useStudents();
  const { departments } = useDepartments();
  
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    regNumber: '',
    departmentId: '',
    yearId: '',
    email: '',
    phoneNumber: ''
  });
  
  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof StudentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof StudentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.regNumber.trim()) {
      newErrors.regNumber = 'Registration Number is required';
    }
    
    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }
    
    if (!formData.yearId) {
      newErrors.yearId = 'Academic Year is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addStudent(formData);
      navigate('/students');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="mr-4"
          onClick={() => navigate('/students')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Students
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
          <p className="text-gray-500 mt-1">Create a new student record</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md shadow-sm sm:text-sm`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="regNumber"
                    name="regNumber"
                    value={formData.regNumber}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.regNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md shadow-sm sm:text-sm`}
                    placeholder="CS2023001"
                  />
                </div>
                {errors.regNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.regNumber}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Select
                    options={[
                      { value: '', label: 'Select Department' },
                      ...departments.map(dept => ({ value: dept.id, label: dept.name }))
                    ]}
                    value={formData.departmentId}
                    onChange={(value) => handleSelectChange('departmentId', value)}
                    error={errors.departmentId}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="yearId" className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Select
                    options={[
                      { value: '', label: 'Select Year' },
                      ...academicYears.map(year => ({ value: year.id, label: year.name }))
                    ]}
                    value={formData.yearId}
                    onChange={(value) => handleSelectChange('yearId', value)}
                    error={errors.yearId}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md shadow-sm sm:text-sm`}
                    placeholder="john.doe@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/students')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Student
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStudentPage;