import {learnerServices} from "@/lib/services/learner.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {Quiz, QuizQuestion, QuizSubmmission} from "@/types";
import {ChevronsLeft, ChevronsRight} from "lucide-react";
import {useState} from "react";

interface CourseLessonQuizProps {
  quiz?: Quiz;
  completeLesson?: () => void;
}

export default function CourseLessonQuiz({
  quiz,
  completeLesson,
}: CourseLessonQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completePercentage, setCompletePercentage] = useState(0);

  const [isDoing, setIsDoing] = useState(false);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  const [haveResult, setHaveResult] = useState(false);
  const [result, setResult] = useState<QuizSubmmission>();

  const fetchQuestions = async () => {
    const accessToken = await getAccessToken();
    const response = await learnerServices.getQuizQuestions(
      accessToken,
      quiz?.id,
    );
    setQuestions(response.questions || []);
    setIsDoing(true);
  };

  const setCurrentAnswer = (questionId: string, answer: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = {...prevAnswers, [questionId]: answer};
      setCompletePercentage(
        (Object.keys(newAnswers).length / questions.length) * 100,
      );
      return newAnswers;
    });
  };

  const submitQuiz = async () => {
    const accessToken = await getAccessToken();
    const response = await learnerServices.submitQuiz(
      accessToken,
      quiz?.id,
      answers,
    );
    setIsDoing(false);
    setHaveResult(true);
    setResult(response);
    if (completeLesson) {
      completeLesson();
    }
  };

  const resetQuiz = () => {
    setIsDoing(true);
    setHaveResult(false);
    setCurrentIdx(0);
    setAnswers({});
    setResult(undefined);
    setCompletePercentage(0);
  };

  return (
    <div className="w-5/6 bg-white p-6 h-[600px] relative overflow-y-scroll">
      {/* Fetch questions */}
      {!isDoing && !haveResult && (
        <div className=" h-full flex flex-col justify-center items-center space-y-4">
          <h3 className="text-2xl font-semibold">{quiz?.title}</h3>
          <button
            className="btn btn-neutral rounded-lg w-96"
            onClick={fetchQuestions}
          >
            Start quiz
          </button>
        </div>
      )}
      {/* Main quiz  */}
      {isDoing && (
        <>
          <div>
            <h3 className="font-semibold text-xl mb-6">
              Question {currentIdx + 1}: {questions[currentIdx].question}
            </h3>
            <div className="space-y-4">
              {questions[currentIdx].options &&
                JSON.parse(questions[currentIdx].options).map(
                  (opt: {option: string}) => (
                    <div
                      key={opt.option}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name={`question-${questions[currentIdx].id}`}
                        className="radio radio-neutral"
                        value={opt.option}
                        onChange={(e) =>
                          setCurrentAnswer(
                            questions[currentIdx].id!,
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
                className="btn btn-sm rounded-lg"
                disabled={currentIdx == 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
              >
                <ChevronsLeft size={16} />
                <span>Prev</span>
              </button>
              <button
                className="btn btn-sm rounded-lg"
                disabled={currentIdx == questions.length - 1}
                onClick={() => setCurrentIdx(currentIdx + 1)}
              >
                <span>Next</span>
                <ChevronsRight size={16} />
              </button>
              <button
                className="btn btn-sm btn-neutral rounded-lg"
                disabled={completePercentage < 50}
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
        <div className="space-y-4">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl font-semibold">{quiz?.title}</h3>
            <p>
              Result:{" "}
              <span className="font-semibold">{result?.percentage}%</span>
            </p>
            <button className="btn btn-neutral w-96" onClick={resetQuiz}>
              Retake quiz
            </button>
          </div>
          {questions.map((question, idx) => (
            <div
              key={question.id}
              className="px-6 py-4 border border-slate-400 bg-slate-50 rounded-lg space-y-3"
            >
              <h4 className="font-semibold text-lg mb-4">
                Question {idx + 1}: {question.question}
              </h4>
              {question.options &&
                JSON.parse(question.options).map((opt: {option: string}) => {
                  const isYourAnswer = opt.option === answers[question.id!];
                  const isCorrectAnswer = opt.option === question.correctAnswer;
                  return (
                    <div
                      key={opt.option}
                      className={`p-2 rounded-md border ${isYourAnswer ? (isCorrectAnswer ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : "border-slate-400"}`}
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
