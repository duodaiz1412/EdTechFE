import {useState} from "react";
import Button from "@/components/Button";
import {Heading3} from "@/components/Typography";
import CommonSelect from "@/components/CommonSelect";

export default function CourseSettingsContent() {
  const enrollmentOptions = [
    {value: "public", label: "Public"},
    {value: "private", label: "Private"},
    {value: "unlisted", label: "Unlisted"},
  ];
  const [enrollment, setEnrollment] = useState("public");
  const [lastSavedEnrollment, setLastSavedEnrollment] = useState("public");
  const [dirty, setDirty] = useState(false);

  return (
    <div className="p-8">
      <Heading3 className="mb-6">Course Settings</Heading3>

      <div className="space-y-8">
        {/* Course Status */}
        <section className="flex items-center gap-4">
          <Button className="bg-gray-800 text-white hover:bg-gray-700">
            Publish
          </Button>
          <p className="text-sm text-gray-600">
            New students can find your course via search.
          </p>
        </section>

        {/* Delete */}
        <section className="flex items-center gap-4">
          <Button className="bg-red-600 text-white hover:bg-red-700">
            Delete
          </Button>
          <p className="text-sm text-gray-600">
            We promise students lifetime access, so courses cannot be deleted
            after students have enrolled.
          </p>
        </section>

        {/* Enrollment */}
        <section className="space-y-2 max-w-xl">
          <label className="text-sm font-medium text-gray-800">
            Enrollment
          </label>
          <div className="flex items-center gap-3">
            <CommonSelect
              value={enrollment}
              options={enrollmentOptions}
              onChange={(value) => {
                setEnrollment(value);
                setDirty(value !== lastSavedEnrollment);
              }}
              className="flex-1"
            />
            <Button
              className="bg-gray-800 text-white hover:bg-gray-700"
              disabled={!dirty}
              onClick={() => {
                setLastSavedEnrollment(enrollment);
                setDirty(false);
              }}
            >
              Save
            </Button>
          </div>
        </section>

        {/* Instructors */}
        <section>
          <label className="text-sm font-medium text-gray-800">
            Instructors
          </label>
          <div className="mt-2 text-sm text-gray-500">Coming soon...</div>
        </section>
      </div>
    </div>
  );
}
