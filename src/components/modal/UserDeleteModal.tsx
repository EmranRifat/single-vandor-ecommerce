"use client";

import { Icon } from "@iconify/react";
import { Button, Modal } from "@heroui/react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[420px]">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon className="bg-danger/10 text-danger">
                <Icon icon="solar:trash-bin-trash-bold" className="size-5" />
              </Modal.Icon>

              <Modal.Heading>Delete User?</Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <p className="text-default-600">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" slot="close" isDisabled={isLoading}>
                Cancel
              </Button>

              <Button
                className="bg-danger text-white"
                isPending={isLoading}
                onPress={onConfirm}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
