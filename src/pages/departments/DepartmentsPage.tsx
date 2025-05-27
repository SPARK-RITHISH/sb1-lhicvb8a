import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useDepartments } from '../../context/DepartmentContext';
import { useStudents } from '../../context/StudentContext';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

interface DepartmentFormData {
  name: string;
  code: string;
}

const DepartmentsPage: React.FC = () => {
  const { departments, addDepartment, updateDepartment } = useDepartments();
  const { students } = useStudents();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<{ id: string } & DepartmentFormData | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>({ name: '', code: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddClick = () => {
    setIsAdding(true);
    setFormData({ name: '', code: '' });
  };
  
  const handleEditClick = (department: { id: string; name: string; code: string }) => {
    setIsEditing(true);
    setCurrentDepartment(department);
    setFormData({ name: department.name, code: department.code });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdding) {
      addDepartment(formData);
      setIsAdding(false);
    } else if (isEditing && currentDepartment) {
      updateDepartment(currentDepartment.id, formData);
      setIsEditing(false);
      setCurrentDepartment(null);
    }
    
    setFormData({ name: '', code: '' });
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentDepartment(null);
    setFormData({ name: '', code: '' });
  };
  
  const getStudentCountByDepartment = (departmentId: string) => {
    return students.filter(student => student.departmentId === departmentId).length;
  };
  
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 mt-1">Manage all departments in the system</p>
        </div>
        <Button 
          onClick={handleAddClick} 
          leftIcon={<Plus size={16} />}
          disabled={isAdding || isEditing}
        >
          Add Department
        </Button>
      </div>
      
      {(isAdding || isEditing) && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>{isAdding ? 'Add New Department' : 'Edit Department'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Department Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isAdding ? 'Add Department' : 'Update Department'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{department.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{department.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getStudentCountByDepartment(department.id)} students
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        onClick={() => handleEditClick(department)}
                        leftIcon={<Edit size={16} />}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;