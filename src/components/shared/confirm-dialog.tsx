"use client";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600">{message}</p>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Batal
        </Button>

        <Button onClick={onConfirm} disabled={loading}>
          {loading ? "Memproses..." : "Ya, lanjutkan"}
        </Button>
      </div>
    </Modal>
  );
}
