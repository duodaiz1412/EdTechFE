import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import useLogin from "@/hooks/useLogin";
import {toast} from "react-toastify";

export default function WaitingForMagicLink() {
  const location = useLocation();
  const email = location.state?.email || "";
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const {handleLogin} = useLogin();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) return;

    try {
      await handleLogin(email);
      setCountdown(60);
      setCanResend(false);
      toast.success("Đã gửi lại liên kết đăng nhập!");
    } catch {
      toast.error("Không thể gửi lại liên kết. Vui lòng thử lại.");
    }
  };

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-base-content mb-2">
          Kiểm tra email của bạn
        </h1>

        <p className="text-base-content/70 mb-4">
          Chúng tôi đã gửi liên kết đăng nhập đến
        </p>

        <div className="bg-base-200 rounded-lg p-3 mb-6">
          <p className="font-medium text-primary">{email}</p>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-base-content/60">
            <p>• Kiểm tra cả thư mục spam/junk</p>
            <p>• Liên kết có hiệu lực trong 15 phút</p>
            <p>• Nhấp vào liên kết để hoàn tất đăng nhập</p>
          </div>

          {!canResend ? (
            <div className="text-sm text-base-content/70">
              Gửi lại sau {countdown}s
            </div>
          ) : (
            <button onClick={handleResend} className="btn btn-outline btn-sm">
              Gửi lại liên kết
            </button>
          )}
        </div>

        <div className="divider">hoặc</div>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/login" className="link link-primary">
            ← Quay lại đăng nhập
          </Link>
          <Link to="/register" className="link link-secondary">
            Chưa có tài khoản? Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
