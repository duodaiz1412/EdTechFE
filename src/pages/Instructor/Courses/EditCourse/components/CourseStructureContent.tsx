import {
  Heading3,
  Heading4,
  BodyRegular,
  CaptionRegular,
} from "@/components/Typography";
import {BookOpen, Lightbulb, CheckCircle, ExternalLink} from "lucide-react";

export default function CourseStructureContent() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Heading3 className="text-2xl font-bold text-gray-900 mb-4">
          Course Structure
        </Heading3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Heading4 className="text-xl font-semibold text-blue-900 mb-3">
            Design your course with purpose
          </Heading4>
          <BodyRegular className="text-blue-800 leading-relaxed">
            Thoughtful planning creates a clear learning journey for your
            students and makes content creation much easier. Consider every
            aspect of each lesson including the skills you'll teach, estimated
            video duration, hands-on activities to include, and how you'll craft
            engaging introductions and meaningful summaries.
          </BodyRegular>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mb-8">
        <Heading4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          Expert Tips
        </Heading4>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2">
              Start with clear learning objectives
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Defining specific goals for what students will achieve in your
              course (learning objectives) from the start helps you determine
              what content to include and how to structure your teaching to help
              students reach those goals.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2">
              Create a detailed outline
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Decide what skills you'll teach and how you'll teach them. Group
              related lessons into sections. Each section should have at least 3
              lessons and include at least one assignment or hands-on activity.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2">
              Introduce yourself and build momentum
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Online learners want to start learning quickly. Create an
              introduction section that gives students something exciting to
              look forward to in the first 10 minutes.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2">
              Each section has a clear learning goal
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Introduce each section by describing the section's goal and why it
              matters. Give lessons and sections titles that reflect their
              content and create a logical flow.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2">
              Each lesson focuses on one concept
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              An ideal lesson length is 2-7 minutes to keep students engaged and
              help them learn in short bursts. Cover a single topic in each
              lesson so learners can easily find and review them later.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2">
              Mix and match your lesson types
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Alternate between filming yourself, your screen, and slides or
              other visuals. Showing yourself can help learners feel more
              connected to the content.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2">
              Hands-on activities create practical learning
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Help learners apply your lessons to real-world scenarios with
              projects, assignments, coding exercises, or worksheets that
              reinforce the concepts.
            </BodyRegular>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="mb-8">
        <Heading4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          Course Requirements
        </Heading4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span>View the complete list of course quality requirements</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span>Your course must have at least five lessons</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                All lessons must add up to at least 30+ minutes of total video
                content
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                Your course must contain valuable educational content and be
                free of promotional or distracting materials
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-8">
        <Heading4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
          Learning Resources
        </Heading4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              Trust & Safety Guidelines
              <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
            </Heading4>
            <CaptionRegular className="text-gray-600">
              Our policies for instructors and students
            </CaptionRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              Join the Instructor Community
              <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
            </Heading4>
            <CaptionRegular className="text-gray-600">
              A place to connect with other instructors
            </CaptionRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              Official Course: How to Create an Online Course
              <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
            </Heading4>
            <CaptionRegular className="text-gray-600">
              Learn about course creation from our instructor team and
              experienced instructors
            </CaptionRegular>
          </div>
        </div>
      </div>
    </div>
  );
}
