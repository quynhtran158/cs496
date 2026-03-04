import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Layout wrapper — applies Navbar and top padding to all non-auth pages
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <div className="pt-16">{children}</div>
  </>
);

function App() {
  return (
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
          path="/create-event"
          element={
            <MainLayout>
              <CreateEvent />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />

        {/* Fallback — redirect to home */}
        <Route
          path="*"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
