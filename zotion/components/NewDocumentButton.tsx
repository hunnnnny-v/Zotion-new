"use client"; // Specifies that the component should be rendered on the client-side

import { useTransition } from "react"; // Imports the useTransition hook from React
import { Button } from "./ui/button"; // Imports the Button component from the ui/button module
import { Router } from "lucide-react"; // Imports the Router icon from the lucide-react library
import { useRouter } from "next/navigation"; // Imports the useRouter hook from Next.js
import { createNewDocument } from "@/actions/actions"; // Imports the createNewDocument function from the actions module

function NewDocumentButton() {
  // Creates a transition state and a function to start the transition
  const [isPending, startTransition] = useTransition();

  // Gets the router instance for navigation
  const router = useRouter();

  // Handles the creation of a new document
  const handleCreateNewDocument = () => {
    // Starts a transition to prevent UI blocking during the document creation process
    startTransition(async () => {
      // Creates a new document using the createNewDocument function
      const { docId } = await createNewDocument();
      // Navigates to the newly created document page
      router.push(`/doc/${docId}`);
    });
  };

  // Renders the button component
  return (
    <Button onClick={handleCreateNewDocument} disabled={!isPending}>
      {/* Displays either "Creating..." or "New Document" based on the pending state */}
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
}

export default NewDocumentButton; // Exports the NewDocumentButton component as the default export
