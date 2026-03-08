import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NdcProvider } from "@/contexts/NdcContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/app/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import MiningPage from "./pages/MiningPage";
import WalletPage from "./pages/WalletPage";
import FundWalletPage from "./pages/FundWalletPage";
import TransferPage from "./pages/TransferPage";
import InvestPage from "./pages/InvestPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import StakePage from "./pages/StakePage";
import CommunityPage from "./pages/CommunityPage";
import EducationPage from "./pages/EducationPage";
import AdsManagerPage from "./pages/AdsManagerPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import CampaignDetailPage from "./pages/CampaignDetailPage";
import ProfilePage from "./pages/ProfilePage";
import PersonalInfoPage from "./pages/PersonalInfoPage";
import SecurityPage from "./pages/SecurityPage";
import FarmAssetsPage from "./pages/FarmAssetsPage";
import NotificationsPage from "./pages/NotificationsPage";
import VerificationPage from "./pages/VerificationPage";
import FieldsPage from "./pages/FieldsPage";
import MarketPage from "./pages/MarketPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import PlatformCharterPage from "./pages/PlatformCharterPage";

const queryClient = new QueryClient();

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/platform-charter" element={<PlatformCharterPage />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<P><DashboardPage /></P>} />
        <Route path="/mining" element={<P><MiningPage /></P>} />
        <Route path="/wallet" element={<P><WalletPage /></P>} />
        <Route path="/wallet/fund" element={<P><FundWalletPage /></P>} />
        <Route path="/wallet/transfer" element={<P><TransferPage /></P>} />
        <Route path="/invest" element={<P><InvestPage /></P>} />
        <Route path="/invest/:id" element={<P><ProjectDetailsPage /></P>} />
        <Route path="/invest/:id/stake" element={<P><StakePage /></P>} />
        <Route path="/community" element={<P><CommunityPage /></P>} />
        <Route path="/education" element={<P><EducationPage /></P>} />
        <Route path="/ads" element={<P><AdsManagerPage /></P>} />
        <Route path="/ads/create" element={<P><CreateCampaignPage /></P>} />
        <Route path="/ads/:id" element={<P><CampaignDetailPage /></P>} />
        <Route path="/profile" element={<P><ProfilePage /></P>} />
        <Route path="/profile/personal" element={<P><PersonalInfoPage /></P>} />
        <Route path="/profile/security" element={<P><SecurityPage /></P>} />
        <Route path="/profile/farms" element={<P><FarmAssetsPage /></P>} />
        <Route path="/notifications" element={<P><NotificationsPage /></P>} />
        <Route path="/verification" element={<P><VerificationPage /></P>} />
        <Route path="/fields" element={<P><FieldsPage /></P>} />
        <Route path="/market" element={<P><MarketPage /></P>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <NdcProvider>
            <Toaster />
            <Sonner />
            <AnimatedRoutes />
          </NdcProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
