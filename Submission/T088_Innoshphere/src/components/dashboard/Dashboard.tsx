import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Building, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Plus,
  FileText,
  MessageSquare,
  Award,
  Settings,
  Bell,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnimatedStatsCard } from '@/components/ui/AnimatedStatsCard';

interface DashboardProps {
  stats?: {
    courses: number;
    faculty: number;
    classrooms: number;
    students: number;
    timetables: number;
    conflicts: number;
    utilization: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ stats = {
  courses: 45,
  faculty: 28,
  classrooms: 15,
  students: 450,
  timetables: 12,
  conflicts: 3,
  utilization: 87,
} }) => {
  const { user } = useAuth();

  const getRoleSpecificContent = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Administrator Dashboard',
          description: 'Manage your institution\'s scheduling and academic operations',
          quickActions: [
            { label: 'Generate Timetable', icon: Calendar, color: 'bg-blue-500' },
            { label: 'Manage Faculty', icon: Users, color: 'bg-green-500' },
            { label: 'View Analytics', icon: BarChart3, color: 'bg-purple-500' },
            { label: 'System Settings', icon: Settings, color: 'bg-gray-500' },
          ],
          recentActivities: [
            { action: 'Generated new timetable for Semester 6', time: '2 hours ago', type: 'success' },
            { action: 'Added 3 new faculty members', time: '4 hours ago', type: 'info' },
            { action: 'Resolved 2 scheduling conflicts', time: '6 hours ago', type: 'warning' },
            { action: 'Updated classroom availability', time: '1 day ago', type: 'info' },
          ],
          alerts: [
            { message: '3 scheduling conflicts need attention', type: 'warning', count: 3 },
            { message: 'Classroom utilization is below 80%', type: 'info', count: 1 },
            { message: '5 faculty members have exceeded workload', type: 'error', count: 5 },
          ]
        };
      case 'faculty':
        return {
          title: 'Faculty Dashboard',
          description: 'Manage your courses, classes, and academic schedule',
          quickActions: [
            { label: 'View My Classes', icon: Calendar, color: 'bg-blue-500' },
            { label: 'Create Assignment', icon: FileText, color: 'bg-green-500' },
            { label: 'Grade Submissions', icon: Award, color: 'bg-purple-500' },
            { label: 'Student Messages', icon: MessageSquare, color: 'bg-orange-500' },
          ],
          recentActivities: [
            { action: 'Uploaded lecture materials for CS301', time: '1 hour ago', type: 'success' },
            { action: 'Graded 15 assignments', time: '3 hours ago', type: 'info' },
            { action: 'Scheduled office hours', time: '5 hours ago', type: 'info' },
            { action: 'Responded to student queries', time: '1 day ago', type: 'success' },
          ],
          alerts: [
            { message: '2 assignments pending review', type: 'warning', count: 2 },
            { message: 'Office hours scheduled tomorrow', type: 'info', count: 1 },
            { message: '5 students need feedback', type: 'error', count: 5 },
          ]
        };
      case 'student':
        return {
          title: 'Student Dashboard',
          description: 'Access your timetable, assignments, and learning materials',
          quickActions: [
            { label: 'View Timetable', icon: Calendar, color: 'bg-blue-500' },
            { label: 'My Assignments', icon: FileText, color: 'bg-green-500' },
            { label: 'Submit Work', icon: Plus, color: 'bg-purple-500' },
            { label: 'View Grades', icon: Award, color: 'bg-orange-500' },
          ],
          recentActivities: [
            { action: 'Submitted Math assignment', time: '30 minutes ago', type: 'success' },
            { action: 'Viewed lecture notes for Physics', time: '2 hours ago', type: 'info' },
            { action: 'Participated in online discussion', time: '4 hours ago', type: 'success' },
            { action: 'Downloaded course materials', time: '1 day ago', type: 'info' },
          ],
          alerts: [
            { message: '2 assignments due this week', type: 'warning', count: 2 },
            { message: 'New lecture materials available', type: 'info', count: 3 },
            { message: 'Grades posted for Math quiz', type: 'success', count: 1 },
          ]
        };
      case 'approver':
        return {
          title: 'Approver Dashboard',
          description: 'Review and approve timetable changes and academic decisions',
          quickActions: [
            { label: 'Pending Approvals', icon: CheckCircle, color: 'bg-blue-500' },
            { label: 'Review Changes', icon: FileText, color: 'bg-green-500' },
            { label: 'View Reports', icon: BarChart3, color: 'bg-purple-500' },
            { label: 'Send Feedback', icon: MessageSquare, color: 'bg-orange-500' },
          ],
          recentActivities: [
            { action: 'Approved CS department timetable', time: '1 hour ago', type: 'success' },
            { action: 'Requested changes to ME schedule', time: '3 hours ago', type: 'warning' },
            { action: 'Reviewed faculty workload distribution', time: '5 hours ago', type: 'info' },
            { action: 'Scheduled approval meeting', time: '1 day ago', type: 'info' },
          ],
          alerts: [
            { message: '5 timetables pending approval', type: 'warning', count: 5 },
            { message: '3 departments need review', type: 'info', count: 3 },
            { message: '1 urgent approval required', type: 'error', count: 1 },
          ]
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to AdaptivePlanr',
          quickActions: [],
          recentActivities: [],
          alerts: []
        };
    }
  };

  const roleContent = getRoleSpecificContent(user?.role || 'student');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{roleContent.title}</h1>
            <p className="text-blue-100">{roleContent.description}</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedStatsCard
          title="Total Courses"
          value={stats.courses}
          icon={BookOpen}
          change={{ value: '+12% from last month', type: 'positive' }}
          delay={0}
        />

        <AnimatedStatsCard
          title="Faculty Members"
          value={stats.faculty}
          icon={Users}
          change={{ value: '+3 new members', type: 'positive' }}
          delay={100}
        />

        <AnimatedStatsCard
          title="Classrooms"
          value={stats.classrooms}
          icon={Building}
          change={{ value: `${stats.utilization}% utilization`, type: 'neutral' }}
          delay={200}
        />

        <AnimatedStatsCard
          title="Total Students"
          value={stats.students}
          icon={Users}
          change={{ value: '+45 this semester', type: 'positive' }}
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="animate-pulse">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roleContent.quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3 transition-all duration-300 hover:scale-110`}>
                    <Icon className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="animate-pulse">Recent Activities</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roleContent.recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 transition-all duration-300 hover:scale-105 hover:bg-gray-50 p-2 rounded-lg"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex-shrink-0 animate-bounce">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="animate-pulse">Alerts & Notifications</CardTitle>
          <CardDescription>Important updates and pending actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roleContent.alerts.map((alert, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0 animate-bounce">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <Badge 
                    variant={alert.type === 'error' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'default'}
                    className="animate-pulse"
                  >
                    {alert.count} item{alert.count > 1 ? 's' : ''}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-4 h-4 animate-pulse" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Current system metrics and health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Memory Usage</span>
                <span>62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage Usage</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timetable Status</CardTitle>
            <CardDescription>Current timetable generation and conflicts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Timetables</span>
              <Badge variant="default">{stats.timetables}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Scheduling Conflicts</span>
              <Badge variant={stats.conflicts > 0 ? 'destructive' : 'default'}>
                {stats.conflicts}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Classroom Utilization</span>
              <Badge variant={stats.utilization > 80 ? 'default' : 'secondary'}>
                {stats.utilization}%
              </Badge>
            </div>
            <div className="pt-2">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Timetable
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
