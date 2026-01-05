import HtmlDisplay from "@/components/HtmlDisplay";
import {Copy, HelpCircle, Mail, CheckCircle} from "lucide-react";
import {useState} from "react";

export default function Support() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const questions = [
    {
      title: "How to enroll in a course or batch?",
      answer:
        "To enroll in a course or batch, simply go to this course/batch and click on the 'Enroll' button on the page.",
    },
    {
      title: "What payment methods are accepted?",
      answer: "We accept QR payment method.",
    },
    {
      title: "How to add my payment method as instructor?",
      answer: `<ul>
<li>Step 1: Open <a href="https://my.payos.vn/login" target="_blank">PayOS</a> and create an account.</li>
<li>Step 2: Go to "Kênh thanh toán", click "Tạo kênh thanh toán". At webhook url, add <strong>https://api.edtech.works/api/v1/payments/webhook/payos</strong></li>
<li>Step 3: Back to Edtech, go to Instructor &gt; Payment, and copy all field from your payment method.</li>
</ul>`,
    },
  ];

  const supportEmail = "support@edtech.com.vn";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 300);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-2">
          <HelpCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          How can we help you?
        </h2>
        <p className="text-gray-600">
          Find answers to common questions or reach out to our support team
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-blue-600">💡</span>
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
            >
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-medium text-gray-800 peer-checked:text-blue-600">
                {q.title}
              </div>
              <div className="collapse-content">
                {/* <p className="text-gray-600 pt-2">{q.answer}</p> */}
                <HtmlDisplay html={q.answer} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">
            Still need help?
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Contact our support team and we'll get back to you within 24 hours
        </p>
        <div className="bg-white p-4 rounded-lg flex items-center justify-between shadow-sm">
          <a
            href={`mailto:${supportEmail}`}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {supportEmail}
          </a>
          <label
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {copiedEmail ? (
              <>
                <CheckCircle size={16} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
