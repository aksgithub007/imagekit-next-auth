"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { styled, TextField } from "@mui/material";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const BorderLinearProgress = styled(LinearProgress)<{ value: number }>(
  ({ theme, value }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...(theme.palette.mode === "dark" && {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: value === 100 ? "green" : "#1a90ff",
    },
  })
);

export const LoginSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(20, "Title must be at most 20 characters"),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description must be at most 200 characters"),

  thumbnailUrl: z.string(),
  fileUrl: z.string(),
  fileType: z.string(),
});

function FileUploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState<"video" | "image">("video");
  const [uploadProgress, setUploadProgress] = useState(0);
  const defaultvalues = {
    title: "",
    description: "",
    thumbnailUrl: "",
    fileUrl: "",
    fileType: fileType,
  };
  const {
    register,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultvalues,
  });
  const handleFileTypeChange = (event: any) => {
    console.log(event.target.value);
    setFileType(event.target.value as "video" | "image");
    setValue("fileType", event.target.value as "video" | "image");
  };
  const handleSuccess = async (response: IKUploadResponse) => {
    console.log(response, "File Upload Response");
    setValue("fileUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
  };
  const handleProgress = async (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: any) => {
    try {
      if (!data.fileUrl) {
        toast.error("Please upload a video first");
        return;
      }
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const finalData = await response.json();
      if (!response.ok) {
        toast.error(finalData.message);
      }
      if (fileType === "video") {
        toast.success("Video published successfully!");
      } else {
        toast.success("Image published successfully!");
      }
      router.push("/");

      // Reset form after successful submission
      setValue("title", "");
      setValue("description", "");
      setValue("fileUrl", "");
      setValue("fileType", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleCancel = () => {
    reset();
    router.push("/");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card sx={{ maxWidth: 475 }}>
          <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
            Video / Image Uplaod Form
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  sx={{ mb: 3 }}
                  type="text"
                  {...register("title")}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />

                <TextField
                  fullWidth
                  label="Description"
                  type="description"
                  sx={{ mb: 3 }}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="file-type-label">File Type</InputLabel>
                  <Select
                    labelId="file-type-label"
                    value={fileType}
                    label="File Type"
                    onChange={handleFileTypeChange}
                  >
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <FileUpload
                    fileType={fileType}
                    onSuccess={handleSuccess}
                    onProgress={handleProgress}
                  />
                  {uploadProgress > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={uploadProgress}
                      />
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, textAlign: "right" }}
                      >
                        {uploadProgress}% {uploadProgress === 100 && "✅"}
                      </Typography>
                    </Box>
                  )}
                </Box>
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
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                <Button type="button" variant="outlined" onClick={handleCancel}>
                  Cacel
                </Button>
              </Box>
            </CardContent>
          </form>
        </Card>
      </Box>
    </>
  );
}

export default FileUploadForm;
