import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Megaphone, Plus, Edit, Trash2, Eye, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string;
  title: string;
  body: string;
  target: string;
  published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const AdminAnnouncementsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    target: "all",
    published: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setAnnouncements(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      if (editingAnnouncement) {
        // Update existing
        const { error } = await supabase
          .from("announcements")
          .update({
            title: formData.title,
            body: formData.body,
            target: formData.target,
            published: formData.published
          })
          .eq("id", editingAnnouncement.id);

        if (error) throw error;
        toast({ title: "Announcement updated successfully" });
      } else {
        // Create new
        const { error } = await supabase
          .from("announcements")
          .insert({
            title: formData.title,
            body: formData.body,
            target: formData.target,
            published: formData.published,
            created_by: user.id
          });

        if (error) throw error;
        toast({ title: "Announcement created successfully" });
      }

      setShowDialog(false);
      setEditingAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save announcement",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({ title: "Announcement deleted successfully" });
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive"
      });
    }
  };

  const handlePublishToggle = async (announcement: Announcement) => {
    try {
      const newPublished = !announcement.published;
      const { error } = await supabase
        .from("announcements")
        .update({ published: newPublished })
        .eq("id", announcement.id);

      if (error) throw error;

      // Send notifications to all users when publishing
      if (newPublished) {
        await supabase.rpc("notify_all_users" as any, {
          _title: announcement.title,
          _body: announcement.body,
          _type: "announcement",
        });
      }
      
      toast({ 
        title: `Announcement ${newPublished ? 'published' : 'unpublished'}${newPublished ? ' — notifications sent!' : ''}` 
      });
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      body: "",
      target: "all",
      published: false
    });
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      body: announcement.body,
      target: announcement.target,
      published: announcement.published
    });
    setShowDialog(true);
  };

  const openCreateDialog = () => {
    setEditingAnnouncement(null);
    resetForm();
    setShowDialog(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Announcements</h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-1">
              Manage platform-wide announcements and notifications
            </p>
          </div>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gradient-primary text-primary-foreground border-0 shadow-premium gap-2">
                <Plus className="h-4 w-4" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
                </DialogTitle>
                <DialogDescription>
                  {editingAnnouncement ? "Update the announcement details" : "Create a new announcement for your users"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-[13px] font-bold">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 rounded-xl border-border/60"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div>
                  <Label className="text-[13px] font-bold">Message</Label>
                  <Textarea
                    value={formData.body}
                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    className="mt-1 min-h-32 rounded-xl border-border/60"
                    placeholder="Enter your announcement message"
                  />
                </div>

                <div>
                  <Label className="text-[13px] font-bold">Target Audience</Label>
                  <Select value={formData.target} onValueChange={(value) => setFormData(prev => ({ ...prev, target: value }))}>
                    <SelectTrigger className="mt-1 rounded-xl border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="admins">Admins Only</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="investors">Investors Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, published: false }));
                    handleSubmit();
                  }}
                  variant="outline"
                >
                  Save Draft
                </Button>
                <Button 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, published: true }));
                    handleSubmit();
                  }}
                  className="gradient-primary text-primary-foreground border-0"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border/60 rounded-2xl animate-pulse">
                <CardContent className="p-6 h-32" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="border border-border/60 shadow-premium rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-premium">
                          <Megaphone className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-display font-extrabold text-foreground truncate">
                            {announcement.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={`border-0 text-[9px] font-bold px-2 py-0.5 rounded-lg ${
                                announcement.published 
                                  ? 'bg-green-500/10 text-green-600'
                                  : 'bg-yellow-500/10 text-yellow-600'
                              }`}
                            >
                              {announcement.published ? 'Published' : 'Draft'}
                            </Badge>
                            <Badge className="bg-blue-500/10 text-blue-600 border-0 text-[9px] font-bold px-2 py-0.5 rounded-lg">
                              {announcement.target === 'all' ? 'All Users' : announcement.target}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[13px] text-muted-foreground mb-3 line-clamp-2">
                        {announcement.body}
                      </p>
                      
                      <p className="text-[10px] text-muted-foreground">
                        Created: {new Date(announcement.created_at).toLocaleString()}
                        {announcement.updated_at !== announcement.created_at && (
                          <span> • Updated: {new Date(announcement.updated_at).toLocaleString()}</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublishToggle(announcement)}
                        className="gap-1 text-[11px]"
                      >
                        <Eye className="h-3 w-3" />
                        {announcement.published ? 'Unpublish' : 'Publish'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(announcement)}
                        className="gap-1 text-[11px]"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(announcement.id)}
                        className="gap-1 text-[11px] text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {announcements.length === 0 && (
              <Card className="border border-border/60 rounded-2xl">
                <CardContent className="py-16 text-center">
                  <Megaphone className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-[15px] font-display font-extrabold text-foreground mb-2">No Announcements</h3>
                  <p className="text-[12px] text-muted-foreground mb-4">
                    Create your first announcement to communicate with your users
                  </p>
                  <Button onClick={openCreateDialog} className="gradient-primary text-primary-foreground border-0 gap-2">
                    <Plus className="h-4 w-4" />
                    Create Announcement
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnnouncementsPage;