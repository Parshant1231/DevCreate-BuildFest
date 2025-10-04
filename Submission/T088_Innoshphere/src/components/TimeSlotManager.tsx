import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { TimeSlot } from '@/types';

const defaultTimeSlots: TimeSlot[] = [
  { id: '1', day: 1, startTime: '09:00', endTime: '10:00', label: '9:00 AM - 10:00 AM' },
  { id: '2', day: 1, startTime: '10:00', endTime: '11:00', label: '10:00 AM - 11:00 AM' },
  { id: '3', day: 1, startTime: '11:00', endTime: '12:00', label: '11:00 AM - 12:00 PM' },
  { id: '4', day: 1, startTime: '12:00', endTime: '13:00', label: '12:00 PM - 1:00 PM' },
  { id: '5', day: 1, startTime: '14:00', endTime: '15:00', label: '2:00 PM - 3:00 PM' },
  { id: '6', day: 1, startTime: '15:00', endTime: '16:00', label: '3:00 PM - 4:00 PM' },
  { id: '7', day: 1, startTime: '16:00', endTime: '17:00', label: '4:00 PM - 5:00 PM' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TimeSlotManager = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold mb-2">Time Slot Configuration</h2>
        <p className="text-muted-foreground">Default weekly schedule structure</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {days.map((day, index) => (
              <div key={day}>
                <h3 className="font-semibold mb-3 text-lg">{day}</h3>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {defaultTimeSlots.map((slot) => (
                    <div
                      key={`${day}-${slot.id}`}
                      className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <p className="text-sm font-medium">{slot.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> These are the standard time slots. The timetable generator will
              automatically assign courses to these slots based on constraints and optimization rules.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
