import { useEffect, useState } from "react";
import { getAllDocument } from "@/utils/firebase/firebaseServices";
import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import AddServiceModal from "@/components/services/Add";
import ServiceDetailsModal from "@/components/services/Detail";
import { Icon } from "@iconify/react";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [activeService, setActiveService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllServices = async () => {
    setIsLoading(true);
    const response = await getAllDocument("Specialities");
    setServices(response);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllServices();
  }, []);


  const handelOnUpdated = async () => {
    toggleShouldDisplayDetails();
    await fetchAllServices();
    setActiveService(services.find((service) => service.id === serviceId));
    toggleShouldDisplayDetails();
  };

  const [shouldAdd, setShouldAdd] = useState(false);
  const [shouldDisplayDetails, setShouldDisplayDetails] = useState(false);

  const toggleShouldAdd = () => setShouldAdd(!shouldAdd);
  const toggleShouldDisplayDetails = () =>
    setShouldDisplayDetails(!shouldDisplayDetails);

  const handelCloseAddModal = () => {
    toggleShouldAdd();
    fetchAllServices();
  };

  const handleCloseDetailsModal = () => {
    toggleShouldDisplayDetails();
    setActiveService({});
  }

  return (
    <div>
      <div className="flex justify-between items-center rounded-lg bg-white p-6 border-b mb-12">
        <div className="my-4">
          <h1 className="text-2xl xl:text-3x py-2">Services</h1>
          <p className="text-gray-500 text-base xl:text-xl">
            Liste des services et autres ayant trait a la gestion
          </p>
        </div>
        <Button
          onClick={toggleShouldAdd}
          className="btn btn-dark bg-primary-500 text-center rounded-lg"
          text="Nouveau service"
          icon="heroicons-outline:plus"
        />
      </div>

      {!!isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-4 gap-y-4 gap-x-6">
          {services.map((serviceItem) => (
            <div
              key={serviceItem.id}
              className="rounded-md bg-white cursor-pointer hover:shadow-md"
              onClick={() => {
                toggleShouldDisplayDetails();
                setActiveService(serviceItem);
                setServiceId(serviceItem.id);
              }}
            >
              <div className="bg-slate-200 dark:hover:bg-slate-700 w-full h-40">
                <img
                  src={serviceItem?.photoURL ?? ""}
                  alt=""
                  className="w-full h-full rounded object-cover bg-gray-100 border border-gray-100"
                />
              </div>
              <p className="font-semibold text-primary-500 p-4">
                {serviceItem?.title}
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-2 px-4 pb-4">
                <Icon icon="heroicons:banknotes" />
                <span>{`${serviceItem?.commission?.amount ?? ""} ${
                  serviceItem?.commission?.currency ?? ""
                }`}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {shouldAdd && (
        <AddServiceModal
          onClose={toggleShouldAdd}
          onCreated={handelCloseAddModal}
          isActive={shouldAdd}
        />
      )}
      {shouldDisplayDetails && (
        <ServiceDetailsModal
          isActive={shouldDisplayDetails}
          onClose={handleCloseDetailsModal}
          service={activeService}
          onUpdated={handelOnUpdated}
        />
      )}
    </div>
  );
};

export default ServicesList;
