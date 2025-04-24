import { Box } from "@mui/material";
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./Components/Dashboard"), {
  ssr: true,
});

export default function Home() {
  return (
    <Box sx={{ mt: 10 }}>
      <Dashboard />
    </Box>
  );
}
