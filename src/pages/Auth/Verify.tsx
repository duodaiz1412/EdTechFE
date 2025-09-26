// import {Link, useSearchParams} from "react-router-dom";
// import {useEffect} from "react";
// import useVerify from "@/hooks/useVerify";

// export default function Verify() {
//   const [params] = useSearchParams();
//   const token = params.get("token");
//   const {status, message, run} = useVerify({token, auto: false});

//   useEffect(() => {
//     const exec = async () => {
//       const success = await run(token || undefined);

//       if (success) {
//         // Thông báo cho tab gốc rằng đã đăng nhập thành công
//         if (window.opener) {
//           // Gửi message cho tab gốc
//           window.opener.postMessage(
//             {
//               type: "LOGIN_SUCCESS",
//               message: "Đăng nhập thành công!",
//             },
//             window.location.origin,
//           );

//           // Chuyển tab gốc về trang chủ
//           window.opener.location.replace("/");

//           // Đóng tab verify sau 1 giây
//           setTimeout(() => {
//             window.close();
//           }, 1000);
//         } else {
//           // Nếu không có tab gốc, chuyển về trang chủ
//           window.location.replace("/");
//         }
//       }
//     };
//     exec();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   return (
//     <div className="card bg-base-100 border border-base-300">
//       <div className="card-body">
//         <h1 className="card-title text-2xl">Xác thực đăng nhập</h1>
//         <p className="text-sm text-base-content/70">
//           Token:{" "}
//           {token ? (
//             <span className="font-mono">{token.slice(0, 10)}...</span>
//           ) : (
//             "Không có"
//           )}
//         </p>
//         <div className="mt-3">
//           {status === "verifying" && (
//             <p className="text-sm">Đang xác thực...</p>
//           )}
//           {status === "success" && (
//             <div className="text-sm text-success">
//               <p>{message}</p>
//               <p className="mt-2 text-xs text-base-content/70">
//                 Đang chuyển về trang chủ và đóng tab này...
//               </p>
//             </div>
//           )}
//           {status === "error" && (
//             <p className="text-sm text-error">{message}</p>
//           )}
//         </div>
//         {status === "success" ? (
//           <button
//             onClick={() => window.close()}
//             className="btn btn-primary mt-4"
//           >
//             Đóng tab này
//           </button>
//         ) : (
//           <Link to="/" className="btn btn-primary mt-4">
//             Về trang chủ
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// }

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
