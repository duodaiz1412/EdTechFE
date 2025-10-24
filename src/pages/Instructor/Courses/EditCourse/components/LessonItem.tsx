import Button from "@/components/Button";
import {
  Edit3,
  Trash2,
  PlayCircle,
  HelpCircle,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import {useState} from "react";
import {useNavigate, useParams} from "react-router";
import {toast} from "react-toastify";
import useCourse from "@/hooks/useCourse";
import {Modal} from "@/components/Modal";

import {CourseItem, useCourseContext} from "@/context/CourseContext";
import HtmlDisplay from "@/components/HtmlDisplay";
import VideoPreview from "@/components/VideoPreview";
import QuizPreview from "@/components/QuizPreview";

interface LessonItemProps {
  chapterId: string;
  item: CourseItem;
  onDelete: (chapterId: string, itemId: string) => void;
}

const getItemIcon = (item: CourseItem) => {
  if (item.videoUrl) return <PlayCircle size={20} />;
  if (item.quizDto) return <HelpCircle size={20} />;
  if (item.content) return <ClipboardList size={20} />;
  return <PlayCircle size={20} />;
};

export default function LessonItem({
  chapterId,
  item,
  onDelete,
}: LessonItemProps) {
  const navigate = useNavigate();
  const {courseId} = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const {createQuiz, loadCourse, updateLesson} = useCourse();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title || "");
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const {formData, updateFormData, syncCourseToFormData} = useCourseContext();

  // Handle edit title
  const handleEditTitle = async () => {
    if (!editTitle.trim()) {
      toast.warning("Please enter a lesson title");
      return;
    }
    if (editTitle.trim() === item.title) {
      toast.info("Title unchanged");
      setShowEditModal(false);
      return;
    }

    try {
      setIsUpdatingTitle(true);
      // Update lesson in database
      const updatedLesson = await updateLesson(item.id!, {
        title: editTitle.trim(),
      });

      // Ensure database update was successful
      if (!updatedLesson) {
        throw new Error("Database update failed");
      }

      // Update local form data
      const currentChapters = formData.chapters || [];
      updateFormData({
        chapters: currentChapters.map((chapter) =>
          chapter.id === chapterId
            ? {
                ...chapter,
                lessons: (chapter.lessons || []).map((lesson) =>
                  lesson.id === item.id
                    ? {...lesson, title: editTitle.trim()}
                    : lesson,
                ),
              }
            : chapter,
        ),
      });

      // Reload course data from server to ensure consistency
      if (courseId) {
        const updatedCourse = await loadCourse(courseId);
        if (updatedCourse) {
          syncCourseToFormData(updatedCourse);
        }
      }

      toast.success("Lesson title updated successfully");
      setShowEditModal(false);
    } catch {
      toast.error("Error updating lesson title");
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  if (!item) {
    return (
      <div className="border border-gray-200 rounded-lg">
        <div
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {isExpanded ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </span>
            <div>
              <p className="font-medium text-red-500">Invalid item data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasContent = item.videoUrl || item.quizDto || item.content;

  const handleClickQuiz = async () => {
    if (!item.id) return;
    if (item.quizDto?.id) {
      navigate(
        `/instructor/courses/${courseId}/edit/lecture/quiz/${item.quizDto.id}`,
      );
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmCreateQuiz = async () => {
    if (!item.id) return;
    try {
      setIsCreatingQuiz(true);
      const quizTitle = "New Quiz";
      const created = await createQuiz({
        title: quizTitle,
        showAnswers: true,
        showSubmissionHistory: true,
      });
      if (!created?.id) {
        toast.error("Failed to create quiz");
        return;
      }
      // Assign quizId to lesson
      const updatedLesson = await updateLesson(item.id, {
        title: item.title || "",
        quizId: created.id,
      });

      if (!updatedLesson) {
        toast.error("Failed to assign quiz to lesson");
        return;
      }
      toast.success("Quiz created successfully");
      // Sync immediately to formData so UI reflects changes
      const currentChapters = formData.chapters || [];
      updateFormData({
        chapters: currentChapters.map((chapter) =>
          chapter.id === chapterId
            ? {
                ...chapter,
                lessons: (chapter.lessons || []).map((lesson) =>
                  lesson.id === item.id
                    ? {...lesson, quizDto: created}
                    : lesson,
                ),
              }
            : chapter,
        ),
      });
      if (courseId) {
        const updatedCourse = await loadCourse(courseId);
        if (updatedCourse) {
          syncCourseToFormData(updatedCourse);
        }
      }
      setShowConfirm(false);
      navigate(
        `/instructor/courses/${courseId}/edit/lecture/quiz/${created.id}`,
      );
    } catch {
      toast.error("Error creating quiz");
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      {/* Header - Always visible */}
      <div
        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">
            {isExpanded ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </span>
          <span className="text-lg">{getItemIcon(item)}</span>
          <div>
            <p className="font-medium text-gray-900">
              Lesson {item.position}: {item.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit3 size={14} />}
              onClick={() => {
                setEditTitle(item.title || "");
                setShowEditModal(true);
              }}
              className="text-green-600 hover:text-green-700"
            >
              Rename
            </Button>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={() => onDelete(chapterId, item.id || "")}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-200">
          {hasContent ? (
            <div className="flex flex-col gap-4">
              <div className="space-y-4 flex flex-col">
                {/* Existing content preview */}
                {item.videoUrl && (
                  <VideoPreview
                    videoUrl={item.videoUrl || ""}
                    onEdit={() =>
                      navigate(
                        `/instructor/courses/${courseId}/edit/lecture/video/${item.id}`,
                      )
                    }
                  />
                )}

                {item.quizDto && (
                  <QuizPreview
                    quizId={item.quizDto.id || ""}
                    quizTitle={item.quizDto.title || "Quiz"}
                    onEdit={() =>
                      navigate(
                        `/instructor/courses/${courseId}/edit/lecture/quiz/${item.quizDto?.id}`,
                      )
                    }
                  />
                )}

                {item.content && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ClipboardList size={20} className="text-green-600" />
                        <p className="font-medium text-green-900">
                          Article Content
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/instructor/courses/${courseId}/edit/lecture/article/${item.id}`,
                          )
                        }
                        className="text-green-700 hover:text-green-800"
                      >
                        Edit
                      </Button>
                    </div>

                    {/* Article Preview */}
                    <div className="bg-white rounded-md p-3 border border-green-200 min-h-32">
                      <HtmlDisplay
                        html={item.content || ""}
                        className="text-gray-700"
                      />
                    </div>

                    <div className="mt-2 text-xs text-green-600">
                      Click "Edit" to modify content
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">
                  No content added yet. Choose a content type:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Add Video */}
                  <div
                    className="flex flex-col items-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(
                        `/instructor/courses/${courseId}/edit/lecture/video/${item.id}`,
                      )
                    }
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <PlayCircle size={24} className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Video</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Upload video lesson
                    </p>
                  </div>

                  {/* Add Article */}
                  <div
                    className="flex flex-col items-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(
                        `/instructor/courses/${courseId}/edit/lecture/article/${item.id}`,
                      )
                    }
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <FileText size={24} className="text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Article</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Upload article file
                    </p>
                  </div>

                  {/* Add Quiz */}
                  <div
                    className="flex flex-col items-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={handleClickQuiz}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <HelpCircle size={24} className="text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Quiz</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Create quiz questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        open={showConfirm}
        onClose={() => (!isCreatingQuiz ? setShowConfirm(false) : undefined)}
        title="Create quiz for lesson"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowConfirm(false)}
              className="text-gray-700"
              disabled={isCreatingQuiz}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmCreateQuiz}
              className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              disabled={isCreatingQuiz}
            >
              {isCreatingQuiz ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-700">
          Do you want to create a quiz for this lesson before configuring
          questions?
        </p>
      </Modal>

      {/* Edit Title Modal */}
      <Modal
        open={showEditModal}
        onClose={() => (!isUpdatingTitle ? setShowEditModal(false) : undefined)}
        title="Edit lesson title"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              disabled={isUpdatingTitle}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditTitle}
              className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              disabled={isUpdatingTitle}
            >
              {isUpdatingTitle ? "Saving..." : "Save"}
            </Button>
          </div>
        }
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Title
          </label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Enter lesson title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
