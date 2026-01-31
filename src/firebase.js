import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRPwSOhf0bwaVeWPBbY0QPWLz-EzUw_nQ",
  authDomain: "military-cat-company.firebaseapp.com",
  projectId: "military-cat-company",
  storageBucket: "military-cat-company.firebasestorage.app",
  messagingSenderId: "199899847879",
  appId: "1:199899847879:web:b9d3bf10db8ebeaed4b2e2",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
