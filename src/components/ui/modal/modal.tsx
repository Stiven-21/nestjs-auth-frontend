"use client";

import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { twMerge } from "tailwind-merge";

import {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalTitleProps,
} from "./types";
import { ModalProvider, useModalContext } from "./modal-context";
import { useScrollLock, useEscapeKey } from "./hooks";
import { IoClose } from "react-icons/io5";

// --- Animaciones por defecto ---
const defaultOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
};

const defaultModalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
};

// --- Componente Raíz (Modal) ---
export const Modal = ({
  children,
  isOpen,
  onClose,
  size = "md",
  position = "center",
  isDismissable = true,
  className,
  backdropClass,
  variants,
}: ModalProps) => {
  // Hooks de efectos
  useScrollLock(isOpen);
  useEscapeKey(onClose, isOpen && isDismissable);

  // Clases de tamaño
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full m-4",
  };

  // Clases de posición
  const positionClasses = {
    center: "items-center",
    top: "items-start pt-10",
    bottom: "items-end pb-10",
  };

  // Handler para click en backdrop
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDismissable && e.target === e.currentTarget) {
        onClose();
      }
    },
    [isDismissable, onClose],
  );

  return createPortal(
    <ModalProvider value={{ isOpen, onClose, size }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal-backdrop"
            variants={defaultOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={twMerge(
              "fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto",
              positionClasses[position],
              backdropClass,
            )}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              variants={variants || defaultModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className={twMerge(
                "relative w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg shadow-xl ring-1 ring-slate-900/5 focus:outline-none overflow-hidden",
                typeof size === "string" &&
                  sizeClasses[size as keyof typeof sizeClasses]
                  ? sizeClasses[size as keyof typeof sizeClasses]
                  : size,
                className,
              )}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalProvider>,
    document.body,
  );
};

// --- Subcomponentes ---

export const ModalHeader = ({
  className,
  children,
  ...props
}: ModalHeaderProps) => {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between px-6 py-4 border-b max-h-96 border-slate-200 dark:border-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalTitle = ({
  className,
  children,
  ...props
}: ModalTitleProps) => {
  return (
    <h3
      className={twMerge(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const ModalBody = ({
  className,
  children,
  ...props
}: ModalBodyProps) => {
  return (
    <div
      className={twMerge("p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalFooter = ({
  className,
  children,
  ...props
}: ModalFooterProps) => {
  return (
    <div
      className={twMerge(
        "flex items-center justify-end gap-2 p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModalCloseButton = ({ className }: { className?: string }) => {
  const { onClose } = useModalContext();
  return (
    <button
      onClick={onClose}
      className={twMerge(
        "rounded-sm cursor-pointer opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800",
        className,
      )}
      aria-label="Close"
    >
      <IoClose className="h-5 w-5" />
    </button>
  );
};
