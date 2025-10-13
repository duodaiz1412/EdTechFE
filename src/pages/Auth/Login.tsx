// import {Link, useNavigate} from "react-router-dom";
// import {useState, useEffect} from "react";
// import useLogin from "@/hooks/useLogin";
// import {useSelector} from "react-redux";
// import {IRootState} from "@/redux/store";
// import {toast} from "react-toastify";

// export default function Login() {
//   const {handleLogin} = useLogin();
//   const isAuthenticated = useSelector(
//     (state: IRootState) => state.auth.isAuthenticated,
//   );
//   const loading = useSelector((state: IRootState) => state.auth.loading);
//   const error = useSelector((state: IRootState) => state.auth.error);
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated) {
//       toast.success("Bạn đã đăng nhập");
//       // navigate('/');
//     }
//   }, [isAuthenticated, navigate]);

//   // Lắng nghe message từ tab verify
//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       if (event.origin !== window.location.origin) return;

//       if (event.data.type === "LOGIN_SUCCESS") {
//         // Chuyển về trang chủ khi nhận được thông báo đăng nhập thành công
//         // navigate('/');
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => window.removeEventListener("message", handleMessage);
//   }, [navigate]);

//   const handleSubmit = async () => {
//     if (!email) return;

//     try {
//       const result = await handleLogin(email);

//       // Nếu gửi email thành công, redirect đến trang chờ
//       if (result) {
//         navigate("/auth/waiting-magic-link", {
//           state: {email},
//         });
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };
//   return (
//     <div className="card bg-base-100 border border-base-300">
//       <div className="card-body">
//         <h1 className="card-title text-2xl">Đăng nhập</h1>
//         <p className="text-sm text-base-content/70">
//           Đăng nhập bằng email để nhận liên kết xác thực.
//         </p>

//         <label className="form-control w-full mt-4">
//           <div className="label">
//             <span className="label-text">Email</span>
//           </div>
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             type="email"
//             placeholder="you@email.com"
//             className="input input-bordered w-full"
//           />
//         </label>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="btn btn-primary mt-4"
//         >
//           {loading ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
//         </button>
//         {error && <p className="mt-2 text-sm text-error">{error}</p>}

//         <div className="mt-4 text-sm">
//           Chưa có tài khoản?{" "}
//           <Link to="/register" className="link link-primary">
//             Đăng ký
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import {Mail} from "lucide-react";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {authServices} from "@/lib/services/auth.services";
import {useAppSelector} from "@/redux/hooks";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("You have already logged in");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authServices.login(email);
      
      if (response.status === 200) {
        navigate("/notify", {state: {email}});
      } else {
        toast.error("Không thể gửi link đăng nhập");
      }
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data?.message || error.response.data?.error;
        toast.error(message || "Có lỗi xảy ra. Vui lòng thử lại");
      } else if (error.request) {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-96 space-y-6" onSubmit={handleLogin}>
      <h1 className="text-2xl font-semibold text-center">
        Login to your account
      </h1>
      <label className="input input-lg w-full">
        <Mail size={20} color="#aaa" />
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button 
        type="submit" 
        className="btn btn-lg btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Đang gửi...
          </>
        ) : (
          "Tiếp tục"
        )}
      </button>
      <p className="text-center space-x-2">
        <span>Don't have an account?</span>
        <Link to="/register" className="link link-primary">
          Register
        </Link>
      </p>
    </form>
  );
}
