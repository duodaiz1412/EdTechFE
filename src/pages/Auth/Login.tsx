import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import useLogin from "@/hooks/useLogin";
import {useSelector} from "react-redux";
import {IRootState} from "@/redux/store";
import {toast} from "react-toastify";

export default function Login() {
  const {handleLogin} = useLogin();
  const isAuthenticated = useSelector(
    (state: IRootState) => state.auth.isAuthenticated,
  );
  const loading = useSelector((state: IRootState) => state.auth.loading);
  const error = useSelector((state: IRootState) => state.auth.error);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Bạn đã đăng nhập");
      // navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Lắng nghe message từ tab verify
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "LOGIN_SUCCESS") {
        // Chuyển về trang chủ khi nhận được thông báo đăng nhập thành công
        // navigate('/');
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  const handleSubmit = async () => {
    if (!email) return;

    try {
      const result = await handleLogin(email);

      // Nếu gửi email thành công, redirect đến trang chờ
      if (result) {
        navigate("/auth/waiting-magic-link", {
          state: {email},
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h1 className="card-title text-2xl">Đăng nhập</h1>
        <p className="text-sm text-base-content/70">
          Đăng nhập bằng email để nhận liên kết xác thực.
        </p>

        <label className="form-control w-full mt-4">
          <div className="label">
            <span className="label-text">Email</span>
          </div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@email.com"
            className="input input-bordered w-full"
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn-primary mt-4"
        >
          {loading ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
        </button>
        {error && <p className="mt-2 text-sm text-error">{error}</p>}

        <div className="mt-4 text-sm">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="link link-primary">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
