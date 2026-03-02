import { ReactNode } from "react";
import { Variants } from "framer-motion";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full" | string;
export type ModalPosition = "center" | "top" | "bottom";

export interface ModalContextProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  scrollBehavior?: "inside" | "outside";
}

export interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  position?: ModalPosition;
  isDismissable?: boolean; // Cerrar con ESC o click fuera
  animate?: boolean;
  className?: string;
  backdropClass?: string;
  variants?: Variants; // Animaciones custom
}

// Interfaces para subcomponentes
export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;
export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;
export type ModalTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
