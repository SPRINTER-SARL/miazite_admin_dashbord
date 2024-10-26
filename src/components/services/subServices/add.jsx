import React, { useState } from "react";
import { addSubDocument, saveImage } from "@/utils/firebase/firebaseServices";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Fileinput from "@/components/ui/Fileinput";
import Button from "@/components/ui/Button";

const AddSubService = ({ onClose, serviceId }) => {
  const [title, setTitle] = useState("");
  const [picture, setPicture] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const schema = yup
    .object({
      title: yup.string().required("Ce champs est Requis"),
      picture: yup.string().required("Ce champs est Requis"),
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

      const subServiceId = addSubDocument(
        "Specialities",
        serviceId,
        "SubSpecialities",
        {
          title: title,
          photoURL: imageId,
          specProviderCount: 0,
          specialityId:serviceId,
        }
      );

      if (subServiceId) {
        onClose();
      }
    } catch (error) {
      toast.error("Erreur lors de la creation, veuillez réessayer");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={onClose}
      className="gap-2 grid pt-2"
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
        className="h-24"
      />
      <div className="w-full mt-2 flex justify-end space-x-4">
        <Button
          type="reset"
          text="Annuler"
          className="btn btn-light block text-center w-auto"
        />
        <Button
          type="submit"
          text="Creer"
          className="btn btn-dark bg-primary-500 block text-center w-auto"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

export default AddSubService;
