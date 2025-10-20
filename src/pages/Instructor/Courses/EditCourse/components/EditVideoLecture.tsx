import {ChangeEvent, useEffect} from "react";
import {useNavigate, useParams} from "react-router";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {Heading3} from "@/components/Typography";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";
import {useUploadFile} from "@/hooks/useUploadFile";
import useCourse from "@/hooks/useCourse";
import {UploadPurpose} from "@/types/upload.types";

interface VideoLectureFormValues {
  title: string;
  description: string;
  videoFile: File | null;
  videoUrl?: string;
}

export default function EditVideoLecture() {
  const navigate = useNavigate();
  const {courseId, lessonId} = useParams();

  const {error, formData, syncCourseToFormData} = useCourseContext();

  const {
    updateLesson,
    loadCourse,
    state: {isSubmitting},
  } = useCourse();

  // Upload hook for video transcoding
  const {
    isUploading,
    progress,
    error: uploadError,
    success: uploadSuccess,
    videoJob,
    uploadVideo,
    resetState: resetUploadState,
  } = useUploadFile({
    onSuccess: (jobId) => {
      toast.success("Video queued for transcoding successfully!");
      // Video URL sẽ được cập nhật sau khi transcoding hoàn thành
      // Hiện tại chỉ lưu job ID để tracking
      formik.setFieldValue("videoUrl", `transcoding:${jobId}`);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error}`);
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().trim().required("Title is required"),
    description: Yup.string().trim(),
    videoFile: Yup.mixed<File>().nullable(),
    videoUrl: Yup.string().test(
      "video-url-required",
      "Video is required",
      function (value) {
        // Cho phép edit video hiện có (có videoUrl) hoặc upload video mới (có videoFile)
        const hasVideoUrl = !!(value && value.trim().length > 0 && !value.startsWith('transcoding:'));
        const hasVideoFile = !!this.parent.videoFile;
        const isTranscoding = !!(value && value.startsWith('transcoding:'));
        return hasVideoUrl || hasVideoFile || isTranscoding;
      },
    ),
  });

  const formik = useFormik<VideoLectureFormValues>({
    initialValues: {
      title: "",
      description: "",
      videoFile: null,
      videoUrl: "",
    },
    validationSchema,
    onSubmit: async () => {
      if (!lessonId) {
        toast.error("Lesson ID is required");
        return;
      }

      try {
        // Nếu có file mới được chọn, upload trước
        if (formik.values.videoFile) {
          try {
            toast.info("Uploading video...");
            await uploadVideo(formik.values.videoFile, lessonId, UploadPurpose.LESSON_VIDEO);

          } catch {
            toast.error("Failed to upload video");
            return;
          }
        }

        const success = await updateLesson(lessonId, {
          title: formik.values.title,
          content: undefined, // Clear article content
          quizId: undefined, // Clear quiz data
        });

        if (success) {
          toast.success("Video lecture updated successfully!");
          const updatedCourse = await loadCourse(courseId!);
          if (updatedCourse) {
            syncCourseToFormData(updatedCourse);
          }
          navigate(`/instructor/courses/${courseId!}/edit/curriculum`);
        } else {
          toast.error("Failed to update video lecture");
        }
      } catch {
        toast.error("Error saving video lecture");
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  // Load existing lesson data when editing
  useEffect(() => {
    if (lessonId && formData.chapters) {
      const lesson = formData.chapters
        .flatMap((chapter) => chapter.lessons || [])
        .find((lesson) => lesson.id === lessonId);

      if (lesson) {
        formik.setValues({
          title: lesson.title || "",
          description: "",
          videoFile: null,
          videoUrl: lesson.videoUrl || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    formik.setFieldValue("videoFile", file);
    // Reset upload state khi chọn file mới
    resetUploadState();
  };

  return (
    <div className="p-6">
      <button
        className="mb-4 text-sm text-gray-600 hover:text-gray-800"
        onClick={() =>
          navigate(`/instructor/courses/${courseId}/edit/curriculum`)
        }
      >
        ← Back to curriculum
      </button>

      <div className="bg-white border rounded-lg p-6 max-w-3xl mx-auto">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Heading3 className="mb-6">Edit video lecture</Heading3>

        <form className="space-y-6" onSubmit={formik.handleSubmit} noValidate>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter video title"
              className="w-full"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Describe your video lesson"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File <span className="text-red-500">*</span>
            </label>

            {/* Hiển thị video hiện có nếu có */}
            {formik.values.videoUrl && !formik.values.videoFile && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                {formik.values.videoUrl.startsWith('transcoding:') ? (
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Video is being processed:
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-700">
                        Transcoding in progress... This may take a few minutes.
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Job ID: {formik.values.videoUrl.replace('transcoding:', '')}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Current video:
                    </p>
                    <video
                      className="h-32 w-56 rounded border border-blue-200 bg-black"
                      src={formik.values.videoUrl}
                      controls
                      preload="metadata"
                      playsInline
                      crossOrigin="anonymous"
                      controlsList="nodownload"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-xs text-blue-700 mt-1">
                      Upload a new file below to replace this video
                    </p>
                  </div>
                )}
              </div>
            )}

            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white hover:file:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* File info */}
            {formik.values.videoFile && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm font-medium text-yellow-800">
                  📁 New video selected: {formik.values.videoFile.name}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Click "Upload & Save Video" to upload and save changes
                </p>
              </div>
            )}

            {/* Upload progress */}
            {isUploading && progress && (
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading... {progress.percentage}%</span>
                  <span>
                    {Math.round(progress.loaded / 1024)}KB /{" "}
                    {Math.round(progress.total / 1024)}KB
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{width: `${progress.percentage}%`}}
                  />
                </div>
              </div>
            )}

            {/* Upload success */}
            {uploadSuccess && videoJob && (
              <div className="mt-3 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                <p className="text-sm font-medium">
                  ✓ Video queued for transcoding successfully!
                </p>
                <p className="text-xs mt-1">Job ID: {videoJob.id}</p>
                <p className="text-xs mt-1">Status: {videoJob.status}</p>
                <p className="text-xs mt-1 text-blue-600">
                  Video will be available after transcoding is complete.
                </p>
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p className="text-sm font-medium">Upload failed:</p>
                <p className="text-xs mt-1">{uploadError}</p>
                <button
                  onClick={resetUploadState}
                  className="mt-2 text-xs underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}

            {formik.errors.videoFile && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.videoFile as string}
              </p>
            )}
            {formik.errors.videoUrl && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.videoUrl as string}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate(`/instructor/courses/${courseId}/edit/curriculum`)
              }
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formik.isValid ||
                !formik.values.title.trim() ||
                isUploading ||
                isSubmitting
              }
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading
                ? "Uploading..."
                : isSubmitting
                  ? "Saving..."
                  : formik.values.videoFile
                    ? "Upload & Save Video"
                    : "Save Video"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
