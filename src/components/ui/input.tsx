import { InputHTMLAttributes, ElementType } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

interface InputProps<
  TFieldValues extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRequired?: boolean;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: string;
  options?: RegisterOptions<TFieldValues>;
  Icon?: ElementType;
  className?: string;
}

const Input = <TFieldValues extends FieldValues>({
  label,
  labelRequired = false,
  name,
  register,
  error,
  type = "text",
  options,
  Icon,
  className,
  ...rest
}: InputProps<TFieldValues>) => {
  return (
    <div className="w-full mb-1">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label} {labelRequired && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className="h-5 w-5 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
          </div>
        )}
        <input
          id={name}
          type={type}
          {...register(name, options)}
          className={`${
            className ??
            `
            w-full px-3 py-1.5 border rounded-md shadow-sm
            focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent
            bg-white text-slate-900
            dark:bg-slate-800 dark:text-slate-100`
          }
            ${
              error
                ? "border-red-500 dark:border-red-400"
                : "border-slate-300 dark:border-slate-600"
            }
            ${Icon ? "pl-10" : "pl-3"}
          `}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs italic text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
