import MyLearningCourses from "./Courses/MyLearningCourses";

export default function MyLearning() {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 ml-2">My Learning</h2>
      <div className="tabs tabs-lg tabs-border">
        {/* Courses */}
        <input
          type="radio"
          name="lesson_tabs"
          className="tab"
          defaultChecked
          aria-label="Courses"
        />
        <div className="tab-content px-3 py-4">
          <MyLearningCourses />
        </div>

        {/* Batches */}
        <input
          type="radio"
          name="lesson_tabs"
          className="tab"
          aria-label="Batches"
        />
        <div className="tab-content px-3 py-4">
          <div>My Learning Batches</div>
        </div>
      </div>
    </div>
  );
}
