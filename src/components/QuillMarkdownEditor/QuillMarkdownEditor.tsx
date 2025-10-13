import {useRef, useEffect} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./QuillMarkdownEditor.css";

interface QuillMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export default function QuillMarkdownEditor({
  value,
  onChange,
  onBlur,
  placeholder = "Nhập nội dung bài giảng...",
  className = "",
  rows = 5,
}: QuillMarkdownEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  // Cấu hình toolbar tối ưu cho markdown
  const modules = {
    toolbar: [
      [{header: [1, 2, 3, false]}],
      ["bold", "italic", "underline"],
      [{list: "ordered"}, {list: "bullet"}],
      [{indent: "-1"}, {indent: "+1"}],
      [{align: []}],
      ["link", "image"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "blockquote",
    "code-block",
  ];

  // Thiết lập chiều cao và styling
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const toolbarHeight = 50;
      const lineHeight = 24;
      const totalHeight = toolbarHeight + rows * lineHeight;

      editor.container.style.height = `${totalHeight}px`;
    }
  }, [rows]);

  return (
    <div className={`quill-markdown-editor ${className}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{
          height: "auto",
        }}
      />
    </div>
  );
}
