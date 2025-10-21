import {ChangeEvent, useEffect} from "react";
import {useNavigate, useParams} from "react-router";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {Heading3} from "@/components/Typography";
import CommonSelect from "@/components/CommonSelect";
import QuillMarkdownEditor from "@/components/QuillMarkdownEditor/QuillMarkdownEditor";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";
import {useUploadFile} from "@/hooks/useUploadFile";
import useCourse from "@/hooks/useCourse";

type LectureType = "video" | "article";

interface LectureFormValues {
  title: string;
  type: LectureType;
  description: string;
  videoFile: File | null;
  content: string;
  videoUrl?: string; // URL of uploaded video
}

const typeOptions = [
  {value: "video", label: "Video"},
  {value: "article", label: "Article"},
];

export default function EditLecture() {
  const navigate = useNavigate();
  const {courseId, lessonId, chapterId} = useParams();

  const {
    // API State (from hook via context)
    error,
    formData,
    syncCourseToFormData,
  } = useCourseContext();

  // Use useCourse hook directly to get createLesson and updateLesson
  const {
    createLesson,
    updateLesson,
    loadCourse,
    state: {isSubmitting},
  } = useCourse();

  // Upload hook
  const {
    isUploading,
    progress,
    error: uploadError,
    success: uploadSuccess,
    uploadedUrl,
    uploadLessonVideo,
    resetState: resetUploadState,
  } = useUploadFile({
    onSuccess: (url) => {
      toast.success("Video uploaded successfully!");
      formik.setFieldValue("videoUrl", url);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error}`);
    },
  });
  const validationSchema = Yup.object({
    title: Yup.string().trim().required("Title is required"),
    type: Yup.mixed<LectureType>().oneOf(["video", "article"]).required(),
    description: Yup.string().trim(),
    videoFile: Yup.mixed<File>()
      .nullable()
      .test("video-required", "Video is required", function (value) {
        const type = this.parent.type as LectureType;
        return type === "video" ? !!value : true;
      }),
    videoUrl: Yup.string().test(
      "video-url-required",
      "Video must be uploaded first",
      function (value) {
        const type = this.parent.type as LectureType;
        return type === "video" ? !!(value && value.trim().length > 0) : true;
      },
    ),
    content: Yup.string().test(
      "content-required",
      "Content is required",
      function (value) {
        const type = this.parent.type as LectureType;
        return type === "article" ? !!(value && value.trim().length > 0) : true;
      },
    ),
  });

  const formik = useFormik<LectureFormValues>({
    initialValues: {
      title: "",
      type: "video",
      description: "",
      videoFile: null,
      content: "",
      videoUrl: "",
    },
    validationSchema,
    onSubmit: async () => {
      const entityId = lessonId || chapterId;
      if (!entityId) {
        toast.error("Lesson ID or Chapter ID is required");
        return;
      }

      try {
        if (lessonId) {
          // Edit existing lesson
          const updatedLesson = await updateLesson(lessonId, {
            title: formik.values.title,
            content: formik.values.content,
            videoUrl: formik.values.videoUrl,
          });

          if (updatedLesson) {
            toast.success("Lecture updated successfully!");
            // Reload course data to get updated lesson
            if (courseId) {
              const updatedCourse = await loadCourse(courseId);
              if (updatedCourse) {
                syncCourseToFormData(updatedCourse);
              }
            }
            navigate(`/instructor/courses/${courseId}/edit/curriculum`);
          } else {
            toast.error("Failed to update lecture");
          }
        } else {
          // Create new lesson
          const newLesson = await createLesson(entityId);

          if (newLesson) {
            toast.success("Lecture created successfully!");
            // Reload course data to get new lesson
            if (courseId) {
              const updatedCourse = await loadCourse(courseId);
              if (updatedCourse) {
                syncCourseToFormData(updatedCourse);
              }
            }
            navigate(`/instructor/courses/${courseId}/edit/curriculum`);
          } else {
            toast.error("Failed to create lecture");
          }
        }
      } catch {
        toast.error("Error saving lecture");
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  // Load existing lesson data when editing (only once when component mounts)
  useEffect(() => {
    if (lessonId && formData.chapters) {
      // Find the lesson in the course data
      const lesson = formData.chapters
        .flatMap((chapter) => chapter.lessons || [])
        .find((lesson) => lesson.id === lessonId);

      if (lesson) {
        // Determine lesson type based on content
        const lessonType: LectureType = lesson.videoUrl ? "video" : "article";

        formik.setValues({
          title: lesson.title || "",
          type: lessonType,
          description: "", // Description not stored in current structure
          videoFile: null,
          content: lesson.content || "",
          videoUrl: lesson.videoUrl || "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    formik.setFieldValue("videoFile", file);

    const entityId = lessonId || chapterId;
    if (file && entityId) {
      try {
        // Upload video file
        await uploadLessonVideo(file, entityId);
      } catch {
        // Handle upload error silently
      }
    }
  };

  const showVideo = formik.values.type === "video";
  const showContent = formik.values.type === "article";

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

        <Heading3 className="mb-6">
          {lessonId ? "Edit lecture" : "Create lecture"}
        </Heading3>

        <form className="space-y-6" onSubmit={formik.handleSubmit} noValidate>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter a title"
              className="w-full"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.title}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <div className="flex flex-row items-center gap-1 h-fit">
              <label className="block text-sm font-medium text-gray-700 mb-2 justify-center align-middle">
                Type
              </label>
              <span className="text-md text-red-500 align-top justify-center">
                *
              </span>
            </div>

            <CommonSelect
              value={formik.values.type}
              onChange={(value) =>
                formik.setFieldValue("type", value as LectureType)
              }
              options={typeOptions}
              placeholder="Select type"
              className="w-full"
            />
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
              placeholder="This is a text editor"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          {/* Video (only for Video) */}
          {showVideo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white hover:file:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              />

              {/* File info */}
              {formik.values.videoFile && (
                <p className="mt-2 text-xs text-gray-500">
                  Selected: {formik.values.videoFile.name}
                </p>
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
              {uploadSuccess && uploadedUrl && (
                <div className="mt-3 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                  <p className="text-sm font-medium">
                    ✓ Video uploaded successfully!
                  </p>
                  <p className="text-xs mt-1">URL: {uploadedUrl}</p>
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
          )}

          {/* Content (only for Article) */}
          {showContent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <QuillMarkdownEditor
                value={formik.values.content}
                onChange={(value) => formik.setFieldValue("content", value)}
                onBlur={() => formik.setFieldTouched("content", true)}
                placeholder="Enter lesson content..."
                className="w-full"
                rows={5}
              />
              {formik.errors.content && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.content as string}
                </p>
              )}
            </div>
          )}
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
              className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading
                ? "Uploading..."
                : isSubmitting
                  ? "Creating..."
                  : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
