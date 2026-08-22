"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { useEffect } from "react";

export default function MetadataUpdater() {
    const { companyName } = useSettings();

    useEffect(() => {
        if (companyName) {
            document.title = `${companyName}`;

            const description = `At ${companyName}, we specialize in the buying, selling, and auctioning of high-quality industrial machinery, tractors, farm tools, and construction equipment.`;
            let descriptionTag = document.querySelector('meta[name="description"]');

            if (!descriptionTag) {
                descriptionTag = document.createElement("meta");
                descriptionTag.setAttribute("name", "description");
                document.head.appendChild(descriptionTag);
            }

            descriptionTag.setAttribute("content", description);
        }
    }, [companyName]);

    return null;
}
