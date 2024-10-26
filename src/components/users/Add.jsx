import React, { useEffect, useState } from "react";
import { addDocument } from "@/utils/firebase/firebaseServices";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { auth } from "@/utils/firebase/firebaseConfig";

const AddUserModal = ({ shouldAdd, toggleShouldAdd }) => {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup
    .object({
      email: yup.string().email("Invalid email").required("L'Email est Requis"),
      nom: yup.string().required("Ce champs est Requis"),
      prenom: yup.string().required("Ce champs est Requis"),
      telephone: yup.string().required("Ce champs est Requis"),
      password: yup
        .string()
        .required("Ce champs est Requis")
        .min(8, "Minimum 8 caracteres")
        .max(16, "Maximum 8 caracteres"),
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
      const userProprietaire = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      const user = userProprietaire.user;
      console.log(user);

      addDocument("Users", {
        email: email,
        prenom: prenom,
        nom: nom,
        telephone: telephone,
        uid: user.uid,
        typeUsersId: userType,
      });

      await fetchUsersByType();
      toggleShouldAdd();
      toast.success("User cree avec succes");
    } catch (error) {
      toast.error("Erreur lors de la creation, veuillez réessayer");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        activeModal={shouldAdd}
        onClose={toggleShouldAdd}
        className="max-w-xl w-[600px]"
        centered
        title="Nouvel utilisateur"
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
            placeholder="Entrer l'adresse email"
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
            placeholder="Entrer le numero de telephone"
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
            name="password"
            label="Mot de passe"
            type="password"
            register={register}
            error={errors.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-[48px]"
            placeholder="Entrer le mot de passe"
          />
          <div className="pb-4"></div>
          <div className="pb-4 flex justify-end w-full">
            <Button
              type="submit"
              text="Creer"
              className="btn btn-dark bg-primary-500 block text-center px-12 mt-4"
              isLoading={isLoading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddUserModal;
