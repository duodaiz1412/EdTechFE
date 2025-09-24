import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import {ToastContainer} from "react-toastify";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyRedirect from "./pages/Auth/VerifyRedirect.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import Courses from "./pages/Course/Courses.tsx";
import CourseDetail from "./pages/Course/CourseDetail.tsx";
import CourseLayout from "./layout/CourseLayout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Notify from "./pages/Auth/Notify.tsx";
import Verify from "./pages/Auth/Verify.tsx";
import {useAppDispatch} from "./redux/hooks.ts";
import {useQuery} from "@tanstack/react-query";
import {userServices} from "./lib/services/user.services.ts";
import {login} from "./redux/slice/userSlice.tsx";
import {authServices} from "./lib/services/auth.services.ts";

function App() {
  const dispatch = useAppDispatch();

  const {isLoading} = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      // Get tokens
      let isTokenExpired = false;
      let accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // Get data if tokens exist
      if (!accessToken) return null;
      let response = await userServices.getUserInfo(accessToken);

      // Logic when token is expired
      if (response.status !== 200) {
        isTokenExpired = true;
        if (!refreshToken) return null;

        const newTokenRequest = await authServices.refresh(refreshToken);
        if (newTokenRequest === null) return null;

        localStorage.setItem("accessToken", newTokenRequest.accessToken);
        localStorage.setItem("refreshToken", newTokenRequest.refreshToken);
        accessToken = newTokenRequest.accessToken;
      }

      if (isTokenExpired) {
        response = await userServices.getUserInfo(String(accessToken));
      }

      // Set global state
      dispatch(
        login({
          name: response.data.fullName,
          email: response.data.email,
          role: response.data.userType,
        }),
      );
      return response;
    },
  });

  return (
    <>
      {isLoading && (
        <div className="w-full h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      )}
      {!isLoading && (
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
          </Routes>
        </BrowserRouter>
      )}
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
