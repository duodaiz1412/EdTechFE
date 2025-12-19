import {Link} from "react-router-dom";
import {MoveLeft} from "lucide-react";
import loginImg from "@/assets/login.svg";

interface AuthLayoutProps {
  children?: JSX.Element;
}

export default function AuthLayout({children}: AuthLayoutProps) {
  return (
    <div className="w-full h-screen relative flex">
      <main className="w-1/2 p-6 flex items-center justify-center relative">
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center space-x-2 hover:bg-slate-50 transition-all px-4 py-2 rounded-md"
        >
          <MoveLeft size={20} />
          <span>Back</span>
        </Link>
        {children}
      </main>

      <div className="w-1/2 h-full">
        <img
          src={loginImg}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
