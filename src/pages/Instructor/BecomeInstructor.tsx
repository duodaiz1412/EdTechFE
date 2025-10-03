import {userServices} from "@/lib/services/user.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {login} from "@/redux/slice/userSlice";
import {Presentation} from "lucide-react";
import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function BecomeInstructor() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.data);

  useEffect(() => {
    if (userData?.roles.includes("COURSE_CREATOR")) {
      navigate("/instructor");
    }
  }, [userData, navigate]);

  const handleSubmit = async () => {
    const accessToken = await getAccessToken();
    const response = await userServices.assignRole(
      accessToken,
      "COURSE_CREATOR",
    );

    if (response.status !== 201) {
      toast.error("Error occurred. Please try later");
      return;
    }

    dispatch(
      login({
        ...userData,
        roles: [...(userData?.roles || []), "COURSE_CREATOR"],
      }),
    );
    navigate("/instructor");
  };

  return (
    <div className="flex">
      <div className="w-1/2 bg-slate-200 h-screen"></div>
      <div className="w-1/2 flex flex-col space-y-6 h-screen items-center justify-center">
        <Presentation size={64} />
        <h2 className="text-2xl font-semibold">Become an instructor</h2>
        <p className="px-8 text-center">
          Teach what you know and help learners explore their interests, gain
          new skills, and advance their careers.
        </p>
        <div className="flex space-x-4">
          <button className="btn btn-lg btn-primary" onClick={handleSubmit}>
            Get Started
          </button>
          <Link to="/" className="btn btn-lg">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
