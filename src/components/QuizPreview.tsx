import {useState, useEffect} from "react";
import {HelpCircle, Edit3} from "lucide-react";
import {instructorServices} from "@/lib/services/instructor.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {QuizQuestion} from "@/types";
import Button from "@/components/Button";

interface QuizPreviewProps {
  quizId: string;
  quizTitle: string;
  onEdit: () => void;
}

export default function QuizPreview({
  quizId,
  quizTitle,
  onEdit,
}: QuizPreviewProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!quizId) return;

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      const response = await instructorServices.getQuizQuestions(
        quizId,
        accessToken,
      );

      const questionsData = response.data || [];
      // Lưu tổng số câu hỏi
      setTotalQuestions(questionsData.length);
      // Chỉ lấy 2 câu hỏi đầu tiên để preview
      setQuestions(questionsData.slice(0, 2));
    } catch {
      setError("Failed to load quiz questions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderQuestionPreview = (question: QuizQuestion, index: number) => {
    if (!question.options) return null;

    try {
      const options = JSON.parse(question.options);
      return (
        <div
          key={question.id}
          className="mb-4 p-3 bg-white rounded-lg border border-purple-200"
        >
          <h4 className="font-medium text-gray-900 mb-2">
            Question {index + 1}: {question.question}
          </h4>
          <div className="space-y-2">
            {options
              .slice(0, 2)
              .map((opt: {option: string}, optIndex: number) => (
                <div
                  key={optIndex}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                  <span className="text-gray-700">{opt.option}</span>
                </div>
              ))}
            {options.length > 2 && (
              <div className="text-xs text-gray-500 italic">
                +{options.length - 2} more options...
              </div>
            )}
          </div>
        </div>
      );
    } catch {
      return (
        <div
          key={question.id}
          className="mb-4 p-3 bg-white rounded-lg border border-red-200"
        >
          <h4 className="font-medium text-gray-900 mb-2">
            Question {index + 1}: {question.question}
          </h4>
          <p className="text-sm text-red-500">Invalid question format</p>
        </div>
      );
    }
  };

  return (
    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <HelpCircle size={20} className="text-purple-600" />
          <div>
            <p className="font-medium text-purple-900">{quizTitle}</p>
            <p className="text-sm text-purple-700">
              {totalQuestions} question(s) total
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Edit3 size={14} />}
            onClick={onEdit}
            className="text-purple-700 hover:text-purple-800"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Questions Preview */}
      <div className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="loading loading-spinner loading-sm"></div>
            <span className="ml-2 text-sm text-gray-600">
              Loading questions...
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchQuestions}
              className="mt-2 text-red-600 border-red-300"
            >
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !error && questions.length === 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              No questions available yet
            </p>
          </div>
        )}

        {!isLoading && !error && questions.length > 0 && (
          <div>
            <p className="text-xs text-purple-600 mb-2 font-medium">
              Preview (showing first 2 questions):
            </p>
            {questions.map((question, index) =>
              renderQuestionPreview(question, index),
            )}

            {totalQuestions > 2 && (
              <div className="text-xs text-gray-500 italic mt-2">
                +{totalQuestions - 2} more questions in full quiz...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
