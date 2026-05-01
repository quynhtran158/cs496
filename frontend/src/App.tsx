import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDetail from "./pages/EventDetail";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <div className="pt-16">{children}</div>
  </>
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Auth pages — no navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Main pages — with navbar */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/discover"
              element={
                <MainLayout>
                  <Discover />
                </MainLayout>
              }
            />
            <Route
              path="/events/:id"
              element={
                <MainLayout>
                  <EventDetail />
                </MainLayout>
              }
            />
            <Route
              path="/events/:id/chat"
              element={
                <MainLayout>
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                </MainLayout>
              }
            />
            <Route
              path="/create-event"
              element={
                <MainLayout>
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MainLayout>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </MainLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <MainLayout>
                  <Faq />
                </MainLayout>
              }
            />

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <NotFound />
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
