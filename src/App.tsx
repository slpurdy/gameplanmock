import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JoinTeam from "./pages/JoinTeam";
import CreateTeam from "./pages/CreateTeam";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import Chat from "./pages/Chat";
import Calendar from "./pages/Calendar";
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import Payments from "./pages/Payments";
import Team from "./pages/Team";
import TeamDetails from "./pages/TeamDetails";
import TeamRoles from "./pages/TeamRoles";
import InviteMembers from "./pages/InviteMembers";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PublicEvent from "./pages/PublicEvent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/join-team" element={<JoinTeam />} />
            <Route path="/create-team" element={<CreateTeam />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-dashboard" element={<UserDashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/calendar/create" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team-details" element={<TeamDetails />} />
            <Route path="/team-roles" element={<TeamRoles />} />
            <Route path="/invite-members" element={<InviteMembers />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/public-event/:id" element={<PublicEvent />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
