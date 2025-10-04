import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { CourseManager } from '@/components/CourseManager';
import { FacultyManager } from '@/components/FacultyManager';
import { ClassroomManager } from '@/components/ClassroomManager';
import { TimeSlotManager } from '@/components/TimeSlotManager';
import { TimetableView } from '@/components/TimetableView';
import { Course, Faculty, Classroom } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const stats = {
    courses: courses.length,
    faculty: faculty.length,
    classrooms: classrooms.length,
    timeSlots: 35, // 5 days x 7 slots
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      case 'courses':
        return (
          <CourseManager
            courses={courses}
            onAddCourse={(course) => setCourses([...courses, course])}
            onDeleteCourse={(id) => setCourses(courses.filter((c) => c.id !== id))}
          />
        );
      case 'faculty':
        return (
          <FacultyManager
            faculty={faculty}
            onAddFaculty={(member) => setFaculty([...faculty, member])}
            onDeleteFaculty={(id) => setFaculty(faculty.filter((f) => f.id !== id))}
          />
        );
      case 'classrooms':
        return (
          <ClassroomManager
            classrooms={classrooms}
            onAddClassroom={(room) => setClassrooms([...classrooms, room])}
            onDeleteClassroom={(id) => setClassrooms(classrooms.filter((c) => c.id !== id))}
          />
        );
      case 'slots':
        return <TimeSlotManager />;
      case 'timetable':
        return <TimetableView courses={courses} faculty={faculty} classrooms={classrooms} />;
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
