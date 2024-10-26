import { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Fileinput from "@/components/ui/Fileinput";
import Button from "@/components/ui/Button";
import { updateSubDocument, saveImage } from "@/utils/firebase/firebaseServices";

const SubServiceItem = ({ subService, serviceId, onRefresh }) => {
  const [isLoading, setIsLoading] = useState("");
  const [shouldEdit, setShouldEdit] = useState(false);
  const [shouldDelete, setShouldDelete] = useState(false);
  const [shouldDisplayOldImage, setshouldDisplayOldImage] = useState(
    !!subService?.photoURL
  );

  const [picture, setPicture] = useState("");
  const [title, setTitle] = useState(`${subService?.title}`);

  const toggleShouldEdit = () => setShouldEdit(!shouldEdit);
  const toggleShouldDelete = () => setShouldDelete(!shouldDelete);

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

  const editSubService = async () => {
    setIsLoading(true);
    try {
      const imageId = shouldDisplayOldImage
        ? subService?.photoURL
        : (await saveImage(picture)) ?? "";

      await updateSubDocument({
        docName: serviceId,
        collectionName: "Specialities",
        subDocName: subService?.id,
        subCollectionName: "SubSpecialities",
        updatedData: {
          title: title,
          photoURL: imageId,
        },
      });
      toggleShouldEdit();
      onRefresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubService = () => {};

  return (
    <div>
      {shouldEdit ? (
        <form
          className="flex justify-between items-center gap-2"
          onSubmit={handleSubmit(editSubService)}
          onReset={toggleShouldEdit}
        >
          <div className="flex items-center gap-2">
            {shouldDisplayOldImage ? (
              <div className="cursor-pointer" onClick={() => setshouldDisplayOldImage(false)}>
                <img
                  src={subService?.photoURL}
                  className="h-12 w-12 object-cover object-center rounded-md"
                  alt=""
                />
              </div>
            ) : (
              <Fileinput
                name="picture"
                register={register}
                error={errors.picture}
                selectedFile={picture}
                onChange={(e) => setPicture(e.target.files[0] ?? "")}
                multiple={false}
                preview={true}
                accept="image/png, image/gif, image/jpeg"
                placeholder="+"
                className="h-12 w-12 text-sm"
              />
            )}
            <Textinput
              name="title"
              type="text"
              register={register}
              error={errors.title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b"
              placeholder="Entrer le titre"
            />
          </div>
          <div className="flex justify-end items-center space-x-2 w-max">
            <Button
              type="reset"
              icon="heroicons-outline:x"
              className="btn btn-outline-light hover:bg-gray-200 text-gray-400 p-2 rounded-full border-none block text-center w-auto"
            />
            <Button
              type="submit"
              icon="heroicons-solid:check"
              className="btn btn-outline-primary text-primary-500 p-2 rounded-full border-none block text-center w-auto"
              isLoading={isLoading}
            />
          </div>
        </form>
      ) : shouldDelete ? (
        <div className="flex items-center gap-x-2 justify-between">
          <p className="text-gray-500 text-sm">
            Etes vous sur de vouloir supprimmer cet element?
          </p>
          <div className="flex justify-end items-center w-max gap-x-2">
            <Button
              type="reset"
              text="Non"
              onClick={toggleShouldDelete}
              className="btn btn-outline-light hover:bg-gray-200 text-gray-400 p-2 rounded-full border-none block text-center w-auto text-sm"
            />
            <Button
              type="submit"
              text="Oui"
              onClick={deleteSubService}
              className="btn btn-outline-primary text-red-500 p-2 rounded-full border-none block text-center w-auto text-sm"
              isLoading={isLoading}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 items-center">
            <img
              src={subService?.photoURL || "/logo.png"}
              className="w-10 h-10 rounded-md"
              alt=""
            />
            <span className="text-gray-500 font-medium">
              {subService?.title}
            </span>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={toggleShouldEdit}
              className="btn btn-outline-primary border-none p-2 text-center rounded-full"
              icon="heroicons-outline:pencil"
            />
            <Button
              onClick={toggleShouldDelete}
              className="btn btn-ountile-light border-none p-2 text-center hover:bg-gray-100 hover:text-red-500 rounded-full"
              icon="heroicons-outline:trash"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubServiceItem;
