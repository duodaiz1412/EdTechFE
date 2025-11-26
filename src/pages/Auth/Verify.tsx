import {useLocation} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

import {authServices} from "@/lib/services/auth.services";
import verifyImg from "@/assets/verify.svg";

export default function Verify() {
  const location = useLocation();

  const {isLoading, error} = useQuery({
    queryKey: ["verify", location.state?.token],
    queryFn: async () => {
      const response = await authServices.verify(location.state?.token);
      const redirectPath = localStorage.getItem("redirectAfterAuthen") || "/";
      localStorage.removeItem("redirectAfterAuthen");
      window.location.href = redirectPath;
      return response;
    },
  });

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="card w-1/2 border border-slate-200 bg-slate-50">
        <figure className="p-4">
          {isLoading && (
            <div className="loading loading-spinner loading-xl"></div>
          )}
          {!isLoading && (
            <div>
              <img src={verifyImg} alt="Email Verified" className="w-96" />
            </div>
          )}
        </figure>
        <div className="card-body">
          <h2 className="card-title text-3xl justify-center p-4">
            {isLoading && "Verifying your email..."}
            {!isLoading && !error && "Email verified successfully!"}
            {!isLoading && error && (
              <div className="flex flex-col gap-2">
                Verification failed!
                <div className="flex justify-center mt-4">
                  <a href="/login" className="btn btn-primary">
                    Go back to login
                  </a>
                </div>
              </div>
            )}
          </h2>
        </div>
      </div>
    </div>
  );
}
