"use client";
import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const handleSignout = async () => {
    await signOut({ redirect: false });
    toast.success("Sign Out Successfully");
    router.push("/sign-in");
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                color: "#fff",
                marginRight: "20px",
              }}
            >
              {session?.user?.username.toUpperCase()}
            </Link>
          </Typography>
          <Link
            style={{
              textDecoration: "none",
              color: "#fff",
              marginRight: "20px",
            }}
            href="/upload"
          >
            Upload Video
          </Link>
          <Button color="inherit" onClick={handleSignout}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
