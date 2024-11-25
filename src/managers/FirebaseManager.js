import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

import firebaseConfig from "../firebaseConfig.json";

const databaseId = "(default)";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app, databaseId);

export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

export const signInUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return false;
  }
  return true;
};

export const signOutUser = () => {
  signOut(auth);
};

export const sendPwdResetEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    return false;
  }
  return true;
};

export const getUserData = async (userId) => {
  const docRef = doc(firestore, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const getUserEmail = async (userId) => {
  const functions = getFunctions();
  const getUserEmailFunc = httpsCallable(functions, "getUserEmail");
  const result = await getUserEmailFunc({ userId: userId });
  return result.data;
};

export const getUserDevices = async (userId) => {
  const q = query(
    collection(firestore, "devices"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(q);

  const devices = {
    models: [],
    platforms: [],
  };
  querySnapshot.docs.forEach((doc) => {
    const deviceData = doc.data();
    devices.models.push(deviceData.deviceModel);
    const devicePlatform = determineDevicePlatform(deviceData.deviceOS);
    devices.platforms.push(devicePlatform);
  });
  return devices;
};

export const getExerciseSessions = async (userId) => {
  const q = query(
    collection(firestore, "exerciseSessions"),
    where("userId", "==", userId),
    orderBy("createdAt")
  );
  const querySnapshot = await getDocs(q);

  const exerciseSessions = querySnapshot.docs.map((doc) => {
    const sessionData = doc.data();
    return {
      createdAt: sessionData.createdAt,
      rating: sessionData.rating,
      category: sessionData.category,
      isAerobic: sessionData.isAerobic,
      exercises: sessionData.exercises,
      glucoseLevelPre: sessionData.glucoseLevelPre,
      glucoseArrowPre: sessionData.glucoseArrowPre,
      glucoseLevelPost: sessionData.glucoseLevelPost,
      glucoseArrowPost: sessionData.glucoseArrowPost,
      heartRateAvg: sessionData.heartRateAvg,
      heartRateMin: sessionData.heartRateMin,
      heartRateMax: sessionData.heartRateMax,
    };
  });
  return exerciseSessions;
};

export const getAllUsers = async () => {
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

const determineDevicePlatform = (deviceOS) => {
  const platforms = ["Android", "iOS"];
  for (const platform of platforms) {
    if (deviceOS.includes(platform)) return platform;
  }
};
