import {Link} from "react-router-dom";

const MainFooter = () => {
  const pages = [
    {name: "Home", path: "/"},
    {name: "Courses", path: "/courses"},
    {name: "Batches", path: "/batches"},
    {name: "Support", path: "/help"},
    {name: "About", path: "/about"},
  ];

  const personal = [
    {name: "Profile", path: "/profile"},
    {name: "Become Instructor", path: "/teaching"},
    {name: "My Learning", path: "/learning"},
    {name: "Purchase History", path: "/purchases"},
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Basic Pages */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              {pages.map((page) => (
                <li key={page.name}>
                  <Link
                    to={page.path}
                    className="hover:text-white transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Personal Links */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              {personal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact - Double width */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Us
            </h3>
            <p className="mb-2">
              Get in touch with us for any inquiries or support.
            </p>
            <a
              href="mailto:support@example.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              support@example.com
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-4 py-8 text-center text-sm">
          <p>Edtech {new Date().getFullYear()} &copy; All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
