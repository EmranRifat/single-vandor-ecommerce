"use client";

import React, { useState } from "react";
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
// import { useRegInviteUser } from "@/hooks/useRegUser";
import { EyeIcon } from "../common/icons/EyeIcon";
import { EyeSlashIcon } from "../common/icons/EyeSlashIcon";
import { useRegInviteUser } from "@/lib/hooks/useRegUser";
// import { EyeIcon } from "../common/icons/EyeIcon";

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
  const [isVisible, setIsVisible] = React.useState(false);
  const { mutate, data, error, isPending } = useRegInviteUser();
  const toggleVisibility = () => setIsVisible(!isVisible);
  console.log("muted data ..", data?.message);
  console.log("muted error ..", error?.message);
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
          console.log("setPass Form submitted response ==>>:", response);

          setLoading(false);
          setMessage(response.message);

          if (response.status === "success") {
            toast.success(response.message);
            router.push("/login");
          }

          if (response.status === "failed") {
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
        <TextField
          name="name"
          isRequired
          isInvalid={!!(formik.touched.name && formik.errors.name)}
          validationBehavior="aria"
          variant="secondary"
        >
          <Label>Enter Your Name</Label>

          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full"
          />

          {formik.touched.name && formik.errors.name && (
            <FieldError>{formik.errors.name}</FieldError>
          )}
        </TextField>

        <TextField
          name="email"
          isRequired
          isInvalid={!!(formik.touched.email && formik.errors.email)}
          validationBehavior="aria"
          variant="secondary"
        >
          <Label>Email</Label>

          <Input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full"
          />

          {formik.touched.email && formik.errors.email && (
            <FieldError>{formik.errors.email}</FieldError>
          )}
        </TextField>
        <TextField
          name="email"
          isRequired
          isInvalid={!!(formik.touched.email && formik.errors.email)}
          validationBehavior="aria"
          variant="secondary"
        >
          <Label>Email</Label>

          <Input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full"
          />

          {formik.touched.email && formik.errors.email && (
            <FieldError>{formik.errors.email}</FieldError>
          )}
        </TextField>

        <TextField
          name="confirmPassword"
          isRequired
          isInvalid={
            !!(formik.touched.confirmPassword && formik.errors.confirmPassword)
          }
          validationBehavior="aria"
          variant="secondary"
        >
          <Label>Confirm Password</Label>

          <div className="relative">
            <Input
              name="confirmPassword"
              type={isVisible ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full pr-10"
            />

            <button
              type="button"
              onClick={toggleVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-default-500"
            >
              {isVisible ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <FieldError>{formik.errors.confirmPassword}</FieldError>
          )}
        </TextField>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="secondary"
            onPress={() => router.back()}
          >
            Back
          </Button>

          <Button
            type="submit"
            isDisabled={isPending}
            className="bg-gradient-to-r from-red-600 to-orange-500 text-white"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Registering...
              </span>
            ) : (
              "Register"
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
