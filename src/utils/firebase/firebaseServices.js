import { db, imgdb } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { count } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { generateUUID } from "@/utils/uuid";

// Fonction pour récupérer instantanément les données avec une condition
export const getDataByCondition = async (
  collectionName,
  field,
  operator,
  value
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(field, operator, value)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données par condition :",
      error
    );
    throw error;
  }
};

// reccuperer tout les document d'une collection
export const getAllDocument = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération tous les document", error);
    throw error;
  }
};

//reccuperer tout les document d'une sous collection aparti du parent
export const getAllSubDocument = async (
  collectionName,
  docName,
  subCollectionName
) => {
  try {
    const querySnapshot = query(
      collection(doc(db, collectionName, docName), subCollectionName)
    );
    const response = await getDocs(querySnapshot);

    const data = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération tous les sous document",
      error
    );
    throw error;
  }
};

// Fonction pour récupérer instantanément un document par son nom
export const getDocumentByName = async (collectionName, docName) => {
  try {
    const docRef = doc(db, collectionName, docName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Aucun document trouvé !");
      return null;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du document par nom :",
      error
    );
    throw error;
  }
};

export const getAllDocumentByCollection = async (collectionName) => {
  try {
    const docRef = doc(db, collectionName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Aucun document trouvé !");
      return null;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de tout les document :",
      error
    );
    throw error;
  }
};

// Fonction pour ajouter un document
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document ajouté avec l'ID :", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout du document :", error);
    throw error;
  }
};

//Ajouter un sous document a un document
export const addSubDocument = async (
  collectionName,
  docName,
  subCollectionName,
  data
) => {
  try {
    const myQuery = query(doc(db, collectionName, docName));
    const subQuery = query(collection(myQuery, subCollectionName));
    const response = await addDoc(subQuery, data);

    return response.id;
  } catch (error) {
    console.error("Erreur lors de la creation du document", error);
    throw error;
  }
};

export const updateSubDocument = async (request) => {
  try {
    console.log(request);
    
    const serviceDoc = doc(
      db,
      request.collectionName,
      request.docName,
      request.subCollectionName,
      request.subDocName
    );
    console.log(serviceDoc);

    await setDoc(serviceDoc, request.updatedData, {
      merge: true,
    });
    console.log("fine");
    
  } catch (error) {
    console.error("Erreur lors de la modification du document", error);
    throw error;
  }
};

// Fonction pour modifier un document
export const updateDocument = async (collectionName, docId, updatedData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, updatedData, { merge: true });
    console.log("Document modifié avec succès !");
  } catch (error) {
    console.error("Erreur lors de la modification du document :", error);
    throw error;
  }
};

// Fonction pour supprimer un document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression du document :", error);
    throw error;
  }
};

// save an image in the firestorage
export const saveImage = async (image) => {
  try {
    const imageType = image.type.split("/").at(-1);
    const storageRef = ref(imgdb, `${generateUUID()}.${imageType}`);

    const data = await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(data.ref);
    console.log(imageUrl);
    return imageUrl; // Retourne le lien de l'image
  } catch (error) {
    console.error("Erreur lors de l'insertion de l'image :", error);
    throw error;
  }
};

export const countDataByCondition = async (
  collectionName,
  field,
  operator,
  value
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(field, operator, value)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.size;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données par condition :",
      error
    );
    throw error;
  }
};
