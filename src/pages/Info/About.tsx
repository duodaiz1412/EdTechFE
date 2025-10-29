import {Link} from "react-router-dom";

export default function About() {
  const missionItems = [
    {
      icon: "🎓",
      bgColor: "bg-blue-100",
      title: "Quality",
      description: "Content designed by leading industry experts",
    },
    {
      icon: "💡",
      bgColor: "bg-green-100",
      title: "Innovation",
      description: "Applying the latest technology in education",
    },
    {
      icon: "🌟",
      bgColor: "bg-purple-100",
      title: "Accessibility",
      description: "Learn anytime, anywhere on any device",
    },
  ];

  const features = [
    {
      icon: "📱",
      title: "Multi-Device Learning",
      description: "Access courses on computers, tablets, and smartphones",
    },
    {
      icon: "🎥",
      title: "High-Quality Videos",
      description: "Professionally produced video content in HD quality",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Detailed reporting system for learning progress",
    },
    {
      icon: "👥",
      title: "Learning Community",
      description: "Connect with other learners, discuss and share experiences",
    },
    {
      icon: "🏆",
      title: "Certificates",
      description: "Receive recognized course completion certificates",
    },
    {
      icon: "🔄",
      title: "Regular Updates",
      description: "Content regularly updated with latest trends",
    },
  ];

  const stats = [
    {number: "10,000+", label: "Students"},
    {number: "500+", label: "Courses"},
    {number: "50+", label: "Instructors"},
    {number: "95%", label: "Satisfaction"},
  ];

  const values = [
    {
      title: "Lifelong Learning",
      description: "We believe learning is a never-ending journey",
    },
    {
      title: "Technology Serves People",
      description: "Using technology to create the best learning experience",
    },
    {
      title: "Supportive Community",
      description:
        "Building a positive learning environment with mutual support",
    },
    {
      title: "Top Quality",
      description:
        "Committed to providing the highest quality content and services",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Edtech</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Leading online learning platform, delivering modern and effective
            learning experiences
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We are committed to providing high-quality education through
              advanced technology, helping everyone access knowledge in the
              easiest and most effective way possible.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {missionItems.map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`${item.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 border rounded-lg hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">
                  {feature.icon} {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Core Values
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions or need support? Our team is always ready to help
            you.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/help"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Supports
            </Link>
            <Link
              to="/"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
