import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
import { auth } from "@/utils/firebase/firebaseConfig";
import { getDataByCondition } from "@/utils/firebase/firebaseServices";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const navigate = useNavigate();
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const user1 = await auth.signInWithEmailAndPassword(email, password);

      if (user1) {
        const currentUserId = user1.user.uid;

        localStorage.setItem("Useruid", `${currentUserId}`);

        const user = await getDataByCondition(
          "Users",
          "uid",
          "==",
          currentUserId
        );
        console.log(user.length);
        user.forEach((doc) => {
          localStorage.setItem("userConnect", doc.id);
          localStorage.setItem("user", JSON.stringify(doc));
          dispatch(setUser(doc));
        });

        toast.success("Connecté avec succès");
        navigate("/");
      }
    } catch (error) {
      var errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        toast.error("Email ou mot de passe incorrect");
      } else if (errorCode === "auth/network-request-failed") {
        toast.error("Assurez-vous d'avoir une bonne connexion et réessayez");
      } else {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
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
        placeholder="Entrer votre adresse email"
      />
      <Textinput
        name="password"
        label="mots de passe"
        type="password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        register={register}
        error={errors.password}
        className="h-[48px]"
        placeholder="Entrer votre mot de passe"
      />
      <div className="flex justify-end">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Mot de passe oublié?{" "}
        </Link>
      </div>
      <Button
        type="submit"
        text="Se connecter"
        className="block w-full text-center btn-dark py-2 rounded-lg font-medium"
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;
