import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthPage } from "@/components/auth/AuthPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { CourseManager } from "@/components/CourseManager";
import { FacultyManager } from "@/components/FacultyManager";
import { ClassroomManager } from "@/components/ClassroomManager";
import { TimeSlotManager } from "@/components/TimeSlotManager";
import { TimetableView } from "@/components/TimetableView";
import { TimetableOptimizer } from "@/components/timetable/TimetableOptimizer";
import { ApprovalWorkflow } from "@/components/approval/ApprovalWorkflow";
import { DepartmentManager } from "@/components/department/DepartmentManager";
import { LearningHub } from "@/components/learning/LearningHub";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import { Course, Faculty, Classroom, Department, Shift, GeneratedTimetable } from "@/types";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State management for all data
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<GeneratedTimetable | null>(null);

  const handleAddCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const handleUpdateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleAddFaculty = (facultyMember: Faculty) => {
    setFaculty(prev => [...prev, facultyMember]);
  };

  const handleDeleteFaculty = (id: string) => {
    setFaculty(prev => prev.filter(f => f.id !== id));
  };

  const handleAddClassroom = (classroom: Classroom) => {
    setClassrooms(prev => [...prev, classroom]);
  };

  const handleDeleteClassroom = (id: string) => {
    setClassrooms(prev => prev.filter(c => c.id !== id));
  };

  const handleAddDepartment = (department: Department) => {
    setDepartments(prev => [...prev, department]);
  };

  const handleUpdateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const handleAddShift = (shift: Shift) => {
    setShifts(prev => [...prev, shift]);
  };

  const handleUpdateShift = (id: string, updates: Partial<Shift>) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteShift = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
  };

  const handleTimetableGenerated = (timetable: GeneratedTimetable) => {
    setSelectedTimetable(timetable);
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          stats={{
            courses: courses.length,
            faculty: faculty.length,
            classrooms: classrooms.length,
            students: 450, // Mock data
            timetables: 12,
            conflicts: 3,
            utilization: 87,
          }}
        />;
      case 'courses':
        return <CourseManager 
          courses={courses} 
          onAddCourse={handleAddCourse} 
          onDeleteCourse={handleDeleteCourse}
          onUpdateCourse={handleUpdateCourse}
        />;
      case 'faculty':
        return <FacultyManager 
          faculty={faculty} 
          onAddFaculty={handleAddFaculty} 
          onDeleteFaculty={handleDeleteFaculty} 
        />;
      case 'classrooms':
        return <ClassroomManager 
          classrooms={classrooms} 
          onAddClassroom={handleAddClassroom} 
          onDeleteClassroom={handleDeleteClassroom} 
        />;
      case 'timeslots':
        return <TimeSlotManager />;
      case 'timetable':
        return <TimetableView courses={courses} faculty={faculty} classrooms={classrooms} />;
      case 'optimizer':
        return <TimetableOptimizer 
          courses={courses} 
          faculty={faculty} 
          classrooms={classrooms}
          onTimetableGenerated={handleTimetableGenerated}
        />;
      case 'approvals':
        return selectedTimetable ? (
          <ApprovalWorkflow 
            timetable={selectedTimetable}
            onApprovalUpdate={(workflow) => {
              console.log('Approval workflow updated:', workflow);
            }}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No timetable selected for approval</p>
          </div>
        );
      case 'departments':
        return <DepartmentManager 
          departments={departments}
          shifts={shifts}
          semesters={[]}
          onAddDepartment={handleAddDepartment}
          onUpdateDepartment={handleUpdateDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onAddShift={handleAddShift}
          onUpdateShift={handleUpdateShift}
          onDeleteShift={handleDeleteShift}
        />;
      case 'learning':
        return <LearningHub 
          modules={[]}
          assignments={[]}
          grades={[]}
        />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
                      {renderDashboardContent()}
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
