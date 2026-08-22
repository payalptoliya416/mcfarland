"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function MetadataUpdater() {
  const { companyName } = useSettings();
  const pathname = usePathname();
  const isInitialLoad = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!companyName) return;

    const updateMetadata = () => {
      if (typeof window === "undefined") return;

      const currentPath = window.location.pathname;
      // Normalize path by removing trailing slash (except for home page)
      const path = currentPath.replace(/\/$/, "") || "/";
      const segments = path.split("/").filter(Boolean);

      // Check if it's the inventory detail page
      const isDetailPage =
        segments[0] === "inventory" &&
        segments.length === 5 &&
        !isNaN(Number(segments[4]));

      if (isDetailPage) {
        // Let InventoryDetail component handle metadata updates dynamically
        return;
      }

      let title = companyName;
      let description = `At ${companyName}, we specialize in the buying, selling, and auctioning of high-quality industrial machinery, tractors, farm tools, and construction equipment.`;

      if (path === "/") {
        title = `${companyName}`;
      } else if (path === "/about-us") {
        title = `About Us | ${companyName}`;
        description = `Learn more about ${companyName}, our mission, values, and experience in industrial machinery and farm equipment auctions.`;
      } else if (path === "/contact-us") {
        title = `Contact Us | ${companyName}`;
        description = `Get in touch with ${companyName}. Find our contact details, location, phone number, and online enquiry form.`;
      } else if (path === "/faq") {
        title = `FAQ | ${companyName}`;
        description = `Frequently Asked Questions about ${companyName} auctions, bidding, payments, and delivery.`;
      } else if (path === "/services") {
        title = `Services | ${companyName}`;
        description = `Explore the services offered by ${companyName}, including machinery valuation, auctions, and direct sales.`;
      } else if (path === "/privacy-policy") {
        title = `Privacy Policy | ${companyName}`;
        description = `Read the privacy policy of ${companyName} regarding data collection and security.`;
      } else if (path === "/terms-condition") {
        title = `Terms & Conditions | ${companyName}`;
        description = `Read our terms and conditions for buyers and sellers participating in ${companyName} auctions.`;
      } else if (path === "/signup") {
        title = `Sign Up | ${companyName}`;
        description = `Create an account with ${companyName} to start bidding and buying high-quality industrial and farm machinery.`;
      } else if (path === "/verify-account") {
        title = `Verify Account | ${companyName}`;
        description = `Verify your account at ${companyName} to complete your registration.`;
      } else if (path.startsWith("/checkout")) {
        title = `Checkout | ${companyName}`;
        description = `Complete your purchase securely via our payment gateway at ${companyName}.`;
      } else if (path.startsWith("/confirmation")) {
        title = `Order Confirmation | ${companyName}`;
        description = `Your order has been placed. Review confirmation details at ${companyName}.`;
      } else if (path.startsWith("/sale-agreement")) {
        title = `Sale Agreement | ${companyName}`;
        description = `Review and sign the sale agreement for your machinery purchase at ${companyName}.`;
      } else if (path.startsWith("/inventory")) {
        title = `Inventory | ${companyName}`;
        description = `Browse high-quality machinery, tractors, farm tools, and construction equipment available at ${companyName}.`;
      }
      // Admin routes
      else if (path === "/admin") {
        title = `Admin Login | ${companyName}`;
        description = `Administrator login portal for ${companyName}.`;
      } else if (path === "/admin/dashboard") {
        title = `Admin Dashboard | ${companyName}`;
        description = `Admin dashboard and activity overview for ${companyName}.`;
      } else if (path === "/admin/machinery") {
        title = `Manage Machinery | ${companyName}`;
        description = `Manage machinery inventory list and details at ${companyName}.`;
      } else if (path === "/admin/category") {
        title = `Manage Categories | ${companyName}`;
        description = `Manage categories and classifications at ${companyName}.`;
      } else if (path === "/admin/user-management") {
        title = `User Management | ${companyName}`;
        description = `View and manage registered users at ${companyName}.`;
      } else if (path === "/admin/bidding") {
        title = `Manage Bidding | ${companyName}`;
        description = `Manage bidding settings and active user bids at ${companyName}.`;
      } else if (path === "/admin/orders") {
        title = `Manage Orders | ${companyName}`;
        description = `View and manage orders at ${companyName}.`;
      } else if (path === "/admin/won-user") {
        title = `Won Users | ${companyName}`;
        description = `Manage won auctions and user assignments at ${companyName}.`;
      } else if (path === "/admin/settings") {
        title = `Admin Settings | ${companyName}`;
        description = `Manage administration and site configuration settings for ${companyName}.`;
      }
      // User routes
      else if (path === "/user/signin") {
        title = `User Sign In | ${companyName}`;
        description = `Sign in to your ${companyName} account to manage bids and view orders.`;
      } else if (path === "/user") {
        title = `My Dashboard | ${companyName}`;
        description = `User dashboard and activity overview for ${companyName}.`;
      } else if (path === "/user/profile") {
        title = `My Profile | ${companyName}`;
        description = `Manage your profile, preferences, and personal information at ${companyName}.`;
      } else if (path === "/user/bids") {
        title = `My Bids | ${companyName}`;
        description = `View and track your active bids on auctions at ${companyName}.`;
      } else if (path === "/user/won-bids") {
        title = `Won Bids | ${companyName}`;
        description = `View list of auctions you have won at ${companyName}.`;
      } else if (path === "/user/orders") {
        title = `My Orders | ${companyName}`;
        description = `View and manage your purchases and orders at ${companyName}.`;
      } else if (path === "/user/payments") {
        title = `My Payments | ${companyName}`;
        description = `View your payment history and statements at ${companyName}.`;
      }

      // Handle title tags and duplicates
      const titleTags = document.querySelectorAll("title");
      if (titleTags.length > 0) {
        if (titleTags[0].textContent !== title) {
          titleTags[0].textContent = title;
        }
        // Clean up duplicate title tags
        for (let i = 1; i < titleTags.length; i++) {
          titleTags[i].remove();
        }
      } else {
        if (document.title !== title) {
          document.title = title;
        }
      }

      // Handle meta description duplicates
      const descriptionTags = document.querySelectorAll('meta[name="description"]');
      let descriptionTag: HTMLMetaElement;

      if (descriptionTags.length === 0) {
        descriptionTag = document.createElement("meta");
        descriptionTag.setAttribute("name", "description");
        document.head.appendChild(descriptionTag);
      } else {
        descriptionTag = descriptionTags[0] as HTMLMetaElement;
        // Clean up any duplicate description tags
        for (let i = 1; i < descriptionTags.length; i++) {
          descriptionTags[i].remove();
        }
      }

      // Only update description if it is different
      if (descriptionTag.getAttribute("content") !== description) {
        descriptionTag.setAttribute("content", description);
      }

      // Dynamic Robots meta tag to block search crawlers on admin and user dashboard pages
      const isNoIndex = path.startsWith("/admin") || path.startsWith("/user");
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (isNoIndex) {
        if (!robotsTag) {
          robotsTag = document.createElement("meta");
          robotsTag.setAttribute("name", "robots");
          document.head.appendChild(robotsTag);
        }
        if (robotsTag.getAttribute("content") !== "noindex, nofollow") {
          robotsTag.setAttribute("content", "noindex, nofollow");
        }
      } else {
        if (robotsTag) {
          robotsTag.remove();
        }
      }
    };

    if (isInitialLoad.current) {
      updateMetadata();
      isInitialLoad.current = false;
    } else {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Delay update by 450ms so it aligns perfectly with the NavigationLoader (400ms duration)
      timeoutRef.current = setTimeout(() => {
        updateMetadata();
      }, 450);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [companyName, pathname]);

  return null;
}
