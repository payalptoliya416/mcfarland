"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { useEffect } from "react";

export default function MetadataUpdater() {
    const { companyName } = useSettings();

    useEffect(() => {
        if (companyName) {
            document.title = companyName;
        }
    }, [companyName]);

    return null;
}
