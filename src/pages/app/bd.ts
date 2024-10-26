export enum USER_ROLE {
  Utilisateur = "Utilisateur",
  Prestaire = "Prestataire",
}
export type User = {
  id?: string;
  uid: string;
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  password: string;
  role: Role;
  country: string | null;
  photo_profil: string;
  token: string | null;
  favoris: string[] | null;
  historique_prestations: string[] | null;
  note_moyenne: number;
  emailVerified: boolean;
  phonenumber: string | null;
  photoURL: string | null;
  avis: string[] | null;
  isActivated?: boolean;
  provideCertificateFile: boolean | null;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  lacationInfo: null | LocationInfo;
  identity: string | null;
  services: string | null;
  proofCertif: string | null;
};

export enum ReservationStatus {
  EN_ATTENTE = "En attente",
  EN_COURS = "En cours",
  TERMINEE = "Terminée",
  ANNULER = "Terminée",
}
export type Estimate = {
  providerData: {
    fullName: string;
    uid: string;
    avatar: string | null;
    ratingSummary: number;
    reviewCount: number | undefined;
  };
  total: number;
  userID: string;
  reservationID: string;
  items: {
    designation: string;
    unitPrice: string;
    qte: string;
  }[];
  laborCost: string;
};

export interface ProviderProfile {
  providerUID: string;
  id: string;
  identity: string | null;
  likes: string[] | null;
  proofCertif: string | null;
  reviews: Review[] | null;
  estimateCount: number | null;
  servicePending: number | null;
  serviceLoading: number | null;
  serviceComplete: number | null;
  // ==================

  profile: string | null;
  service: string | null;
  services: string | null;
  qualifications: string[] | null;
  experienceYears: number | null;
  laborCost: number | null;
  cvLink: string | null;

  experiences:
    | {
        title: string;
        company: string;
        location: string;
        startDate: number;
        endDate: number;
      }[]
    | null;

  training:
    | {
        degree: string;
        school: string;
        startDate: number;
        endDate: number;
      }[]
    | null;
}

// types.ts
export enum Role {
  Utilisateur = "Utilisateur",
  Prestaire = "Prestataire",
}

/**
    sudo apt update && sudo apt upgrade -y
    sudo apt install update-manager-core
    sudo do-release-upgrade
   */

export interface Account {
  password: string;
  email: string;
  role: Role | null;
}

export interface Speciality {
  title: string;
  description: string;
  specProviderCount: number;
  photoURL: string;
  id: string;
}

export interface Task {
  title: string;
  id: string;
  serviceId: string;
}

type Review = {
  userId: string;
  rating: number;
  text: string;
  createdAt: number;
};

export const CollectionNames = {
  Users: "Users",
  Specialities: "Specialities",
  Reservations: "Reservations",
  Estimates: "Estimates",
  Messages: "Messages",
  Discussions: "Discussions",
  Tasks: "Tasks",
  Profile: "Profile",
  Notifications: "notifications",
};

export interface LocationInfo {
  city: string;
  town: string;
  suburb: string;
  state: string;
  state_code: string;
  country: string;
  country_code: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
  flag: string;
}

export interface ReservationData {
  timestamp: number | null;
  address: LocationInfo | null;
  selectedEstimate: string | null;
  serviceID: string | null;
  serviceData: Speciality | null;
  cleintData: {
    fullName: string;
    avatar: string;
  } | null;
  estimateProviderIDS: string[] | null;
  serviceTitle: string | null;
  status: ReservationStatus | null;
  subTaskTitle: null | string;
  tasksIds: Task[] | null;
  explanation: Explanation | null;
  providerID: string | null;
  userID: string | null;
  providerAvatar: string[] | null;
}
