"use client";

import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from "react";
import { EyeIcon } from "./icons/EyeIcon";
import { EyeSlashIcon } from "./icons/EyeSlashIcon";

const MaterialInput = ({
  id,
  name,
  type,
  label,
  value,
  autoComplete,
  autoFocus,
  place_holder,
  error,
  isRequired,
  showClearButton,
  clearInput,
  showPasswordToggle,
  whenChange,
  whenBlur,
  doFocus,
}: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (doFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [doFocus]);

  const inputType =
    showPasswordToggle && type === "password"
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;

  return (
    <div className="w-full">

      {/* Input Wrapper */}
      <div className="relative w-full">

        <input
          ref={inputRef}
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={whenChange}
          onBlur={whenBlur}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          placeholder={place_holder || " "}
          required={isRequired}
          className={`
            peer w-full
            px-4 py-3
            border rounded-lg
            bg-transparent
            text-gray-800
            focus:outline-none
            transition-all duration-200
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-400"
                : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-400"
            }
          `}
        />

        {/* Floating Label */}
        <label
          className="
            absolute left-4
            top-3
            text-gray-500
            text-sm
            transition-all duration-200
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-sm
            peer-focus:-top-2
            peer-focus:text-xs
            peer-focus:text-green-600
            bg-white px-1
          "
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Password Toggle */}
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
            tabIndex={-1}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Clear Button */}
        {showClearButton && value.length > 0 && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
          >
            ✕
          </button>
        )}
      </div>

      {/* Error Text */}
      {error && (
        <p className="text-sm text-red-500 mt-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default MaterialInput;