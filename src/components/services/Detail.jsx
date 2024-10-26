import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import EditServiceModal from "./Edit";
import AddSubService from "./subServices/add";
import SubServiceItem from "./subServices";
import { getAllSubDocument } from "@/utils/firebase/firebaseServices";

const ServiceDetailsModal = ({ service, isActive, onClose, onUpdated }) => {
  const [subServices, setSubServices] = useState([]);

  const [shouldEdit, setShouldEdit] = useState(false);
  const [shouldDelete, setShouldDelete] = useState(false);
  const [shouldAdd, setShouldAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShouldAdd = () => setShouldAdd(!shouldAdd);
  const toggleShouldEdit = () => setShouldEdit(!shouldEdit);
  const toggleShouldDelete = () => setShouldDelete(!shouldDelete);

  const fetchAllSubServices = async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubDocument(
        "Specialities",
        service?.id ?? "",
        "SubSpecialities"
      );
      console.log(service?.id, response);

      setSubServices(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    console.log(service);
    
    fetchAllSubServices();
  }, [service]);

  const handelCloseAddModal = () => {
    toggleShouldAdd();
    fetchAllSubServices();
  };

  const deleteService = () => {};

  const handelEdit = async () => {
    await onUpdated();
    toggleShouldEdit();
  };

  return (
    <Modal
      activeModal={isActive}
      onClose={onClose}
      className="max-w-xl pt-0 pb-4"
      centered
      themeClass="border-b w-full"
      title={`${
        shouldEdit
          ? "Edition"
          : shouldDelete
          ? "Suppression"
          : "Service Details"
      }`}
    >
      {shouldEdit ? (
        <EditServiceModal
          service={service}
          isActive={shouldEdit}
          onClose={handelEdit}
        />
      ) : shouldDelete ? (
        <div className="flex flex-col gap-4 pt-0 w-[500px] max-h-[80dvh]">
          <div className="text-lg text-gray-500 text-center px-6 pt-4">
            Vous etes sur le points de supprimer le service{" "}
            <span className="font-bold">"{service?.title}"</span> ainsi que tout
            ses sous servies! <br />
            Etes vous sur de votre choix?
          </div>
          <div className="flex items-center justify-center gap-4 py-6">
            <Button
              type="button"
              text="Non annuler"
              onClick={toggleShouldDelete}
              className="btn btn-light block text-center px-12 mt-4"
            />
            <Button
              type="button"
              onClick={deleteService}
              text="Oui supprimer"
              className="btn btn-dark bg-red-500 block text-center px-12 mt-4"
              isLoading={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pt-0 w-[500px] max-h-[80dvh] relative">
          <div>
            <div className="flex gap-4 absolute -top-16 right-16">
              <Button
                onClick={toggleShouldEdit}
                className="btn btn-primary-light p-2 text-center hover:btn-dark hover:bg-primary-500 rounded-full"
                icon="heroicons-outline:pencil"
              />
              <Button
                onClick={toggleShouldDelete}
                className="btn btn-primary-light p-2 text-center hover:btn-dark hover:bg-red-500 rounded-full"
                icon="heroicons-outline:trash"
              />
            </div>
            <div className="self-center w-full">
              <img
                src={service?.photoURL || "/logo.png"}
                alt=""
                className="h-[200px] w-full object-cover rounded-md"
              />
            </div>
            <div>
              <h2 className="font-semibold text-2xl text-primary-500 py-2">
                {service?.title}
              </h2>

              <p className="text-gray-500 text-sm flex items-center gap-2 pb-4">
                <Icon icon="heroicons:banknotes" />
                <span>{`${service?.commission?.amount ?? ""} ${
                  service?.commission?.currency ?? ""
                }`}</span>
              </p>
              <p className="font-semibold text-gray-500">
                {service?.description}
              </p>
            </div>
          </div>
          <div className="overflow-auto border p-4 rounded-md">
            <div className="flex justify-between items-center border-b pb-2 mt-2">
              <h3 className="text-primary-500 text-sm font-bold">
                {!shouldAdd ? "Sous services" : "Nouveau sous service"}
              </h3>
              {!shouldAdd && (
                <Button
                  onClick={toggleShouldAdd}
                  className="btn btn-primary-light p-2 text-center hover:btn-dark rounded-full"
                  icon="heroicons-outline:plus"
                />
              )}
            </div>
            {shouldAdd ? (
              <AddSubService
                isActive={shouldAdd}
                serviceId={service?.id}
                onClose={handelCloseAddModal}
              />
            ) : subServices.length ? (
              <div className="flex flex-col gapy-3 mt-4">
                {subServices.map((subService) => (
                  <SubServiceItem
                    subService={subService}
                    serviceId={service.id}
                    onRefresh={fetchAllSubServices}
                    key={subService.id}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full pt-8 pb-4 text-gray-500 text-sm text-center">
                Aucun sous services pour l'instant
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ServiceDetailsModal;
