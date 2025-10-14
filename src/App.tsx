import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {useQuery} from "@tanstack/react-query";

import {login} from "./redux/slice/userSlice.tsx";
import {useAppDispatch} from "./redux/hooks.ts";
import {userServices} from "./lib/services/user.services.ts";
import {getAccessToken} from "./lib/utils/getAccessToken.ts";
import {Role} from "./types/index.ts";

import ProtectedRoute, {
  RoleProtectedRoute,
  TypeProtectedRoute,
} from "./components/ProtectedRoute.tsx";

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
import IntendedLearnersContent from "./pages/Instructor/Courses/EditCourse/components/IntendedLearnersContent.tsx";
import CourseStructureContent from "./pages/Instructor/Courses/EditCourse/components/CourseStructureContent.tsx";
import FilmEditContent from "./pages/Instructor/Courses/EditCourse/components/FilmEditContent.tsx";
import CurriculumContent from "./pages/Instructor/Courses/EditCourse/components/CurriculumContent.tsx";
import CaptionContent from "./pages/Instructor/Courses/EditCourse/components/CaptionContent.tsx";
import AccessibilityContent from "./pages/Instructor/Courses/EditCourse/components/AccessibilityContent.tsx";
import LandingPageContent from "./pages/Instructor/Courses/EditCourse/components/LandingPageContent.tsx";
import PricingContent from "./pages/Instructor/Courses/EditCourse/components/PricingContent.tsx";
import PromotionsContent from "./pages/Instructor/Courses/EditCourse/components/PromotionsContent.tsx";
import CourseMessagesContent from "./pages/Instructor/Courses/EditCourse/components/CourseMessagesContent.tsx";
import CourseSettingsContent from "./pages/Instructor/Courses/EditCourse/components/CourseSettingsContent.tsx";
import {CourseProvider} from "./context/CourseContext.tsx";
import BecomeInstructor from "./pages/Instructor/BecomeInstructor.tsx";
import {enrollServices} from "./lib/services/enroll.services.ts";
import PublicProfile from "./pages/Profile/PublicProfile.tsx";
import EditLecture from "./pages/Instructor/Courses/EditCourse/components/EditLecture.tsx";
import EditVideoLecture from "./pages/Instructor/Courses/EditCourse/components/EditVideoLecture.tsx";
import EditArticleLecture from "./pages/Instructor/Courses/EditCourse/components/EditArticleLecture.tsx";
import EditQuizLecture from "./pages/Instructor/Courses/EditCourse/components/EditQuizLecture.tsx";

function App() {
  const dispatch = useAppDispatch();

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
          roles: response.data.roles.map((role: Role) => role.role),
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
          {/* Auth routes */}
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
          <Route path="/auth/verify" element={<VerifyRedirect />} />
          <Route path="/verify" element={<Verify />} />

          {/* Public routes */}
          <Route
            element={
              <MainLayout>
                <Outlet />
              </MainLayout>
            }
          >
            <Route path="/" element={<Courses />} />
            <Route path="/users/:userId/profile" element={<PublicProfile />} />
            <Route path="/course/:slug" element={<CourseDetail />} />
            <Route path="/learning" element={<MyLearning />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Profile & Settings */}
            <Route
              element={
                <ProfileLayout>
                  <Outlet />
                </ProfileLayout>
              }
            >
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

              {/* Admin CMS routes */}
              <Route
                path="/users"
                element={
                  <TypeProtectedRoute requiredType="SYSTEM_USER">
                    <UserList />
                  </TypeProtectedRoute>
                }
              />
              <Route
                path="/users/:userId"
                element={
                  <TypeProtectedRoute requiredType="SYSTEM_USER">
                    <UserDetail />
                  </TypeProtectedRoute>
                }
              />
            </Route>

            {/* Learner routes */}
            <Route
              path="/course/:courseSlug/learn/lesson/:lessonSlug"
              element={<CourseLayout />}
            />

            {/* Instructor routes */}
            <Route path="/teaching" element={<BecomeInstructor />} />

            <Route
              element={
                <RoleProtectedRoute
                  requiredRole="COURSE_CREATOR"
                  redirectTo="/teaching"
                >
                  <InstructorLayout>
                    <Outlet />
                  </InstructorLayout>
                </RoleProtectedRoute>
              }
            >
              <Route path="/instructor" element={<InstructorCourse />} />
            </Route>

            {/* Instructor - Create/Edit Course routes (without sidebar) */}
            <Route
              path="/instructor/courses/create"
              element={
                <RoleProtectedRoute
                  requiredRole="COURSE_CREATOR"
                  redirectTo="/teaching"
                >
                  <CourseProvider>
                    <CreateCourse />
                  </CourseProvider>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/edit"
              element={
                <RoleProtectedRoute
                  requiredRole="COURSE_CREATOR"
                  redirectTo="/teaching"
                >
                  <CourseProvider>
                    <EditCourse />
                  </CourseProvider>
                </RoleProtectedRoute>
              }
            >
              <Route index element={<IntendedLearnersContent />} />
              <Route
                path="intended-learners"
                element={<IntendedLearnersContent />}
              />
              <Route
                path="course-structure"
                element={<CourseStructureContent />}
              />
              <Route
                path="setup-test"
                element={
                  <div className="text-center text-gray-500">
                    Setup & test video content coming soon...
                  </div>
                }
              />
              <Route path="film-edit" element={<FilmEditContent />} />
              <Route path="curriculum" element={<CurriculumContent />} />
              <Route path="caption" element={<CaptionContent />} />
              <Route path="accessibility" element={<AccessibilityContent />} />
              <Route path="landing-page" element={<LandingPageContent />} />
              <Route path="pricing" element={<PricingContent />} />
              <Route path="promotions" element={<PromotionsContent />} />
              <Route path="messages" element={<CourseMessagesContent />} />
              <Route path="settings" element={<CourseSettingsContent />} />
            </Route>
            {/* Edit existing lecture */}
            <Route
              path="/instructor/courses/:courseId/edit/lecture/edit/:lessonId"
              element={
                <RoleProtectedRoute
                  requiredRole="COURSE_CREATOR"
                  redirectTo="/teaching"
                >
                  <CourseProvider>
                    <EditLecture />
                  </CourseProvider>
                </RoleProtectedRoute>
              }
            />
            
            {/* Edit video lecture */}
            <Route
              path="/instructor/courses/:courseId/edit/lecture/video/:lessonId"
              element={
                <RoleProtectedRoute
                  requiredRole="COURSE_CREATOR"
                  redirectTo="/teaching"
                >
                  <CourseProvider>
                    <EditVideoLecture />
                  </CourseProvider>
                </RoleProtectedRoute>
              }
            />
            
            {/* Edit article lecture */}
            <Route
              path="/instructor/courses/:courseId/edit/lecture/article/:lessonId"
              element={
                <RoleProtectedRoute
                  requiredRole="COURSE_CREATOR"
                  redirectTo="/teaching"
                >
                  <CourseProvider>
                    <EditArticleLecture />
                  </CourseProvider>
                </RoleProtectedRoute>
              }
            />
            
            {/* Edit quiz lecture */}
            <Route
              path="/instructor/courses/:courseId/edit/lecture/quiz/:lessonId"
              element={
                <RoleProtectedRoute
                  requiredRole="COURSE_CREATOR"
                  redirectTo="/teaching"
                >
                  <CourseProvider>
                    <EditQuizLecture />
                  </CourseProvider>
                </RoleProtectedRoute>
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
