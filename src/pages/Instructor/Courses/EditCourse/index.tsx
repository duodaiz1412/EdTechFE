import {useState} from "react";
import {useNavigate} from "react-router";
import {ArrowLeft, Settings, Eye} from "lucide-react";
import Button from "@/components/Button";
import {Heading2} from "@/components/Typography";
import Chip from "@/components/Chip";
import IntendedLearnersContent from "./components/IntendedLearnersContent";
import CurriculumContent from "./components/CurriculumContent";
import CourseStructureContent from "./components/CourseStructureContent";
import FilmEditContent from "./components/FilmEditContent";
import CaptionContent from "./components/CaptionContent";
import AccessibilityContent from "./components/AccessibilityContent";
import LandingPageContent from "./components/LandingPageContent";
import PricingContent from "./components/PricingContent";
import PromotionsContent from "./components/PromotionsContent";
import CourseMessagesContent from "./components/CourseMessagesContent";
import CourseSettingsContent from "./components/CourseSettingsContent";

const navigationItems = [
  {
    section: "Plan your course",
    items: [
      {id: "intended-learners", label: "Intended learners", active: true},
      {id: "course-structure", label: "Course structure"},
      {id: "setup-test", label: "Setup & test video"},
    ],
  },
  {
    section: "Create your content",
    items: [
      {id: "film-edit", label: "Film & edit"},
      {id: "curriculum", label: "Curriculum"},
      {id: "caption", label: "Caption (optional)"},
      {id: "accessibility", label: "Accessibility (optional)"},
    ],
  },
  {
    section: "Publish your course",
    items: [
      {id: "landing-page", label: "Course landing page"},
      {id: "pricing", label: "Pricing"},
      {id: "promotions", label: "Promotions"},
      {id: "messages", label: "Course messages"},
    ],
  },
];

export default function EditCourse() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("intended-learners");

  const renderContent = () => {
    switch (activeSection) {
      case "intended-learners":
        return <IntendedLearnersContent />;
      case "settings":
        return <CourseSettingsContent />;
      case "course-structure":
        return <CourseStructureContent />;
      case "setup-test":
        return (
          <div className="p-8 text-center text-gray-500">
            Setup & test video content coming soon...
          </div>
        );
      case "film-edit":
        return <FilmEditContent />;
      case "curriculum":
        return <CurriculumContent />;
      case "caption":
        return <CaptionContent />;
      case "accessibility":
        return <AccessibilityContent />;
      case "landing-page":
        return <LandingPageContent />;
      case "pricing":
        return <PricingContent />;
      case "promotions":
        return <PromotionsContent />;
      case "messages":
        return <CourseMessagesContent />;
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            Content for {activeSection} coming soon...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate("/instructor")}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to courses
            </Button>
            <div className="flex items-center gap-3">
              <Heading2>Course name</Heading2>
              <Chip variant="warning">Draft</Chip>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              leftIcon={<Eye size={16} />}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Preview
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Settings size={16} />}
              onClick={() => setActiveSection("settings")}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-white border-r min-h-screen">
          <div className="p-6">
            {navigationItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {section.section}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">{renderContent()}</div>
      </div>
    </div>
  );
}
