import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import HomeLayout from "./layout/HomeLayout";
import CmsLayout from "./layout/CmsLayout";
import {AuthLayout} from "./layout/AuthLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import {ToastContainer} from "react-toastify";
import DaisyUIDemo from "./components/DaisyUIDemo";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Verify from "./pages/Auth/Verify.tsx";
import WaitingForMagicLink from "./pages/Auth/WaitingForMagicLink";
import Profile from "./pages/Profile/index.tsx";
import UserManagement from "./pages/Cms/UserManagement";
import Settings from "./pages/Cms/Settings";
import MainLayout from "./layout/MainLayout.tsx";
import Courses from "./pages/Course/Courses.tsx";
import CourseDetail from "./pages/Course/CourseDetail.tsx";
import CourseLayout from "./layout/CourseLayout.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <HomeLayout>
                <Outlet />
              </HomeLayout>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth/verify" element={<Verify />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="demo" element={<DaisyUIDemo />} />
          </Route>

          {/* CMS routes with CmsLayout */}
          <Route
            element={
              <CmsLayout>
                <Outlet />
              </CmsLayout>
            }
          >
            <Route path="/cms" element={<Dashboard />} />
            <Route path="/cms/user-management" element={<UserManagement />} />
            <Route path="/cms/settings" element={<Settings />} />
          </Route>

          {/* Main layout with course browser */}
          <Route
            element={
              <MainLayout>
                <Outlet />
              </MainLayout>
            }
          >
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
          </Route>

          {/* Course Layout */}
          <Route
            element={
              <CourseLayout>
                <Outlet />
              </CourseLayout>
            }
          >
            <Route
              path="/course/:courseId/learn/lesson"
              element={<p>Demo layout</p>}
            />
          </Route>

          {/* Auth routes with AuthLayout */}
          <Route
            element={
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/verify" element={<Verify />} />
            <Route
              path="/auth/waiting-magic-link"
              element={<WaitingForMagicLink />}
            />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          draggable
          pauseOnFocusLoss
          autoClose={3000}
          hideProgressBar
          newestOnTop
          pauseOnHover
        />
      </BrowserRouter>
    </>
  );
}

export default App;
