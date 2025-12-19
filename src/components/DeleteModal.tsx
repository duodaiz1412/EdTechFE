import Button from "@/components/Button";
import Modal from "@/components/Modal";
import {ReactNode} from "react";

export interface DeleteModalProps {
  open: boolean;
  title?: string;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

export function DeleteModal({
  open,
  title = "Delete",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  loading = false,
}: DeleteModalProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="space-y-2">
        {typeof message === "string" ? (
          <p className="text-sm text-gray-700">{message}</p>
        ) : (
          message
        )}
      </div>
    </Modal>
  );
}

export default DeleteModal;
