import {Link} from "react-router-dom";
import {MoveLeft} from "lucide-react";
import {LoginBg} from "@/assets/images";

interface AuthLayoutProps {
  children?: JSX.Element;
}

export default function AuthLayout({children}: AuthLayoutProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex">
      <div className="w-3/5 h-full bg-slate-300">
        <img
          src={LoginBg}
          alt="Login background"
          className="w-full h-full object-cover"
        />
      </div>
      <main className="w-2/5 p-6 flex items-center justify-center relative">
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center space-x-2 link link-hover"
        >
          <MoveLeft size={20} />
          <span>Back</span>
        </Link>
        {children}
      </main>
    </div>
  );
}
