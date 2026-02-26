"use client";

import { useEffect, useRef, ReactNode, RefObject } from "react";

interface ClickOutSideProps {
  children: ReactNode;
  exceptionRef?: RefObject<HTMLElement>;
  onclick: () => void;
  className?: string;
}

const ClickOutSide = ({
  children,
  exceptionRef,
  onclick,
  className = "",
}: ClickOutSideProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideWrapper =
        wrapperRef.current?.contains(target) ?? false;
      const clickedInsideException =
        exceptionRef?.current?.contains(target) ?? false;

      if (!clickedInsideWrapper && !clickedInsideException) {
        onclick();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [exceptionRef, onclick]);

  return (
    <div
      ref={wrapperRef}
      className={className}
    >
      {children}
    </div>
  );
};

export default ClickOutSide;
