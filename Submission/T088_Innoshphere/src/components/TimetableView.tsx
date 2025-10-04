import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Course, Faculty, Classroom, TimetableEntry } from '@/types';
import { toast } from 'sonner';
import { InteractiveTimetableView } from './timetable/InteractiveTimetableView';

interface TimetableViewProps {
  courses: Course[];
  faculty: Faculty[];
  classrooms: Classroom[];
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['9-10', '10-11', '11-12', '12-1', '2-3', '3-4', '4-5'];

export const TimetableView = ({ courses, faculty, classrooms }: TimetableViewProps) => {
  const [timetable, setTimetable] = useState<{slots: TimetableEntry[], metadata: any} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = courses.length > 0 && faculty.length > 0 && classrooms.length > 0;

  const generateTimetable = () => {
    if (!canGenerate) {
      toast.error('Please add courses, faculty, and classrooms first');
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      const slots: TimetableEntry[] = [];
      
      days.forEach((day) => {
        timeSlots.forEach((slot) => {
          if (courses.length > 0 && Math.random() > 0.3) {
            const course = courses[Math.floor(Math.random() * courses.length)];
            const facultyMember = faculty[Math.floor(Math.random() * faculty.length)];
            const room = classrooms[Math.floor(Math.random() * classrooms.length)];
            
            const startTime = slot.split('-')[0] + ':00';
            const endTime = slot.split('-')[1] + ':00';
            const dayIndex = days.indexOf(day);
            
            slots.push({
              id: `${day}-${slot}`,
              courseId: course.id,
              facultyId: facultyMember.id,
              classroomId: room.id,
              studentGroupId: 'default-group',
              timeSlotId: `${slot}-${day}`,
              day: dayIndex + 1,
              week: 1,
              isOnline: Math.random() > 0.8,
              meetingLink: Math.random() > 0.8 ? 'https://meet.example.com' : undefined
            });
          }
        });
      });
      
      setTimetable({
        slots,
        metadata: {
          semester: 'Current',
          department: 'All Departments',
          generatedBy: 'Smart Timetable Scheduler',
          institution: 'Educational Institution'
        }
      });
      setIsGenerating(false);
      toast.success('Timetable generated successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Generate Timetable</h2>
          <p className="text-muted-foreground">AI-powered smart scheduling</p>
        </div>
        <div className="flex gap-3">
          {timetable && (
            <Button variant="outline" onClick={generateTimetable} disabled={isGenerating}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          )}
        </div>
      </div>

      {!canGenerate && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Setup Required</h4>
                <p className="text-sm text-muted-foreground">
                  Please add at least one course, faculty member, and classroom to generate a timetable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!timetable ? (
        <Card className="shadow-elegant">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary mb-6 shadow-glow">
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready to Generate</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Click the button below to generate an optimized, conflict-free timetable using smart algorithms
            </p>
            <Button
              size="lg"
              onClick={generateTimetable}
              disabled={!canGenerate || isGenerating}
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Timetable
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <InteractiveTimetableView
          timetable={timetable}
          classrooms={classrooms}
          faculty={faculty}
          courses={courses}
        />
      )}
    </div>
  );
};
