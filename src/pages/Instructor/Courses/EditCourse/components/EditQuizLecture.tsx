import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {Heading3} from "@/components/Typography";
import {useCourseContext} from "@/context/CourseContext";
import {toast} from "react-toastify";
import useCourse from "@/hooks/useCourse";
import {Plus, Trash2, HelpCircle, AlertTriangle} from "lucide-react";
import {Modal} from "@/components/Modal";
import QuestionOption from "@/components/QuestionOption";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
}

const parseOptionsFromBackend = (options: any): string[] => {
  if (!options) return ["", ""];

  // If options is a string, try to parse it
  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      if (Array.isArray(parsed)) {
        return parsed.map((opt: any) => {
          if (typeof opt === "string") return opt;
          if (typeof opt === "object" && opt.option) return opt.option;
          return "";
        });
      }
    } catch {
      return ["", ""];
    }
  }

  // If options is already an array
  if (Array.isArray(options)) {
    return options.map((opt: any) => {
      if (typeof opt === "string") return opt;
      if (typeof opt === "object" && opt.option) return opt.option;
      return "";
    });
  }

  return ["", ""];
};

export default function EditQuizLecture() {
  const navigate = useNavigate();
  const {courseId, quizId} = useParams();
  const {error, formData, syncCourseToFormData} = useCourseContext();
  const {
    loadCourse,
    updateQuiz,
    addQuestionsToQuiz,
    getQuizQuestions,
    deleteQuestion,
    updateQuestion: updateQuestionAPI,
    state: {isSubmitting},
  } = useCourse();

  // State
  const [quizTitle, setQuizTitle] = useState("");
  const [originalQuizTitle, setOriginalQuizTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [originalQuestions, setOriginalQuestions] = useState<QuizQuestion[]>(
    [],
  );
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);

  // Helper function to check if question has changed
  const hasQuestionChanged = (
    current: QuizQuestion,
    original: QuizQuestion,
  ) => {
    return (
      current.question !== original.question ||
      current.correctAnswer !== original.correctAnswer ||
      current.explanation !== original.explanation ||
      current.marks !== original.marks ||
      JSON.stringify(current.options) !== JSON.stringify(original.options)
    );
  };

  // Validate quiz before saving
  const validateQuiz = () => {
    if (!quizTitle.trim()) {
      toast.error("Quiz title is required");
      return false;
    }

    if (questions.length === 0) {
      toast.error("At least one question is required");
      return false;
    }

    // Check each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      // Check if question text is empty
      if (!question.question.trim()) {
        toast.error(`Question ${i + 1}: Question text is required`);
        return false;
      }

      // Check if correct answer is selected
      if (!question.correctAnswer.trim()) {
        toast.error(`Question ${i + 1}: Please select a correct answer`);
        return false;
      }

      // Check if correct answer exists in options
      if (!question.options.includes(question.correctAnswer)) {
        toast.error(
          `Question ${i + 1}: Selected correct answer must be one of the options`,
        );
        return false;
      }

      // Check if all options are filled
      const emptyOptions = question.options.filter((opt) => !opt.trim());
      if (emptyOptions.length > 0) {
        toast.error(`Question ${i + 1}: All answer options must be filled`);
        return false;
      }

      // Check minimum options
      if (question.options.length < 2) {
        toast.error(
          `Question ${i + 1}: At least 2 answer options are required`,
        );
        return false;
      }
    }

    return true;
  };

  // Save quiz
  const handleSaveQuiz = async () => {
    if (!quizId) {
      toast.error("Quiz ID is required");
      return;
    }

    // Validate quiz before saving
    if (!validateQuiz()) {
      return;
    }

    try {
      let hasChanges = false;

      // 1. Update quiz title only if changed
      if (quizTitle !== originalQuizTitle) {
        const updated = await updateQuiz(quizId, {title: quizTitle});
        if (!updated) {
          toast.error("Failed to update quiz title");
          return;
        }
        hasChanges = true;
      }

      // 2. Update individual questions that have changed
      for (const currentQuestion of questions) {
        const originalQuestion = originalQuestions.find(
          (q) => q.id === currentQuestion.id,
        );

        if (
          originalQuestion &&
          hasQuestionChanged(currentQuestion, originalQuestion)
        ) {
          const questionData = {
            question: currentQuestion.question,
            options: JSON.stringify(
              currentQuestion.options.map((opt) => ({option: opt})),
            ),
            correctAnswer: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            marks: currentQuestion.marks,
            type: "SINGLE_CHOICE",
          };

          const success = await updateQuestionAPI(
            currentQuestion.id,
            questionData,
          );
          if (!success) {
            toast.error(
              `Failed to update question: ${currentQuestion.question.substring(0, 30)}...`,
            );
            return;
          }
          hasChanges = true;
        }
      }

      if (hasChanges) {
        toast.success("Quiz saved successfully!");

        // Update original values for next comparison
        setOriginalQuizTitle(quizTitle);
        setOriginalQuestions([...questions]);

        // Reload course data
        const updatedCourse = await loadCourse(courseId!);
        if (updatedCourse) {
          syncCourseToFormData(updatedCourse);
        }
        navigate(`/instructor/courses/${courseId!}/edit/curriculum`);
      } else {
        toast.info("No changes to save");
      }
    } catch {
      toast.error("Error saving quiz");
    }
  };

  // Load quiz data
  useEffect(() => {
    const loadQuizData = async () => {
      if (!quizId) return;

      setIsLoadingQuestions(true);
      try {
        // Get quiz title from formData
        let title = "";
        if (formData.chapters) {
          const allLessons = formData.chapters.flatMap((c) => c.lessons || []);
          const lessonWithQuiz = allLessons.find(
            (l) => l.quizDto?.id === quizId,
          );
          if (lessonWithQuiz?.quizDto) {
            title = lessonWithQuiz.quizDto.title || "";
          }
        }
        setQuizTitle(title);
        setOriginalQuizTitle(title);

        // Load questions
        const quizQuestions = await getQuizQuestions(quizId);
        if (quizQuestions?.length > 0) {
          const loadedQuestions = quizQuestions.map((q: any) => {
            return {
              id: q.id,
              question: q.question,
              options: parseOptionsFromBackend(q.options),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || "",
              marks: q.marks || 1,
            };
          });
          setQuestions(loadedQuestions);
          setOriginalQuestions(loadedQuestions);
        } else {
          setOriginalQuestions([]);
        }
      } catch {
        toast.error("Failed to load quiz");
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuizData();
  }, [quizId, formData.chapters, getQuizQuestions]);

  // Add new question
  const addQuestion = async () => {
    if (!quizId) {
      toast.error("Quiz ID is required");
      return;
    }

    try {
      setIsLoadingQuestions(true);

      // Create empty question to send to API
      const emptyQuestion = {
        question: "",
        options: JSON.stringify([{option: ""}, {option: ""}]),
        correctAnswer: "",
        explanation: "",
        marks: 1,
      };

      // Call API to add question
      const success = await addQuestionsToQuiz(quizId, [emptyQuestion]);
      if (!success) {
        toast.error("Failed to add question");
        return;
      }

      // Fetch updated questions from server
      const updatedQuestions = await getQuizQuestions(quizId);
      if (updatedQuestions) {
        const loadedQuestions = updatedQuestions.map((q: any) => {
          return {
            id: q.id,
            question: q.question,
            options: parseOptionsFromBackend(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "",
            marks: q.marks || 1,
          };
        });
        setQuestions(loadedQuestions);
        setOriginalQuestions(loadedQuestions);
      }

      toast.success("Question added successfully");
    } catch {
      toast.error("Error adding question");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;

    setIsDeletingQuestion(true);
    try {
      const question = questions.find((q) => q.id === questionToDelete);
      if (!question) {
        toast.error("Question not found");
        return;
      }

      // Always call delete API for existing questions
      const success = await deleteQuestion(question.id);
      if (!success) {
        toast.error("Failed to delete question from server");
        return;
      }

      // Fetch updated questions from server to ensure consistency
      const updatedQuestions = await getQuizQuestions(quizId!);
      if (updatedQuestions) {
        const loadedQuestions = updatedQuestions.map((q: any) => ({
          id: q.id,
          question: q.question,
          options: parseOptionsFromBackend(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || "",
          marks: q.marks || 1,
        }));
        setQuestions(loadedQuestions);
        setOriginalQuestions(loadedQuestions);
      } else {
        // If no questions left, clear the arrays
        setQuestions([]);
        setOriginalQuestions([]);
      }

      toast.success("Question deleted successfully");
    } catch {
      toast.error("Error deleting question");
    } finally {
      setIsDeletingQuestion(false);
      setDeleteModalOpen(false);
      setQuestionToDelete(null);
    }
  };

  // Update question field
  const updateQuestion = (
    questionId: string,
    field: keyof QuizQuestion,
    value: any,
  ) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? {...q, [field]: value} : q)),
    );
  };

  // Update option
  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return {...q, options: newOptions};
        }
        return q;
      }),
    );
  };

  // Add option
  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? {...q, options: [...q.options, ""]} : q,
      ),
    );
  };

  // Remove option
  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const optionToRemove = q.options[optionIndex];
          const filtered = q.options.filter((_, idx) => idx !== optionIndex);
          const nextCorrect =
            q.correctAnswer === optionToRemove
              ? filtered[0] || ""
              : q.correctAnswer;
          return {...q, options: filtered, correctAnswer: nextCorrect};
        }
        return q;
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <button
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
        onClick={() =>
          navigate(`/instructor/courses/${courseId}/edit/curriculum`)
        }
      >
        ← Back to curriculum
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-5xl mx-auto shadow-xl">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="text-center mb-8">
          <Heading3 className="text-2xl font-bold text-gray-900 mb-2">
            {quizId ? "Edit Quiz Lecture" : "Create Quiz Lecture"}
          </Heading3>
          <p className="text-gray-600">
            Create engaging quiz questions to test your students' knowledge
          </p>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz title <span className="text-red-500">*</span>
            </label>
            <Input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="w-full"
            />
            {!quizTitle.trim() && (
              <p className="mt-1 text-xs text-red-600">Title is required</p>
            )}
          </div>

          {/* Questions */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Questions <span className="text-red-500">*</span>
              </label>
            </div>

            {isLoadingQuestions ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <HelpCircle size={32} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No questions yet
                  </h3>
                  <p className="text-gray-500 mb-4 max-w-md">
                    Start building your quiz by adding questions. Each question
                    can have multiple choice answers with explanations.
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    leftIcon={<Plus size={18} />}
                    onClick={addQuestion}
                    disabled={isLoadingQuestions}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200 border-0"
                  >
                    {isLoadingQuestions
                      ? "Adding Question..."
                      : "Add Your First Question"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Question {index + 1}
                        </h4>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={isDeletingQuestion}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 border-red-200"
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Question Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                      {/* Question Text */}
                      <div className="lg:col-span-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Question Text <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "question",
                              e.target.value,
                            )
                          }
                          placeholder="Enter your question here..."
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 ${
                            !question.question.trim()
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          rows={3}
                        />
                        {!question.question.trim() && (
                          <p className="mt-1 text-xs text-red-600">
                            Question text is required
                          </p>
                        )}
                      </div>

                      {/* Marks */}
                      <div className="lg:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Points
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={question.marks}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "marks",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            placeholder="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-400 text-sm">pts</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Answer Options */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Answer Options <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <QuestionOption
                            key={optionIndex}
                            option={option}
                            optionIndex={optionIndex}
                            isSelected={question.correctAnswer === option}
                            onSelect={() =>
                              updateQuestion(
                                question.id,
                                "correctAnswer",
                                option,
                              )
                            }
                            onOptionChange={(value) =>
                              updateOption(question.id, optionIndex, value)
                            }
                            onRemove={
                              question.options.length > 2
                                ? () => removeOption(question.id, optionIndex)
                                : undefined
                            }
                            canRemove={question.options.length > 2}
                          />
                        ))}

                        {/* Validation messages */}
                        {!question.correctAnswer.trim() && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-xs text-red-600">
                              Please select a correct answer
                            </p>
                          </div>
                        )}

                        {question.options.some((opt) => !opt.trim()) && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-xs text-red-600">
                              All answer options must be filled
                            </p>
                          </div>
                        )}

                        <div className="flex justify-center pt-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            leftIcon={<Plus size={16} />}
                            onClick={() => addOption(question.id)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200"
                          >
                            Add Another Option
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <div className="flex items-center gap-2">
                          <HelpCircle size={16} className="text-blue-500" />
                          Explanation (Optional)
                        </div>
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "explanation",
                            e.target.value,
                          )
                        }
                        placeholder="Provide an explanation for why this is the correct answer. This will help students learn from their mistakes."
                        className="w-full px-4 py-3 border border-blue-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}

                {/* Add Question Button - Now at the bottom */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    leftIcon={<Plus size={18} />}
                    onClick={addQuestion}
                    disabled={isLoadingQuestions}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200 border-0"
                  >
                    {isLoadingQuestions
                      ? "Adding Question..."
                      : "Add New Question"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {questions.length} question{questions.length !== 1 ? "s" : ""}{" "}
              added
            </div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  navigate(`/instructor/courses/${courseId}/edit/curriculum`)
                }
                className="px-6 py-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveQuiz}
                disabled={
                  !quizTitle.trim() ||
                  questions.length === 0 ||
                  questions.some(
                    (q) =>
                      !q.question.trim() ||
                      !q.correctAnswer.trim() ||
                      q.options.some((opt) => !opt.trim()),
                  ) ||
                  isSubmitting ||
                  isLoadingQuestions
                }
                className="px-8 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                {isSubmitting
                  ? "Saving Quiz..."
                  : isLoadingQuestions
                    ? "Loading..."
                    : "Save Quiz"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          if (!isDeletingQuestion) {
            setDeleteModalOpen(false);
            setQuestionToDelete(null);
          }
        }}
        title="Delete Question"
        size="sm"
        closeOnOverlayClick={!isDeletingQuestion}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setQuestionToDelete(null);
                }}
                disabled={isDeletingQuestion}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmDeleteQuestion}
                disabled={isDeletingQuestion}
                className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingQuestion ? "Deleting..." : "Delete Question"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
