// This directive (if present) indicates that the function can only run on the client-side (browser)
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
import { Fragment } from "react";

function Breadcrumbs() {
  // Get the current pathname (URL path) from Next.js navigation
  const path = usePathname();

  // Split the pathname into an array of segments based on forward slashes
  const segments = path.split("/");

  // This line is commented out, but it could be used for debugging purposes
  // console.log(segments); // Uncomment to see the path segments in the console

  // Return the JSX structure for the Breadcrumbs component
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* First Breadcrumb item for "Home" */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {/* Loop through each segment of the path and create a BreadcrumbItem */}
        {segments.map((segment, index) => {
          // Construct the href attribute for the breadcrumb link
          // by joining segments up to the current index
          const href = `/${segments.slice(0, index + 1).join("/")}`;

          // Check if the current segment is the last one in the path
          const isLast = index === segments.length - 1;

          // Conditionally render the BreadcrumbItem based on the segment
          return (
            <Fragment key={segment}>
              <BreadcrumbSeparator /> {/* Add separator between items */}
              <BreadcrumbItem>
                {isLast ? (
                  // Display the last segment as non-clickable BreadcrumbPage
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  // Render a clickable BreadcrumbLink for non-last segments
                  <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
