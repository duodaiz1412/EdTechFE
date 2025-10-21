import {Trash2} from "lucide-react";

interface QuestionOptionProps {
  option: string;
  optionIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onOptionChange: (value: string) => void;
  onRemove?: () => void;
  canRemove: boolean;
}

export default function QuestionOption({
  option,
  optionIndex,
  isSelected,
  onSelect,
  onOptionChange,
  onRemove,
  canRemove,
}: QuestionOptionProps) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const letter = letters[optionIndex] || String.fromCharCode(65 + optionIndex);

  const handleChange = (value: string) => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length <= 500) {
      onOptionChange(value);
    }
  };

  return (
    <div
      className={`
        group relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? "border-gray-600 bg-white shadow-md"
            : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
        }
      `}
      onClick={onSelect}
    >
      {/* Option Letter Badge */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200
          ${
            isSelected
              ? "bg-gray-800 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
          }
        `}
      >
        {letter}
      </div>

      {/* Input Field */}
      <div className="flex-1">
        <textarea
          value={option}
          onChange={(e) => handleChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder={`Option ${letter}`}
          rows={1}
          className={`
            w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-0 transition-all duration-200 border resize-none overflow-hidden
            ${
              isSelected
                ? "bg-white text-gray-900 focus:ring-gray-400 border-gray-300 placeholder-gray-400"
                : "bg-white text-gray-900 focus:ring-gray-400 border-gray-300 placeholder-gray-400"
            }
          `}
          style={{
            minHeight: "42px",
            height: "auto",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
        />
      </div>

      {/* Remove Button */}
      {canRemove && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
            text-gray-400 hover:text-gray-600 hover:bg-gray-100
            opacity-0 group-hover:opacity-100
          `}
          title="Remove option"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
