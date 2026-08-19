"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSettingsByKeysFooter } from "@/api/categoryActions";
import { SettingsData } from "@/api/data";

interface SettingsContextType {
  settings: SettingsData | null;
  companyName: string;
  phoneNumber: string;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  companyName: "",
  phoneNumber: "",
  isLoading: true,
  refreshSettings: async () => {},
});

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await getSettingsByKeysFooter();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const capitalizeCompanyName = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const companyName = settings?.company_name
    ? capitalizeCompanyName(settings.company_name)
    : "";
  const phoneNumber = settings?.phone_no || "";

  return (
    <SettingsContext.Provider value={{ settings, companyName, isLoading, phoneNumber, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
