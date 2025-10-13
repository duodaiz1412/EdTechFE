import {Link} from "react-router-dom";
import {MoveLeft} from "lucide-react";

interface AuthLayoutProps {
  children?: JSX.Element;
}

export default function AuthLayout({children}: AuthLayoutProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex">
      <main className="w-1/2 p-6 flex items-center justify-center relative">
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center space-x-2 link link-hover"
        >
          <MoveLeft size={20} />
          <span>Back</span>
        </Link>
        {children}
      </main>

      <div className="w-1/2 h-full bg-slate-300"></div>
    </div>
  );
}
