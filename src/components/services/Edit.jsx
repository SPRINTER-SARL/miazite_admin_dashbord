import { useState } from "react";
import { updateDocument, saveImage } from "@/utils/firebase/firebaseServices";
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Select from "@/components/ui/Select";
import InputGroup from "@/components/ui/InputGroup";

const EditServiceModal = ({ onClose, service }) => {
  const [title, setTitle] = useState(`${service?.title ?? ""}`);
  const [description, setDescription] = useState(
    `${service?.description ?? ""}`
  );
  const [picture, setPicture] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [commissionAmount, setCommitionAmount] = useState(
    service?.commission?.amount ?? 0
  );
  const [commissionCurrency, setCommitionCurrency] = useState(
    `${service?.commission?.currency ?? "DZ"}`
  );
  const [shouldDisplayOldImage, setshouldDisplayOldImage] = useState(
    !!service?.photoURL
  );

  const currencies = [
    { value: "DZ", label: "DZ" },
    { value: "USD", label: "USD" },
  ];

  const schema = yup
    .object({
      title: yup.string().required("Ce champs est Requis"),
      // picture: yup.string().required("Ce champs est Requis"),
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
      const imageId = shouldDisplayOldImage
        ? service.photoURL
        : await saveImage(picture) ?? "";

      if (!imageId) return;

      await updateDocument("Specialities", service.id, {
        title: title,
        description: description,
        photoURL: imageId,
        specProviderCount: 0,
        commission: {
          amount: commissionAmount,
          currency: commissionCurrency,
        },
      });

      toast.success("Service cree avec succes");
      await onClose();
    } catch (error) {
      toast.error("Erreur lors de la creation, veuillez réessayer");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onReset={onClose}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 pt-0 w-[500px] max-h-[80dvh]"
    >
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
      {shouldDisplayOldImage ? (
        <div className="w-full h-48 relative">
          <img
            src={service.photoURL}
            className="w-full h-full object-cover object-center border rounded-md"
            alt=""
          />
          <Button
            className="absolute top-4 right-4 btn btn-outline-light text-gray-500 bg-gray-50 rounded-full p-2 hover:text-red-500"
            icon="heroicons:trash"
            onClick={() => setshouldDisplayOldImage(false)}
          />
        </div>
      ) : (
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
          className="h-48"
        />
      )}

      <div className="w-full mt-2 flex justify-end space-x-4">
        <Button
          type="reset"
          text="Annuler"
          className="btn btn-light block text-center w-auto px-8"
        />
        <Button
          type="submit"
          text="Enregistrer"
          className="btn btn-dark bg-primary-500 block text-center w-auto px-8"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

export default EditServiceModal;
