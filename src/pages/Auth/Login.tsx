import {Mail} from "lucide-react";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {authServices} from "@/lib/services/auth.services";
import {useAppSelector} from "@/redux/hooks";

export default function Login() {
  const [email, setEmail] = useState("");
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("You have already logged in");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const response = await authServices.login(email);

    if (response.status !== 200) {
      toast.error("Failed to login with email");
    }

    navigate("/notify", {state: {email}});
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
      <button type="submit" className="btn btn-lg btn-primary w-full">
        Continue
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
