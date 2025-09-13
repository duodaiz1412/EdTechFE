import {Link} from "react-router-dom";
import {useState} from "react";
import useRegister from "@/hooks/useRegister";
import {useSelector} from "react-redux";
import {IRootState} from "@/redux/store";

export default function Register() {
  const {handleRegister, success} = useRegister();
  const loading = useSelector((state: IRootState) => state.auth.loading);
  const error = useSelector((state: IRootState) => state.auth.error);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    if (!fullName || !email) return;
    await handleRegister(fullName, email);
  };
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h1 className="card-title text-2xl">Đăng ký</h1>
        <p className="text-sm text-base-content/70">
          Tạo tài khoản bằng email để bắt đầu học.
        </p>

        <label className="form-control w-full mt-4">
          <div className="label">
            <span className="label-text">Họ và Tên</span>
          </div>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Nguyễn Văn A"
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full mt-3">
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
          onClick={onSubmit}
          disabled={loading}
          className="btn btn-primary mt-4"
        >
          {loading ? "Đang gửi..." : "Tạo tài khoản"}
        </button>
        {success && (
          <p className="mt-2 text-sm text-success">
            Vui lòng kiểm tra email để xác nhận.
          </p>
        )}
        {error && <p className="mt-2 text-sm text-error">{error}</p>}

        <div className="mt-4 text-sm">
          Đã có tài khoản?{" "}
          <Link to="/login" className="link link-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
