import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {Heading3} from "@/components/Typography";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";
import useCourse from "@/hooks/useCourse";
import {Plus, Trash2, HelpCircle} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizLectureFormValues {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export default function EditQuizLecture() {
  const navigate = useNavigate();
  const {courseId, lessonId, chapterId} = useParams();

  const {
    error,
    formData,
  } = useCourseContext();

  const {
    createLesson,
    updateLesson,
    loadCourse,
    state: {isSubmitting},
  } = useCourse();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const validationSchema = Yup.object({
    title: Yup.string().trim().required("Title is required"),
    description: Yup.string().trim(),
    questions: Yup.array().min(1, "At least one question is required"),
  });

  const formik = useFormik<QuizLectureFormValues>({
    initialValues: {
      title: "",
      description: "",
      questions: [],
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
          const success = await updateLesson(lessonId, {
            title: formik.values.title,
            description: formik.values.description,
            content: "", // Clear article content
            videoUrl: undefined, // Clear video data
            quizDto: {
              questions: formik.values.questions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
              })),
            },
          });

          if (success) {
            toast.success("Quiz lecture updated successfully!");
            if (courseId) {
              await loadCourse(courseId);
            }
            navigate(`/instructor/courses/${courseId}/edit/curriculum`);
          } else {
            toast.error("Failed to update quiz lecture");
          }
        } else {
          // Create new lesson
          const newLesson = await createLesson(entityId);

          if (newLesson) {
            toast.success("Quiz lecture created successfully!");
            if (courseId) {
              await loadCourse(courseId);
            }
            navigate(`/instructor/courses/${courseId}/edit/curriculum`);
          } else {
            toast.error("Failed to create quiz lecture");
          }
        }
      } catch {
        toast.error("Error saving quiz lecture");
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

      if (lesson && lesson.quizDto) {
        const loadedQuestions = lesson.quizDto.questions.map((q: any, index: number) => ({
          id: `q-${index}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        }));
        
        setQuestions(loadedQuestions);
        formik.setValues({
          title: lesson.title || "",
          description: "",
          questions: loadedQuestions,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    formik.setFieldValue("questions", updatedQuestions);
  };

  const removeQuestion = (questionId: string) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    formik.setFieldValue("questions", updatedQuestions);
  };

  const updateQuestion = (questionId: string, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    );
    setQuestions(updatedQuestions);
    formik.setFieldValue("questions", updatedQuestions);
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    formik.setFieldValue("questions", updatedQuestions);
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

      <div className="bg-white border rounded-lg p-6 max-w-4xl mx-auto">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Heading3 className="mb-6">
          {lessonId ? "Edit quiz lecture" : "Create quiz lecture"}
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
              placeholder="Enter quiz title"
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
              placeholder="Describe your quiz lesson"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={4}
            />
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Questions <span className="text-red-500">*</span>
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={16} />}
                onClick={addQuestion}
                className="text-purple-600 hover:text-purple-700"
              >
                Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <HelpCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No questions added yet</p>
                <p className="text-sm text-gray-400">Click "Add Question" to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Question Text */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        placeholder="Enter your question here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Options */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formik.errors.questions && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.questions as string}
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
                questions.length === 0 ||
                isSubmitting
              }
              className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Save Quiz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
