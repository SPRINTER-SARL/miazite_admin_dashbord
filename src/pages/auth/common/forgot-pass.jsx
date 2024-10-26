import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "@/utils/firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
   
  })
  .required();
const ForgotPass = () => {

  const [email, setemail] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    sendPasswordResetEmail(auth, email)
  .then(() => {
    alert("email de reinitialisation envoye")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="email"
        register={register}
        error={errors.email}
        value={email} 
        onChange={(e) => setemail(e.target.value)} 
        className="h-[48px]"
      />

      <button className="btn btn-dark block w-full text-center">
        Envoyer un E-mail de Récupération
      </button>
    </form>
  );
};

export default ForgotPass;
