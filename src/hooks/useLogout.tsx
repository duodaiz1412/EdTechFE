import {logout} from "@/redux/slice/authSlice";
import {useDispatch} from "react-redux";

const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return {handleLogout};
};

export default useLogout;
