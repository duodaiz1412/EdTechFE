import {MailWarning} from "lucide-react";
import {useLocation} from "react-router-dom";

export default function Notify() {
  const location = useLocation();
  return (
    <div className="flex justify-center items-center bg-blue-500 h-screen">
      <div className="card border border-slate-200 w-1/3 bg-base-100">
        <figure className="pt-4">
          <MailWarning size={48} />
        </figure>
        <div className="card-body">
          <div className="card-title text-xl justify-center">
            Please check your email
          </div>
          <div className="text-center">
            <p className="p-2">
              You're almost there. We've sent you an email to{" "}
              <span className="font-bold">{location.state?.email}</span>. If you
              don't see it, you may need to check your spam folder.
            </p>
            <p className="p-2">You can close this page now.</p>
            <div className="pt-2">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open Gmail
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
