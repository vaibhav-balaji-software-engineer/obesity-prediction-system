import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";

export const savePrediction = async (userId, predictionData) => {
  const predictionsRef = collection(
    db,
    "users",
    userId,
    "predictions"
  );

  const snapshot = await getDocs(predictionsRef);

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const todaysPredictions = snapshot.docs.filter((doc) => {
    const createdAt = doc.data().createdAt;

    if (!createdAt || typeof createdAt.toDate !== "function") {
      return false;
    }

    const date = createdAt.toDate();

    return date >= startOfDay && date < endOfDay;
  });

  if (todaysPredictions.length >= 5) {
    throw new Error(
      "You have reached the maximum of 5 predictions for today."
    );
  }

  await addDoc(predictionsRef, {
    ...predictionData,
    createdAt: serverTimestamp()
  });
};
export const getTodaysPredictionCount = async (userId) => {
  const predictionsRef = collection(
    db,
    "users",
    userId,
    "predictions"
  );

  const snapshot = await getDocs(predictionsRef);

  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const todaysPredictions = snapshot.docs.filter((doc) => {
    const createdAt = doc.data().createdAt;

    if (!createdAt || typeof createdAt.toDate !== "function") {
      return false;
    }

    const date = createdAt.toDate();

    return date >= startOfDay && date < endOfDay;
  });

  return todaysPredictions.length;
};