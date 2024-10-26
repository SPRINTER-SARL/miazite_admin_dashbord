import React, { useEffect, useState } from "react";
import { countDataByCondition } from "@/utils/firebase/firebaseServices";

import shade1 from "@/assets/images/all-img/shade-1.png";
import shade2 from "@/assets/images/all-img/shade-2.png";
import shade3 from "@/assets/images/all-img/shade-3.png";
import shade4 from "@/assets/images/all-img/shade-4.png";

const GroupChart3 = () => {
  const [clientsCount, setClientsCount] = useState(0);
  const [providersCount, setProvidersCount] = useState(0);
  const [reservationAskedCount, setReservationAskedCount] = useState(0);
  const [reservationAccecptedCount, setReservationAccecptedCount] = useState(0);
  const [reservationFinishedCount, setReservationFinishedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const statistics = [
    {
      title: "Clients",
      count: clientsCount,
      bg: "bg-warning-500",
      img: shade1,
      percentClass: "text-primary-500",
    },
    {
      title: "Prestataires ",
      count: providersCount,
      bg: "bg-info-500",
      img: shade2,
      percentClass: "text-primary-500",
    },
    {
      title: "Réservation demander",
      count: reservationAskedCount,
      bg: "bg-primary-500",
      img: shade3,
      percentClass: "text-danger-500",
    },
    {
      title: "Réservation Accepter",
      count: reservationAccecptedCount,
      bg: "bg-success-500",
      img: shade4,
      percentClass: "text-primary-500",
    },
    {
      title: "Réservation Terminé",
      count: reservationFinishedCount,
      bg: "bg-purple-300",
      img: shade1,
      percentClass: "text-primary-500",
    },
  ];

  const fetchStatistics = async () => {
    setIsLoading(true);
    const clientsCountResponse = await countDataByCondition(
      "Users",
      "role",
      "==",
      "Utilisateur"
    );
    const providersCount = await countDataByCondition(
      "Users",
      "role",
      "==",
      "Prestataire"
    );
    const reservationAskedCount = await countDataByCondition(
      "Reservations",
      "status",
      "==",
      "En attente"
    );
    const reservationAccecptedCount = await countDataByCondition(
      "Reservations",
      "status",
      "==",
      "En cours"
    );
    const reservationFinishedCount = await countDataByCondition(
      "Reservations",
      "status",
      "==",
      "Terminée"
    );
    setClientsCount(clientsCountResponse);
    setProvidersCount(providersCount);
    setReservationAskedCount(reservationAskedCount);
    setReservationAccecptedCount(reservationAccecptedCount);
    setReservationFinishedCount(reservationFinishedCount);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-5">
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-25 relative z-[1]`}
        >
          <div className="overlay absolute left-0 top-0 w-full h-full z-[-1]">
            <img
              src={item.img}
              alt=""
              draggable="false"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="block mb-6 text-sm text-slate-900 dark:text-white font-medium">
            {item.title}
          </span>
          <span className="block mb- text-2xl text-slate-900 dark:text-white font-medium mb-6">
            {isLoading ? (
              <svg
                className="animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <span>{item.count}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GroupChart3;
