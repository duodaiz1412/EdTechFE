import {adminServices} from "@/lib/services/admin.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useQuery} from "@tanstack/react-query";
import {Link, useNavigate, useParams} from "react-router-dom";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "react-toastify";

export default function UserDetail() {
  const {userId} = useParams();
  const navigate = useNavigate();

  const {data} = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const response = await adminServices.getUser(userId!, accessToken);
      return response.data;
    },
  });

  interface IFormData {
    fullName: string;
    email: string;
    username: string;
    userType: "SYSTEM_USER" | "WEBSITE_USER";
  }

  const initialValue: IFormData = {
    fullName: data?.fullName || "",
    email: data?.email || "",
    username: data?.username || "",
    userType: data?.userType || "WEBSITE_USER",
  };

  const schema = yup
    .object({
      fullName: yup.string().required(),
      email: yup.string().email().required(),
      username: yup.string().required(),
      userType: yup.string().oneOf(["SYSTEM_USER", "WEBSITE_USER"]).required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: {isDirty},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValue,
  });

  const onSubmit = async (data: IFormData) => {
    const accessToken = await getAccessToken();
    await adminServices.updateUser(userId!, data, accessToken);
    toast.success("Update user successfully");
    navigate("/users");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-10">Edit user</h2>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="fullname" className="font-semibold">
              Fullname
            </label>
            <input
              id="fullname"
              type="text"
              className="input w-full"
              {...register("fullName")}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="type" className="font-semibold">
              User type
            </label>
            <select
              id="type"
              className="select w-full"
              {...register("userType")}
            >
              <option value="WEBSITE_USER">WEBSITE_USER</option>
              <option value="SYSTEM_USER">SYSTEM_USER</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input w-full"
              {...register("email")}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="fullname" className="font-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input w-full"
              {...register("username")}
            />
          </div>
        </div>
        <div className="space-x-2">
          <button disabled={!isDirty} className="btn btn-neutral">
            Save
          </button>
          <Link to="/users" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
