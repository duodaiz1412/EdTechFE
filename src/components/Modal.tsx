import {ReactNode, useEffect, useMemo, useRef} from "react";
import {createPortal} from "react-dom";
import {cn} from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
  hideCloseButton = false,
  closeOnOverlayClick = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRoot = useMemo(() => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    return root;
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    // Không đóng modal nếu đang select text
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    if (e.target === overlayRef.current) onClose();
  };

  const content = (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={cn(
          "w-full rounded-lg bg-white shadow-xl",
          "mx-4",
          widthClass,
          className,
        )}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div className="text-base font-semibold text-gray-900">{title}</div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="px-5 py-4">{children}</div>

        {footer && <div className="border-t px-5 py-4">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(content, modalRoot);
}

export default Modal;
