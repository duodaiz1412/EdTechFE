import {Heading3} from "@/components/Typography";

export default function CourseStructureContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="space-y-4">
        <Heading3>Course Structure</Heading3>
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-semibold text-gray-700">Coming Soon</h2>
        <p className="text-gray-500 max-w-md">
          We're working on building an amazing course structure editor. 
          This feature will be available soon!
        </p>
      </div>
    </div>
  );
}
