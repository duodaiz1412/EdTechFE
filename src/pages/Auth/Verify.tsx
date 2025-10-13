import {authServices} from "@/lib/services/auth.services";
import {useQuery} from "@tanstack/react-query";
import {CircleCheck} from "lucide-react";
import {useLocation} from "react-router-dom";

export default function Verify() {
  const location = useLocation();

  const {isLoading, error} = useQuery({
    queryKey: ["verify", location.state?.token],
    queryFn: async () => {
      const response = await authServices.verify(location.state?.token);
      window.location.href = "/";
      return response;
    },
  });

  return (
    <div className="w-full h-screen bg-blue-500 flex justify-center items-center">
      <div className="card w-96 border border-slate-300 bg-base-100">
        <figure className="p-4">
          {isLoading && (
            <div className="loading loading-spinner loading-xl"></div>
          )}
          {!isLoading && (
            <div>
              <CircleCheck size={48} />
            </div>
          )}
        </figure>
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoading && "Verifying your email..."}
            {!isLoading && !error && "Email verified successfully!"}
            {!isLoading && error && "Verification failed!"}
          </h2>
        </div>
      </div>
    </div>
  );
}
