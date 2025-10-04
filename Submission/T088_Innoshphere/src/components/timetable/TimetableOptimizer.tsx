import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  Building, 
  BarChart3,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star
} from 'lucide-react';
import { 
  Course, 
  Faculty, 
  Classroom, 
  GeneratedTimetable, 
  OptimizationConstraints,
  TimetableConflicts 
} from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TimetableOptimizerProps {
  courses: Course[];
  faculty: Faculty[];
  classrooms: Classroom[];
  onTimetableGenerated?: (timetable: GeneratedTimetable) => void;
}

interface OptimizationSettings {
  maxIterations: number;
  populationSize: number;
  crossoverRate: number;
  mutationRate: number;
  elitismRate: number;
  timeout: number; // in seconds
}

export const TimetableOptimizer: React.FC<TimetableOptimizerProps> = ({
  courses,
  faculty,
  classrooms,
  onTimetableGenerated,
}) => {
  const { user } = useAuth();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [generatedTimetables, setGeneratedTimetables] = useState<GeneratedTimetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<GeneratedTimetable | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    maxIterations: 1000,
    populationSize: 50,
    crossoverRate: 0.8,
    mutationRate: 0.1,
    elitismRate: 0.1,
    timeout: 300, // 5 minutes
  });

  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    facultyWorkload: {
      minHoursPerWeek: 8,
      maxHoursPerWeek: 40,
      maxHoursPerDay: 8,
    },
    classroomUtilization: {
      minUtilization: 60,
      maxUtilization: 95,
    },
    studentGaps: {
      maxGapsPerDay: 2,
      preferConsecutiveSlots: true,
    },
    departmentPreferences: {
      'Computer Science': {
        preferredSlots: ['09:00-10:30', '10:45-12:15'],
        avoidedSlots: ['14:00-15:30'],
      },
      'Mathematics': {
        preferredSlots: ['08:00-09:30', '15:45-17:15'],
        avoidedSlots: ['12:30-14:00'],
      },
    },
  });

  // Mock optimization algorithm
  const runOptimization = async () => {
    setIsOptimizing(true);
    setProgress(0);
    setCurrentIteration(0);
    setBestScore(0);

    try {
      for (let i = 0; i < optimizationSettings.maxIterations; i++) {
        // Simulate optimization step
        await new Promise(resolve => setTimeout(resolve, 10));
        
        setCurrentIteration(i + 1);
        setProgress((i + 1) / optimizationSettings.maxIterations * 100);
        
        // Simulate improving score
        const newScore = Math.min(95, 60 + (i / optimizationSettings.maxIterations) * 35 + Math.random() * 10);
        if (newScore > bestScore) {
          setBestScore(newScore);
        }

        // Generate a sample timetable every 100 iterations
        if ((i + 1) % 100 === 0) {
          const sampleTimetable = generateSampleTimetable(i + 1, newScore);
          setGeneratedTimetables(prev => [...prev, sampleTimetable]);
        }
      }

      // Final timetable
      const finalTimetable = generateSampleTimetable(optimizationSettings.maxIterations, bestScore);
      setGeneratedTimetables(prev => [...prev, finalTimetable]);
      setSelectedTimetable(finalTimetable);
      
      toast.success(`Optimization completed! Generated ${generatedTimetables.length + 1} timetable options.`);
    } catch (error) {
      toast.error('Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const generateSampleTimetable = (iteration: number, score: number): GeneratedTimetable => {
    const conflicts: TimetableConflicts[] = [];
    if (score < 80) {
      conflicts.push({
        type: 'faculty',
        description: 'Faculty workload imbalance detected',
        severity: 'medium',
        affectedEntries: ['entry1', 'entry2'],
      });
    }
    if (score < 75) {
      conflicts.push({
        type: 'classroom',
        description: 'Classroom utilization below optimal',
        severity: 'low',
        affectedEntries: ['entry3'],
      });
    }

    return {
      id: `timetable_${iteration}`,
      name: `Optimized Timetable ${iteration}`,
      entries: [], // Mock entries
      score,
      conflicts,
      metrics: {
        teacherWorkloadBalance: Math.min(95, score + Math.random() * 5),
        classroomUtilization: Math.min(95, score - 5 + Math.random() * 10),
        studentGaps: Math.max(85, score - 10 + Math.random() * 15),
        conflictCount: conflicts.length,
        departmentSatisfaction: Math.min(95, score + Math.random() * 5),
      },
      constraints,
      generatedAt: new Date(),
      generatedBy: user?.id || 'system',
      status: 'draft',
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleApproveTimetable = (timetable: GeneratedTimetable) => {
    // Mock approval
    toast.success('Timetable approved and saved!');
    onTimetableGenerated?.(timetable);
  };

  const handleRejectTimetable = (timetable: GeneratedTimetable) => {
    // Mock rejection
    toast.info('Timetable marked for revision');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Timetable Optimizer</h2>
          <p className="text-gray-600">Generate optimized timetables using advanced algorithms</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            onClick={runOptimization}
            disabled={isOptimizing || courses.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isOptimizing ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Optimization
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Max Iterations</label>
                <input
                  type="number"
                  min="100"
                  max="5000"
                  value={optimizationSettings.maxIterations}
                  onChange={(e) => setOptimizationSettings(prev => ({
                    ...prev,
                    maxIterations: parseInt(e.target.value)
                  }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Population Size</label>
                <input
                  type="number"
                  min="20"
                  max="200"
                  value={optimizationSettings.populationSize}
                  onChange={(e) => setOptimizationSettings(prev => ({
                    ...prev,
                    populationSize: parseInt(e.target.value)
                  }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Timeout (seconds)</label>
                <input
                  type="number"
                  min="60"
                  max="1800"
                  value={optimizationSettings.timeout}
                  onChange={(e) => setOptimizationSettings(prev => ({
                    ...prev,
                    timeout: parseInt(e.target.value)
                  }))}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {isOptimizing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Optimization Progress</h3>
                <Badge className={getScoreBadgeColor(bestScore)}>
                  Best Score: {bestScore.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Iteration: {currentIteration} / {optimizationSettings.maxIterations}</span>
                <span>Progress: {progress.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Timetables */}
      {generatedTimetables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Generated Timetables ({generatedTimetables.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedTimetables.map((timetable) => (
                <div
                  key={timetable.id}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedTimetable?.id === timetable.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{timetable.name}</h4>
                        <Badge className={getScoreBadgeColor(timetable.score)}>
                          Score: {timetable.score.toFixed(1)}%
                        </Badge>
                        {timetable.conflicts.length > 0 && (
                          <Badge variant="destructive">
                            {timetable.conflicts.length} Conflicts
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Generated on {timetable.generatedAt.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTimetable(timetable)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveTimetable(timetable)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectTimetable(timetable)}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="text-sm font-medium">Workload</span>
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        {timetable.metrics.teacherWorkloadBalance.toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Building className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium">Utilization</span>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {timetable.metrics.classroomUtilization.toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-purple-600 mr-1" />
                        <span className="text-sm font-medium">Student Gaps</span>
                      </div>
                      <div className="text-lg font-semibold text-purple-600">
                        {timetable.metrics.studentGaps.toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                        <span className="text-sm font-medium">Conflicts</span>
                      </div>
                      <div className="text-lg font-semibold text-red-600">
                        {timetable.metrics.conflictCount}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-yellow-600 mr-1" />
                        <span className="text-sm font-medium">Satisfaction</span>
                      </div>
                      <div className="text-lg font-semibold text-yellow-600">
                        {timetable.metrics.departmentSatisfaction.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Conflicts */}
                  {timetable.conflicts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h5 className="font-medium text-red-800 mb-2">Conflicts Detected:</h5>
                      <ul className="space-y-1">
                        {timetable.conflicts.map((conflict, index) => (
                          <li key={index} className="text-sm text-red-700 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-2" />
                            {conflict.description} ({conflict.severity} severity)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Timetable Details */}
      {selectedTimetable && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Timetable: {selectedTimetable.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    Overall Score: <span className={`font-semibold ${getScoreColor(selectedTimetable.score)}`}>
                      {selectedTimetable.score.toFixed(1)}%
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleApproveTimetable(selectedTimetable)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve & Save
                  </Button>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium">Performance Metrics</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Teacher Workload Balance</span>
                      <span className="text-sm font-medium">{selectedTimetable.metrics.teacherWorkloadBalance.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedTimetable.metrics.teacherWorkloadBalance} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Classroom Utilization</span>
                      <span className="text-sm font-medium">{selectedTimetable.metrics.classroomUtilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedTimetable.metrics.classroomUtilization} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Student Gap Minimization</span>
                      <span className="text-sm font-medium">{selectedTimetable.metrics.studentGaps.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedTimetable.metrics.studentGaps} className="h-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">Quality Indicators</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Conflict Count</span>
                      <Badge variant={selectedTimetable.metrics.conflictCount === 0 ? 'default' : 'destructive'}>
                        {selectedTimetable.metrics.conflictCount}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Department Satisfaction</span>
                      <span className="text-sm font-medium">{selectedTimetable.metrics.departmentSatisfaction.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedTimetable.metrics.departmentSatisfaction} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {courses.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Setup Required</h3>
            <p className="text-gray-600">
              Please add courses, faculty, and classrooms before running the optimization algorithm.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

