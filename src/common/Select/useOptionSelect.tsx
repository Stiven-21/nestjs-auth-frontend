"use client";
import { SelectData } from "@/interfaces/select";
import { useEffect, useRef, useState } from "react";

interface OptionSelectProps {
  data: SelectData[];
  defaultValue?: number;
}

const useOptionSelect = ({ data, defaultValue }: OptionSelectProps) => {
  const initialValue = (() => {
    if (
      data.length > 0 &&
      defaultValue !== undefined &&
      defaultValue !== null
    ) {
      const defaultItem = data.find((d) => d.id === defaultValue);
      return defaultItem ? defaultItem.name : "";
    }
    return "";
  })();

  const [search, setSearch] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [show, setShow] = useState<boolean>(false);
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const dropdown = dropdownRef.current;

    if (dropdown) {
      const rect = dropdown.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      dropdown.style.bottom = rect.bottom > windowHeight ? "100%" : "auto";
    }

    const clearSearchSelect = () => {
      setSearch("");
    };

    if (!show) {
      clearSearchSelect();
      selectContainerRef.current?.focus();
    }
  }, [show]);

  return {
    search,
    setSearch,
    inputValue,
    setInputValue,
    show,
    setShow,
    selectContainerRef,
    dropdownRef,
  };
};

export default useOptionSelect;
