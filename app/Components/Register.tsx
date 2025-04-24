"use client";
import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField } from "@mui/material";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),

    email: z.string().email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

const defaultvalues = {
  username: "",
  email: "",
  password: "",
  confirmpassword: "",
};

interface RegisterType {
  username: string;
  email: string;
  password: string;
}

function Register() {
  const router = useRouter();
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: defaultvalues,
  });

  const onSubmit = async (data: RegisterType) => {
    const newUser = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const finalData = await response.json();
      if (!response.ok) {
        toast.error(finalData?.message || "Registration failed");
        return;
      }
      if (finalData) {
        toast.success(finalData?.message);
        reset();
        router.push("/sign-in");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "97vh",
        }}
      >
        <Card
          sx={{ maxWidth: 475, boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        >
          <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
            Register Form
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box>
                <TextField
                  fullWidth
                  sx={{ mb: 3 }}
                  label="Username"
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />

                <TextField
                  fullWidth
                  label="Email"
                  sx={{ mb: 3 }}
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  sx={{ mb: 3 }}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  sx={{ mb: 3 }}
                  {...register("confirmpassword")}
                  error={!!errors.confirmpassword}
                  helperText={errors.confirmpassword?.message}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    isSubmitting ? <Loader2 className="animate-spin" /> : null
                  }
                  sx={{ mr: 3 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </form>
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body1">
              If already registerd please <Link href="/sign-in">log in</Link>
            </Typography>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}

export default Register;
