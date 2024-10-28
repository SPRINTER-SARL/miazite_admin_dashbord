import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Carousel from "@/components/ui/Carousel";
import { SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import {
  getDataByCondition,
  getDocumentByName,
  updateDocument,
} from "@/utils/firebase/firebaseServices";
import Loading from "@/components/Loading";
import Button from "./ui/Button";
import { Link } from "react-router-dom";
import PaymentProofPreview from "./ServicePaymentProofPreview";

const Status = {
  EN_ATTENTE: "En attente",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
  PAID: "Payé",
  FAILED: "Échec",
};
const ReservationDetailsModal = ({
  reservation,
  isActive,
  onClose,
  onUpdated,
}) => {
  const [profile, setProfile] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldDisplayGallery, setShouldDisplayGallery] = useState(false);

  const toggleShouldDisplayGallery = () =>
    setShouldDisplayGallery(!shouldDisplayGallery);

  const handelActivate = async () => {
    setIsLoading(true);
    try {
      await updateDocument("Reservations", reservation?.id, {
        isPaymentFileValidated: 1,
        status: "Payé",
      });
      toggleShouldDisplayGallery();
      onUpdated();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeactivate = async () => {
    setIsLoading(true);
    try {
      await updateDocument("Reservations", reservation?.id, {
        isPaymentFileValidated: -1,
        status: "Échec",
      });
      toggleShouldDisplayGallery();
      onUpdated();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPrestataire = async () => {
    setIsLoading(true);
    try {
      const response = await getDataByCondition(
        "Users",
        "providerUID",
        "==",
        reservation?.providerID ?? ""
      );

      if (response.length) setProfile(response[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDevis = async () => {
    setIsLoading(true);
    try {
      const response = reservation?.selectedEstimate
        ? await getDocumentByName(
            "Estimates",
            reservation?.selectedEstimate ?? ""
          )
        : {};

      if (response) setEstimate(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(reservation);

    const fetchData = async () => {
      await Promise.all([fetchPrestataire(), fetchDevis()]);
    };
    fetchData();
  }, []);

  const timetampsToLocalString = (date) => new Date(date).toDateString();
  const timetampsToLocalHour = (date) => new Date(date).toLocaleTimeString();

  return (
    <Modal
      activeModal={isActive}
      onClose={onClose}
      className="w-[800px]"
      centered
      title="Reservation Details"
    >
      <div className="flex flex-col gap-4 pb-6 w-full max-h-[80dvh] overflow-y-auto">
        <div className="self-center w-full border rounded-md">
          <Carousel
            className="main-caro"
            navigation={true}
            pagination={{
              enabled: true,
            }}
          >
            {reservation?.explanation?.images
              ?.filter(Boolean)
              .map((image, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="single-slide bg-no-repeat bg-contain bg-center w-full h-[250px]"
                    style={{
                      backgroundImage: `url(${image})`,
                    }}
                  ></div>
                </SwiperSlide>
              ))}
          </Carousel>
        </div>
        <div>
          <h3 className="text-base font-semibold">
            {reservation?.explanation?.description ?? ""} {">"}{" "}
            {reservation?.subTaskTitle ?? ""}
          </h3>
          <div className="text-base text-slate-600 dark:text-slate-50">
            <Icon icon="heroicons:location" size={10} />
            <span>{reservation?.lacationInfo?.flag ?? ""}</span>
            <span className="ml-2">
              {reservation?.lacationInfo?.country ?? ""}
            </span>
            <span className="ml-2">
              {reservation?.lacationInfo?.city ?? ""}
            </span>
            <span className="ml-2">
              {reservation?.lacationInfo?.formatted_address ?? ""}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-max px-3 text-center py-1 5 text-sm font-medium rounded-full ${
                reservation?.status === Status.EN_ATTENTE
                  ? "bg-orange-200 text-orange-500"
                  : reservation?.status === Status.EN_COURS
                  ? "bg-blue-200 text-blue-500"
                  : reservation?.status === Status.TERMINEE
                  ? "bg-green-200 text-green-600"
                  : reservation?.status === Status.ANNULEE ||
                    reservation?.status === Status.FAILED
                  ? "bg-red-200 text-red-400"
                  : ""
              }`}
            >
              <span>{reservation?.status}</span>
            </div>
            <div className="flex gap-x-2 items-center text-gray-500">
              <Icon icon="heroicons:calendar" size={10} />
              <span className="text-sm">
                {timetampsToLocalString(reservation?.timestamp)}
              </span>
            </div>
            <div className="flex gap-x-2 items-center text-gray-500">
              <Icon icon="heroicons:clock" size={10} />
              <span className="text-sm">
                {timetampsToLocalHour(reservation?.timestamp)}
              </span>
            </div>
            <div className="flex gap-x-2 items-center truncate text-gray-500 ml-4">
              <Icon icon="heroicons:banknotes" size={10} />
              <span className="text-sm">{estimate?.total ?? 0}</span>
            </div>
            <div className="flex gap-x-2 items-center text-gray-500">
              <Icon icon="heroicons:square-3-stack-3d" size={10} />
              <span className="text-sm">{reservation?.serviceTitle}</span>
            </div>
          </div>
          <div className="flex"></div>
        </div>
        <ul className="list divide-y">
          <li className="grid grid-cols-2 flex-col pt-2">
            <div className="grid gap-y-3">
              <h6 className="text-base">Client</h6>
              <div className="flex items-center space-x-3">
                {reservation?.clientData?.avatar ? (
                  <img
                    src={reservation?.clientData.avatar}
                    className="h-8 w-8 rounded"
                  />
                ) : (
                  <Icon icon="heroicons:user" size={16} />
                )}
                <Link
                  to={`user/?id=${reservation?.clientId}`}
                  className="text-base text-slate-600 dark:text-slate-50"
                >
                  {reservation?.clientData?.fullName}
                </Link>
              </div>
            </div>
            <div className="grid gap-y-3">
              <h6 className="text-base">Prestataire</h6>
              <div className="flex items-center space-x-3">
                {profile?.photoURL ? (
                  <img src={profile?.photoURL} className="h-8 w-8 rounded" />
                ) : (
                  <Icon icon="heroicons:user" size={16} />
                )}
                <Link
                  to={`user/?id=${profile?.id}`}
                  className="text-base text-slate-600 dark:text-slate-50"
                >
                  {profile?.nom} {profile?.prenom}
                </Link>
              </div>
            </div>
            <div className=""></div>
          </li>
          <li className="flex flex-col space-y-3 pt-4">
            <h6 className="text-base">Preuve de Paiment</h6>
            <div>
              {reservation?.paiementProofFile && (
                <Button
                  onClick={toggleShouldDisplayGallery}
                  icon="heroicons-outline:photo"
                  className="btn-light text-slate-800 border border-primary-500 mb-2 px-3 py-1.5 text-xs"
                  text="Voir la preuve"
                />
              )}
              <div className="flex space-x-2">
                <span className="text-gray-500">Status :</span>
                <span
                  className={`w-max px-3 text-center py-1 5 text-sm font-medium rounded-full ${
                    reservation?.isPaymentFileValidated == 0
                      ? "text-orange-500"
                      : reservation?.isPaymentFileValidated > 0
                      ? "text-green-600"
                      : reservation?.isPaymentFileValidated < 0
                      ? "text-red-400"
                      : ""
                  }`}
                >
                  {!reservation?.paiementProofFile
                    ? "Pas encore fournit"
                    : reservation?.isPaymentFileValidated > 0
                    ? "Aprouver"
                    : reservation?.isPaymentFileValidated < 0
                    ? "Refuser"
                    : "En attente"}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      {shouldDisplayGallery && (
        <PaymentProofPreview
          isActive={shouldDisplayGallery}
          onClose={toggleShouldDisplayGallery}
          onActivate={handelActivate}
          onDeactivate={handleDeactivate}
          reservation={reservation}
        />
      )}
    </Modal>
  );
};

export default ReservationDetailsModal;
