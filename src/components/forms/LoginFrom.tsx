"use client";

import { Button, Input } from "@heroui/react";
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
        <Input
          id="email"
          name="email"
          label="Enter Your Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ""
          }
          variant="bordered"
          isRequired
        />
      </motion.div>

      {/* PASSWORD */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.15, delay: 0.05 }}
      >
        <Input
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
          id="password"
          name="password"
          label="Enter Your Password"
          type={isVisible ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""
          }
          variant="bordered"
          isRequired
        />
      </motion.div>

      {/* ERROR */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

     
      {/* BUTTON */}
        <button
          type="submit"
          color="success"
          className="w-full text-white py-4 text-md"
          isLoading={loading}
        >
          Login
        </button>
    </form>
  );
}