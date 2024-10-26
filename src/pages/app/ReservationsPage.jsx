import { useEffect, useState } from "react";
import { getDataByCondition } from "@/utils/firebase/firebaseServices";
import Loading from "@/components/Loading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ReservationDetailsModal from "@/components/ReservationDetailsModal";
import { Link } from "react-router-dom";

const columns = [
  {
    label: "Client",
  },
  // {
  //   label: "Prestataire",
  // },
  {
    label: "Besoin",
  },
  {
    label: "Service",
  },
  {
    label: "Adresse",
  },
  {
    label: "Status",
  },
  {
    label: "Date",
  },
];

const status = ["", "En attente", "En cours", "Terminée", "Annulée"];

const Status = {
  EN_ATTENTE: "En attente",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
  PAID: "Payé",
  FAILED: "Échec",
};

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationId, setReservationId] = useState([]);
  const [activeReservation, setActiveReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetchReservations = async () => {
    setIsLoading(true);
    const response = await getDataByCondition(
      "Reservations",
      "status",
      activeTab !== 0 ? "==" : "!=",
      status[activeTab]
    );

    setReservations(response);
    setIsLoading(false);
  };

  const dateToLocalString = (date) => new Date(date).toDateString();

  useEffect(() => {
    fetchReservations();
  }, [activeTab]);

  useEffect(() => {
    setActiveReservation(
      reservations.find((reservation) => reservation.id === reservationId)
    );
  }, [reservationId]);

  const [shouldDisplayDetails, setShouldDisplayDetails] = useState(false);

  const toggleShouldDisplayDetails = () =>
    setShouldDisplayDetails(!shouldDisplayDetails);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl xl:text-3xl my-4">Reservations</h1>
      </div>

      <div className="w-full border-b border-b-gray-100">
        <div className="flex items-center gap-x-2 py-4 mt-2">
          <Button
            onClick={() => setActiveTab(0)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 0
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="Tout"
          />
          <Button
            onClick={() => setActiveTab(1)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 1
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="En attente"
          />
          <Button
            onClick={() => setActiveTab(2)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 2
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="En cours"
          />
          <Button
            onClick={() => setActiveTab(3)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 3
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="Terminée"
          />
          <Button
            onClick={() => setActiveTab(4)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 4
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="Annulée"
          />
          <Button
            icon="heroicons-outline:refresh"
            onClick={fetchReservations}
            className="btn btn-light bg-white ml-4 rounded-full p-2"
          />
        </div>
      </div>
      {!!isLoading ? (
        <Loading />
      ) : (
        <Card
          titleClass="text-3xl pt-4"
          className="min-h-[70dvh] mt-4"
          noborder
        >
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table className="min-w-full divide-y divide-slate-800 border-t table-fixed dark:divide-slate-100">
                  <thead className="bg-primary-500 dark:bg-slate-100">
                    <tr>
                      {columns.map((column, i) => (
                        <th
                          key={i}
                          scope="col"
                          className=" table-th  text-white "
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {reservations.length ? (
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      {reservations.map((row) => (
                        <tr
                          onClick={() => {
                            toggleShouldDisplayDetails();
                            setReservationId(row.id);
                          }}
                          key={row.id}
                          className="hover:bg-slate-200 hover:cursor-pointer dark:hover:bg-slate-700"
                        >
                          <td className="table-td font-semibold text-slate-800">
                            {row?.clientData?.fullName ?? ""}
                          </td>
                          <td className="table-td font-medium text-slate-800 max-w-40 truncate xl:max-w-40">
                            {row?.explanation?.description}
                          </td>
                          <td className="table-td text-slate-800">
                            <Link
                              to={`/services/?id=${row?.serviceData.id}`}
                              className="text-blue-500"
                              title={row?.serviceData?.title}
                            >
                              {row?.serviceData?.title}
                            </Link>
                          </td>
                          <td className="table-td text-gray-500  max-w-48 truncate">
                            {row?.address?.formatted_address}
                          </td>
                          <td className="table-td">
                            <div
                              className={`w-max px-3 mx-auto text-center py-1 5 text-sm font-medium rounded-full ${
                                row?.status === Status.EN_ATTENTE
                                  ? "bg-orange-200 text-orange-500"
                                  : row?.status === Status.EN_COURS
                                  ? "bg-blue-200 text-blue-500"
                                  : row?.status === Status.TERMINEE
                                  ? "bg-green-200 text-green-600"
                                  : (row?.status === Status.ANNULEE || row?.status === Status.FAILED)
                                  ? "bg-red-200 text-red-400"
                                  : ""
                              }`}
                            >
                              <span>{row?.status}</span>
                            </div>
                          </td>
                          <td className="table-td">
                            {dateToLocalString(row?.createdAt ?? "")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <caption className="caption-bottom text-center py-24">
                      <span> Oups! Aucun utilisateur pour l'intant</span>
                    </caption>
                  )}
                </table>
              </div>
            </div>
          </div>
        </Card>
      )}

      {shouldDisplayDetails && (
        <ReservationDetailsModal
          isActive={shouldDisplayDetails}
          onClose={toggleShouldDisplayDetails}
          reservation={activeReservation}
          onUpdated={fetchReservations}
        />
      )}
    </div>
  );
};

export default ReservationsList;
