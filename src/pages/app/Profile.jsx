import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { useEffect, useState } from "react";
import {
  getDocumentByName,
  updateDocument,
} from "@/utils/firebase/firebaseServices";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
// import WigetBg from "@/assets/images/all-img/widget-bg-1.png";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("L'Email est Requis"),
    nom: yup.string().required("Ce champs est Requis"),
    prenom: yup.string().required("Ce champs est Requis"),
    cni: yup.string().required("Ce champs est Requis"),
    phoneNumber: yup.string().required("Ce champs est Requis"),
  })
  .required();
const Profile = () => {
  const [user, setUser] = useState({});
  const [shouldEdit, setShouldEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toogleShouldEdit = () => setShouldEdit(!shouldEdit);

  const userId = localStorage.getItem("userConnect") || "";

  const fetchProfile = async () => {
    const response = await getDocumentByName("Users", userId);

    setUser(response);
  };

  const EditProfileModal = ({ user }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState(user?.email ?? "");
    const [nom, setNom] = useState(user?.nom ?? "");
    const [prenom, setPrenom] = useState(user?.prenom ?? "");
    const [phoneNumber, setPhoneNumber] = useState(user?.phonenumber ?? "");
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm({
      resolver: yupResolver(schema),
      //
      mode: "all",
    });

    const onSubmit = async () => {
      setIsLoading(true);
      try {
        const user = updateDocument("Users", userId, {
          email: email,
          prenom: prenom,
          nom: nom,
          phonenumber: phoneNumber,
        });
        dispatch(setUser(user));
        fetchProfile();
        toogleShouldEdit();
        toast.success("Prolif modifier");
      } catch (error) {
        toast.error("Erreur lors de l'edition,veuillez réessayer");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <>
        <Modal
          activeModal={shouldEdit}
          onClose={toogleShouldEdit}
          className="w-[400px]"
          centered
          title="Modifier Profile"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <Textinput
              name="nom"
              value={nom}
              label="Nom"
              type="text"
              register={register}
              error={errors.nom}
              onChange={(e) => setNom(e.target.value)}
              className="h-[48px]"
              placeholder="Entrer votre adresse nom"
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
              placeholder="Entrer votre adresse prenom"
            />
            <Textinput
              name="email"
              label="Adresse email"
              type="email"
              register={register}
              error={errors.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[48px]"
              placeholder="Entrer votre adresse email"
            />
            <Textinput
              name="phoneNumber"
              label="Telephone"
              type="number"
              register={register}
              error={errors.phoneNumber}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-[48px]"
              placeholder="Entrer votre adresse phoneNumber"
            />

            <Button
              type="submit"
              text="Enregistrer"
              className="btn btn-dark block w-full text-center "
              isLoading={isLoading}
            />
          </form>
        </Modal>
      </>
    );
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  <img
                    src={user?.photoURL|| "/logo.png"}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                  <Link
                    to="#"
                    className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  >
                    <Icon icon="heroicons:camera" />
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {user?.nom + " " + user?.prenom}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <Button
              onClick={toogleShouldEdit}
              icon="heroicons:pencil-square"
              className="btn btn-dark"
              text="Modifier"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4">
            <Card title="Informations">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="capitalise text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href={`mailto:${user?.email}`}
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {user?.email}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="capitalise text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      TELEPHONE
                    </div>
                    <a
                      href={`tel:${user?.phonenumber}`}
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {user?.phonenumber}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map-pin" />
                  </div>
                  <div className="flex-1">
                    <div className="capitalise text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      LOCALISATION
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      <span>{user?.lacationInfo?.flag ?? ""}</span>
                      <span className="ml-2">
                        {user?.lacationInfo?.country ?? ""}
                      </span>
                      <span className="ml-2">
                        {user?.lacationInfo?.city ?? ""}
                      </span>
                      <span className="ml-2">
                        {user?.lacationInfo?.formatted_address ?? ""}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-3"></div>
        </div>
      </div>
      {shouldEdit && <EditProfileModal user={user} />}
    </div>
  );
};

export default Profile;
