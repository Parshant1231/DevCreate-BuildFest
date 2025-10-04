import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  FileText, 
  Calendar,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit,
  Send,
  History
} from 'lucide-react';
import { 
  GeneratedTimetable, 
  ApprovalWorkflow as ApprovalWorkflowType, 
  ApprovalStep, 
  ApprovalStatus, 
  ApprovalLevel 
} from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ApprovalWorkflowProps {
  timetable: GeneratedTimetable;
  onApprovalUpdate?: (workflow: ApprovalWorkflowType) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  timetable,
  onApprovalUpdate,
}) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // Mock approval workflow data
  const [workflow, setWorkflow] = useState<ApprovalWorkflowType>({
    id: `workflow_${timetable.id}`,
    timetableId: timetable.id,
    currentLevel: 'department',
    status: 'pending',
    approvals: [
      {
        id: 'step1',
        level: 'department',
        approverId: 'dept_head_1',
        approverName: 'Dr. Sarah Johnson (CS Head)',
        status: 'pending',
        required: true,
      },
      {
        id: 'step2',
        level: 'academic',
        approverId: 'academic_dean_1',
        approverName: 'Prof. Michael Chen (Academic Dean)',
        status: 'pending',
        required: true,
      },
      {
        id: 'step3',
        level: 'administrative',
        approverId: 'admin_head_1',
        approverName: 'Mr. David Wilson (Administrative Head)',
        status: 'pending',
        required: false,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'needs_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'needs_revision': return <Edit className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: ApprovalLevel) => {
    switch (level) {
      case 'department': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-purple-100 text-purple-800';
      case 'administrative': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (stepId: string) => {
    const updatedApprovals = workflow.approvals.map(approval => {
      if (approval.id === stepId) {
        return {
          ...approval,
          status: 'approved' as ApprovalStatus,
          comments: comment,
          approvedAt: new Date(),
        };
      }
      return approval;
    });

    const newWorkflow = {
      ...workflow,
      approvals: updatedApprovals,
      updatedAt: new Date(),
    };

    // Check if all required approvals are done
    const requiredApprovals = newWorkflow.approvals.filter(a => a.required);
    const approvedRequired = requiredApprovals.every(a => a.status === 'approved');
    
    if (approvedRequired) {
      newWorkflow.status = 'approved';
    } else {
      // Move to next level
      const nextStep = newWorkflow.approvals.find(a => a.status === 'pending' && a.required);
      if (nextStep) {
        newWorkflow.currentLevel = nextStep.level;
      }
    }

    setWorkflow(newWorkflow);
    onApprovalUpdate?.(newWorkflow);
    setComment('');
    toast.success('Approval submitted successfully');
  };

  const handleReject = (stepId: string) => {
    const updatedApprovals = workflow.approvals.map(approval => {
      if (approval.id === stepId) {
        return {
          ...approval,
          status: 'rejected' as ApprovalStatus,
          comments: comment,
          approvedAt: new Date(),
        };
      }
      return approval;
    });

    const newWorkflow = {
      ...workflow,
      approvals: updatedApprovals,
      status: 'rejected',
      updatedAt: new Date(),
    };

    setWorkflow(newWorkflow);
    onApprovalUpdate?.(newWorkflow);
    setComment('');
    toast.error('Timetable rejected');
  };

  const handleRequestRevision = (stepId: string) => {
    const updatedApprovals = workflow.approvals.map(approval => {
      if (approval.id === stepId) {
        return {
          ...approval,
          status: 'needs_revision' as ApprovalStatus,
          comments: comment,
          approvedAt: new Date(),
        };
      }
      return approval;
    });

    const newWorkflow = {
      ...workflow,
      approvals: updatedApprovals,
      status: 'needs_revision',
      updatedAt: new Date(),
    };

    setWorkflow(newWorkflow);
    onApprovalUpdate?.(newWorkflow);
    setComment('');
    toast.info('Revision requested');
  };

  const getCurrentStep = () => {
    return workflow.approvals.find(a => a.level === workflow.currentLevel);
  };

  const canApprove = (step: ApprovalStep) => {
    // Check if user can approve this step based on their role
    if (!user) return false;
    
    if (step.level === 'department' && user.role === 'faculty') return true;
    if (step.level === 'academic' && user.role === 'approver') return true;
    if (step.level === 'administrative' && user.role === 'admin') return true;
    
    return false;
  };

  const currentStep = getCurrentStep();
  const isWorkflowComplete = workflow.status === 'approved' || workflow.status === 'rejected';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Approval Workflow</h2>
          <p className="text-gray-600">Review and approve timetable: {timetable.name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Badge className={getStatusColor(workflow.status)}>
            {workflow.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Approval Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflow.approvals.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 border rounded-lg ${
                  step.id === currentStep?.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'approved' ? 'bg-green-100' :
                        step.status === 'rejected' ? 'bg-red-100' :
                        step.status === 'needs_revision' ? 'bg-orange-100' :
                        step.id === currentStep?.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {getStatusIcon(step.status)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{step.approverName}</h4>
                        <Badge className={getLevelColor(step.level)}>
                          {step.level}
                        </Badge>
                        {step.required && (
                          <Badge variant="outline">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {step.comments || 'No comments provided'}
                      </p>
                      {step.approvedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {step.status === 'approved' ? 'Approved' : 
                           step.status === 'rejected' ? 'Rejected' : 
                           'Requested revision'} on {step.approvedAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge className={getStatusColor(step.status)}>
                      {step.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Action */}
      {currentStep && !isWorkflowComplete && canApprove(currentStep) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Your Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Current Step:</strong> {currentStep.approverName} - {currentStep.level} level approval
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Please review the timetable and provide your decision with comments.
                </p>
              </div>

              <div>
                <Label htmlFor="comment">Comments</Label>
                <Textarea
                  id="comment"
                  placeholder="Add your comments, feedback, or concerns about this timetable..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(currentStep.id)}
                  disabled={!comment.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleRequestRevision(currentStep.id)}
                  disabled={!comment.trim()}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Request Revision
                </Button>
                <Button
                  onClick={() => handleReject(currentStep.id)}
                  disabled={!comment.trim()}
                  variant="destructive"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Status */}
      {isWorkflowComplete && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              {workflow.status === 'approved' ? (
                <div>
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Timetable Approved!</h3>
                  <p className="text-green-700">
                    This timetable has been approved and is ready for implementation.
                  </p>
                </div>
              ) : (
                <div>
                  <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-red-800 mb-2">Timetable Rejected</h3>
                  <p className="text-red-700">
                    This timetable has been rejected and needs revision before resubmission.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timetable Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Timetable Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{timetable.score.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {timetable.conflicts.length}
              </div>
              <div className="text-sm text-gray-600">Conflicts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {timetable.entries.length}
              </div>
              <div className="text-sm text-gray-600">Scheduled Classes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval History */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Approval History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Workflow created</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{workflow.createdAt.toLocaleString()}</span>
              </div>
              {workflow.approvals
                .filter(approval => approval.approvedAt)
                .map((approval, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    {getStatusIcon(approval.status)}
                    <span className="text-gray-600">
                      {approval.status === 'approved' ? 'Approved' :
                       approval.status === 'rejected' ? 'Rejected' : 
                       'Revision requested'} by {approval.approverName}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {approval.approvedAt?.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

