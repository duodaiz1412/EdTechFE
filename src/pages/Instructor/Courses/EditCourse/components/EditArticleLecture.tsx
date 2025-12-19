import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {Heading3} from "@/components/Typography";
import QuillMarkdownEditor from "@/components/QuillMarkdownEditor/QuillMarkdownEditor";
import DocumentUpload from "@/components/DocumentUpload";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";
import useCourse from "@/hooks/useCourse";
import {useUploadFile} from "@/hooks/useUploadFile";
import {UploadPurpose} from "@/types/upload.types";

interface ArticleLectureFormValues {
  title: string;
  content: string;
  fileUrl?: string;
}

export default function EditArticleLecture() {
  const navigate = useNavigate();
  const {courseId, lessonId, chapterId} = useParams();

  const {error, formData, syncCourseToFormData} = useCourseContext();

  const {
    updateLesson,
    loadCourse,
    state: {isSubmitting},
  } = useCourse();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Upload hook for file upload
  const {uploadFile, isUploading: isFileUploading} = useUploadFile({
    onSuccess: () => {
      // This will be handled in the submit function
    },
    onError: (error) => {
      toast.error(`File upload failed: ${error}`);
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().trim().required("Title is required"),
    content: Yup.string().test(
      "content-required",
      "Content is required",
      function (value) {
        return !!(value && value.trim().length > 0);
      },
    ),
    fileUrl: Yup.string().optional(),
  });

  const formik = useFormik<ArticleLectureFormValues>({
    initialValues: {
      title: "",
      content: "",
      fileUrl: "",
    },
    validationSchema,
    onSubmit: async () => {
      const entityId = lessonId || chapterId;
      if (!entityId) {
        toast.error("Lesson ID or Chapter ID is required");
        return;
      }

      try {
        let fileUrl = formik.values.fileUrl;
        if (selectedFile && courseId) {
          try {
            fileUrl = await uploadFile(
              selectedFile,
              UploadPurpose.LESSON_RESOURCE,
              courseId,
            );
            if (!fileUrl) {
              toast.error("Failed to upload file");
              return;
            }
          } catch {
            toast.error("Failed to upload file");
            return;
          }
        }
        if (lessonId) {
          // Edit existing lesson

          const updateData = {
            title: formik.values.title,
            content: formik.values.content,
            fileUrl: fileUrl,
            videoUrl: undefined, // Clear video data
            quizId: undefined, // Clear quiz data
          };

          const updatedLesson = await updateLesson(lessonId, updateData);

          if (updatedLesson) {
            toast.success("Article lecture updated successfully!");
            if (courseId) {
              const updatedCourse = await loadCourse(courseId);
              if (updatedCourse) {
                syncCourseToFormData(updatedCourse);
              }
            }
            navigate(`/instructor/courses/${courseId}/edit/curriculum`);
          } else {
            toast.error("Failed to update article lecture");
          }
        }
      } catch {
        toast.error("Error saving article lecture");
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
          content: lesson.content || "",
          fileUrl: lesson.fileUrl || "",
        });
        setSelectedFile(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
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

        <Heading3 className="mb-6">
          {lessonId ? "Edit article lecture" : "Create article lecture"}
        </Heading3>

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
              placeholder="Enter article title"
              className="w-full"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.title}</p>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <QuillMarkdownEditor
              value={formik.values.content}
              onChange={(value) => formik.setFieldValue("content", value)}
              onBlur={() => formik.setFieldTouched("content", true)}
              placeholder="Write your article content here..."
              className="w-full"
              rows={8}
            />
            {formik.errors.content && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.content as string}
              </p>
            )}
          </div>

          {/* Optional File Upload */}
          <DocumentUpload
            title="Attach File (Optional)"
            accept=".pdf,.doc,.docx,.txt,.md"
            src={formik.values.fileUrl}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />

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
                !formik.values.content.trim() ||
                isSubmitting ||
                isFileUploading
              }
              className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFileUploading
                ? "Uploading file..."
                : isSubmitting
                  ? "Saving..."
                  : "Save Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
