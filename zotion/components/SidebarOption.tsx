"use client"; // Specifies that the component should be rendered on the client-side

import { db } from "@/firebase"; // Imports the Firestore database instance
import { doc } from "firebase/firestore"; // Imports the `doc` function from Firebase for creating document references
import Link from "next/link"; // Imports the Link component for navigation
import { usePathname } from "next/navigation"; // Imports the `usePathname` hook for getting the current pathname
import { useDocumentData } from "react-firebase-hooks/firestore"; // Imports the `useDocumentData` hook for fetching document data

function SidebarOption({ href, id }: { href: string; id: string }) {
  // Fetches document data from Firestore using the provided document ID
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));

  // Gets the current pathname from the URL
  const pathname = usePathname();

  // Checks if the current path includes the provided href and is not the root path
  const isActive = href.includes(pathname) && pathname!== "/";

  // If data is not available, return null
  if (!data) return null;

  // Renders a Link component with styling based on the isActive flag
  return (
    <Link
      href={href}
      className={`border p-2 rounded-md ${
        isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
      }`}
    >
      {/* Displays the document title */}
      <p className="truncate">{data.title}</p>
    </Link>
  );
}

export default SidebarOption; // Exports the SidebarOption component as the default export
