"use client";

import { createContext, useContext } from "react";
import { ModalContextProps } from "./types";

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ModalContext.Provider;

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a <Modal />");
  }
  return context;
};
