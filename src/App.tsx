import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import HomeLayout from "./layout/HomeLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import {ToastContainer} from "react-toastify";
import DaisyUIDemo from "./components/DaisyUIDemo";

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
            <Route path="about" element={<About />} />
            <Route path="demo" element={<DaisyUIDemo />} />
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
