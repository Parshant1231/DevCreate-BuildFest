// User Types
export type UserRole = 'admin' | 'faculty' | 'student' | 'approver';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  institution?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

// Course Types
export type CourseType = 'theory' | 'lab' | 'seminar' | 'project' | 'online' | 'hybrid';
export type Priority = 'high' | 'medium' | 'low';
export type RoomType = 'theory' | 'lab' | 'seminar' | 'projector' | 'online' | 'hybrid';
export type Semester = 'odd' | 'even' | 'both';

export interface Course {
  id: string;
  name: string;
  code: string;
  type: CourseType;
  credits: number;
  sessionsPerWeek: number;
  duration: number;
  priority: Priority;
  facultyId?: string;
  department: string;
  semester: Semester;
  year: number;
  prerequisites?: string[];
  color?: string;
  description?: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  availability: boolean[][];
  maxLoadPerDay: number;
  maxLoadPerWeek: number;
  preferredHours: string[];
  assignedCourses: string[];
  qualifications: string[];
  experience: number;
  areas: string[];
}

export interface Classroom {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  department: string;
  building: string;
  floor: number;
  resources: string[];
  isAvailable: boolean;
  maintenanceSchedule?: string[];
}

export interface TimeSlot {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  label: string;
  isBreak: boolean;
  shift: 'morning' | 'afternoon' | 'evening';
}

export interface StudentGroup {
  id: string;
  name: string;
  semester: string;
  year: number;
  department: string;
  totalStudents: number;
  electives: string[];
  batch: string;
  section?: string;
}

export interface TimetableEntry {
  id: string;
  courseId: string;
  facultyId: string;
  classroomId: string;
  studentGroupId: string;
  timeSlotId: string;
  day: number;
  week: number;
  conflicts?: string[];
  isOnline?: boolean;
  meetingLink?: string;
}

export interface TimetableConflicts {
  type: 'faculty' | 'classroom' | 'student' | 'resource';
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedEntries: string[];
}

export interface OptimizationConstraints {
  facultyWorkload: {
    minHoursPerWeek: number;
    maxHoursPerWeek: number;
    maxHoursPerDay: number;
  };
  classroomUtilization: {
    minUtilization: number;
    maxUtilization: number;
  };
  studentGaps: {
    maxGapsPerDay: number;
    preferConsecutiveSlots: boolean;
  };
  departmentPreferences: {
    [department: string]: {
      preferredSlots: string[];
      avoidedSlots: string[];
    };
  };
}

export interface GeneratedTimetable {
  id: string;
  name: string;
  entries: TimetableEntry[];
  score: number;
  conflicts: TimetableConflicts[];
  metrics: {
    teacherWorkloadBalance: number;
    classroomUtilization: number;
    studentGaps: number;
    conflictCount: number;
    departmentSatisfaction: number;
  };
  constraints: OptimizationConstraints;
  generatedAt: Date;
  generatedBy: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  feedback?: string;
}

// Approval Workflow Types
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision';
export type ApprovalLevel = 'department' | 'academic' | 'administrative';

export interface ApprovalWorkflow {
  id: string;
  timetableId: string;
  currentLevel: ApprovalLevel;
  status: ApprovalStatus;
  approvals: ApprovalStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalStep {
  id: string;
  level: ApprovalLevel;
  approverId: string;
  approverName: string;
  status: ApprovalStatus;
  comments?: string;
  approvedAt?: Date;
  required: boolean;
}

// Department and Institution Types
export interface Department {
  id: string;
  name: string;
  code: string;
  headId: string;
  facultyCount: number;
  studentCount: number;
  color: string;
  preferences: {
    preferredSlots: string[];
    avoidedSlots: string[];
    maxClassesPerDay: number;
  };
}

export interface Institution {
  id: string;
  name: string;
  type: 'university' | 'college' | 'institute';
  departments: string[];
  shifts: Shift[];
  academicYear: string;
  semesters: SemesterConfig[];
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: number[];
  departments: string[];
}

export interface SemesterConfig {
  id: string;
  name: string;
  type: 'odd' | 'even' | 'both';
  startDate: Date;
  endDate: Date;
  weeks: number;
  departments: string[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Learning Management System Types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  courseId: string;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'discussion';
  content: string;
  attachments: string[];
  dueDate?: Date;
  points: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: Date;
  points: number;
  submissions: AssignmentSubmission[];
  instructions: string;
  attachments: string[];
  isPublished: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments: string[];
  submittedAt: Date;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  assignmentId?: string;
  points: number;
  maxPoints: number;
  type: 'assignment' | 'quiz' | 'exam' | 'participation';
  gradedBy: string;
  gradedAt: Date;
  comments?: string;
}

// Analytics Types
export interface AnalyticsData {
  timetable: {
    utilization: number;
    conflicts: number;
    satisfaction: number;
  };
  academic: {
    coursePerformance: { [courseId: string]: number };
    facultyWorkload: { [facultyId: string]: number };
    studentProgress: { [studentId: string]: number };
  };
  system: {
    activeUsers: number;
    generatedTimetables: number;
    averageGenerationTime: number;
  };
}
