import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {login} from "@/redux/slice/userSlice";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {userServices} from "@/lib/services/user.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import instructorImg from "@/assets/instructor.svg";

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
      <div className="w-1/2 h-screen flex items-center justify-center">
        <img
          src={instructorImg}
          alt="Become an instructor"
          className="h-2/3 w-2/3 object-cover"
        />
      </div>
      <div className="w-1/2 flex flex-col space-y-6 h-screen items-center justify-center">
        <h2 className="text-3xl font-semibold">Become an instructor</h2>
        <p className="px-8 text-center text-lg">
          Teach what you know and help learners explore their interests, gain
          new skills, and advance their careers.
        </p>
        <div className="flex space-x-4">
          <button
            className="btn btn-lg btn-neutral rounded-lg"
            onClick={handleSubmit}
          >
            Get Started
          </button>
          <Link to="/" className="btn btn-lg rounded-lg">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
