import Modal from "@/components/ui/Modal";
import Button from "./ui/Button";

const ConfirmationModal = ({
  isActive,
  onClose,
  onConfirm,
  title,
  text,
  isLoading,
  theme = "BLUE",
}) => {
  return (
    <Modal
      activeModal={isActive}
      onClose={onClose}
      className="max-w-xl"
      centered
      title={title}
    >
      <div className="flex flex-col gap-12">
        <div className="text-lg text-gray-500 text-center">{text}</div>
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            text="Annuler"
            onClick={onClose}
            className="btn btn-light block text-center px-12 mt-4"
          />
          <Button
            type="button"
            onClick={onConfirm}
            text="Confirmer"
            className={`btn btn-dark ${
              theme === "BLUE" ? " bg-primary-500 " : " bg-red-500 "
            } block text-center px-12 mt-4`}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
