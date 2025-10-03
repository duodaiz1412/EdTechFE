import {useState} from "react";
import {useNavigate} from "react-router";
import {ArrowLeft, Settings} from "lucide-react";
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
    let content;
    switch (activeSection) {
      case "intended-learners":
        content = <IntendedLearnersContent />;
        break;
      case "settings":
        content = <CourseSettingsContent />;
        break;
      case "course-structure":
        content = <CourseStructureContent />;
        break;
      case "setup-test":
        content = (
          <div className="text-center text-gray-500">
            Setup & test video content coming soon...
          </div>
        );
        break;
      case "film-edit":
        content = <FilmEditContent />;
        break;
      case "curriculum":
        content = <CurriculumContent />;
        break;
      case "caption":
        content = <CaptionContent />;
        break;
      case "accessibility":
        content = <AccessibilityContent />;
        break;
      case "landing-page":
        content = <LandingPageContent />;
        break;
      case "pricing":
        content = <PricingContent />;
        break;
      case "promotions":
        content = <PromotionsContent />;
        break;
      case "messages":
        content = <CourseMessagesContent />;
        break;
      default:
        content = (
          <div className="text-center text-gray-500">
            Content for {activeSection} coming soon...
          </div>
        );
    }
    return <div className="px-10 py-6">{content}</div>;
  };

  return (
    <div className="min-h-screen bg-white">
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
              leftIcon={<Settings size={16} />}
              onClick={() => setActiveSection("settings")}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex px-32 gap-4">
        {/* Sidebar Navigation */}
        <div className="w-1/5 bg-white min-h-screen">
          <div className="px-6 py-12">
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
        <div className="flex-1 mt-4 mb-20 bg-white border border-[#D9D9D9] rounded-lg">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
