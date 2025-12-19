interface TimeStepProps {
  timeCommitment: string;
  updateFormData: (data: {timeCommitment: string}) => void;
}

const timeOptions = [
  {value: "0-2", label: "I'm very busy right now (0-2 hours)"},
  {value: "2-4", label: "I work on the side (2-4 hours)"},
  {value: "5+", label: "I have lots of flexibility (5+ hours)"},
  {value: "undecided", label: "I haven't decided yet if I have time"},
  {value: "", label: "Skip this step (optional)"},
];

export default function TimeStep({
  timeCommitment,
  updateFormData,
}: TimeStepProps) {
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          How much time can you spend creating your course per week?
        </h2>
        <p className="text-lg text-gray-600">
          This is optional. We can help you achieve your goals even if you don't
          have much time.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {timeOptions.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              timeCommitment === option.value
                ? "border-gray-800 bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="timeCommitment"
              value={option.value}
              checked={timeCommitment === option.value}
              onChange={(e) => updateFormData({timeCommitment: e.target.value})}
              className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-gray-800"
            />
            <span className="ml-3 text-left text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
