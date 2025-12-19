"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getSiteContent } from "@/utils/api";

const ContentContext = createContext<any>(null);

export function ContentProvider({ children, initialContent }: { children: React.ReactNode, initialContent: any }) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    // Optionally refresh content on mount if needed, but we rely on initialContent from Server Component
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
