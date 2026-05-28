import { initializeApp } from "firebase/app";
import { getFirestore, collection, collectionGroup, addDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// CRUD operations

// add document to a collection
export async function addGuestGroup(newGroup) {
  try {
    const docRef = await addDoc(collection(db, 'groups'), newGroup);
    console.log('Document added with ID:', docRef.id);
    return docRef;
  } catch (err) {
    console.error(err);
  }
}

// firebaseConfig.js

export async function addGuest(guestData, groupId) {
  try {
    const guestsRef = collection(db, 'groups', groupId, 'guests')
    const guestDoc = await addDoc(guestsRef, {
      ...guestData,
      nameLower: typeof guestData.name === 'string' ? guestData.name.trim().toLowerCase() : ''
    })
    console.log('Guest added with ID:', guestDoc.id)
    return guestDoc
  } catch (err) {
    console.error('Error adding guest:', err)
  }
}

export async function searchGuestsByName(name) {
  const normalized = name.trim().toLowerCase()
  if (!normalized) return []

  const guestsQuery = query(
    collectionGroup(db, 'guests'),
    where('nameLower', '>=', normalized),
    where('nameLower', '<=', normalized + '\uf8ff')
  )

  const querySnapshot = await getDocs(guestsQuery)
  return await Promise.all(querySnapshot.docs.map(async doc => {
    const data = doc.data()
    const groupRef = doc.ref.parent.parent
    const groupDoc = groupRef ? await getDoc(groupRef) : null

    return {
      id: doc.id,
      groupId: groupRef?.id ?? null,
      groupName: groupDoc?.exists() ? groupDoc.data().name : groupRef?.id ?? 'Unknown group',
      ...data
    }
  }))
}

// fetch all guest groups
export async function getGroups() {
  const querySnapshot = await getDocs(collection(db, 'groups'));
  return await Promise.all(querySnapshot.docs.map(async doc => {
    const guestsSnapshot = await getDocs(collection(db, 'groups', doc.id, 'guests'))
    return {
      id: doc.id,
      ...doc.data(),
      guests: guestsSnapshot.docs.map(guestDoc => ({
        id: guestDoc.id,
        ...guestDoc.data()
      }))
    }
  }))
}