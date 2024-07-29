"use client"; // Specifies that the component should be rendered on the client-side

import { useMyPresence, useOthers } from "@liveblocks/react/suspense"; // Imports hooks for managing presence and other users from Liveblocks

import { PointerEvent } from "react"; // Imports the PointerEvent type from React
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({
  children,
}: {
  // Defines a functional component with a children prop
  children: React.ReactNode; // Prop type for children
}) {
  const [myPresence, updateMyPresence] = useMyPresence(); // Gets the current user's presence and a function to update it
  const others = useOthers(); // Gets information about other users

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    // Updates the user's cursor position in the presence data
    const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) }; // Calculates cursor position
    updateMyPresence({ cursor }); // Updates the presence with the cursor data
  }

  function handlePointerLeave() {
    // Removes the cursor position from the presence data when the pointer leaves the element
    updateMyPresence({ cursor: null });
  }

  return (
    <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      {/* Renders the children component */}
      {others.filter((other)=>other.presence.cursor!=null).map(({connectionId ,presence ,info})=>(
        <FollowPointer key={connectionId} info={info} x={presence.cursor!.x} y={presence.cursor!.y}/>
      ))}
      {children}
    </div>
  );
}

export default LiveCursorProvider; // Exports the component as the default export
