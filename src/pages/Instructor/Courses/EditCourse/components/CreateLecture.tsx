import {ChangeEvent} from "react";
import {useNavigate} from "react-router";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {Heading3} from "@/components/Typography";
import CommonSelect from "@/components/CommonSelect";
import {useFormik} from "formik";
import * as Yup from "yup";

type LectureType = "video" | "article" | "video_slide";

interface LectureFormValues {
  title: string;
  type: LectureType;
  description: string;
  videoFile: File | null;
  content: string;
}

const typeOptions = [
  {value: "video", label: "Video"},
  {value: "article", label: "Article"},
  {value: "video_slide", label: "Video + Slide"},
];

export default function CreateLecture() {
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    title: Yup.string().trim().required("Title is required"),
    type: Yup.mixed<LectureType>()
      .oneOf(["video", "article", "video_slide"])
      .required(),
    description: Yup.string().trim(),
    videoFile: Yup.mixed<File>()
      .nullable()
      .test("video-required", "Video is required", function (value) {
        const type = this.parent.type as LectureType;
        const needsVideo = type === "video" || type === "video_slide";
        return needsVideo ? !!value : true;
      }),
    content: Yup.string().test(
      "content-required",
      "Content is required",
      function (value) {
        const type = this.parent.type as LectureType;
        const needsContent = type === "article" || type === "video_slide";
        return needsContent ? !!(value && value.trim().length > 0) : true;
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
    },
    validationSchema,
    onSubmit: async (values) => {
      // TODO: call API to create lecture
      // For now, just navigate back
      navigate(-1);
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    formik.setFieldValue("videoFile", file);
  };

  const showVideo =
    formik.values.type === "video" || formik.values.type === "video_slide";
  const showContent =
    formik.values.type === "article" || formik.values.type === "video_slide";

  return (
    <div className="p-6">
      <button
        className="mb-4 text-sm text-gray-600 hover:text-gray-800"
        onClick={() => navigate(-1)}
      >
        ← Back to chapters
      </button>

      <div className="bg-white border rounded-lg p-6 max-w-3xl mx-auto">
        <Heading3 className="mb-6">Create lecture</Heading3>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type*
            </label>
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

          {/* Video (only for Video or Video + Slide) */}
          {showVideo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white hover:file:bg-gray-50"
              />
              {formik.values.videoFile && (
                <p className="mt-2 text-xs text-gray-500">
                  Selected: {formik.values.videoFile.name}
                </p>
              )}
              {formik.errors.videoFile && (
                <p className="mt-1 text-xs text-red-600">
                  {formik.errors.videoFile as string}
                </p>
              )}
            </div>
          )}

          {/* Content (only for Article or Video + Slide) */}
          {showContent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="This is a text editor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
              variant="secondary"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formik.isValid || !formik.values.title.trim()}
              className="bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
