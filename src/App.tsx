import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {useQuery} from "@tanstack/react-query";
import {GlobalPollingProvider} from "./components/GlobalPollingProvider";

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
import Support from "./pages/Info/Support.tsx";
import About from "./pages/Info/About.tsx";
import Home from "./pages/Info/Home.tsx";

import MyLearning from "./pages/Course/MyLearning/index.tsx";
import CourseLayout from "./layout/CourseLayout.tsx";
import CourseList from "./pages/Course/CourseList";
import CoursesByTag from "./pages/Course/CourseList/CoursesByTag.tsx";
import CourseDetail from "./pages/Course/CourseDetail.tsx";

import BatchLayout from "./layout/BatchLayout.tsx";
import BatchList from "./pages/Batch/BatchList/index.tsx";
import BatchesByTag from "./pages/Batch/BatchList/BatchesByTag.tsx";
import BatchDetail from "./pages/Batch/BatchDetail.tsx";

import ProfileLayout from "./layout/ProfileLayout.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import PurchaseHistory from "./pages/Profile/PurchaseHistory.tsx";
import UserList from "./pages/CMS/UserList.tsx";
import UserDetail from "./pages/CMS/UserDetail.tsx";

import InstructorLayout from "./layout/InstructorLayout.tsx";
import InstructorCourse from "./pages/Instructor/Courses/index.tsx";
import CreateCourse from "./pages/Instructor/Courses/CreateCourse/index.tsx";
import EditCourse from "./pages/Instructor/Courses/EditCourse/index.tsx";
import PreviewCourse from "./pages/Instructor/Courses/PreviewCourse/index.tsx";
import IntendedLearnersContent from "./pages/Instructor/Courses/EditCourse/components/IntendedLearnersContent.tsx";
import CourseStructureContent from "./pages/Instructor/Courses/EditCourse/components/CourseStructureContent.tsx";
import FilmEditContent from "./pages/Instructor/Courses/EditCourse/components/FilmEditContent.tsx";
import CurriculumContent from "./pages/Instructor/Courses/EditCourse/components/CurriculumContent.tsx";
import CaptionContent from "./pages/Instructor/Courses/EditCourse/components/CaptionContent.tsx";
import AccessibilityContent from "./pages/Instructor/Courses/EditCourse/components/AccessibilityContent.tsx";
import LandingPageContent from "./pages/Instructor/Courses/EditCourse/components/LandingPageContent.tsx";
import PricingContent from "./pages/Instructor/Courses/EditCourse/components/PricingContent.tsx";
import PromotionsContent from "./pages/Instructor/Courses/EditCourse/components/PromotionsContent.tsx";
import {CourseProvider} from "./context/CourseContext.tsx";
import BecomeInstructor from "./pages/Instructor/BecomeInstructor.tsx";
import {enrollServices} from "./lib/services/enroll.services.ts";
import EditLecture from "./pages/Instructor/Courses/EditCourse/components/EditLecture.tsx";
import EditVideoLecture from "./pages/Instructor/Courses/EditCourse/components/EditVideoLecture.tsx";
import EditArticleLecture from "./pages/Instructor/Courses/EditCourse/components/EditArticleLecture.tsx";
import EditQuizLecture from "./pages/Instructor/Courses/EditCourse/components/EditQuizLecture.tsx";
import CourseLandingPreview from "./pages/Instructor/Courses/PreviewCourse/CourseLandingPreview.tsx";
import SetPayment from "./pages/Instructor/Payment/SetPayment.tsx";
import InstructorBatch from "./pages/Instructor/Batchs/index.tsx";
import CreateBatch from "./pages/Instructor/Batchs/CreateBatch/index.tsx";
import EditBatch from "./pages/Instructor/Batchs/EditBatch/index.tsx";
import MyBatches from "./pages/Instructor/MyBatches.tsx";

function App() {
  const dispatch = useAppDispatch();

  useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await userServices.getUserInfo(accessToken);
      const courseEnrollments =
        await enrollServices.getCourseEnrollments(accessToken);

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
          courseEnrollments: courseEnrollments,
        }),
      );
      return response;
    },
  });

  return (
    <>
      <GlobalPollingProvider>
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
            <Route path="/verify" element={<Verify />} />

            {/* Public routes */}
            <Route
              element={
                <MainLayout>
                  <Outlet />
                </MainLayout>
              }
            >
              <Route path="/" element={<Home />} />

              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/tag/:tag" element={<CoursesByTag />} />
              <Route path="/course/:slug" element={<CourseDetail />} />

              <Route path="/batches" element={<BatchList />} />
              <Route path="/batches/tag/:tag" element={<BatchesByTag />} />
              <Route path="/batch/:slug" element={<BatchDetail />} />

              <Route path="/help" element={<Support />} />
              <Route path="/about" element={<About />} />
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
                <Route path="/purchases" element={<PurchaseHistory />} />

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
              <Route path="/batch/:batchSlug/learn" element={<BatchLayout />} />
              <Route
                path="/learning"
                element={
                  <MainLayout>
                    <MyLearning />
                  </MainLayout>
                }
              />

              {/* Instructor routes */}
              <Route path="/teaching" element={<BecomeInstructor />} />

              {/* Instructor: Batches management */}
              <Route path="/batch/:batchSlug/teach" element={<BatchLayout />} />
              <Route
                element={
                  <RoleProtectedRoute
                    requiredRole="COURSE_CREATOR"
                    redirectTo="/teaching"
                  >
                    <MainLayout>
                      <Outlet />
                    </MainLayout>
                  </RoleProtectedRoute>
                }
              >
                <Route path="/my-batches" element={<MyBatches />} />
              </Route>

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
                <Route path="/instructor/batch" element={<InstructorBatch />} />
                <Route path="/instructor/payment" element={<SetPayment />} />
              </Route>

              {/* Instructor - Create/Edit Batch routes (without sidebar) */}
              <Route
                path="/instructor/batch/create"
                element={
                  <RoleProtectedRoute
                    requiredRole="COURSE_CREATOR"
                    redirectTo="/teaching"
                  >
                    <CourseProvider>
                      <CreateBatch />
                    </CourseProvider>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/instructor/batch/:batchId/edit"
                element={
                  <RoleProtectedRoute
                    requiredRole="COURSE_CREATOR"
                    redirectTo="/teaching"
                  >
                    <CourseProvider>
                      <EditBatch />
                    </CourseProvider>
                  </RoleProtectedRoute>
                }
              />
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
                path="/instructor/courses/:courseId/preview"
                element={
                  <RoleProtectedRoute
                    requiredRole="COURSE_CREATOR"
                    redirectTo="/teaching"
                  >
                    <CourseProvider>
                      <PreviewCourse />
                    </CourseProvider>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:courseId/preview/lesson/:lessonSlug"
                element={
                  <RoleProtectedRoute
                    requiredRole="COURSE_CREATOR"
                    redirectTo="/teaching"
                  >
                    <CourseProvider>
                      <PreviewCourse />
                    </CourseProvider>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:courseId/preview/landing-preview"
                element={
                  <RoleProtectedRoute
                    requiredRole="COURSE_CREATOR"
                    redirectTo="/teaching"
                  >
                    <CourseLandingPreview />
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

                <Route path="film-edit" element={<FilmEditContent />} />
                <Route path="curriculum" element={<CurriculumContent />} />
                <Route path="caption" element={<CaptionContent />} />
                <Route
                  path="accessibility"
                  element={<AccessibilityContent />}
                />
                <Route path="landing-page" element={<LandingPageContent />} />
                <Route path="pricing" element={<PricingContent />} />
                <Route path="promotions" element={<PromotionsContent />} />

                {/* Nested lecture edit routes using the same CourseProvider */}
                <Route
                  path="lecture/edit/:lessonId"
                  element={<EditLecture />}
                />
                <Route
                  path="lecture/video/:lessonId"
                  element={<EditVideoLecture />}
                />
                <Route
                  path="lecture/article/:lessonId"
                  element={<EditArticleLecture />}
                />
                <Route
                  path="lecture/quiz/:quizId"
                  element={<EditQuizLecture />}
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </GlobalPollingProvider>

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
