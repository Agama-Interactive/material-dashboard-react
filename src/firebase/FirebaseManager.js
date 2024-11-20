import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";

const databaseId = "(default)";
const firebaseConfig = {
  apiKey: "AIzaSyDz8rQC8HkRSZWZpfd3ORLT9FJSF-fRisU",
  authDomain: "diactive-dev.firebaseapp.com",
  projectId: "diactive-dev",
  storageBucket: "diactive-dev.appspot.com",
  messagingSenderId: "884426083339",
  appId: "1:884426083339:web:9ba65eb12b90a32650cb0e",
  measurementId: "G-5JTDRYT9YH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app, databaseId);

export const getAllUsers = async () => {
  await signInWithEmailAndPassword(auth, "jay@agama.io", "password");

  const q = query(collection(firestore, "users"), orderBy("name"));
  const querySnapshot = await getDocs(q);
  const users = querySnapshot.docs.map((doc) => {
    const userData = doc.data();
    return {
      id: doc.id,
      name: userData.name,
      profilePicture: userData.profilePicture,
      level: userData.level,
      muscleStrength: userData.muscleStrength,
      cardioCapacity: userData.cardioCapacity,
      fitnessLevel: userData.fitnessLevel,
    };
  });

  // Sort so that it's case insensitive as the query is case sensitive, i.e. returns users with names [A-Za-z]
  users.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  return users;
};
