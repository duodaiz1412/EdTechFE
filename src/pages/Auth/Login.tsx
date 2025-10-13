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
        const message =
          error.response.data?.message || error.response.data?.error;
        toast.error(message || "Có lỗi xảy ra. Vui lòng thử lại");
      } else if (error.request) {
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng",
        );
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
