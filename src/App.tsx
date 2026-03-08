import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NdcProvider } from "@/contexts/NdcContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
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

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mining" element={<MiningPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wallet/fund" element={<FundWalletPage />} />
        <Route path="/wallet/transfer" element={<TransferPage />} />
        <Route path="/invest" element={<InvestPage />} />
        <Route path="/invest/:id" element={<ProjectDetailsPage />} />
        <Route path="/invest/:id/stake" element={<StakePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/ads" element={<AdsManagerPage />} />
        <Route path="/ads/create" element={<CreateCampaignPage />} />
        <Route path="/ads/:id" element={<CampaignDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/personal" element={<PersonalInfoPage />} />
        <Route path="/profile/security" element={<SecurityPage />} />
        <Route path="/profile/farms" element={<FarmAssetsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/fields" element={<FieldsPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/platform-charter" element={<PlatformCharterPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NdcProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </NdcProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
