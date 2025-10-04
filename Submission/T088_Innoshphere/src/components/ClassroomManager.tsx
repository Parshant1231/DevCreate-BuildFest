import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, DoorOpen } from 'lucide-react';
import { Classroom, RoomType } from '@/types';
import { toast } from 'sonner';

interface ClassroomManagerProps {
  classrooms: Classroom[];
  onAddClassroom: (classroom: Classroom) => void;
  onDeleteClassroom: (id: string) => void;
}

export const ClassroomManager = ({ classrooms, onAddClassroom, onDeleteClassroom }: ClassroomManagerProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'theory' as RoomType,
    capacity: 60,
    resources: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please enter classroom name');
      return;
    }

    const newClassroom: Classroom = {
      id: crypto.randomUUID(),
      ...formData,
      resources: formData.resources.split(',').map(r => r.trim()).filter(Boolean),
    };

    onAddClassroom(newClassroom);
    setFormData({
      name: '',
      type: 'theory',
      capacity: 60,
      resources: '',
    });
    toast.success('Classroom added successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold mb-2">Classroom Management</h2>
        <p className="text-muted-foreground">Configure classrooms and their facilities</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Classroom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Name *</Label>
                <Input
                  id="room-name"
                  placeholder="e.g., Room 301"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">Room Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: RoomType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="room-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Theory Class</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                    <SelectItem value="seminar">Seminar Hall</SelectItem>
                    <SelectItem value="projector">Projector Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Seating Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="10"
                max="200"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resources">Resources (comma-separated)</Label>
              <Input
                id="resources"
                placeholder="e.g., Projector, Whiteboard, Computer"
                value={formData.resources}
                onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-primary hover:shadow-glow transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Add Classroom
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5" />
            Available Classrooms ({classrooms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classrooms.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No classrooms added yet</p>
          ) : (
            <div className="space-y-3">
              {classrooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-card transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <DoorOpen className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{room.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {room.type} • Capacity: {room.capacity}
                        {room.resources.length > 0 && ` • ${room.resources.join(', ')}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDeleteClassroom(room.id);
                      toast.success('Classroom removed');
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
