import ClickOutSide from "@/common/ClickOutSide/clickOutSide";
import ClickOpenSelect from "@/common/Select/clickOpenSelect";
import ListSelect from "@/common/Select/listSelect";
import useOptionSelect from "@/common/Select/useOptionSelect";
import { SelectData } from "@/interfaces/select";
import { ElementType, useEffect } from "react";
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export interface SelectProps<
  TFieldValues extends FieldValues,
> extends React.InputHTMLAttributes<HTMLSelectElement | HTMLInputElement> {
  label?: string;
  labelRequired?: boolean;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: string;
  options?: RegisterOptions<TFieldValues>;
  Icon?: ElementType;
  setValue: UseFormSetValue<TFieldValues>;
  isSearchable?: boolean;
  isClearable?: boolean;
  data: SelectData[];
  defaultValue?: number;
  isOpenable?: boolean;
  watch: UseFormWatch<TFieldValues>;
}

const Select = <TFieldValues extends FieldValues>({
  label,
  labelRequired = false,
  name,
  register,
  error,
  options,
  Icon,
  setValue,
  isSearchable,
  isClearable = false,
  data,
  defaultValue,
  isOpenable = true,
  watch,
  ...props
}: SelectProps<TFieldValues>) => {
  const {
    search,
    setSearch,
    inputValue,
    setInputValue,
    show,
    setShow,
    selectContainerRef,
    dropdownRef,
  } = useOptionSelect({ data, defaultValue });

  useEffect(() => {
    if (register) {
      register(name, options);
    }
  }, [register, name, options]);

  const watchedValue = watch(name);

  useEffect(() => {
    if (watchedValue === undefined) setInputValue("");
  }, [watchedValue, setInputValue]);

  return (
    <div className="w-full ">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          {label} {!labelRequired && "(optional)"}
        </label>
      )}
      <ClickOutSide
        className="w-full"
        onclick={() => setShow(false)}
      >
        <ClickOpenSelect
          name={name}
          show={show}
          setShow={(state) => {
            setShow(state);
            if (state) {
              dropdownRef.current?.focus();
            } else {
              selectContainerRef.current?.focus();
            }
          }}
          selectContainerRef={selectContainerRef}
          inputValue={inputValue}
          isClearable={isClearable}
          setSearch={setSearch}
          setInputValue={setInputValue}
          setValue={(fieldName, value) =>
            setValue(fieldName, value, { shouldValidate: true })
          }
          isOpenable={isOpenable}
          Icon={Icon}
          error={error}
          {...props}
        />

        <ListSelect
          name={name}
          show={show}
          dropdownRef={dropdownRef}
          isSearchable={isSearchable}
          search={search}
          setSearch={setSearch}
          data={data}
          setValue={(fieldName, value) =>
            setValue(fieldName, value, { shouldValidate: true })
          }
          inputValue={inputValue}
          setInputValue={setInputValue}
          setShow={setShow}
          isOpenable={isOpenable}
          {...props}
        />
      </ClickOutSide>
      {error && <p className="mt-1 text-xs italic text-red-500">{error}</p>}
      <input
        type="hidden"
        {...(register && register(name, options))}
      />
    </div>
  );
};

export default Select;
