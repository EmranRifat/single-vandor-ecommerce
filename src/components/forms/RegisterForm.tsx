"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FieldError, Input, Label, Spinner, TextField } from "@heroui/react";
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
        <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
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
        <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
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
        <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
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
        <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <TextField
            name="confirmPassword"
            isRequired
            isInvalid={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
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
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <FieldError>{formik.errors.confirmPassword}</FieldError>
            )}
          </TextField>
        </motion.div>

        
        {/* ACTIONS */}
        <div className="flex justify-between mt-6">
          
          <Button
            type="button"
            variant="ghost"
            onPress={() => router.back()}
          >
            Back
          </Button>

          {/* HeroUI v3 Button has no "color" or "isLoading" prop — use variant + Spinner */}
          <Button type="submit" variant="primary" isDisabled={isPending || loading}>
            {isPending || loading ? (
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
        <p className="text-green-500 text-center text-sm">
            {data.message}
        </p>
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
