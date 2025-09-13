import {useDispatch} from "react-redux";
import {setLoading, setError} from "@/redux/slice/authSlice";
import {authServices} from "@/lib/services/auth.services";

const useLogin = () => {
  const dispatch = useDispatch();
  const handleLogin = async (email: string) => {
    dispatch(setLoading(true));
    try {
      await authServices.login({email});
      return true;
    } catch (error) {
      dispatch(setError((error as Error)?.message || "Đăng nhập thất bại"));
      dispatch(setLoading(false));
      throw error;
    }
  };
  return {handleLogin};
};

export default useLogin;
