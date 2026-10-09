import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import ClassBooks from "./pages/ClassBooks";
import Students from "./pages/Students";
import Inventory from "./pages/Inventory";
import Distribution from "./pages/Distribution";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { useEduStock } from "./context/EduStockContext";

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <h2 className="text-xl font-semibold text-[#102A43]">{title}</h2>
      <p className="text-sm text-[#64748B] mt-2">This page is coming soon.</p>
    </div>
  );
}

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, user, signOut, error: authError } = useAuth();
  const { loading, error, reload } = useEduStock();

  const handleSignOut = async () => {
    const { error: signOutError } = await signOut();
    if (signOutError) window.alert(`Could not sign out: ${signOutError.message}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} profile={profile} email={user?.email} onSignOut={handleSignOut} />
        <main className="flex-1 p-4 sm:p-6">
          {loading && <p role="status" className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">Loading your Supabase records…</p>}
          {(error || authError) && <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span>{error || authError}</span>{error && <button onClick={() => void reload()} className="font-semibold underline">Retry</button>}</div>}
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/class-books" element={<ClassBooks />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/students" element={<Students />} />
      <Route path="/distribution" element={<Distribution />} />
      <Route path="/reports" element={<ComingSoon title="Reports" />} />
      <Route path="/settings" element={<ComingSoon title="Settings" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<ProtectedRoute><Layout><AppRoutes /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;