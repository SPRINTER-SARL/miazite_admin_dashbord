import React, { useState } from "react";
import { updateDocument } from "@/utils/firebase/firebaseServices";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const EditUserModal = ({ shouldEdit, toggleShouldEdit, user }) => {
  // const user = users.find((user) => user.id == userId);

  const [email, setEmail] = useState(user.email);
  const [nom, setNom] = useState(user.nom);
  const [prenom, setPrenom] = useState(user.prenom);
  const [cni, setCNI] = useState(user.num_cni);
  const [telephone, setTelephone] = useState(user.telephone);
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup
    .object({
      email: yup.string().email("Invalid email").required("L'Email est Requis"),
      nom: yup.string().required("Ce champs est Requis"),
      prenom: yup.string().required("Ce champs est Requis"),
      cni: yup.string().required("Ce champs est Requis"),
      telephone: yup.string().required("Ce champs est Requis"),
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

  const onSubmit = async (data) => {
    try {
      updateDocument("Users", userId, {
        email: email,
        prenom: prenom,
        nom: nom,
        telephone: telephone,
        num_cni: cni,
      });
      await fetchUsersByType();
      toggleShouldEdit();
      toast.success("utilisateur modifier avec succes");
    } catch (error) {
      toast.error("Erreur lors de l'edition, veuillez réessayer");
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        activeModal={shouldEdit}
        onClose={toggleShouldEdit}
        className="max-w-xl"
        centered
        title="Modifier Profile"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="gap-4 grid grid-cols-2"
        >
          <Textinput
            name="email"
            label="Adresse email"
            type="email"
            register={register}
            error={errors.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[48px]"
            placeholder="Entrer le adresse email"
          />
          <Textinput
            name="telephone"
            label="Telephone"
            type="number"
            register={register}
            error={errors.telephone}
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="h-[48px]"
            placeholder="Entrer le adresse telephone"
          />
          <Textinput
            name="nom"
            value={nom}
            label="Nom"
            type="text"
            register={register}
            error={errors.nom}
            onChange={(e) => setNom(e.target.value)}
            className="h-[48px]"
            placeholder="Entrer le adresse nom"
          />
          <Textinput
            name="prenom"
            label="Prenom"
            type="text"
            register={register}
            error={errors.prenom}
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="h-[48px]"
            placeholder="Entrer le adresse prenom"
          />
          <Textinput
            name="cni"
            label="cni"
            type="text"
            register={register}
            error={errors.cni}
            value={cni}
            onChange={(e) => setCNI(e.target.value)}
            className="h-[48px]"
            placeholder="Entrer le numero decni"
          />
          <div className="pb-4">
            <Button
              type="submit"
              text="Enregistrer"
              className="btn btn-dark block w-full text-center "
              isLoading={isLoading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditUserModal;
