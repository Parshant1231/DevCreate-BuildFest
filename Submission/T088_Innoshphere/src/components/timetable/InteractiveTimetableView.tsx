import React, { useState } from 'react';
import { X, Download, FileText, File, Table, MapPin, Clock, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { exportToPDF, exportToDOC, exportToExcel, createTimetableExportData } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { TimetableEntry, Classroom, Faculty, Course } from '@/types';

interface InteractiveTimetableViewProps {
  timetable: {
    slots: TimetableEntry[];
    metadata: {
      semester?: string;
      department?: string;
      generatedBy?: string;
      institution?: string;
    };
  };
  classrooms: Classroom[];
  faculty: Faculty[];
  courses: Course[];
}

export const InteractiveTimetableView: React.FC<InteractiveTimetableViewProps> = ({
  timetable,
  classrooms,
  faculty,
  courses
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimetableEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const getClassroomInfo = (classroomId: string) => {
    return classrooms.find(c => c.id === classroomId);
  };

  const getFacultyInfo = (facultyId: string) => {
    return faculty.find(f => f.id === facultyId);
  };

  const getCourseInfo = (courseId: string) => {
    return courses.find(c => c.id === courseId);
  };

  const handleSlotClick = (slot: TimetableEntry) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleExport = async (format: 'pdf' | 'doc' | 'excel') => {
    try {
      const exportData = createTimetableExportData(timetable, timetable.metadata);
      
      switch (format) {
        case 'pdf':
          const pdfResult = await exportToPDF('timetable-container', 'timetable.pdf');
          if (pdfResult.success) {
            toast({ title: 'Success', description: 'Timetable exported as PDF' });
          } else {
            toast({ title: 'Error', description: pdfResult.message, variant: 'destructive' });
          }
          break;
        case 'doc':
          const docResult = await exportToDOC(exportData, 'timetable.docx');
          if (docResult.success) {
            toast({ title: 'Success', description: 'Timetable exported as DOC' });
          } else {
            toast({ title: 'Error', description: docResult.message, variant: 'destructive' });
          }
          break;
        case 'excel':
          const excelResult = await exportToExcel(exportData, 'timetable.csv');
          if (excelResult.success) {
            toast({ title: 'Success', description: 'Timetable exported as Excel' });
          } else {
            toast({ title: 'Error', description: excelResult.message, variant: 'destructive' });
          }
          break;
      }
    } catch (error) {
      toast({ 
        title: 'Export Failed', 
        description: 'An error occurred while exporting the timetable', 
        variant: 'destructive' 
      });
    }
  };

  const timeSlots = Array.from(new Set(timetable.slots.map(slot => slot.timeSlotId.split('-')[0])));
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Interactive Timetable</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('doc')}
                className="flex items-center space-x-2"
              >
                <File className="w-4 h-4" />
                <span>DOC</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('excel')}
                className="flex items-center space-x-2"
              >
                <Table className="w-4 h-4" />
                <span>Excel</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Timetable Container */}
      <div id="timetable-container">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Semester:</strong> {timetable.metadata.semester || 'Current'}</p>
              <p><strong>Department:</strong> {timetable.metadata.department || 'All Departments'}</p>
              <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Time</th>
                    {days.map(day => (
                      <th key={day} className="border border-gray-300 px-3 py-2 text-center font-semibold">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50">
                        {time}:00-{parseInt(time) + 1}:00
                      </td>
                      {days.map((day, dayIndex) => {
                        const slot = timetable.slots.find(s => 
                          s.timeSlotId.startsWith(time) && s.day === dayIndex + 1
                        );
                        
                        if (!slot) {
                          return (
                            <td key={day} className="border border-gray-300 px-3 py-2 h-16"></td>
                          );
                        }

                        const classroom = getClassroomInfo(slot.classroomId);
                        const facultyMember = getFacultyInfo(slot.facultyId);
                        const course = getCourseInfo(slot.courseId);

                        return (
                          <td 
                            key={day} 
                            className="border border-gray-300 px-3 py-2 h-16 cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => handleSlotClick(slot)}
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{course?.name || 'Course'}</div>
                              <div className="text-xs text-gray-600">
                                {classroom?.name || 'Room'} - {classroom?.building || 'Building'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {facultyMember?.name || 'Faculty'}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal for Slot Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Class Details</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedSlot && (
            <div className="space-y-6">
              {/* Course Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Course Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Course Name</label>
                      <p className="text-lg">{getCourseInfo(selectedSlot.courseId)?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Course Code</label>
                      <p className="text-lg">{getCourseInfo(selectedSlot.courseId)?.code || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Credits</label>
                      <p className="text-lg">{getCourseInfo(selectedSlot.courseId)?.credits || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Duration</label>
                      <p className="text-lg">60 minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Faculty Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Faculty Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Faculty Name</label>
                      <p className="text-lg">{getFacultyInfo(selectedSlot.facultyId)?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Designation</label>
                      <p className="text-lg">{getFacultyInfo(selectedSlot.facultyId)?.designation || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Department</label>
                      <p className="text-lg">{getFacultyInfo(selectedSlot.facultyId)?.department || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-lg">{getFacultyInfo(selectedSlot.facultyId)?.email || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Classroom Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Classroom Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Room Name</label>
                      <p className="text-lg">{getClassroomInfo(selectedSlot.classroomId)?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Building</label>
                      <p className="text-lg">{getClassroomInfo(selectedSlot.classroomId)?.building || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Capacity</label>
                      <p className="text-lg">{getClassroomInfo(selectedSlot.classroomId)?.capacity || 'N/A'} students</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Room Type</label>
                      <p className="text-lg">{getClassroomInfo(selectedSlot.classroomId)?.type || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Schedule Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Day</label>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {days[selectedSlot.day - 1]}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Time Slot</label>
                      <p className="text-lg">{selectedSlot.timeSlotId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Week</label>
                      <p className="text-lg">Week {selectedSlot.week}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Online</label>
                      <Badge variant={selectedSlot.isOnline ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                        {selectedSlot.isOnline ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
