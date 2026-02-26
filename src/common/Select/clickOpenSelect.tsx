import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import { ElementType } from "react";
import { FaAngleDown } from "react-icons/fa";
import { GrClearOption } from "react-icons/gr";

interface ClickOpenSelectProps<
  TFieldValues extends FieldValues,
> extends React.InputHTMLAttributes<HTMLSelectElement | HTMLInputElement> {
  name: Path<TFieldValues>;
  show: boolean;
  setShow: (value: boolean) => void;
  inputValue: string | null;
  isClearable?: boolean;
  setSearch: (value: string) => void;
  setInputValue: (value: string) => void;
  setValue: UseFormSetValue<TFieldValues>;
  isOpenable: boolean;
  selectContainerRef: React.RefObject<HTMLDivElement | null>;
  Icon?: ElementType;
  error?: string;
}

const ClickOpenSelect = <TFieldValues extends FieldValues>({
  name,
  show,
  setShow,
  inputValue,
  isClearable,
  setSearch,
  setInputValue,
  isOpenable,
  setValue,
  selectContainerRef,
  Icon,
  error,
  ...props
}: ClickOpenSelectProps<TFieldValues>) => {
  const handleKeyboard = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpenable) return;

    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        setShow(!show);
        break;
      case "Escape":
        setShow(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={selectContainerRef}
      id={props.id}
      onClick={() => setShow(!show)}
      onKeyDown={handleKeyboard}
      tabIndex={0}
      className={`px-3 py-3.5 border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 flex items-center justify-between transition duration-300 ${
        error
          ? "border-red-500 dark:border-red-400 focus:border-slate-200 focus:dark:border-slate-700"
          : "border-slate-200 dark:border-slate-700"
      } rounded-xl ${!isOpenable ? "cursor-not-allowed" : "cursor-pointer"}`}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={show}
      aria-controls={props.id ? `${props.id}-listbox` : undefined}
    >
      <div className="flex flex-row items-center justify-center gap-x-2">
        {Icon && (
          <Icon className="text-slate-400 dark:text-slate-500 h-5 w-5" />
        )}
        <span
          className={`${
            inputValue
              ? "text-slate-950 dark:text-white"
              : "text-slate-400 dark:text-slate-500"
          } truncate select-none`}
        >
          {inputValue
            ? inputValue[0].toUpperCase() + inputValue.slice(1)
            : props.placeholder}
        </span>
      </div>

      <span className="flex items-center justify-items-end gap-x-2">
        {isClearable && inputValue && !show && (
          <GrClearOption
            className={`hover:text-red-500 w-5 h-5 transition-opacity duration-300 ${
              isClearable && inputValue && !show
                ? "animate-expand"
                : "animate-collapse"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOpenable) return;
              setShow(false);
              setSearch("");
              setInputValue("");
              setValue(
                name,
                null as PathValue<TFieldValues, Path<TFieldValues>>,
              );
            }}
          />
        )}
        <FaAngleDown
          className={`${show && isOpenable ? "rotate-180" : ""} duration-300`}
          aria-hidden="true"
        />
      </span>
    </div>
  );
};

export default ClickOpenSelect;
