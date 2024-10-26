import React, { useState } from "react";
import { addDocument, saveImage } from "@/utils/firebase/firebaseServices";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Fileinput from "@/components/ui/Fileinput";
import Select from "@/components/ui/Select";
import InputGroup from "@/components/ui/InputGroup";

const AddServiceModal = ({ isActive, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [commissionAmount, setCommitionAmount] = useState(0);
  const [commissionCurrency, setCommitionCurrency] = useState("DZ");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const currencies = [
    { value: "DZ", label: "DZ" },
  ];
  
  const schema = yup
    .object({
      title: yup.string().required("Ce champs est Requis"),
      picture: yup.string().required("Ce champs est Requis"),
      commission: yup.string().required("Ce champs est Requis"),
    })
    .required();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const imageId = (await saveImage(picture)) ?? "";
      if (!imageId) return;

      const serviceId = await addDocument("Specialities", {
        title: title,
        description: description,
        photoURL: imageId,
        specProviderCount: 0,
        commission: {
          amount: commissionAmount,
          currency: commissionCurrency
        }
      });

      if (serviceId) {
        toast.success("Service cree avec succes");
        onCreated();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      activeModal={isActive}
      onClose={onClose}
      className="max-w-xl w-[600px]"
      centered
      title="Nouveau service"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="gap-4 grid">
        <Textinput
          name="title"
          label="Titre"
          type="text"
          register={register}
          error={errors.title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-[48px]"
          placeholder="Entrer le titre"
        />
        <InputGroup
          type="text"
          label="Commission"
          value={commissionAmount}
          onChange={(e) => setCommitionAmount(e.target.value)}
          name="commission"
          prepend={
            <Select
              className="border-none w-24 active:border-none active:outline-none outline-none axctive:border-none focus:outline-none"
              onChange={(e) => setCommitionCurrency(e.target.value)}
              value={commissionCurrency}
              placeholder="Devise"
              register={register}
              options={currencies}
              name="devise"
            />
          }
          error={errors.commission}
          placeholder="Entrez le montant"
          register={register}
        />
        <Textinput
          name="description"
          value={description}
          label="Description"
          type="text"
          register={register}
          error={errors.description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-[48px]"
          placeholder="Entrer la description"
        />
        <Fileinput
          name="picture"
          label="Image"
          register={register}
          error={errors.picture}
          selectedFile={picture}
          onChange={(e) => setPicture(e.target.files[0] ?? "")}
          multiple={false}
          preview={true}
          accept="image/png, image/gif, image/jpeg"
          placeholder="Cliquez ici pour selectionner une image"
          className="h-40"
        />
        <Button
          type="submit"
          text="Creer"
          className="btn btn-dark bg-primary-500 block text-center w-full px-12 mt-4"
          isLoading={isLoading}
        />
      </form>
    </Modal>
  );
};

export default AddServiceModal;
