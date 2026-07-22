"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { toast } from "react-toastify";
import MaterialInput from "../common/MaterialInput";
import { useRegInviteUser } from "@/lib/hooks/useRegUser";
import { EyeSlashIcon } from "../common/icons/EyeSlashIcon";
import { EyeIcon } from "../common/icons/EyeIcon";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenState = searchParams.get("token") || "";
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const { mutate, data, error, isPending } = useRegInviteUser();

  console.log("Reg Form submitted  ..", data);
  console.log("Reg Form submitted error ..", error);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      token: tokenState,
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),

    onSubmit: (values) => {
      const formData = {
        ...values,
        token: tokenState,
      };

      setLoading(true);
      mutate(formData, {
        onSuccess: (response) => {
          console.log("Reg Form submitted response ==>>:", response);

          setLoading(false);
          setMessage(response.message);

          if (response.status === "success") {
            toast.success(response.message);
            router.push("/login");
          }

          if (response.status === "error") {
            toast.error(response.message);
          }
        },
        onError: (error: any) => {
          console.error("Form submission failed:", error);
          setLoading(false);
        },
      });
    },
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* NAME */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <TextField
            name="name"
            type="text"
            isRequired
            isInvalid={!!(formik.touched.name && formik.errors.name)}
            validationBehavior="aria"
            variant="secondary"
          >
            <Label>Enter Your Name</Label>
            <Input
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
            />
            {formik.touched.name && formik.errors.name && (
              <FieldError>{formik.errors.name}</FieldError>
            )}
          </TextField>
        </motion.div>

        {/* EMAIL */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <TextField
            name="email"
            type="email"
            isRequired
            isInvalid={!!(formik.touched.email && formik.errors.email)}
            validationBehavior="aria"
            variant="secondary"
          >
            <Label>Email</Label>
            <Input
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
        >
          <TextField
            name="password"
            isRequired
            isInvalid={!!(formik.touched.password && formik.errors.password)}
            validationBehavior="aria"
            variant="secondary"
            className="relative"
          >
            <Label>Password</Label>
            <div className="relative flex items-center">
              <Input
                type={isVisible ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
              />
              <button
                aria-label="toggle password visibility"
                className="absolute right-3 focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashIcon className="text-xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeIcon className="text-xl text-default-400 pointer-events-none" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <FieldError>{formik.errors.password}</FieldError>
            )}
          </TextField>
        </motion.div>

        {/* CONFIRM PASSWORD */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <TextField
            name="confirmPassword"
            isRequired
            isInvalid={
              !!(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )
            }
            validationBehavior="aria"
            variant="secondary"
            className="relative"
          >
            <Label>Confirm Password</Label>
            <div className="relative flex items-center">
              <Input
                type={isVisible ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
              />
              <button
                aria-label="toggle confirm password visibility"
                className="absolute right-3 focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashIcon className="text-xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeIcon className="text-xl text-default-400 pointer-events-none" />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <FieldError>{formik.errors.confirmPassword}</FieldError>
              )}
          </TextField>
        </motion.div>

        {/* ACTIONS */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onPress={() => router.back()}
            className="h-11 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition-all duration-300 hover:border-pink-500 hover:bg-pink-50 hover:text-pink-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-pink-500 dark:hover:bg-pink-500/10 dark:hover:text-pink-400"
          >
            ← Back
          </Button>

          <Button
            type="submit"
            variant="primary"
            isDisabled={isPending || loading}
            className="h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-7 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-600 hover:to-rose-600 hover:shadow-pink-500/40 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-pink-900/30"
          >
            {isPending || loading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Registering...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Register
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            )}
          </Button>
        </div>

        {/* SUCCESS MESSAGE */}
        {data?.message && (
          <p className="text-green-500 text-center text-sm">{data.message}</p>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-center text-sm">
            {(error as Error).message}
          </p>
        )}
      </form>
    </div>
  );
}
