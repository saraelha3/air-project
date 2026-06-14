import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, query, orderByChild, remove } from "firebase/database";

// Firebase configuration — air-projet
const firebaseConfig = {
  apiKey: "AIzaSyDViftIWuTFIzMNgqttAOZ2B5rSWkGqs6E",
  authDomain: "air-projet.firebaseapp.com",
  databaseURL: "https://air-projet-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "air-projet",
  storageBucket: "air-projet.firebasestorage.app",
  messagingSenderId: "831877641578",
  appId: "1:831877641578:web:fa60495680ac3d29a6e113",
  measurementId: "G-NXERQ2CEJB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ── Reference to the historique node ────────────────────────────────────────
const historiqueRef = ref(database, "historique");

/**
 * Push a new history entry to the Realtime Database.
 * @param {Object} entry – the prediction row data to persist
 * @returns {Promise} – resolves when the write completes
 */
export function pushHistoryEntry(entry) {
  return push(historiqueRef, {
    ...entry,
    timestamp: Date.now(),
  });
}

/**
 * Listen for real-time changes to the historique node.
 * Calls `callback(rows)` whenever data changes, with rows sorted newest-first.
 * @param {Function} callback – receives an array of history row objects
 * @returns {Function} unsubscribe – call to stop listening
 */
export function onHistoryChange(callback) {
  const q = query(historiqueRef, orderByChild("timestamp"));
  const unsubscribe = onValue(q, (snapshot) => {
    const rows = [];
    snapshot.forEach((child) => {
      rows.push({ id: child.key, ...child.val() });
    });
    // Newest first
    rows.reverse();
    callback(rows);
  });
  return unsubscribe;
}

/**
 * Delete a history entry from Realtime Database.
 * @param {string} id – the unique entry ID to remove
 * @returns {Promise} – resolves when the delete completes
 */
export function deleteHistoryEntry(id) {
  return remove(ref(database, `historique/${id}`));
}

export { database };
