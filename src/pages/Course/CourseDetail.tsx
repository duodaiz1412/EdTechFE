import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {Link, useParams} from "react-router-dom";
import {Languages, PlayCircle, User, XIcon} from "lucide-react";
import {usePayOS} from "@payos/payos-checkout";
import ReactPlayer from "react-player";

import {Chapter, Course, Label, Tag, Review} from "@/types";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {login} from "@/redux/slice/userSlice";
import {publicServices} from "@/lib/services/public.services";
import {enrollServices} from "@/lib/services/enroll.services";
import {progressServices} from "@/lib/services/progress.services";
import {getFileUrlFromMinIO} from "@/lib/services/upload.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {formatPrice} from "@/lib/utils/formatPrice";
import {isCourseEnrolled} from "@/lib/utils/isCourseEnrolled";
import {checkIsInstructor} from "@/lib/utils/isBatchInstructor";

import ReadOnlyRating from "@/components/ReadOnlyRating";
import CourseContentList from "./CourseContent/CourseContentList";
import CourseReviewItem from "./CourseLesson/Review/CourseReviewItem";
import HtmlDisplay from "@/components/HtmlDisplay";

export default function CourseDetail() {
  // Data states
  const {slug} = useParams();
  const [courseImgLink, setCourseImgLink] = useState<string>();
  const [courseInfo, setCourseInfo] = useState<Course>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentLessonSlug, setCurrentLessonSlug] = useState("");
  const [isInstructor, setIsInstructor] = useState(false);

  // Redux states
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userData = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

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
      setIsEnrolled(true);
      setIsPaying(false);

      const fetchData = async () => {
        const accessToken = await getAccessToken();
        const courseEnrollments =
          await enrollServices.getCourseEnrollments(accessToken);
        dispatch(
          login({
            ...userData,
            courseEnrollments: courseEnrollments,
          }),
        );
      };
      fetchData();
    },
  };
  const [payOSConfig, setPayOSConfig] = useState(defaultPayOSConfig);
  const {open, exit} = usePayOS(payOSConfig);

  // Fetch course info
  const {isLoading} = useQuery({
    queryKey: ["course-info", slug],
    queryFn: async () => {
      if (!slug) return null;
      const course = await publicServices.getCourseBySlug(slug);
      setCourseInfo(course);
      if (course.image) {
        const imgLink = await getFileUrlFromMinIO(course.image);
        setCourseImgLink(imgLink.uploadUrl);
      }
      return course;
    },
  });
  // Check if user is instructor
  useEffect(() => {
    if (courseInfo && userData?.id) {
      setIsInstructor(checkIsInstructor(userData.id, courseInfo.instructors));
    }
  }, [courseInfo, userData?.id]);

  // Fetch chapters, reviews, enrollment status, progress
  useEffect(() => {
    const fetchData = async () => {
      if (!slug || !userData) return;

      // Get chapters and lessons
      const chapters = await publicServices.getChapters(slug);
      setChapters(chapters);

      // Get reviews
      const avgRating = await publicServices.getAverageRating(slug);
      setAverageRating(avgRating);
      const reviews = await publicServices.getReviews(slug);
      setReviews(reviews.content);

      // Check if user is enrolled this course
      const enrolled = isCourseEnrolled(
        userData?.courseEnrollments || [],
        slug,
      );
      setIsEnrolled(enrolled);

      // Get progress
      if (enrolled) {
        const accessToken = await getAccessToken();
        const progress = await progressServices.getProgress(slug, accessToken);
        setCurrentLessonSlug(progress.currentLessonSlug || "");
      }
    };

    fetchData();
  }, [slug, userData]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info("Login required");
    }

    const accessToken = await getAccessToken();

    if (!courseInfo?.paidCourse) {
      const response = await enrollServices.enrollFreeCourse(
        slug || "",
        accessToken,
      );
      if (response.status === 201) {
        toast.success("Enroll course successfully");
        setIsEnrolled(true);

        const courseEnrollments =
          await enrollServices.getCourseEnrollments(accessToken);
        dispatch(
          login({
            ...userData,
            courseEnrollments: courseEnrollments,
          }),
        );
      }
    } else {
      setIsPaying(true);
      const order = await enrollServices.enrollPaidCourse(
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
          <h2 className="text-3xl font-bold">{courseInfo?.title}</h2>
          {/* General info */}
          <div className="space-y-3 text-sm">
            <p className="text-xl">{courseInfo?.shortIntroduction}</p>
            <div className="flex space-x-2 items-start">
              <span className="font-semibold text-orange-900">
                {averageRating || 0}
              </span>
              <ReadOnlyRating rating={averageRating || 0} size="xs" />
              <span>({courseInfo?.enrollments || 0} students)</span>
            </div>
            {/* Instructors */}
            <div className="flex space-x-2">
              <User size={20} />
              <span className="font-semibold">Instructors: </span>
              <p>
                {courseInfo?.instructors
                  ?.map((inst) => inst.fullName)
                  .join(", ")}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-2">
                <Languages size={20} />
                <span className="font-semibold">Language:</span>
                <span>{courseInfo?.language}</span>
              </div>
              <div className="flex space-x-2">
                {courseInfo?.labels?.map((label: Label) => (
                  <span key={label.id} className="badge bg-blue-600 text-white">
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <HtmlDisplay html={courseInfo?.description || "No description"} />
          </div>
          {/* Topics (tags) */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Explore related topics
            </h3>
            {courseInfo?.tags?.map((tag: Tag) => (
              <Link
                to={`/courses/tag/${tag.name}`}
                key={tag.id}
                className="btn rounded-lg mr-4"
              >
                {tag.name}
              </Link>
            ))}
          </div>
          {/* List of lessons */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Course contents</h3>
            <CourseContentList
              chapters={chapters}
              courseSlug={courseInfo?.slug}
            />
          </div>
          {/* Skill level */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Course level</h3>
            <p>{courseInfo?.skillLevel || "Not specified"}</p>
          </div>
          {/* Who is this course for*/}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Who is this course for?
            </h3>
            <p>{courseInfo?.targetAudience || "Not specified"}</p>
          </div>
          {/* Reviews */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Reviews</h3>
            <div className="grid grid-cols-2 gap-6">
              {reviews.length > 0 &&
                reviews.map((review) => (
                  <CourseReviewItem key={review.id} review={review} />
                ))}
              {reviews.length === 0 && <p>No reviews yet.</p>}
            </div>
          </div>
        </div>
        {/* Course enroll */}
        <div className="w-1/3 space-y-4">
          <div className="card border border-slate-200 shadow-sm rounded-lg">
            <figure className="h-56 border-b border-b-slate-200">
              {courseImgLink && (
                <img
                  className="w-full h-full object-cover"
                  src={courseImgLink}
                />
              )}
              {!courseImgLink && (
                <div className="w-full h-full bg-slate-100 text-slate-500 flex justify-center items-center">
                  No image
                </div>
              )}
            </figure>
            <div className="card-body space-y-2">
              {isLoading && (
                <button disabled className="btn btn-neutral">
                  <div className="loading"></div>
                </button>
              )}
              {!isLoading && isInstructor && (
                <div className="p-2 rounded-lg bg-blue-600 text-white text-center text-lg">
                  Your course
                </div>
              )}
              {!isLoading && !isInstructor && !isEnrolled && (
                <>
                  <p className="text-2xl font-bold">
                    {courseInfo?.paidCourse &&
                      formatPrice(
                        courseInfo?.sellingPrice,
                        courseInfo?.currency || "VND",
                      )}
                    {!courseInfo?.paidCourse && "Free Course"}
                  </p>
                  <button className="btn btn-neutral" onClick={handleEnroll}>
                    Enroll this course
                  </button>
                </>
              )}
              {!isLoading && !isInstructor && isEnrolled && (
                <Link
                  to={`/course/${courseInfo?.slug}/learn/lesson/${currentLessonSlug || chapters?.[0]?.lessons?.[0]?.slug}`}
                  className="btn btn-neutral"
                >
                  Continue learning
                </Link>
              )}
              {!isLoading && !isInstructor && (
                <button className="btn" onClick={() => setIsPreviewOpen(true)}>
                  Course introduction
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Preview video modal */}
      {isPreviewOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
          {courseInfo?.videoLink && (
            <ReactPlayer
              src={courseInfo?.videoLink}
              style={{
                width: "calc(100% / 3 * 2)",
                height: "calc(100% / 4 * 3)",
              }}
              controls
            />
          )}
          {!courseInfo?.videoLink && (
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
            Total:{" "}
            {formatPrice(
              courseInfo?.sellingPrice,
              courseInfo?.currency || "VND",
            )}
          </p>
          <button className="btn btn-outline" onClick={handleCancelPayment}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
