import {useState} from "react";
import {useDispatch} from "react-redux";
import {authServices} from "@/lib/services/auth.services";
import {setLoading, setError} from "@/redux/slice/authSlice";

const useRegister = () => {
  const dispatch = useDispatch();
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async (fullName: string, email: string) => {
    dispatch(setLoading(true));
    setSuccess(false);
    try {
      await authServices.register({fullName, email});
      setSuccess(true);
      return true;
    } catch (e: any) {
      dispatch(setError(e?.message || "Đăng ký thất bại"));
      throw e;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {handleRegister, success};
};

export default useRegister;
