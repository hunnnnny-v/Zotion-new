// Import necessary components from React and Clerk
"use client"; // Specify that this component should be rendered on the client-side
import React from "react"; // Import React for JSX and component creation

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs"; // Import components for user authentication and management from Clerk

import Breadcrumbs from "./Breadcrumbs"; // Import the Breadcrumbs component from the same directory

// Define the Header component
function Header() {
  // Get the current user information using the Clerk's useUser hook
  const { user } = useUser();

  // Return the JSX structure for the Header component
  return (
    <div className="flex items-center justify-between p-5">
      {/* If the user is signed in, display a greeting with their name */}
      {user && (
        <h1 className="text-2xl hover:font-bold">
          {/* Access the user's first name */}
          {user?.firstName}
          {"'s"} Space {/* Add an apostrophe and the word "Space" */}
        </h1>
      )}

      {/* Display the Breadcrumbs component */}
      <Breadcrumbs />

      {/* Display either the sign-in button or user button based on authentication status */}
      <div>
        <SignedOut>
          {/* Display the sign-in button when the user is not signed in */}
          <SignInButton />
        </SignedOut>
        <SignedIn>
          {/* Display the user button when the user is signed in */}
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

// Export the Header component as the default export
export default Header;
