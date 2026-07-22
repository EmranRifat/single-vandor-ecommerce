"use client";

import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import MaterialInput from "@/src/components/common/MaterialInput";
import Cookies from "js-cookie";
import { useAuth } from "@/lib/auth-context";
import { EyeSlashIcon } from "../common/icons/EyeSlashIcon";
import { EyeIcon } from "../common/icons/EyeIcon";
import {
  FieldError,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";

type UserLoginData = {
    email: string;
    password: string;
  };

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isVisible, setIsVisible] = React.useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),

      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const payload: UserLoginData = {
          email: values.email,
          password: values.password,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const data = await response.json();

        if (response.ok) {
          // store cookies
          Cookies.set("access", data.token);
          Cookies.set("user", JSON.stringify(data.user));

          // update auth context
          setUser(data.user);

          router.push("/products");
        } else {
          setError(data.error || "Login failed");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      }

      setLoading(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* EMAIL */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
       <TextField
  name="email"
  isInvalid={!!(formik.touched.email && formik.errors.email)}
>
  <Label>Email</Label>

  <Input
    name="email"
    value={formik.values.email}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />

  <FieldError>{formik.errors.email}</FieldError>
</TextField>
      </motion.div>
{/* PASSWORD */}
<motion.div
  initial={{ x: -300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.15, delay: 0.05 }}
>
  <TextField
    name="password"
    isRequired
    isInvalid={!!(formik.touched.password && formik.errors.password)}
    validationBehavior="aria"
    variant="secondary"
    className="relative"
  >
    <Label>Enter Your Password</Label>

    <div className="relative">
      <Input
        name="password"
        type={isVisible ? "text" : "password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full py-2.5 pr-10"
      />

      <button
        type="button"
        aria-label="Toggle password visibility"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600 focus:outline-none"
      >
        {isVisible ? (
          <EyeSlashIcon className="pointer-events-none h-5 w-5" />
        ) : (
          <EyeIcon className="pointer-events-none h-5 w-5" />
        )}
      </button>
    </div>

    {formik.touched.password && formik.errors.password && (
      <FieldError>{formik.errors.password}</FieldError>
    )}
  </TextField>
</motion.div>

      {/* ERROR */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* BUTTON */}
     {/* BUTTON */}
<Button
  type="submit"
  size="lg"
  isDisabled={loading}
  className="w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-500 py-4 text-base font-semibold text-white transition-all hover:from-red-700 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <Spinner size="sm" />
      Logging in...
    </span>
  ) : (
    "Login"
  )}
</Button>
    </form>
  );
}
