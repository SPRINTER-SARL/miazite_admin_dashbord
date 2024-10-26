import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import {
  getDataByCondition,
  getDocumentByName,
  getAllSubDocument,
  updateSubDocument,
} from "@/utils/firebase/firebaseServices";
import Loading from "@/components/Loading";
import AccountDepositProofPreview from "../AccountDepositProofPreview";

const UserDetailsModal = ({
  user,
  isActive,
  onClose,
  onEdit,
  onDelete,
  onDisplayProof,
}) => {
  const [profile, setProfile] = useState(null);
  const [service, setService] = useState(null);
  const [activePayment, setActivePayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldDisplayGallery, setShouldDisplayGallery] = useState(false);

  const toggleShouldDisplayGallery = () =>
    setShouldDisplayGallery(!shouldDisplayGallery);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await getDataByCondition(
        "Profile",
        "providerUID",
        "==",
        user?.uid ?? ""
      );

      if (response.length) setProfile(response[0]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = user?.uid
        ? await getAllSubDocument("Profile", user?.uid, "Payments")
        : [];
      if (response.length) setPayments(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchService = async () => {
    setIsLoading(true);
    try {
      const response = user?.service || user?.services  ? await getDocumentByName(
        "Specialities",
        user?.service ?? user?.services
      ): null;

      if (response) setService(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProfile(), fetchService()]);
      await fetchPayments();
    };
    fetchData();
  }, []);

  const displayPaymentProof = (payment) => {
    setActivePayment(payment);
    toggleShouldDisplayGallery();
  };

  const toLocaleDateString = (date) => new Date(date).toDateString();
  const handelActivate = async () => {
    setIsLoading(true);
    try {
      await updateSubDocument({
        collectionName: "Profile",
        docName: user.id,
        subCollectionName: "Payments",
        subDocName: activePayment?.id,
        updatedData: {
          status: "Approuvé",
        },
      });
      toggleShouldDisplayGallery();
      fetchPayments();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setIsLoading(true);
    try {
      await updateSubDocument({
        collectionName: "Profile",
        docName: user.uid,
        subCollectionName: "Payments",
        subDocName: activePayment?.id,
        updatedData: {
          status: "Refusé",
        },
      });
      toggleShouldDisplayGallery();
      fetchPayments();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      activeModal={isActive}
      onClose={onClose}
      className="max-w-xl max-h-[85dvh] overflow-y-auto"
      centered
      title="User Details"
    >
      <div className="flex flex-col gap-12 py-6">
        <div className="self-center">
          <img
            src={user?.photoProfil || "/logo.png"}
            alt=""
            className="h-[186px] w-[186px] object-cover rounded-full"
          />
        </div>
        <ul className="list space-y-6 px-4">
          <li className="flex items-center space-x-3 rtl:space-x-reverse">
            {user?.isActivated ? (
              <div className="bg-green-200 text-green-500 px-3 py-1 5 h-min text-sm inline-flex font-medium rounded-full w-min">
                Actif
              </div>
            ) : (
              <div className="bg-red-100 text-red-500 px-3 py-1 5 text-sm inline-flex font-medium rounded-full w-min">
                Inactif
              </div>
            )}
          </li>
          <li className="flex space-x-3 rtl:space-x-reverse">
            <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
              <Icon icon="heroicons:envelope" size={16} />
            </div>
            <div className="flex-1">
              <a
                href={`mailto:${user?.email}`}
                className="text-base text-slate-600 dark:text-slate-50"
              >
                {user?.email}
              </a>
            </div>
          </li>
          <li className="flex space-x-3 rtl:space-x-reverse">
            <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
              <Icon icon="heroicons:phone-arrow-up-right" size={16} />
            </div>
            <div className="flex-1">
              <a
                href={`tel:${user?.telephone}`}
                className="text-base text-slate-600 dark:text-slate-50"
              >
                {user?.phonenumber}
              </a>
            </div>
          </li>
          <li className="flex space-x-3 rtl:space-x-reverse">
            <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
              <Icon icon="heroicons:map-pin" size={16} />
            </div>
            <div className="flex-1">
              <div className="text-base text-slate-600 dark:text-slate-50">
                <span>{user?.lacationInfo?.flag ?? ""}</span>
                <span className="ml-2">
                  {user?.lacationInfo?.country ?? ""}
                </span>
                <span className="ml-2">{user?.lacationInfo?.city ?? ""}</span>
                <span className="ml-2">
                  {user?.lacationInfo?.formatted_address ?? ""}
                </span>
              </div>
            </div>
          </li>
          <li className="flex space-x-3 rtl:space-x-reverse">
            <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
              <Icon icon="heroicons:cog" size={16} />
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex-1">
                <p className="text-base text-slate-600 dark:text-slate-50">
                  {service?.title}
                  {profile?.experienceYears
                    ? ` | ${profile.experienceYears} ans`
                    : ""}
                </p>
              </div>
            )}
          </li>
          <li>
            <div className="flex gap-4 w-full border-t justify-end pt-4">
              <Button
                onClick={onDisplayProof}
                className="btn rounded-md py-1.5 text-center px-6 btn-light"
                text="preuves d'identiter"
                icon="heroicons-outline:photo"
              />
              <Button
                onClick={onEdit}
                className="btn rounded-md py-1.5 text-center px-6 btn-dark bg-primary-500"
                text="Edit"
                icon="heroicons-outline:pencil"
              />
              <Button
                onClick={onDelete}
                className="btn rounded-md py-1.5 text-center px-6 btn-dark bg-red-500"
                text="Supprimer"
                icon="heroicons-outline:trash"
              />
            </div>
          </li>
          {/* {payments.length && ( */}
          <li>
            <div className="w-full border-t justify-end pt-4">
              <h5 className="text-gray-600 text-lg">Paiments</h5>
              <div className="flex flex-col gap-3 mt-3">
                {payments.map((payment) => (
                  <div
                    key={payment?.id}
                    className="rounded border flex justify-between p-3"
                  >
                    <div>
                      <p className="text-base">
                        {payment?.price} {payment?.currency} {payment?.price}
                      </p>
                      <div className="flex text-gray-500 items-center gap-3 py-2 divide-x">
                        <div className="flex gap-2 items-center text-sm">
                          <Icon icon="heroicons:calendar" />
                          <span className="font-bold">
                            {toLocaleDateString(payment.timestamp)}
                          </span>
                        </div>
                        <span className="pl-3">{payment.status}</span>
                        <span className="pl-3">{payment.type}</span>
                      </div>
                    </div>
                    <Button
                      icon="heroicons:eye"
                      className="py-2 btn btn-outline-primary border-none items-center justify-center"
                      onClick={() => displayPaymentProof(payment)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </li>
          {/* )} */}
        </ul>
      </div>
      {shouldDisplayGallery && (
        <AccountDepositProofPreview
          isActive={shouldDisplayGallery}
          onClose={toggleShouldDisplayGallery}
          onActivate={handelActivate}
          onDeactivate={handleDeactivate}
          payment={activePayment}
        />
      )}
    </Modal>
  );
};

export default UserDetailsModal;
