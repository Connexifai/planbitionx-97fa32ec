import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import LoginV2 from "./pages/LoginV2.tsx";
import LoginV3 from "./pages/LoginV3.tsx";
import LoginV4 from "./pages/LoginV4.tsx";
import Landing from "./pages/Landing.tsx";
import PlanbitionHome from "./pages/PlanbitionHome.tsx";
import NotFound from "./pages/NotFound.tsx";
import Presentation from "./pages/Presentation.tsx";
import AiSlides from "./pages/AiSlides.tsx";
import SiteLayout from "./pages/marketing/SiteLayout.tsx";
import SiteHome from "./pages/marketing/SiteHome.tsx";
import SiteProduct from "./pages/marketing/SiteProduct.tsx";
import SiteAbout from "./pages/marketing/SiteAbout.tsx";
import SiteContact from "./pages/marketing/SiteContact.tsx";
import robotImg from "@/assets/robot-assistant.png";

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[300] bg-background flex flex-col items-center justify-center">
      <div className="pulsating-x pointer-events-none">
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
      </div>
      <img
        src={robotImg}
        alt="Loading"
        className="w-24 h-24 object-contain drop-shadow-2xl robot-float relative z-10"
      />
      <div className="mt-4 relative z-10">
        <div className="h-1 w-32 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary animate-[loading-bar_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (session) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function HomeOrPlanner() {
  const { session, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (session) return <Index />;
  return <Navigate to="/landing" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/login-v2" element={<PublicRoute><LoginV2 /></PublicRoute>} />
            <Route path="/login-v3" element={<PublicRoute><LoginV3 /></PublicRoute>} />
            <Route path="/login-v4" element={<PublicRoute><LoginV4 /></PublicRoute>} />
            <Route path="/" element={<HomeOrPlanner />} />
            <Route path="/presentation" element={<Presentation />} />
            <Route path="/ai-slides" element={<AiSlides />} />
            <Route path="/site" element={<SiteLayout />}>
              <Route index element={<SiteHome />} />
              <Route path="product" element={<SiteProduct />} />
              <Route path="over-ons" element={<SiteAbout />} />
              <Route path="contact" element={<SiteContact />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
