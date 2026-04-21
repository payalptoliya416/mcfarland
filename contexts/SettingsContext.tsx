"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSettingsByKeysFooter } from "@/api/categoryActions";
import { SettingsData } from "@/api/data";

interface SettingsContextType {
  settings: SettingsData | null;
  companyName: string;
  phoneNumber: string;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  companyName: "",
  phoneNumber: "",
  isLoading: true,
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

  useEffect(() => {
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

    fetchSettings();
  }, []);
  const companyName = settings?.company_name || "";
  const phoneNumber = settings?.phone_no || "";

  return (
    <SettingsContext.Provider value={{ settings, companyName, isLoading ,  phoneNumber }}>
      {children}
    </SettingsContext.Provider>
  );
};
