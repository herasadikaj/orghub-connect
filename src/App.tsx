import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/features/auth";
import { AuthErrorBoundary } from "@/features/auth/components/AuthErrorBoundary";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import LoginError from "./pages/LoginError";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/auth"
              element={
                <AuthErrorBoundary>
                  <Auth />
                </AuthErrorBoundary>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthErrorBoundary>
                  <Signup />
                </AuthErrorBoundary>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthErrorBoundary>
                  <Profile />
                </AuthErrorBoundary>
              }
            />
            <Route path="/login-error" element={<LoginError />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
