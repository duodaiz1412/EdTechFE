import {BrowserRouter, Navigate, Outlet, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {useQuery} from "@tanstack/react-query";

import {login} from "./redux/slice/userSlice.tsx";
import {useAppDispatch, useAppSelector} from "./redux/hooks.ts";
import {userServices} from "./lib/services/user.services.ts";
import {getAccessToken} from "./lib/utils/getAccessToken.ts";
import {Role} from "./types/index.ts";

import ProtectedRoute from "./components/ProtectedRoute.tsx";

import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Notify from "./pages/Auth/Notify.tsx";
import VerifyRedirect from "./pages/Auth/VerifyRedirect.tsx";
import Verify from "./pages/Auth/Verify.tsx";

import MainLayout from "./layout/MainLayout.tsx";

import MyLearning from "./pages/Course/MyLearning/MyLearning.tsx";
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
import BecomeInstructor from "./pages/Instructor/BecomeInstructor.tsx";
import {enrollServices} from "./lib/services/enroll.services.ts";

function App() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user.data);

  useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await userServices.getUserInfo(accessToken);
      const enrollments = await enrollServices.getEnrollments(accessToken);

      // Set global state
      dispatch(
        login({
          id: response.data.id,
          name: response.data.fullName,
          email: response.data.email,
          username: response.data.username,
          image: response.data.userImage || undefined,
          type: response.data.userType,
          roles: response.data.roles.map((role: Role) => role.name),
          enrollments: enrollments,
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
            <Route path="/course/:slug" element={<CourseDetail />} />
            <Route path="/learning" element={<MyLearning />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            {/* Profile layout */}
            <Route
              element={
                <ProfileLayout>
                  <Outlet />
                </ProfileLayout>
              }
            >
              {/* Profile route */}
              <Route path="/profile" element={<Profile />} />
              {/* Admin CMS routes */}
              <Route
                path="/users"
                element={
                  userInfo?.type === "SYSTEM_USER" ? (
                    <UserList />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/users/:userId"
                element={
                  userInfo?.type === "SYSTEM_USER" ? (
                    <UserDetail />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              {/* Settings route */}
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Learner routes */}
            <Route
              path="/course/:courseId/learn/lesson/:lessonId"
              element={<CourseLayout />}
            />

            {/* Instructor routes */}
            <Route path="/teaching" element={<BecomeInstructor />} />
            <Route
              element={
                userInfo?.roles.includes("COURSE_CREATOR") ? (
                  <InstructorLayout>
                    <Outlet />
                  </InstructorLayout>
                ) : (
                  <Navigate to="/teaching" />
                )
              }
            >
              <Route path="/instructor" element={<InstructorCourse />} />
            </Route>
            {/* Create course without sidebar */}
            <Route
              path="/instructor/courses/create"
              element={
                userInfo?.roles.includes("COURSE_CREATOR") ? (
                  <CourseProvider>
                    <CreateCourse />
                  </CourseProvider>
                ) : (
                  <Navigate to="/teaching" />
                )
              }
            />
            {/* Edit course without sidebar */}
            <Route
              path="/instructor/courses/:courseId/edit"
              element={
                userInfo?.roles.includes("COURSE_CREATOR") ? (
                  <EditCourse />
                ) : (
                  <Navigate to="/teaching" />
                )
              }
            />
            {/* Create lecture page */}
            <Route
              path="/instructor/courses/:courseId/edit/lecture/create"
              element={
                userInfo?.roles.includes("COURSE_CREATOR") ? (
                  <CreateLecture />
                ) : (
                  <Navigate to="/teaching" />
                )
              }
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
