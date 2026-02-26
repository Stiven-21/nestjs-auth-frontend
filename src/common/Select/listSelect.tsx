"use client";
import { Input } from "@/components/ui";
import { SelectData } from "@/interfaces/select";
import { useEffect, useRef, useState } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  useForm,
  UseFormSetValue,
} from "react-hook-form";
import { IoClose, IoSearch } from "react-icons/io5";

interface ListSelectProps<
  TFieldValues extends FieldValues,
> extends React.InputHTMLAttributes<HTMLSelectElement | HTMLInputElement> {
  name: Path<TFieldValues>;
  show: boolean;
  dropdownRef: React.RefObject<HTMLUListElement | null>;
  isSearchable?: boolean;
  search: string;
  setSearch: (search: string) => void;
  data: SelectData[];
  setValue: UseFormSetValue<TFieldValues>;
  inputValue: string;
  setInputValue: (value: string) => void;
  setShow: (value: boolean) => void;
  isOpenable: boolean;
}

const ListSelect = <TFieldValues extends FieldValues>({
  show,
  dropdownRef,
  isSearchable,
  search,
  setSearch,
  data,
  setValue,
  inputValue,
  setInputValue,
  setShow,
  isOpenable,
  name,
  ...props
}: ListSelectProps<TFieldValues>) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  const { register } = useForm<{ search: string }>();

  useEffect(() => {
    const focus = () => setFocusedIndex(-1);
    if (!show) focus();
  }, [show]);

  useEffect(() => {
    if (focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
      itemsRef.current[focusedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleKeyboard = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!isOpenable || !show || filteredData.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % filteredData.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === 0 ? filteredData.length - 1 : prev - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0) {
          const selectedItem = filteredData[focusedIndex];
          setValue(
            name,
            selectedItem.id as PathValue<TFieldValues, Path<TFieldValues>>,
          );
          setInputValue(selectedItem.name);
          setShow(false);
        }
        break;
      case "Escape":
        setShow(false);
        break;
      default:
        break;
    }
  };

  return (
    <ul
      tabIndex={show ? 0 : -1}
      ref={dropdownRef}
      className={`w-full py-2 select-none focus:outline-none rounded-xl shadow-md z-30 absolute bg-slate-100 dark:bg-slate-700 border mt-2 -mb-4 overflow-x-hidden scrollbar-thumb-rounded-full scrollbar-track-rounded-full ${
        show && isOpenable
          ? "max-h-60 border border-blue-500 dark:border-blue-400 opacity-100 overflow-y-auto space-y-0.5"
          : "max-h-0 opacity-0 overflow-y-hidden"
      }`}
      onKeyDown={handleKeyboard}
      role="listbox"
      id={props.id ? `${props.id}-listbox` : undefined}
      aria-activedescendant={
        focusedIndex >= 0 && filteredData[focusedIndex]
          ? `${props.id}-option-${filteredData[focusedIndex].id}`
          : undefined
      }
    >
      {/* Barra de búsqueda */}
      {isSearchable && (
        <div className="flex items-center px-3 py-2 sticky top-0 bg-slate-100 dark:bg-slate-700 border-b border-b-slate-200 dark:border-b-slate-800">
          <IoSearch className="text-slate-400 dark:text-slate-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar . . ."
            autoComplete="off"
            register={register}
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-3 pr-5 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50"
            disabled={data.length === 0}
            tabIndex={show ? 0 : -1}
          />
          {search && (
            <span
              className="absolute text-xl inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setSearch("")}
            >
              <IoClose />
            </span>
          )}
        </div>
      )}

      {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
          <li
            key={item.id}
            id={props.id ? `${props.id}-option-${item.id}` : undefined}
            ref={(el: HTMLLIElement | null) => {
              itemsRef.current[index] = el;
            }}
            onClick={() => {
              setValue(
                name,
                item.id as PathValue<TFieldValues, Path<TFieldValues>>,
              );
              setInputValue(item.name);
              setShow(false);
            }}
            className={`px-3 font-medium text-sm py-2 cursor-pointer hover:bg-slate-200 hover:text-blue-500 dark:hover:bg-slate-600 ${
              focusedIndex === index
                ? "bg-slate-200 dark:bg-slate-600 text-blue-500"
                : ""
            }
            ${
              item?.name?.toLowerCase() === inputValue.toLowerCase()
                ? "bg-slate-100 dark:bg-slate-700 text-blue-600"
                : ""
            }`}
            role="option"
            aria-selected={focusedIndex === index}
          >
            {item.name[0].toUpperCase() + item.name.slice(1).toLowerCase()}
          </li>
        ))
      ) : (
        <li className="px-3 py-2 text-slate-400 dark:text-slate-500">
          No result found . . .
        </li>
      )}
    </ul>
  );
};

export default ListSelect;
