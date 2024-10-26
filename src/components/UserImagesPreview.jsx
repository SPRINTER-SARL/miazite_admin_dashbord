import Carousel from "@/components/ui/Carousel";
import { SwiperSlide } from "swiper/react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const UserImagesPreview = ({
  user,
  isActive,
  onClocse,
  onActivate,
  onDeactivate,
}) => {
  return (
    <Modal
      activeModal={isActive}
      onClose={onClocse}
      className="max-w-fit"
      title="Gallery"
      centered
    >
      <div className="w-[90dvw] h-[80dvh] relative">
        <div className="h-[75dvh] bg-gray-300">
          <Carousel
            className="main-caro"
            navigation={true}
            pagination={{
              enabled: true,
            }}
          >
            <SwiperSlide>
              <div
                className="single-slide bg-no-repeat bg-contain bg-center w-full h-[70dvh] relative flex justify-center"
                style={{
                  backgroundImage: `url(${user?.identity})`,
                }}
              >
                <p className="text-xl text-primary-700 px-4 py-1 border rounded w-max bg-gray-100 mt-2 h-min">
                  Piece d'identite
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="single-slide bg-no-repeat bg-contain bg-center w-full h-[70dvh] relative flex justify-center"
                style={{
                  backgroundImage: `url(${user?.proofCertif})`,
                }}
              >
                <p className="text-xl text-primary-700 px-4 py-1 border rounded w-max bg-gray-100 mt-2 h-min">
                  Preuve de certification
                </p>
              </div>
            </SwiperSlide>
          </Carousel>
        </div>
        <div className="flex justify-end absolute right-2 bottom-2">
          {user?.isActivated ? (
            <Button
              onClick={onDeactivate}
              className="btn btn-dark mt-4 bg-red-500 text-center rounded-lg"
              text="Desactiver"
              icon="heroicons-outline:no-symbol"
            />
          ) : (
            <Button
              onClick={onActivate}
              className="btn btn-dark mt-4 bg-primary-500 text-center rounded-lg"
              text="Activer"
              icon="heroicons-outline:check"
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserImagesPreview;
