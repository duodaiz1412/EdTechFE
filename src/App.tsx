import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import HomeLayout from "./layout/HomeLayout";
import {AuthLayout} from "./layout/AuthLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import {ToastContainer} from "react-toastify";
import DaisyUIDemo from "./components/DaisyUIDemo";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Verify from "./pages/Auth/Verify.tsx";

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
            <Route path="demo" element={<DaisyUIDemo />} />
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
