"use client";

import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import MaterialInput from "@/src/components/common/MaterialInput";
import Cookies from "js-cookie";
import { useAuth } from "@/lib/auth-context";
import { EyeSlashIcon } from "../common/icons/EyeSlashIcon";
import { EyeIcon } from "../common/icons/EyeIcon";

type UserLoginData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
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
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const data = await response.json();
        console.log("Login response data ..", data);

        if (response.ok && data.status === "success") {
          const token = data?.token;
          const user = data?.user;

          if (!token || !user) {
            setError("Invalid login response");
            return;
          }

          Cookies.set("token", token, { expires: 7 });
          Cookies.set("user", JSON.stringify(user), { expires: 7 });
          Cookies.set("role", user?.role || "", { expires: 7 });

          setUser(user);

          const redirect = new URLSearchParams(window.location.search).get(
            "redirect",
          );

          const redirectTo =
            redirect && redirect.startsWith("/") && !redirect.startsWith("//")
              ? redirect
              : "/";

          if (user?.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push(redirectTo);
          }
        } else {
          setError(data.message || data.error || "Login failed");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
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
        {/* TextField is the correct HeroUI v3 wrapper for label + input + validation */}
        <TextField
          name="email"
          type="email"
          isRequired
          isInvalid={!!(formik.touched.email && formik.errors.email)}
          validationBehavior="aria"
          variant="secondary"
        >
          <Label className="text-gray-700 dark:text-gray-200">
            Enter Your Email
          </Label>
          <Input
            className="
              py-2.5 bg-white text-gray-900 placeholder:text-gray-400
              border border-gray-200 rounded-lg
              data-[focus-visible=true]:ring-0
              data-[focus-visible=true]:outline-none
              data-[focus-visible=true]:border-gray-400
              dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
              dark:border-gray-700 dark:data-[focus-visible=true]:border-gray-500
              transition-colors
                       "
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
          />
          {formik.touched.email && formik.errors.email && (
            <FieldError>{formik.errors.email}</FieldError>
          )}
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
          className="relative "
        >
          <Label className="text-gray-700 dark:text-gray-200">
            Enter Your Password
          </Label>
          <div className="relative flex items-center">
            <Input
              className="
    py-2.5 pr-10 bg-white text-gray-900 placeholder:text-gray-400
    border border-gray-200 rounded-lg
    data-[focus-visible=true]:ring-0
    data-[focus-visible=true]:outline-none
    data-[focus-visible=true]:border-gray-400
    dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500
    dark:border-gray-700 dark:data-[focus-visible=true]:border-gray-500
    transition-colors
  "
              type={isVisible ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
            />
            <button
              aria-label="toggle password visibility"
              className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashIcon className="text-md pointer-events-none" />
              ) : (
                <EyeIcon className="text-md pointer-events-none" />
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <FieldError>{formik.errors.password}</FieldError>
          )}
        </TextField>
      </motion.div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {/* BUTTON */}
      <Button
        size="lg"
        type="submit"
        isDisabled={loading}
        fullWidth
        className="w-full rounded-lg bg-gradient-to-r from-red-600 to-orange-500 py-4 text-base font-semibold text-white shadow-md transition-all hover:from-red-700 hover:to-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" color="current" />
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
