import Input from "@/components/Input";
import {useState} from "react";

interface BasicInfoStepProps {
  type: "course" | "batch";
  title: string;
  onTitleChange: (title: string) => void;
  titleError?: string | null;
  titlePlaceholder?: string;
  heading?: string;
  subheading?: string;
}

export default function BasicInfoStep({
  type,
  title,
  onTitleChange,
  titleError,
  titlePlaceholder = "E.g: Learn Photoshop CS6 from scratch",
}: BasicInfoStepProps) {
  const [titleFocused, setTitleFocused] = useState(false);

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          How about a working title for your {type}?
        </h2>
        <p className="text-lg text-gray-600">
          It's ok if you can't think of a good title now. You can change it
          later.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onFocus={() => setTitleFocused(true)}
          placeholder={titlePlaceholder}
          className="w-full text-center text-lg py-3 focus:outline-none focus:ring-1 focus:border-gray-300"
        />
        {titleFocused && titleError && (
          <p className="text-red-500 text-sm mt-1 text-left">{titleError}</p>
        )}
      </div>
    </div>
  );
}
