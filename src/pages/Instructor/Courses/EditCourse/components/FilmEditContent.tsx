import {
  Heading3,
  Heading4,
  BodyRegular,
  CaptionRegular,
} from "@/components/Typography";
import {
  Video,
  Lightbulb,
  CheckCircle,
  ExternalLink,
  Camera,
  Mic,
  Edit3,
} from "lucide-react";

export default function FilmEditContent() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Heading3 className="text-2xl font-bold text-gray-900 mb-4">
          Film & Edit
        </Heading3>
        <div className="space-y-4">
          <Heading4 className="text-xl font-semibold text-gray-900">
            Time to bring your knowledge to life
          </Heading4>
          <BodyRegular className="text-gray-700 leading-relaxed">
            This is where the magic happens! If you've planned your course
            structure and followed our guidance, you're perfectly prepared for
            the recording process. Take your time, focus on quality, and don't
            hesitate to refine during editing.
          </BodyRegular>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mb-8">
        <Heading4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          Professional Tips
        </Heading4>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Camera className="w-4 h-4 mr-2 text-blue-500" />
              Take regular breaks and review your work
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Monitor for any environmental changes like new background noises.
              Pay attention to your energy levels—recording can be exhausting
              and that fatigue will show on camera if you're not careful.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Video className="w-4 h-4 mr-2 text-green-500" />
              Connect with your audience
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Students want to connect with their instructor. Even for screen
              recording courses, include a personal introduction video. Consider
              adding brief on-camera introductions for each major section to
              maintain engagement.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Camera className="w-4 h-4 mr-2 text-purple-500" />
              Practice makes perfect on camera
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Look directly at the camera lens and speak clearly and
              confidently. Don't be afraid to do multiple takes until you get it
              right—your students will appreciate the polished result.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Edit3 className="w-4 h-4 mr-2 text-orange-500" />
              Plan for smooth editing
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              You can easily edit out long pauses, mistakes, and filler words
              like "um" or "ah." Record some extra B-roll footage or graphics
              that you can insert later to cover any cuts or transitions.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Mic className="w-4 h-4 mr-2 text-red-500" />
              Create audio markers for easy editing
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Clap your hands at the start of each recording to create an audio
              spike that makes it easy to sync video and audio during editing.
              Use our production guides to organize your recording sessions
              efficiently.
            </BodyRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Video className="w-4 h-4 mr-2 text-indigo-500" />
              Keep your screen clean for recordings
            </Heading4>
            <BodyRegular className="text-gray-700 leading-relaxed">
              Remove any unrelated files and folders from your desktop before
              recording. Open all necessary tabs in advance. Use at least 24pt
              font size for on-screen text and utilize zoom features to
              highlight important areas.
            </BodyRegular>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="mb-8">
        <Heading4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          Technical Requirements
        </Heading4>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                Record and export in HD quality to create videos of at least
                720p, or 1080p for optimal quality
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                Audio should be balanced across both left and right channels and
                perfectly synchronized with your video
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span>
                Audio must be free of echo and background noise to avoid
                distracting students from the learning content
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-8">
        <Heading4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Video className="w-5 h-5 mr-2 text-blue-500" />
          Production Resources
        </Heading4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              Create a test video
              <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
            </Heading4>
            <CaptionRegular className="text-gray-600">
              Get feedback before filming your entire course
            </CaptionRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              Teaching Center: A/V Quality Guide
              <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
            </Heading4>
            <CaptionRegular className="text-gray-600">
              Record and edit with confidence using our expert guides
            </CaptionRegular>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
            <Heading4 className="font-semibold text-gray-900 mb-2 flex items-center">
              Trust & Safety Guidelines
              <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
            </Heading4>
            <CaptionRegular className="text-gray-600">
              Our policies for instructors and students
            </CaptionRegular>
          </div>
        </div>
      </div>
    </div>
  );
}
