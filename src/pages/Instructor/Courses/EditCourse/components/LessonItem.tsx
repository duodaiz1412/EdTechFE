import Button from "@/components/Button";
import {
  Edit3,
  Trash2,
  PlayCircle,
  HelpCircle,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import {CourseItem} from "@/context/CourseContext";

interface LessonItemProps {
  chapterId: string;
  item: CourseItem;
  onEdit: (chapterId: string, itemId: string) => void;
  onDelete: (chapterId: string, itemId: string) => void;
}

const getItemIcon = (item: CourseItem) => {
  if (item.videoUrl) return <PlayCircle size={20} />;
  if (item.quizDto) return <HelpCircle size={20} />;
  if (item.content) return <ClipboardList size={20} />;
  return <PlayCircle size={20} />;
};

export default function LessonItem({
  chapterId,
  item,
  onEdit,
  onDelete,
}: LessonItemProps) {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!item) {
    return (
      <div className="border border-gray-200 rounded-lg">
        <div 
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </span>
            <div>
              <p className="font-medium text-red-500">Invalid item data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasContent = item.videoUrl || item.quizDto || item.content;

  return (
    <div className="border border-gray-200 rounded-lg">
      {/* Header - Always visible */}
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </span>
          <span className="text-lg">{getItemIcon(item)}</span>
          <div>
            <p className="font-medium text-gray-900">
              Lesson {item.position}: {item.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit3 size={14} />}
              onClick={() => onEdit(chapterId, item.id || "")}
              className="text-green-600 hover:text-green-700"
            >
              Edit
            </Button>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={() => onDelete(chapterId, item.id || "")}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-200">
          {hasContent ? (
            <div className="space-y-4">
              {/* Existing content preview */}
              {item.videoUrl && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <PlayCircle size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Video Content</p>
                    <p className="text-sm text-blue-700">Video lesson uploaded</p>
                  </div>
                </div>
              )}
              
              {item.quizDto && (
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <HelpCircle size={20} className="text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Quiz Content</p>
                    <p className="text-sm text-purple-700">Quiz questions configured</p>
                  </div>
                </div>
              )}
              
              {item.content && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <ClipboardList size={20} className="text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Article Content</p>
                    <p className="text-sm text-green-700">Article content written</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">No content added yet. Choose a content type:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Add Video */}
                  <div 
                    className="flex flex-col items-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/instructor/courses/${courseId}/edit/lecture/video/${item.id}`)}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <PlayCircle size={24} className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">+ Video</h3>
                    <p className="text-sm text-gray-500 text-center">Upload video lesson</p>
                  </div>

                  {/* Add Article */}
                  <div 
                    className="flex flex-col items-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/instructor/courses/${courseId}/edit/lecture/article/${item.id}`)}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <FileText size={24} className="text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">+ Article</h3>
                    <p className="text-sm text-gray-500 text-center">Upload article file</p>
                  </div>

                  {/* Add Quiz */}
                  <div 
                    className="flex flex-col items-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/instructor/courses/${courseId}/edit/lecture/quiz/${item.id}`)}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <HelpCircle size={24} className="text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">+ Quiz</h3>
                    <p className="text-sm text-gray-500 text-center">Create quiz questions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
