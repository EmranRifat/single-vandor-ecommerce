"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Spinner } from "@heroui/react";
import { toast } from "react-toastify";
import MaterialInput from "../common/MaterialInput";
import { useRegInviteUser } from "@/hooks/useRegUser";
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
    
  console.log("muted data ..",data?.message)
  console.log("muted error ..",error?.message)

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

      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

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

        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Input
            id="name"
            name="name"
            label="Enter Your Name"
            type="text"
            value={formik.values.name}
            errorMessage={formik.errors.name || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="bordered"
          />
        </motion.div>

        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formik.values.email}
            errorMessage={formik.errors.email || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="bordered"
          />
        </motion.div>

        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Input
            id="password"
            name="password"
            label="Password"
            value={formik.values.password}
            errorMessage={formik.errors.password || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="bordered"
           type={isVisible ? "text" : "password"}
             endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-solid outline-transparent"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <EyeSlashIcon className="text-xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeIcon className="text-xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
          />
        </motion.div>

        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Input
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            value={formik.values.confirmPassword}
            errorMessage={formik.errors.confirmPassword || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="bordered"
           type={isVisible ? "text" : "password"}
             endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-solid outline-transparent"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <EyeSlashIcon className="text-xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeIcon className="text-xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
          />
        </motion.div>

        <div className="flex justify-between mt-6">
          
          <Button
            type="button"
            variant="ghost"
            onPress={() => router.back()}
          >
            Back
          </Button>

         <Button
            type="submit"
            color="primary"
            isLoading={isPending}
            >
            Register
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