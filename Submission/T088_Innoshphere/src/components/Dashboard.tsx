import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DoorOpen, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardProps {
  stats: {
    courses: number;
    faculty: number;
    classrooms: number;
    timeSlots: number;
  };
}

export const Dashboard = ({ stats }: DashboardProps) => {
  const cards = [
    {
      title: 'Total Courses',
      value: stats.courses,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Faculty Members',
      value: stats.faculty,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Classrooms',
      value: stats.classrooms,
      icon: DoorOpen,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Time Slots',
      value: stats.timeSlots,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your scheduling system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Add New Course</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Register Faculty</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
              <DoorOpen className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Configure Classroom</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <CardTitle>System Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Data Completion</span>
                <span className="text-sm font-medium">
                  {Math.round(((stats.courses + stats.faculty + stats.classrooms) / 15) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{
                    width: `${Math.min(((stats.courses + stats.faculty + stats.classrooms) / 15) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.courses === 0 || stats.faculty === 0 || stats.classrooms === 0
                ? 'Add courses, faculty, and classrooms to generate timetables'
                : 'Ready to generate optimized timetables'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
