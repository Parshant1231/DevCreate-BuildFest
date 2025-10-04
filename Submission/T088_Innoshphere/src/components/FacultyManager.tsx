import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, User } from 'lucide-react';
import { Faculty } from '@/types';
import { toast } from 'sonner';

interface FacultyManagerProps {
  faculty: Faculty[];
  onAddFaculty: (faculty: Faculty) => void;
  onDeleteFaculty: (id: string) => void;
}

export const FacultyManager = ({ faculty, onAddFaculty, onDeleteFaculty }: FacultyManagerProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    maxLoadPerDay: 4,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Initialize availability matrix (5 days x 8 slots)
    const availability = Array(5).fill(null).map(() => Array(8).fill(true));

    const newFaculty: Faculty = {
      id: crypto.randomUUID(),
      ...formData,
      availability,
      preferredHours: [],
      assignedCourses: [],
    };

    onAddFaculty(newFaculty);
    setFormData({
      name: '',
      email: '',
      maxLoadPerDay: 4,
    });
    toast.success('Faculty member added successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold mb-2">Faculty Management</h2>
        <p className="text-muted-foreground">Register faculty members and their availability</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Faculty Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="faculty-name">Full Name *</Label>
                <Input
                  id="faculty-name"
                  placeholder="e.g., Dr. John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., john.smith@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoad">Max Teaching Load (hours/day)</Label>
              <Input
                id="maxLoad"
                type="number"
                min="1"
                max="8"
                value={formData.maxLoadPerDay}
                onChange={(e) => setFormData({ ...formData, maxLoadPerDay: parseInt(e.target.value) })}
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-accent hover:shadow-glow transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Registered Faculty ({faculty.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {faculty.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No faculty members added yet</p>
          ) : (
            <div className="space-y-3">
              {faculty.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-card transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.email} • Max {member.maxLoadPerDay}h/day
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDeleteFaculty(member.id);
                      toast.success('Faculty member removed');
                    }}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
