import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children, superOnly = false }: { children: React.ReactNode; superOnly?: boolean }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isSuperAdmin, loading: roleLoading } = useAdminRole();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;
  if (superOnly && !isSuperAdmin) return <Navigate to="/dashboard" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default AdminRoute;
