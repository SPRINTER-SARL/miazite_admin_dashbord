import { useEffect, useState } from "react";
import {
  getDataByCondition,
  updateDocument,
  getAllDocumentByCollection,
  getAllDocument,
} from "@/utils/firebase/firebaseServices";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AccountDepositProofPreview from "@/components/AccountDepositProofPreview";
import Icon from "@/components/ui/Icon";

const UsersList = () => {
  const { user } = useSelector((state) => state.auth);

  const [payments, setPayments] = useState([]);
  const [activePayment, setActivePayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const [shouldDisplayGallery, setShouldDisplayGallery] = useState(false);
  const toggleShouldDisplayGallery = () =>
    setShouldDisplayGallery(!shouldDisplayGallery);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = user?.uid ? await getAllDocument("Payments") : [];
      console.log(response);

      if (response.length) setPayments(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const displayPaymentProof = (payment) => {
    setActivePayment(payment);
    toggleShouldDisplayGallery();
  };
  const toLocaleDateString = (date) => new Date(date).toDateString();
  const handelActivate = async () => {
    setIsLoading(true);
    try {
      console.log(activePayment?.id);

      await updateDocument("Payments", activePayment?.id, {
        status: "Payé",
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
      await updateDocument("Payments", activePayment?.id, {
        status: "Impayé",
      });
      toggleShouldDisplayGallery();
      fetchPayments();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const PaymentItem = ({ payment }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [client, setClient] = useState(false);

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = payment.userId
          ? await getDataByCondition(
              "Users",
              "uid",
              "==",
              payment?.userId ?? ""
            )
          : [];
        console.log(response[0], payment.userId);

        if (response.length) setClient(response[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchProfile();
    }, []);
    return (
      <div className="rounded border hover:bg-gray-100 cursor-pointer p-3">
        <p className="text-base">
          {Math.round(payment?.price * 96.05)} {" DZ"}
        </p>
        <div className="flex text-gray-500 items-center gap-3 py-2 divide-x">
          <div className="flex gap-2 items-center text-sm">
            <Icon icon="heroicons:calendar" size={20} />
            <span className="font-bold">
              {toLocaleDateString(payment.timestamp)}
            </span>
          </div>
          <span
            className={`ml-3 px-2 py-0.5 text-sm rounded-full ${
              payment?.status === "Payé"
                ? "bg-green-200 text-green-600"
                : payment?.status === "Impayé"
                ? "bg-red-200 text-red-400"
                : "bg-orange-200 text-orange-500"
            }`}
          >
            {payment.status}
          </span>
          <span className="pl-3">{payment.type}</span>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          {isLoading ? "Loading..." : client?.nom + " " + client?.prenom}
        </p>
      </div>
    );
  };

  return (
    <div>
      <div className="w-full border-b border-b-gray-100">
        {/* <div className="flex items-center gap-x-2 py-4 mt-2">
          <Button
            onClick={() => setActiveTab(0)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 0
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="Prestataires"
          />
          <Button
            onClick={() => setActiveTab(1)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 1
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="Clients"
          />
        </div> */}
      </div>
      {!!isLoading ? (
        <Loading />
      ) : (
        <Card
          title="Paiments"
          titleClass="text-3xl pt-4"
          className="min-h-[70dvh]"
          headerslot={
            <Button
              icon="heroicons-outline:refresh"
              onClick={fetchPayments}
              className="btn btn-light rounded-full p-2 mt-2"
            />
          }
          noborder
        >
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <div className="w-full border-t justify-end pt-4">
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {payments.map((payment) => (
                      <PaymentItem
                        key={payment?.id}
                        onClick={() => displayPaymentProof(payment)}
                        payment={payment}
                      />
                    ))}
                  </div>
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
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UsersList;
