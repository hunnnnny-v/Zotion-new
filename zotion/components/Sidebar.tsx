"use client"; // Specifies that the component should be rendered on the client-side

import { useCollection } from "react-firebase-hooks/firestore"; // Import for listening to Firestore collections
import { MenuIcon } from "lucide-react"; // Import for Menu icon component
import NewDocumentButton from "./NewDocumentButton"; // Import for "New Document" button
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Imports for Sheet UI component
import { useUser } from "@clerk/nextjs"; // Import for getting user information
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from "firebase/firestore"; // Imports for Firestore queries and data structures
import { db } from "@/firebase"; // Import for Firestore database instance
import { useEffect, useState } from "react"; // Imports for component state and lifecycle effects
import SidebarOption from "./SidebarOption"; // Import for SidebarOption component

// Interface definition for documents retrieved from the "rooms" collection
interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

function Sidebar() {
  const { user } = useUser(); // Get the current user from Clerk

  // State to store grouped room documents (owners and editors)
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  // Use Firestore hook to listen for documents based on user email (if user exists)
  const [data, loading, error] = useCollection(
    user && // Only query if user is logged in
      query(
        collectionGroup(db, "rooms"), // Query all documents across subcollections within "rooms"
        where("userId", "==", user.emailAddresses[0].toString()) // Filter by user's email
      )
  );

  // useEffect hook to run after data changes
  useEffect(() => {
    if (!data) return; // Skip if data is not available

    // Group documents by role (owner/editor) using reduce
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument; // Get document data

        if (roomData.role === "owner") {
          acc.owner.push({ id: curr.id, ...roomData }); // Add owner document
        } else {
          acc.editor.push({ id: curr.id, ...roomData }); // Add editor document
        }
        return acc;
      },
      { owner: [], editor: [] }
    ); // Initial accumulator object

    setGroupedData(grouped); // Update state with grouped data
  }, [data]); // Re-run useEffect whenever data changes

  // Define JSX for menu options displayed in the sidebar
  const menuOptions = (
    <>
      <NewDocumentButton /> {/* "New Document" button */}
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {/* My Documents */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No documents found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My Documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}

        {/* Shared with me */}
        {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Shared With Me
            </h2>
            {groupedData.editor.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}
      </div>
    </>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={30} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}

export default Sidebar;
