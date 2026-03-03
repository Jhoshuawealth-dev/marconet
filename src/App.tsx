import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import MiningPage from "./pages/MiningPage";
import WalletPage from "./pages/WalletPage";
import InvestPage from "./pages/InvestPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import CommunityPage from "./pages/CommunityPage";
import EducationPage from "./pages/EducationPage";
import AdsManagerPage from "./pages/AdsManagerPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import ProfilePage from "./pages/ProfilePage";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mining" element={<MiningPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route path="/invest/:id" element={<ProjectDetailsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/ads" element={<AdsManagerPage />} />
          <Route path="/ads/create" element={<CreateCampaignPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
