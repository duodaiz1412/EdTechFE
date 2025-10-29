import {MailWarning} from "lucide-react";
import {useLocation} from "react-router-dom";

type EmailProvider = {
  name: string;
  url: string;
};

const getEmailProvider = (email: string): EmailProvider => {
  const domain = email?.split("@")[1]?.toLowerCase();

  if (!domain) {
    return {
      name: "Email Client",
      url: "mailto:",
    };
  }

  // Gmail
  if (domain === "gmail.com") {
    return {
      name: "Gmail",
      url: "https://mail.google.com",
    };
  }

  // Outlook/Hotmail
  if (
    domain === "outlook.com" ||
    domain === "hotmail.com" ||
    domain === "live.com"
  ) {
    return {
      name: "Outlook",
      url: "https://outlook.live.com",
    };
  }

  // Yahoo
  if (
    domain === "yahoo.com" ||
    domain === "yahoo.co.uk" ||
    domain === "ymail.com"
  ) {
    return {
      name: "Yahoo Mail",
      url: "https://mail.yahoo.com",
    };
  }

  // Apple iCloud
  if (domain === "icloud.com" || domain === "me.com" || domain === "mac.com") {
    return {
      name: "iCloud Mail",
      url: "https://www.icloud.com/mail",
    };
  }

  // ProtonMail
  if (domain === "protonmail.com" || domain === "proton.me") {
    return {
      name: "ProtonMail",
      url: "https://mail.proton.me",
    };
  }

  // Zoho
  if (domain === "zoho.com" || domain === "zohomail.com") {
    return {
      name: "Zoho Mail",
      url: "https://mail.zoho.com",
    };
  }

  // Default fallback
  return {
    name: "Email Client",
    url: "mailto:",
  };
};

export default function Notify() {
  const location = useLocation();
  const email = location.state?.email;
  const emailProvider = getEmailProvider(email);

  return (
    <div className="flex justify-center items-center bg-blue-500 h-screen">
      <div className="card border border-slate-200 w-1/3 bg-base-100">
        <figure className="pt-4">
          <MailWarning size={48} />
        </figure>
        <div className="card-body">
          <div className="card-title text-xl justify-center">
            Please check your email
          </div>
          <div className="text-center">
            <p className="p-2">
              You're almost there. We've sent you an email to{" "}
              <span className="font-bold">{email}</span>. If you don't see it,
              you may need to check your spam folder.
            </p>
            <p className="p-2">You can close this page now.</p>
            <div className="pt-2">
              <a
                href={emailProvider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-neutral rounded-lg"
              >
                Open {emailProvider.name}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
