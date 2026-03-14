"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import MaterialInput from "@/src/components/common/MaterialInput";
import Cookies from "js-cookie";

type UserLoginData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
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
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Login successful", data);

      // store token in cookie
      Cookies.set("token", data.token, { expires: 7 });

      // store user info in cookie
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      router.push("/products");
    } else {
      setError(data.error || "Login failed");
    }
  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  }

  setLoading(false);
}
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">

      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={formik.handleSubmit}>

          {/* EMAIL */}
          <motion.div
            className="mb-5"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <MaterialInput
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formik.values.email}
              whenChange={formik.handleChange}
              whenBlur={formik.handleBlur}
              error={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ""
              }
              isRequired
            />
          </motion.div>

          {/* PASSWORD */}
          <motion.div
            className="mb-5"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.05 }}
          >
            <MaterialInput
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formik.values.password}
              whenChange={formik.handleChange}
              whenBlur={formik.handleBlur}
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : ""
              }
              showPasswordToggle
              isRequired
            />
          </motion.div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          {/* LOGIN BUTTON */}
          <Button
            type="submit"
            color="success"
            className="w-full text-white py-6 text-md"
            isLoading={loading}
          >
            Login
          </Button>

        </form>
      </div>

    </div>
  );
}