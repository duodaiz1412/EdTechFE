import {Link} from "react-router-dom";

interface FooterProps {
  className?: string;
}

const Footer = ({className}: FooterProps) => {
  const pages = [
    {name: "Home", path: "/"},
    {name: "Courses", path: "/courses"},
    {name: "Batches", path: "/batches"},
    {name: "Support", path: "/help"},
    {name: "About", path: "/about"},
  ];

  const personal = [
    {name: "Profile", path: "/profile"},
    {name: "Instructor", path: "/teaching"},
    {name: "My Learning", path: "/learning"},
    {name: "Purchase History", path: "/purchases"},
  ];

  return (
    <footer
      className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-12 pb-6 mt-auto ${className || ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo and Description */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Edtech
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Providing reliable education since 2025. Empowering learners
              worldwide.
            </p>
          </div>

          {/* Column 2: Services */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Services
            </h3>
            <ul className="space-y-3">
              {pages.map((page) => (
                <li key={page.name}>
                  <Link
                    to={page.path}
                    className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Account */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Account
            </h3>
            <ul className="space-y-3">
              {personal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Contact Us
            </h3>
            <p className="mb-4 text-gray-400 leading-relaxed">
              Get in touch with us for any inquiries or support.
            </p>
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              support@edtech.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center text-sm text-gray-400">
            <p>Edtech {new Date().getFullYear()} &copy; All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
