import {Navigate, useSearchParams} from "react-router-dom";

export default function VerifyRedirect() {
  const [params] = useSearchParams();
  const token = params.get("token");
  return <Navigate to="/verify" state={{token: token}} />;
}
