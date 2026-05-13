"use client";

import { Button, FieldError, Input, Label, Spinner, TextField } from "@heroui/react";
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
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),

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
      }
    );

    const data = await response.json();
    console.log("Login response data ..", data);

    if (response.ok && data.status === "success") {
      const token = data?.token;
      const user = data?.user;

      // if (!token || !user) {
      //   setError("Invalid login response");
      //   return;
      // }


      // store cookies
      Cookies.set("token", token);
      Cookies.set("user", JSON.stringify(user));
      Cookies.set("role", JSON.stringify( user?.role));

      // update auth co  ntext
      setUser(user);

      router.push("/products");
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
          <Label>Enter Your Email</Label>
          <Input
            className="
    py-2.5 bg-white
    data-[focus-visible=true]:ring-0
    data-[focus-visible=true]:outline-none
    data-[focus-visible=true]:border-gray-400
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
          <Label>Enter Your Password</Label>
          <div className="relative flex items-center">
            <Input
             className="
    py-2.5 bg-white
    data-[focus-visible=true]:ring-0
    data-[focus-visible=true]:outline-none
    data-[focus-visible=true]:border-gray-400
  "
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
                <EyeSlashIcon className="text-md text-default-400 pointer-events-none" />
              ) : (
                <EyeIcon className="text-md text-default-400 pointer-events-none" />
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
        <Button
        size="lg"
        type="submit"
        variant="secondary"
        isDisabled={loading}
        fullWidth
        className="w-full py-4 text-md"
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