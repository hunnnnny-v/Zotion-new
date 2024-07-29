"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  // Protect the function with Clerk.nextjs server-side authentication
   auth().protect();

  // Get session claims from the authenticated user (if logged in)
  const { sessionClaims } = await auth();

  // Create a reference to the "documents" collection in Firestore
  const docCollectionRef = adminDb.collection("documents");

  // Create a new document in the "documents" collection with a title
  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });

  // Get the ID of the newly created document
  const docId = docRef.id;

  // Assuming `users` collection stores user data
  // Create a subcollection named "rooms" within the user's document
  // (based on their email) and add a document with details:
  await adminDb
    .collection("users")
    .doc(sessionClaims?.email!) // Use email if available
    .collection("rooms")
    .doc(docId)
    .set({
      userId: sessionClaims?.email!,
      role: "owner",
      createdAt: new Date(),
      roomId: docId,
    });

  // Return the ID of the newly created document
  return { docId };
}

export async function deleteDocument(roomId: string) {
  auth().protect();

  console.log("delete document", roomId);

  try {
    //delete the room reference itself
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    //delete the room reference in the user's collection for every user using the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    //delete the room in the liveblocks.
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth().protect();

  console.log("inviteUserToDocument", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  auth().protect();
  console.log("removeUserFromDocument", roomId, email);

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}
