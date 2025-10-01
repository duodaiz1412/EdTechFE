import {userServices} from "@/lib/services/user.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {useAppSelector} from "@/redux/hooks";
import {useState} from "react";
import {toast} from "react-toastify";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

interface IFormData {
  fullName: string;
  email: string;
  username: string;
}

export default function Profile() {
  const userData = useAppSelector((state) => state.user.data);

  const initialValue: IFormData = {
    fullName: userData?.name || "",
    email: userData?.email || "",
    username: userData?.username || "",
  };

  const schema = yup
    .object({
      fullName: yup.string().required(),
      email: yup.string().email().required(),
      username: yup.string().required(),
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

  const [image, setImage] = useState<File | string | undefined>(
    userData?.image,
  );
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: IFormData) => {
    const accessToken = await getAccessToken();
    const response = await userServices.changeUserInfo(accessToken, data);

    if (response.status !== 200) {
      toast.error("Failed to change info, please try later.");
    }
    toast.success("Change info successfully");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-10">Your profile</h2>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
          <div className="h-96 bg-slate-200 border border-slate-200 flex justify-center">
            <img src={preview} />
          </div>
          <div className="col-span-1 space-y-2 flex flex-col">
            <label htmlFor="user-image" className="font-semibold">
              User image
            </label>
            <input
              id="user-image"
              type="file"
              accept="image/*"
              className="file-input w-full"
              onChange={handleUploadImage}
            />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={!isDirty}>
          Save
        </button>
      </form>
    </div>
  );
}
