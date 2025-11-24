import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {Link, useParams} from "react-router-dom";
import ReactPlayer from "react-player";

import {Batch, CourseLabel, CourseTag} from "@/types";
import {publicServices} from "@/lib/services/public.services";
import {enrollServices} from "@/lib/services/enroll.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {formatPrice} from "@/lib/utils/formatPrice";

import {toast} from "react-toastify";
import {useAppSelector} from "@/redux/hooks";
import {Clock, Languages, PlayCircle, XIcon} from "lucide-react";

import {usePayOS} from "@payos/payos-checkout";
import HtmlDisplay from "@/components/HtmlDisplay";

export default function BatchDetail() {
  // Data states
  const {slug} = useParams();
  const [batchInfo, setBatchInfo] = useState<Batch>();
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Redux states
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  //   const userData = useAppSelector((state) => state.user.data);

  // Preview states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Payment states
  const [isPaying, setIsPaying] = useState(false);
  const defaultPayOSConfig = {
    RETURN_URL: window.location.href,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: "",
    embedded: true,
    onSuccess: () => {
      toast.success("Payment successful");
      setIsEnrolled(true);
      setIsPaying(false);
    },
  };
  const [payOSConfig, setPayOSConfig] = useState(defaultPayOSConfig);
  const {open, exit} = usePayOS(payOSConfig);

  // Fetch course info
  useQuery({
    queryKey: ["batch-info", slug],
    queryFn: async () => {
      if (!slug) return null;
      const course = await publicServices.getBatchBySlug(slug);
      setBatchInfo(course);
      return course;
    },
  });

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info("Login required");
    }

    const accessToken = await getAccessToken();

    if (!batchInfo?.paidBatch) {
      const response = await enrollServices.enrollFreeBatch(
        slug || "",
        accessToken,
      );
      if (response.status === 201) {
        setIsEnrolled(true);
        toast.success("Enroll course successfully");
      }
    } else {
      setIsPaying(true);
      const order = await enrollServices.enrollPaidBatch(
        slug || "",
        accessToken,
      );
      if (order) {
        setPayOSConfig((oldConfig) => ({
          ...oldConfig,
          CHECKOUT_URL: order.paymentUrl,
          RETURN_URL: order.returnUrl,
          CANCEL_URL: order.cancelUrl,
        }));
      }
    }
  };

  const handleCancelPayment = () => {
    setIsPaying(false);
    setPayOSConfig(defaultPayOSConfig);
    exit();
  };

  useEffect(() => {
    if (isPaying && payOSConfig.CHECKOUT_URL != "") {
      open();
    }
  }, [payOSConfig, open, isPaying]);

  return (
    <div className="w-full max-w-[1380px] mx-auto">
      <div className="flex items-start space-x-12 pt-6">
        {/* Course info */}
        <div className="w-2/3 space-y-10">
          <h2 className="text-3xl font-bold">{batchInfo?.title}</h2>
          {/* General info */}
          <div className="space-y-3 text-sm">
            {/* Time */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <Clock size={20} />
                <span>Duration:</span>
              </div>
              <p>
                {new Date(batchInfo?.startTime || "").toLocaleDateString(
                  "vi-VN",
                )}{" "}
                -{" "}
                {new Date(batchInfo?.endTime || "").toLocaleDateString("vi-VN")}
              </p>
            </div>
            {/* Instructor */}
            {/* Language and labels */}
            <div className="flex items-center space-x-6">
              <div className="flex space-x-2">
                <Languages size={20} />: <span>{batchInfo?.language}</span>
              </div>
              <div className="flex space-x-2">
                {batchInfo?.label?.map((label: CourseLabel) => (
                  <span key={label.id} className="badge bg-blue-600 text-white">
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Topics (tags) */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Explore related topics
            </h3>
            {batchInfo?.tag?.map((tag: CourseTag) => (
              <Link
                to={`/batches/tag/${tag.name}`}
                key={tag.id}
                className="btn rounded-lg mr-4"
              >
                {tag.name}
              </Link>
            ))}
          </div>
          {/* Max capacity */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Max capacity</h3>
            <p className="text-lg font-semibold">{batchInfo?.maxCapacity}</p>
          </div>
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <HtmlDisplay html={batchInfo?.description || "No description"} />
          </div>
        </div>
        {/* Batch enroll */}
        <div className="w-1/3 space-y-4">
          <div className="card border border-slate-200 shadow-sm rounded-lg">
            <figure className="h-56 border-b border-b-slate-200">
              {batchInfo?.image && (
                <img
                  className="w-full h-full object-cover"
                  src={batchInfo.image}
                />
              )}
              {!batchInfo?.image && (
                <div className="w-full h-full bg-slate-100 text-slate-500 flex justify-center items-center">
                  No image
                </div>
              )}
            </figure>
            <div className="card-body space-y-2">
              {!isEnrolled ? (
                <>
                  <p className="text-2xl font-bold">
                    {batchInfo?.paidBatch &&
                      formatPrice(batchInfo?.sellingPrice, "VND")}
                    {!batchInfo?.paidBatch && "Free Batch"}
                  </p>
                  <button className="btn btn-neutral" onClick={handleEnroll}>
                    Enroll this batch
                  </button>
                </>
              ) : (
                <Link
                  to={`/course/${batchInfo?.slug}/learn`}
                  className="btn btn-neutral"
                >
                  Continue learning
                </Link>
              )}
              <button className="btn" onClick={() => setIsPreviewOpen(true)}>
                Batch introduction
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Preview video modal */}
      {isPreviewOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          {batchInfo?.videoLink && (
            <ReactPlayer
              src={batchInfo?.videoLink}
              style={{
                width: "calc(100% / 3 * 2)",
                height: "calc(100% / 4 * 3)",
              }}
              controls
            />
          )}
          {!batchInfo?.videoLink && (
            <div className="w-2/3 h-2/3 bg-slate-100 flex items-center justify-center text-slate-500">
              <PlayCircle size={40} />
              <span className="ml-4 font-semibold text-lg">
                No preview available
              </span>
            </div>
          )}
          <XIcon
            className="absolute top-16 right-16 text-slate-200 cursor-pointer"
            size={30}
            onClick={() => setIsPreviewOpen(false)}
          />
        </div>
      )}
      {/* QR modal */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-50 bg-[rgba(0,0,0,0.5)] flex justify-center items-center ${!isPaying && "hidden"}`}
      >
        <div className="flex flex-col items-center space-y-4 bg-white opacity-100 rounded-lg p-4">
          <div id="embedded-payment-container" className="w-96 h-96"></div>
          <p className="text-xl font-semibold">
            Total: {formatPrice(batchInfo?.sellingPrice, "VND")}
          </p>
          <button className="btn btn-outline" onClick={handleCancelPayment}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
