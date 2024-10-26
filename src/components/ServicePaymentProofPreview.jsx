import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const PaymentProofPreview = ({
  reservation,
  isActive,
  onClose,
  onActivate,
  onDeactivate,
}) => {
  return (
    <Modal
      activeModal={isActive}
      onClose={onClose}
      className="max-w-fit"
      title="Preuve de realisation"
      centered
    >
      <div className="w-[90dvw] h-[80dvh] relative">
        <div className="h-[75dvh] bg-gray-300">
          <div
            className="single-slide bg-no-repeat bg-contain bg-center w-full h-[70dvh] relative flex justify-center"
            style={{
              backgroundImage: `url(${reservation?.paiementProofFile})`,
            }}
          ></div>
        </div>
        {reservation?.paiementProofFile && (
          <div className="flex justify-end absolute right-2 bottom-2 gap-x-4">
            <Button
              onClick={onDeactivate}
              className="btn btn-dark mt-4 bg-red-500 text-center rounded-lg"
              text="Rejetter"
              icon="heroicons-outline:no-symbol"
            />
            <Button
              onClick={onActivate}
              className="btn btn-dark mt-4 bg-primary-500 text-center rounded-lg"
              text="Aprouver"
              icon="heroicons-outline:check"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentProofPreview;
