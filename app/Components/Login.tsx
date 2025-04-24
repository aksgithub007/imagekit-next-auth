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
import { signIn, SignInResponse } from "next-auth/react";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});
const defaultvalues = {
  email: "",
  password: "",
};

interface LoginType {
  email: string;
  password: string;
}

function Login() {
  const router = useRouter();
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultvalues,
  });

  const onSubmit = async (data: LoginType) => {
    try {
      const response: SignInResponse | undefined = await signIn("credentials", {
        redirect: false,
        email: data?.email,
        password: data?.password,
      });

      if (response?.error) {
        toast.error(response.error);
      }
      if (response?.ok && response?.status === 200) {
        toast.success("Sign In Successfully");
        reset();
        router.push("/");
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleGoogleLogin = async () => {
    const response = await signIn("google", { redirect: false });
    console.log(response, "google response");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "96vh",
        }}
      >
        <Card
          sx={{ maxWidth: 475, boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        >
          <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
            Login Form
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box>
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
                  {isSubmitting ? "Login..." : "Sign In"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
                <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
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
              If account is not registerd please{" "}
              <Link href="/register">Register</Link>
            </Typography>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}

export default Login;
