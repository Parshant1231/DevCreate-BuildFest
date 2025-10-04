import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  FileText, 
  MessageCircle, 
  Upload, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Video,
  File,
  BarChart3
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LearningModule, Assignment, Grade } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LearningHubProps {
  modules: LearningModule[];
  assignments: Assignment[];
  grades: Grade[];
  onAddModule?: (module: LearningModule) => void;
  onUpdateModule?: (id: string, module: Partial<LearningModule>) => void;
  onDeleteModule?: (id: string) => void;
  onAddAssignment?: (assignment: Assignment) => void;
  onUpdateAssignment?: (id: string, assignment: Partial<Assignment>) => void;
  onDeleteAssignment?: (id: string) => void;
}

const moduleTypes = [
  { value: 'video', label: 'Video Lesson', icon: Video },
  { value: 'document', label: 'Document', icon: File },
  { value: 'quiz', label: 'Quiz', icon: CheckCircle },
  { value: 'assignment', label: 'Assignment', icon: FileText },
  { value: 'discussion', label: 'Discussion', icon: MessageCircle },
];

export const LearningHub: React.FC<LearningHubProps> = ({
  modules,
  assignments,
  grades,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'modules' | 'assignments' | 'grades'>('modules');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingModule, setEditingModule] = useState<LearningModule | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    courseId: '',
    type: 'video' as const,
    content: '',
    points: 10,
    isPublished: false,
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    points: 100,
    instructions: '',
    isPublished: false,
  });

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || module.type === filterType;
    return matchesSearch && matchesType;
  });

  const getModuleIcon = (type: string) => {
    const moduleType = moduleTypes.find(t => t.value === type);
    return moduleType ? moduleType.icon : File;
  };

  const getModuleColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'assignment': return 'bg-purple-100 text-purple-800';
      case 'discussion': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetModuleForm = () => {
    setModuleForm({
      title: '',
      description: '',
      courseId: '',
      type: 'video',
      content: '',
      points: 10,
      isPublished: false,
    });
    setEditingModule(null);
    setShowModuleForm(false);
  };

  const resetAssignmentForm = () => {
    setAssignmentForm({
      title: '',
      description: '',
      courseId: '',
      dueDate: '',
      points: 100,
      instructions: '',
      isPublished: false,
    });
    setEditingAssignment(null);
    setShowAssignmentForm(false);
  };

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moduleForm.title || !moduleForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingModule) {
      const updatedModule: Partial<LearningModule> = {
        ...moduleForm,
        attachments: [],
        dueDate: moduleForm.type === 'assignment' ? new Date() : undefined,
      };
      onUpdateModule?.(editingModule.id, updatedModule);
      toast.success('Module updated successfully');
    } else {
      const newModule: LearningModule = {
        id: crypto.randomUUID(),
        ...moduleForm,
        attachments: [],
        dueDate: moduleForm.type === 'assignment' ? new Date() : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      onAddModule?.(newModule);
      toast.success('Module added successfully');
    }
    
    resetModuleForm();
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assignmentForm.title || !assignmentForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingAssignment) {
      const updatedAssignment: Partial<Assignment> = {
        ...assignmentForm,
        dueDate: new Date(assignmentForm.dueDate),
        submissions: editingAssignment.submissions,
        attachments: [],
      };
      onUpdateAssignment?.(editingAssignment.id, updatedAssignment);
      toast.success('Assignment updated successfully');
    } else {
      const newAssignment: Assignment = {
        id: crypto.randomUUID(),
        ...assignmentForm,
        dueDate: new Date(assignmentForm.dueDate),
        submissions: [],
        attachments: [],
        isPublished: false,
      };
      onAddAssignment?.(newAssignment);
      toast.success('Assignment added successfully');
    }
    
    resetAssignmentForm();
  };

  const handleEditModule = (module: LearningModule) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description,
      courseId: module.courseId,
      type: module.type,
      content: module.content,
      points: module.points,
      isPublished: module.isPublished,
    });
    setShowModuleForm(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      courseId: assignment.courseId,
      dueDate: assignment.dueDate.toISOString().split('T')[0],
      points: assignment.points,
      instructions: assignment.instructions,
      isPublished: assignment.isPublished,
    });
    setShowAssignmentForm(true);
  };

  const getStudentProgress = () => {
    const totalModules = modules.length;
    const completedModules = Math.floor(totalModules * 0.7); // Mock progress
    return { completed: completedModules, total: totalModules };
  };

  const getAverageGrade = () => {
    if (grades.length === 0) return 0;
    return grades.reduce((sum, grade) => sum + (grade.points / grade.maxPoints), 0) / grades.length * 100;
  };

  const progress = getStudentProgress();
  const averageGrade = getAverageGrade();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Learning Hub</h2>
          <p className="text-gray-600">Access learning materials, assignments, and track your progress</p>
        </div>
        {user?.role === 'faculty' && (
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      {user?.role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Course Progress</p>
                  <p className="text-2xl font-bold">{progress.completed}/{progress.total}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={(progress.completed / progress.total) * 100} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Grade</p>
                  <p className="text-2xl font-bold">{averageGrade.toFixed(1)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Badge className={averageGrade >= 80 ? 'bg-green-100 text-green-800' : 
                                averageGrade >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}>
                  {averageGrade >= 80 ? 'Excellent' : 
                   averageGrade >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Assignments</p>
                  <p className="text-2xl font-bold">{assignments.length}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary">
                  Due Soon: {Math.floor(assignments.length * 0.3)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'modules', label: 'Learning Modules', icon: BookOpen },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'grades', label: 'Grades', icon: BarChart3 },
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

      {/* Learning Modules Tab */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search learning modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {moduleTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {user?.role === 'faculty' && (
              <Button onClick={() => setShowModuleForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            )}
          </div>

          {/* Module Form */}
          {showModuleForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingModule ? 'Edit Learning Module' : 'Add New Learning Module'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleModuleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="moduleTitle">Title *</Label>
                      <Input
                        id="moduleTitle"
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Introduction to Data Structures"
                      />
                    </div>
                    <div>
                      <Label htmlFor="moduleType">Type</Label>
                      <Select
                        value={moduleForm.type}
                        onValueChange={(value: any) => setModuleForm(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {moduleTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="moduleDescription">Description *</Label>
                    <Textarea
                      id="moduleDescription"
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the learning objectives and content..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="modulePoints">Points</Label>
                      <Input
                        id="modulePoints"
                        type="number"
                        min="1"
                        max="100"
                        value={moduleForm.points}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={moduleForm.isPublished}
                        onChange={(e) => setModuleForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isPublished">Published</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingModule ? 'Update Module' : 'Add Module'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetModuleForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Modules List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module) => {
              const Icon = getModuleIcon(module.type);
              return (
                <Card key={module.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <Badge className={getModuleColor(module.type)}>
                          {moduleTypes.find(t => t.value === module.type)?.label}
                        </Badge>
                      </div>
                      {user?.role === 'faculty' && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditModule(module)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              onDeleteModule?.(module.id);
                              toast.success('Module deleted');
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-lg mb-2 line-clamp-2">{module.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{module.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{module.points} points</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{module.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {user?.role === 'student' ? (
                        <Button className="flex-1" size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button className="flex-1" size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      )}
                      {module.isPublished ? (
                        <Badge className="bg-green-100 text-green-800">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Actions */}
          {user?.role === 'faculty' && (
            <div className="flex justify-end">
              <Button onClick={() => setShowAssignmentForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </Button>
            </div>
          )}

          {/* Assignment Form */}
          {showAssignmentForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assignmentTitle">Title *</Label>
                      <Input
                        id="assignmentTitle"
                        value={assignmentForm.title}
                        onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Data Structures Project"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignmentPoints">Points</Label>
                      <Input
                        id="assignmentPoints"
                        type="number"
                        min="1"
                        max="1000"
                        value={assignmentForm.points}
                        onChange={(e) => setAssignmentForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assignmentDescription">Description *</Label>
                    <Textarea
                      id="assignmentDescription"
                      value={assignmentForm.description}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the assignment requirements..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={assignmentForm.dueDate}
                        onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="assignmentPublished"
                        checked={assignmentForm.isPublished}
                        onChange={(e) => setAssignmentForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="assignmentPublished">Published</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={assignmentForm.instructions}
                      onChange={(e) => setAssignmentForm(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="Detailed instructions for students..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingAssignment ? 'Update Assignment' : 'Add Assignment'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetAssignmentForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Assignments List */}
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{assignment.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{assignment.points} points</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{assignment.submissions.length} submissions</span>
                        </div>
                      </div>
                    </div>
                    {user?.role === 'faculty' && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAssignment(assignment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onDeleteAssignment?.(assignment.id);
                            toast.success('Assignment deleted');
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {user?.role === 'student' ? (
                      <>
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Submit Work
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Submissions
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                      </>
                    )}
                    {assignment.isPublished ? (
                      <Badge className="bg-green-100 text-green-800">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Grades Tab */}
      {activeTab === 'grades' && (
        <Card>
          <CardContent className="p-6">
            {grades.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Grades Available</h3>
                <p className="text-gray-600">
                  Grades will appear here once assignments are graded.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {grades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{grade.courseId}</h4>
                      <p className="text-sm text-gray-600">
                        {grade.type} • {grade.gradedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {grade.points}/{grade.maxPoints}
                      </div>
                      <div className="text-sm text-gray-600">
                        {((grade.points / grade.maxPoints) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

