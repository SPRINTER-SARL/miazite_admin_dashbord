import { useEffect, useState } from "react";
import {
  getDataByCondition,
  updateDocument,
} from "@/utils/firebase/firebaseServices";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AddUserModal from "@/components/users/Add";
import EditUserModal from "@/components/users/Edit";
import UserDetailsModal from "@/components/users/Detail";
import Dropdown from "@/components/ui/Dropdown";
import ConfirmationModal from "@/components/ConfirmationModal";
import UserImagesPreview from "@/components/UserImagesPreview";

const columns = [
  {
    label: "Documents",
  },
  {
    label: "Nom",
  },
  {
    label: "Prenom",
  },
  {
    label: "Email",
  },
  {
    label: "Telephone",
  },
  {
    label: "Status",
  },
  {
    label: "Action",
  },
];

const userRoles = ["Prestataire", "Utilisateur", "Admin"];

const UsersList = () => {
  const { user } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetchUsersByType = async () => {
    setIsLoading(true);
    const response = await getDataByCondition(
      "Users",
      "role",
      "==",
      userRoles[activeTab]
    );

    setUsers(response);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsersByType();
  }, [activeTab]);

  useEffect(() => {
    setActiveUser(users.find((user) => user.id === userId));
  }, [userId]);

  const [shouldActivate, setShouldActivate] = useState(false);
  const [shouldDeactivate, setShouldDeactivate] = useState(false);

  const [shouldEdit, setShouldEdit] = useState(false);
  const [shouldAdd, setShouldAdd] = useState(false);
  const [shouldDisplayDetails, setShouldDisplayDetails] = useState(false);

  const toggleShouldAdd = () => setShouldAdd(!shouldAdd);
  const toggleShouldEdit = () => setShouldEdit(!shouldEdit);
  const toggleShouldDisplayDetails = () =>
    setShouldDisplayDetails(!shouldDisplayDetails);
  const toggleShouldDeactivate = () => setShouldDeactivate(!shouldDeactivate);
  const toggleShouldActivate = () => setShouldActivate(!shouldActivate);

  const [shouldPreviewImages, setShouldPreviewImages] = useState(false);
  const toggleShouldPreviewImages = () =>
    setShouldPreviewImages(!shouldPreviewImages);

  const [actionLoading, setActionLoading] = useState(false);

  const handelActivate = async () => {
    setActionLoading(true);
    try {
      await updateDocument("Users", activeUser?.id, {
        isActivated: true,
      });
      setShouldActivate(false);
      await fetchUsersByType();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };
  const handelDeactivate = async () => {
    setActionLoading(true);
    try {
      await updateDocument("Users", activeUser?.id, {
        isActivated: false,
      });
      toggleShouldActivate();
      await fetchUsersByType();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl xl:text-3xl my-4">Utilisateurs</h1>
        {user?.role === "Superviseur" && (
          <Button
            onClick={toggleShouldAdd}
            className="btn btn-dark bg-primary-500 text-center rounded-lg"
            text="Nouvel ustilisateur"
            icon="heroicons-outline:plus"
          />
        )}
      </div>

      <div className="w-full border-b border-b-gray-100">
        <div className="flex items-center gap-x-2 py-4 mt-2">
          <Button
            onClick={() => setActiveTab(0)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 0
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="Prestataires"
          />
          <Button
            onClick={() => setActiveTab(1)}
            className={`btn rounded-full py-1.5 text-center px-6 ${
              activeTab === 1
                ? "btn-dark bg-primary-500"
                : "btn-ligth bg-primary-100 text-black-500"
            }`}
            text="Clients"
          />
        </div>
      </div>
      {!!isLoading ? (
        <Loading />
      ) : (
        <Card
          title={`${activeTab === 0 ? "Prestataires" : "Clients"}`}
          titleClass="text-3xl pt-4"
          className="min-h-[70dvh]"
          headerslot={
            <Button
              icon="heroicons-outline:refresh"
              onClick={fetchUsersByType}
              className="btn btn-light rounded-full p-2 mt-2"
            />
          }
          noborder
        >
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table className="min-w-full divide-y divide-slate-800 border-t table-fixed dark:divide-slate-100">
                  <thead className="bg-primary-500 dark:bg-slate-100">
                    <tr>
                      {columns.map((column, i) => (
                        <th
                          key={i}
                          scope="col"
                          className=" table-th  text-white "
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {users.length ? (
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      {users.map((row) => (
                        <tr
                          onDoubleClick={() => {
                            toggleShouldDisplayDetails();
                            setUserId(row.id);
                          }}
                          key={row.uid}
                          className="hover:bg-slate-200 hover:cursor-pointer dark:hover:bg-slate-700"
                        >
                          <td className="table-td font-semibold text-slate-800">
                            <div
                              className="flex items-center justify-center cursor-pointer gap-x-2"
                              onClick={() => {
                                setUserId(row.id);
                                toggleShouldPreviewImages();
                              }}
                            >
                              <img
                                src={row?.identity || "/logo.png"}
                                alt=""
                                className="w-12 h-12 rounded object-cover bg-gray-100 border border-gray-100"
                              />
                              <img
                                src={row?.proofCertif || "/logo.png"}
                                alt=""
                                className="w-12 h-12 rounded object-cover bg-gray-100 border border-gray-100"
                              />
                            </div>
                          </td>
                          <td className="table-td font-semibold text-slate-800">
                            {row?.nom}
                          </td>
                          <td className="table-td text-slate-800">
                            {row?.prenom}
                          </td>
                          <td className="table-td font-semibold text-gray-500">
                            {row?.email}
                          </td>
                          <td className="table-td">{row?.phonenumber}</td>
                          <td className="table-td">
                            {row?.isActivated ? (
                              <div className="bg-green-200 text-green-500 px-3 py-1 5 text-sm inline-flex font-medium rounded-full w-min">
                                Actif
                              </div>
                            ) : (
                              <div className="bg-red-100 text-red-500 px-3 py-1 5 text-sm inline-flex font-medium rounded-full w-min">
                                Inactif
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <Dropdown
                                icon="heroicons-outline:ellipsis-vertical"
                                items={[
                                  {
                                    label: "View details",
                                    icon: "heroicons-outline:eye",
                                    onClick: () => {
                                      toggleShouldDisplayDetails();
                                      setUserId(row?.id);
                                    },
                                  },
                                  {
                                    label: "Editer",
                                    icon: "heroicons-outline:pencil",
                                    onClick: () => {
                                      toggleShouldEdit();
                                      setUserId(row?.id);
                                    },
                                  },
                                  {
                                    label: row?.isActivated
                                      ? "Desactiver"
                                      : "Activer",
                                    icon: row?.isActivated
                                      ? "heroicons-outline:no-symbol"
                                      : "heroicons-outline:check",
                                    onClick: () => {
                                      row?.isActivated
                                        ? toggleShouldDeactivate()
                                        : toggleShouldActivate();
                                      setUserId(row.id);
                                    },
                                  },
                                ]}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <caption className="caption-bottom text-center py-24">
                      <span> Oups! Aucun utilisateur pour l'intant</span>
                    </caption>
                  )}
                </table>
              </div>
            </div>
          </div>
        </Card>
      )}
      {shouldPreviewImages && (
        <UserImagesPreview
          user={activeUser}
          isActive={shouldPreviewImages}
          onClocse={toggleShouldPreviewImages}
          onDeactivate={() => {
            toggleShouldDeactivate();
            toggleShouldPreviewImages();
          }}
          onActivate={() => {
            toggleShouldActivate();
            toggleShouldPreviewImages();
          }}
        />
      )}

      {shouldAdd && (
        <AddUserModal
          toggleShouldAdd={toggleShouldAdd}
          shouldAdd={shouldAdd}
        />
      )}

      {shouldEdit && (
        <EditUserModal
          shouldEdit={shouldEdit}
          toggleShouldEdit={toggleShouldEdit}
          user={activeUser}
        />
      )}

      {shouldDisplayDetails && (
        <UserDetailsModal
          isActive={shouldDisplayDetails}
          onClose={()=> {toggleShouldDisplayDetails(); setActiveUser(null)}}
          user={activeUser}
          onEdit={toggleShouldEdit}
          onDelete={toggleShouldDeactivate}
        />
      )}

      {shouldActivate && (
        <ConfirmationModal
          title="Activation"
          theme="BLUE"
          text={`Etes vous sur de vouloir vraiment activer l'utilisateur ${activeUser?.nom} ${activeUser?.prenom}`}
          isActive={shouldActivate}
          onClose={toggleShouldActivate}
          onConfirm={handelActivate}
          isLoading={actionLoading}
        />
      )}

      {shouldDeactivate && (
        <ConfirmationModal
          title="Desactivation"
          text={`Etes vous sur de vouloir vraiment desactiver l'utilisateur ${activeUser?.nom} ${activeUser?.prenom}`}
          theme="RED"
          isActive={shouldDeactivate}
          onClose={toggleShouldDeactivate}
          onConfirm={handelDeactivate}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default UsersList;
