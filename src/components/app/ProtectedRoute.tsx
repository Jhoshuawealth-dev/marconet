import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import SideNav from "@/components/app/SideNav";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <SideNav />
      <div className="lg:pl-[260px]">{children}</div>
    </>
  );
};

export default ProtectedRoute;

