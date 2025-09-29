import {useState} from "react";
import {Plus, Trash2} from "lucide-react";
import Button from "@/components/Button";
import {Heading3} from "@/components/Typography";

export default function IntendedLearnersContent() {
  const [learningObjectives, setLearningObjectives] = useState([
    "Content 1",
    "Content 2",
    "Content 3",
  ]);
  const [requirements, setRequirements] = useState([
    "Requirement 1",
    "Requirement 2",
  ]);
  const [targetAudience, setTargetAudience] = useState([
    "Learner 1",
    "Learner 2",
  ]);

  const addItem = (setter: any, placeholder: string) => {
    setter((prev: string[]) => [...prev, placeholder]);
  };

  const removeItem = (setter: any, index: number) => {
    setter((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (setter: any, index: number, value: string) => {
    setter((prev: string[]) =>
      prev.map((item, i) => (i === index ? value : item)),
    );
  };

  return (
    <div className="p-8">
      <Heading3 className="mb-6">Intended Learners</Heading3>

      <div className="space-y-8">
        {/* What will students learn */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            What will students learn in your course?
          </h4>
          <div className="space-y-3">
            {learningObjectives.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    updateItem(setLearningObjectives, index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => removeItem(setLearningObjectives, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() =>
                addItem(setLearningObjectives, "E.g: Self-discipline")
              }
              className="text-blue-600 hover:text-blue-700"
            >
              Add more to your response
            </Button>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            What are the requirements or prerequisites for taking your course?
          </h4>
          <div className="space-y-3">
            {requirements.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    updateItem(setRequirements, index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => removeItem(setRequirements, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() => addItem(setRequirements, "New requirement")}
              className="text-blue-600 hover:text-blue-700"
            >
              Add more to your response
            </Button>
          </div>
        </div>

        {/* Target audience */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Who is this course for?
          </h4>
          <div className="space-y-3">
            {targetAudience.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    updateItem(setTargetAudience, index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => removeItem(setTargetAudience, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() => addItem(setTargetAudience, "New learner type")}
              className="text-blue-600 hover:text-blue-700"
            >
              Add more to your response
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
