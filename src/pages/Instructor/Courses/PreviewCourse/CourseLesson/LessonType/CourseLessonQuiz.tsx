import {instructorServices} from "@/lib/services/instructor.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {Quiz, QuizQuestion, QuizSubmmission} from "@/types";
import {useState} from "react";

interface CourseLessonQuizProps {
  quiz?: Quiz;
}

export default function CourseLessonQuiz({quiz}: CourseLessonQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [isDoing, setIsDoing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  const [haveResult, setHaveResult] = useState(false);
  const [result, setResult] = useState<QuizSubmmission>();

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const accessToken = await getAccessToken();
      const response = await instructorServices.getQuizQuestions(
        quiz?.id || "",
        accessToken,
      );
      const questionsData = response.data || [];
      setQuestions(questionsData);

      if (questionsData.length > 0) {
        setIsDoing(true);
      }
    } catch {
      // Preview mode - không có questions
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentAnswer = (questionId: string, answer: string) => {
    setAnswers((answers) => ({...answers, [questionId]: answer}));
  };

  const submitQuiz = async () => {
    // Instructor preview mode - simulate quiz completion
    setIsDoing(false);
    setHaveResult(true);
    setResult({
      id: "preview-result",
      percentage: Math.floor(Math.random() * 40) + 60, // Random score 60-100%
    } as QuizSubmmission);
  };

  const resetQuiz = () => {
    setIsDoing(true);
    setHaveResult(false);
    setCurrentIdx(0);
    setAnswers({});
    setResult(undefined);
  };

  return (
    <div className="w-5/6 bg-white p-6 h-[600px] relative overflow-y-auto custom-scrollbar">
      {/* Fetch questions */}
      {!isDoing && !haveResult && !isLoading && (
        <div className=" h-full flex flex-col justify-center items-center space-y-4">
          <h3 className="text-lg font-semibold">{quiz?.title}</h3>
          <button className="btn btn-neutral w-96" onClick={fetchQuestions}>
            Start quiz
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="h-full flex flex-col justify-center items-center space-y-4">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="text-gray-600">Loading quiz questions...</p>
        </div>
      )}
      {/* No questions message */}
      {!isLoading && isDoing && questions.length === 0 && (
        <div className="h-full flex flex-col justify-center items-center space-y-4">
          <h3 className="text-lg font-semibold">No questions available</h3>
          <p className="text-gray-600">
            This quiz doesn't have any questions yet.
          </p>
          <button className="btn btn-neutral" onClick={() => setIsDoing(false)}>
            Back
          </button>
        </div>
      )}

      {/* Main quiz  */}
      {isDoing && questions.length > 0 && questions[currentIdx] && (
        <>
          <div>
            <h3 className="font-semibold text-xl mb-6">
              Question {currentIdx + 1}: {questions[currentIdx]?.question}
            </h3>
            <div className="space-y-4">
              {questions[currentIdx]?.options &&
                JSON.parse(questions[currentIdx].options).map(
                  (opt: {option: string}) => (
                    <div
                      key={opt.option}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name="question"
                        className="radio radio-neutral"
                        value={opt.option}
                        onChange={(e) =>
                          setCurrentAnswer(
                            questions[currentIdx]?.id || "",
                            e.target.value,
                          )
                        }
                      />
                      <span>{opt.option}</span>
                    </div>
                  ),
                )}
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
            <progress
              className="progress progress-neutral w-56"
              value={currentIdx + 1}
              max={questions.length}
            ></progress>
            <div className="space-x-2">
              <button
                className="btn btn-sm"
                disabled={currentIdx == 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
              >
                Prev
              </button>
              <button
                className="btn btn-sm"
                disabled={currentIdx == questions.length - 1}
                onClick={() => setCurrentIdx(currentIdx + 1)}
              >
                Next
              </button>
              <button
                className="btn btn-sm btn-neutral"
                disabled={Object.keys(answers).length != questions.length}
                onClick={submitQuiz}
              >
                Submit quiz
              </button>
            </div>
          </div>
        </>
      )}
      {/* Result */}
      {!isDoing && haveResult && (
        <div className="space-y-4 pb-20">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-lg font-semibold">{quiz?.title}</h3>
            <p>Result: {result?.percentage}%</p>
            <button className="btn btn-neutral w-96" onClick={resetQuiz}>
              Retake quiz
            </button>
          </div>
          {questions.map((question, idx) => (
            <div
              key={question.id}
              className="p-4 border border-slate-300 rounded-lg space-y-2"
            >
              <h4>
                Question {idx + 1}: {question.question}
              </h4>
              {question.options &&
                JSON.parse(question.options).map((opt: {option: string}) => {
                  const isYourAnswer = opt.option === answers[question.id!];
                  const isCorrectAnswer = opt.option === question.correctAnswer;
                  return (
                    <div
                      key={opt.option}
                      className={`p-2 rounded-md border ${isYourAnswer ? (isCorrectAnswer ? "border-green-500" : "border-red-500") : "border-slate-300"}`}
                    >
                      <span className={`${isYourAnswer && "font-semibold"}`}>
                        {opt.option}
                      </span>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
