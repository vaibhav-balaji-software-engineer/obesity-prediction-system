import {
  collection,
  getDocs,
  orderBy,
  query
} from "firebase/firestore";

import { db } from "../firebase";

export const getPredictionHistory = async (userId) => {
  const predictionsRef = collection(
    db,
    "users",
    userId,
    "predictions"
  );

  const historyQuery = query(
    predictionsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(historyQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};