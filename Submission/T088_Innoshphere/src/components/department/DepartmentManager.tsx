import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Building, 
  Users, 
  Clock, 
  Settings, 
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';
import { Department, Shift, SemesterConfig } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DepartmentManagerProps {
  departments: Department[];
  shifts: Shift[];
  semesters: SemesterConfig[];
  onAddDepartment: (department: Department) => void;
  onUpdateDepartment: (id: string, department: Partial<Department>) => void;
  onDeleteDepartment: (id: string) => void;
  onAddShift: (shift: Shift) => void;
  onUpdateShift: (id: string, shift: Partial<Shift>) => void;
  onDeleteShift: (id: string) => void;
}

const departmentColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DepartmentManager: React.FC<DepartmentManagerProps> = ({
  departments,
  shifts,
  semesters,
  onAddDepartment,
  onUpdateDepartment,
  onDeleteDepartment,
  onAddShift,
  onUpdateShift,
  onDeleteShift,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'departments' | 'shifts' | 'semesters'>('departments');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showShiftForm, setShowShiftForm] = useState(false);

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    code: '',
    headId: '',
    color: departmentColors[0],
    preferences: {
      preferredSlots: [] as string[],
      avoidedSlots: [] as string[],
      maxClassesPerDay: 6,
    },
  });

  const [shiftForm, setShiftForm] = useState({
    name: '',
    startTime: '08:00',
    endTime: '17:00',
    days: [] as number[],
    departments: [] as string[],
  });

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetDepartmentForm = () => {
    setDepartmentForm({
      name: '',
      code: '',
      headId: '',
      color: departmentColors[0],
      preferences: {
        preferredSlots: [],
        avoidedSlots: [],
        maxClassesPerDay: 6,
      },
    });
    setEditingDepartment(null);
    setShowDepartmentForm(false);
  };

  const resetShiftForm = () => {
    setShiftForm({
      name: '',
      startTime: '08:00',
      endTime: '17:00',
      days: [],
      departments: [],
    });
    setEditingShift(null);
    setShowShiftForm(false);
  };

  const handleDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departmentForm.name || !departmentForm.code) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingDepartment) {
      const updatedDept: Partial<Department> = {
        ...departmentForm,
        facultyCount: editingDepartment.facultyCount,
        studentCount: editingDepartment.studentCount,
      };
      onUpdateDepartment(editingDepartment.id, updatedDept);
      toast.success('Department updated successfully');
    } else {
      const newDept: Department = {
        id: crypto.randomUUID(),
        ...departmentForm,
        facultyCount: 0,
        studentCount: 0,
      };
      onAddDepartment(newDept);
      toast.success('Department added successfully');
    }
    
    resetDepartmentForm();
  };

  const handleShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shiftForm.name || shiftForm.days.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingShift) {
      const updatedShift: Partial<Shift> = {
        ...shiftForm,
        id: editingShift.id,
      };
      onUpdateShift(editingShift.id, updatedShift);
      toast.success('Shift updated successfully');
    } else {
      const newShift: Shift = {
        id: crypto.randomUUID(),
        ...shiftForm,
      };
      onAddShift(newShift);
      toast.success('Shift added successfully');
    }
    
    resetShiftForm();
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setDepartmentForm({
      name: department.name,
      code: department.code,
      headId: department.headId,
      color: department.color,
      preferences: department.preferences,
    });
    setShowDepartmentForm(true);
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setShiftForm({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      days: shift.days,
      departments: shift.departments,
    });
    setShowShiftForm(true);
  };

  const toggleDay = (dayIndex: number) => {
    setShiftForm(prev => ({
      ...prev,
      days: prev.days.includes(dayIndex)
        ? prev.days.filter(d => d !== dayIndex)
        : [...prev.days, dayIndex]
    }));
  };

  const toggleDepartment = (deptId: string) => {
    setShiftForm(prev => ({
      ...prev,
      departments: prev.departments.includes(deptId)
        ? prev.departments.filter(d => d !== deptId)
        : [...prev.departments, deptId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Department & Shift Management</h2>
          <p className="text-gray-600">Manage departments, shifts, and academic configurations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'departments', label: 'Departments', icon: Building },
          { id: 'shifts', label: 'Shifts', icon: Clock },
          { id: 'semesters', label: 'Semesters', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={() => setShowDepartmentForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </div>

          {/* Department Form */}
          {showDepartmentForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingDepartment ? 'Edit Department' : 'Add New Department'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deptName">Department Name *</Label>
                      <Input
                        id="deptName"
                        value={departmentForm.name}
                        onChange={(e) => setDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deptCode">Department Code *</Label>
                      <Input
                        id="deptCode"
                        value={departmentForm.code}
                        onChange={(e) => setDepartmentForm(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="e.g., CS"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="headId">Department Head ID</Label>
                      <Input
                        id="headId"
                        value={departmentForm.headId}
                        onChange={(e) => setDepartmentForm(prev => ({ ...prev, headId: e.target.value }))}
                        placeholder="e.g., FAC001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Department Color</Label>
                      <div className="flex gap-2">
                        {departmentColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setDepartmentForm(prev => ({ ...prev, color }))}
                            className={`w-8 h-8 rounded-full border-2 ${
                              departmentForm.color === color ? 'border-gray-400' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxClasses">Max Classes Per Day</Label>
                    <Input
                      id="maxClasses"
                      type="number"
                      min="1"
                      max="12"
                      value={departmentForm.preferences.maxClassesPerDay}
                      onChange={(e) => setDepartmentForm(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          maxClassesPerDay: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingDepartment ? 'Update Department' : 'Add Department'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetDepartmentForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Departments List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((department) => (
              <Card key={department.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: department.color }}
                      />
                      <Badge variant="outline">{department.code}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDepartment(department)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onDeleteDepartment(department.id);
                          toast.success('Department deleted');
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-lg mb-2">{department.name}</h4>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{department.facultyCount} faculty members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{department.studentCount} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Max {department.preferences.maxClassesPerDay} classes/day</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Preferred Slots: {department.preferences.preferredSlots.length}</span>
                      <span>Avoided Slots: {department.preferences.avoidedSlots.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Shifts Tab */}
      {activeTab === 'shifts' && (
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex justify-end">
            <Button onClick={() => setShowShiftForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Shift
            </Button>
          </div>

          {/* Shift Form */}
          {showShiftForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingShift ? 'Edit Shift' : 'Add New Shift'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShiftSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="shiftName">Shift Name *</Label>
                    <Input
                      id="shiftName"
                      value={shiftForm.name}
                      onChange={(e) => setShiftForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Morning Shift"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={shiftForm.startTime}
                        onChange={(e) => setShiftForm(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={shiftForm.endTime}
                        onChange={(e) => setShiftForm(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Working Days *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {dayNames.map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleDay(index)}
                          className={`p-2 text-sm rounded-md border ${
                            shiftForm.days.includes(index)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Assigned Departments</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {departments.map((dept) => (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => toggleDepartment(dept.id)}
                          className={`p-2 text-sm rounded-md border flex items-center gap-2 ${
                            shiftForm.departments.includes(dept.id)
                              ? 'bg-green-100 border-green-300 text-green-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: dept.color }}
                          />
                          {dept.code}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingShift ? 'Update Shift' : 'Add Shift'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetShiftForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Shifts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shifts.map((shift) => (
              <Card key={shift.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg">{shift.name}</h4>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditShift(shift)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onDeleteShift(shift.id);
                          toast.success('Shift deleted');
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{shift.startTime} - {shift.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{shift.days.length} working days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{shift.departments.length} departments</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {shift.days.map(dayIndex => (
                        <Badge key={dayIndex} variant="outline" className="text-xs">
                          {dayNames[dayIndex].slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Semesters Tab */}
      {activeTab === 'semesters' && (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Semester Management</h3>
            <p className="text-gray-600">
              Semester configuration will be available in the next update.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

