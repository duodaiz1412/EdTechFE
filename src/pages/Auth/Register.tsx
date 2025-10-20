import {useState} from "react";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import {Mail, User} from "lucide-react";
import {authServices} from "@/lib/services/auth.services";

export default function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  const handleRegiser = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const response = await authServices.register(fullName, email);

    if (response.status !== 200) {
      toast.error("Failed to register");
    }

    navigate("/notify", {state: {email}});
  };

  return (
    <form className="w-96 space-y-6" onSubmit={handleRegiser}>
      <h1 className="text-2xl font-semibold text-center">
        Register with your email
      </h1>
      <label className="input input-lg w-full">
        <User size={20} color="#aaa" />
        <input
          type="text"
          required
          placeholder="Fullname"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </label>
      <label className="input input-lg w-full">
        <Mail size={20} color="#aaa" />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button type="submit" className="btn btn-lg btn-neutral w-full">
        Register
      </button>
      <p className="text-center space-x-2">
        <span>Already have an account?</span>
        <Link to="/login" className="link link-neutral">
          Login
        </Link>
      </p>
    </form>
  );
}
