// HtmlPreview.tsx
import {useMemo} from "react";
import DOMPurify from "dompurify";

type Props = {
  html: string;
  className?: string;
};

export default function HtmlPreview({html, className}: Props) {
  const clean = useMemo(() => {
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "strong",
        "em",
        "u",
        "b",
        "i",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "div",
        "span",
        "blockquote",
        "pre",
        "code",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class", "id"],
      ALLOW_DATA_ATTR: false,
    });

    // (tuỳ chọn) ép link mở tab mới + noopener
    const doc = new DOMParser().parseFromString(sanitized, "text/html");
    doc.querySelectorAll("a[href]").forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
    return doc.body.innerHTML;
  }, [html]);

  return (
    <div
      className={`prose prose-sm max-w-none ${className || ""}`}
      dangerouslySetInnerHTML={{__html: clean}}
    />
  );
}
