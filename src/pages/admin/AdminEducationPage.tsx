import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, TrendingUp, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EnrollmentData {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

interface CourseSummary {
  course_id: string;
  enrollment_count: number;
  recent_enrollments: number;
}

const COURSE_NAMES = {
  "digital-farming": "Digital Farming",
  "investment": "Investment Strategies",
  "governance": "Governance & DAO",
  "ai-tools": "AI Tools & Tech"
};

const AdminEducationPage = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [courseSummaries, setCourseSummaries] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all enrollments
      const { data: enrollmentData } = await supabase
        .from("enrolled_courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (enrollmentData) {
        // Get user IDs and fetch profiles separately
        const userIds = [...new Set(enrollmentData.map(e => e.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);

        // Create profile map
        const profileMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

        // Combine data
        const enrollmentsWithProfiles = enrollmentData.map(enrollment => ({
          ...enrollment,
          profiles: profileMap.get(enrollment.user_id) || { full_name: null }
        }));

        setEnrollments(enrollmentsWithProfiles);

        // Calculate course summaries
        const courseMap = new Map<string, { count: number; recent: number }>();
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        enrollmentData.forEach(enrollment => {
          const current = courseMap.get(enrollment.course_id) || { count: 0, recent: 0 };
          const isRecent = new Date(enrollment.created_at) > oneWeekAgo;
          
          courseMap.set(enrollment.course_id, {
            count: current.count + 1,
            recent: current.recent + (isRecent ? 1 : 0)
          });
        });

        const summaryData = Array.from(courseMap.entries()).map(([course_id, data]) => ({
          course_id,
          enrollment_count: data.count,
          recent_enrollments: data.recent
        })).sort((a, b) => b.enrollment_count - a.enrollment_count);

        setCourseSummaries(summaryData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const totalEnrollments = enrollments.length;
  const uniqueStudents = new Set(enrollments.map(e => e.user_id)).size;
  const totalCourses = Object.keys(COURSE_NAMES).length;
  const activeCourses = courseSummaries.length;

  // Chart data for course enrollments
  const chartData = courseSummaries.map(summary => ({
    name: COURSE_NAMES[summary.course_id as keyof typeof COURSE_NAMES] || summary.course_id,
    enrollments: summary.enrollment_count
  }));

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-extrabold text-foreground">Education Overview</h1>
          <p className="text-[12px] text-muted-foreground font-medium mt-1">
            Track course enrollments and learning trends
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-premium">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-[20px] font-display font-extrabold text-metric">{totalEnrollments}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Total Enrollments</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center shadow-premium">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-[20px] font-display font-extrabold text-metric">{uniqueStudents}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Active Students</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-secondary flex items-center justify-center shadow-premium">
                <GraduationCap className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-[20px] font-display font-extrabold text-metric">{activeCourses}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Active Courses</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 shadow-premium rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-premium">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[20px] font-display font-extrabold text-metric">
                  {courseSummaries.reduce((sum, c) => sum + c.recent_enrollments, 0)}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">This Week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-[15px] font-display font-extrabold">Course Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}
                    formatter={(value: number) => [value, "Enrollments"]}
                  />
                  <Bar 
                    dataKey="enrollments" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseSummaries.map((course) => (
            <Card key={course.course_id} className="border border-border/60 shadow-premium rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shadow-sm">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-display font-extrabold text-foreground">
                      {COURSE_NAMES[course.course_id as keyof typeof COURSE_NAMES] || course.course_id}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">{course.course_id}</p>
                  </div>
                  {course.recent_enrollments > 0 && (
                    <Badge className="bg-green-500/10 text-green-600 border-0 text-[9px] font-bold px-2 py-1 rounded-lg">
                      +{course.recent_enrollments} this week
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground font-medium">Total Enrollments</span>
                    <span className="text-[13px] font-bold text-metric">{course.enrollment_count}</span>
                  </div>
                  
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-foreground h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(course.enrollment_count / Math.max(...courseSummaries.map(c => c.enrollment_count))) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Enrollments */}
        <Card className="border border-border/60 shadow-premium rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-[15px] font-display font-extrabold">Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted/30 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {enrollments.slice(0, 10).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shadow-sm">
                        {(enrollment.profiles?.full_name || "U").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-foreground">
                          {enrollment.profiles?.full_name || "Anonymous"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {COURSE_NAMES[enrollment.course_id as keyof typeof COURSE_NAMES] || enrollment.course_id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(enrollment.created_at).toLocaleDateString()}
                      </p>
                      <Badge className="gradient-accent text-accent-foreground border-0 text-[9px] font-bold px-2 py-0.5 rounded-lg mt-1">
                        200 NDC
                      </Badge>
                    </div>
                  </div>
                ))}
                {enrollments.length === 0 && (
                  <div className="py-8 text-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-[12px] text-muted-foreground">No enrollments yet</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEducationPage;