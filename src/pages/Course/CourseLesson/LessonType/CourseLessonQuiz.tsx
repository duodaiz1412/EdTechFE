import {learnerServices} from "@/lib/services/learner.services";
import {getAccessToken} from "@/lib/utils/getAccessToken";
import {Quiz, QuizQuestion, QuizSubmmission} from "@/types";
import {useState} from "react";

export default function CourseLessonQuiz({quiz}: {quiz?: Quiz}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

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
    setAnswers((answers) => ({...answers, [questionId]: answer}));
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
  };

  const resetQuiz = () => {
    setIsDoing(true);
    setHaveResult(false);
    setCurrentIdx(0);
    setAnswers({});
    setResult(undefined);
  };

  return (
    <div className="w-5/6 bg-white p-6 h-[600px] relative">
      {/* Fetch questions */}
      {!isDoing && !haveResult && (
        <div className=" h-full flex flex-col justify-center items-center space-y-4">
          <h3 className="text-lg font-semibold">{quiz?.title}</h3>
          <button className="btn btn-neutral w-96" onClick={fetchQuestions}>
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
                        name="question"
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
        <div className="space-y-4">
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
