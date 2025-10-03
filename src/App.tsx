import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {useQuery} from "@tanstack/react-query";

import {login} from "./redux/slice/userSlice.tsx";
import {useAppDispatch, useAppSelector} from "./redux/hooks.ts";
import {userServices} from "./lib/services/user.services.ts";
import {getAccessToken} from "./lib/utils/getAccessToken.ts";

import ProtectedRoute from "./components/ProtectedRoute.tsx";

import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Notify from "./pages/Auth/Notify.tsx";
import VerifyRedirect from "./pages/Auth/VerifyRedirect.tsx";
import Verify from "./pages/Auth/Verify.tsx";

import MainLayout from "./layout/MainLayout.tsx";

import CourseLayout from "./layout/CourseLayout.tsx";
import Courses from "./pages/Course/Courses.tsx";
import CourseDetail from "./pages/Course/CourseDetail.tsx";

import ProfileLayout from "./layout/ProfileLayout.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import Settings from "./pages/Profile/Settings.tsx";
import UserList from "./pages/CMS/UserList.tsx";
import UserDetail from "./pages/CMS/UserDetail.tsx";
import InstructorLayout from "./layout/InstructorLayout.tsx";
import InstructorCourse from "./pages/Instructor/Courses/index.tsx";
import CreateCourse from "./pages/Instructor/Courses/CreateCourse/index.tsx";
import EditCourse from "./pages/Instructor/Courses/EditCourse/index.tsx";
import CreateLecture from "./pages/Instructor/Courses/EditCourse/components/CreateLecture.tsx";
import {CourseProvider} from "./context/CourseContext.tsx";

function App() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user.data);

  useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await userServices.getUserInfo(accessToken);

      // Set global state
      dispatch(
        login({
          name: response.data.fullName,
          email: response.data.email,
          username: response.data.username,
          image: response.data.userImage || undefined,
          type: response.data.userType,
        }),
      );
      return response;
    },
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth layout: login, register */}
          <Route
            element={
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/notify" element={<Notify />} />
          <Route path="/auth/verify" element={<VerifyRedirect />} />
          <Route path="/verify" element={<Verify />} />

          {/* Public layout */}
          <Route
            element={
              <MainLayout>
                <Outlet />
              </MainLayout>
            }
          >
            <Route path="/" element={<Courses />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <ProfileLayout>
                  <Outlet />
                </ProfileLayout>
              }
            >
              <Route path="/profile" element={<Profile />} />
              {userInfo?.type === "SYSTEM_USER" && (
                <>
                  <Route path="/users" element={<UserList />} />
                  <Route path="/users/:userId" element={<UserDetail />} />
                </>
              )}
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route
              element={
                <CourseLayout>
                  <Outlet />
                </CourseLayout>
              }
            >
              <Route
                path="/course/:courseId/learn/lesson"
                element={<p>Demo learning</p>}
              />
              <Route
                path="/course/:courseId/enroll"
                element={<p>Demo enroll</p>}
              />
            </Route>
          </Route>
          {/* Instructor layout */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <InstructorLayout>
                  <Outlet />
                </InstructorLayout>
              }
            >
              <Route path="/instructor" element={<InstructorCourse />} />
            </Route>
            {/* Create course without sidebar */}
            <Route
              path="/instructor/courses/create"
              element={
                <CourseProvider>
                  <CreateCourse />
                </CourseProvider>
              }
            />
            {/* Edit course without sidebar */}
            <Route
              path="/instructor/courses/:courseId/edit"
              element={<EditCourse />}
            />
            {/* Create lecture page */}
            <Route
              path="/instructor/courses/:courseId/edit/lecture/create"
              element={<CreateLecture />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        draggable
        pauseOnFocusLoss
        autoClose={3000}
        hideProgressBar
        newestOnTop
        pauseOnHover
      />
    </>
  );
}

export default App;
