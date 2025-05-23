"use client";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IKVideo, IKImage } from "imagekitio-next";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { VideoSchemaType } from "@/models/VideoModal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function Dashboard() {
  const [videos, setVideos] = useState<VideoSchemaType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/video", { method: "GET" });
      const finalData = await response.json();
      if (finalData) {
        setVideos(finalData);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: any) => {
    console.log(id);
    try {
      const response = await fetch("/api/video", {
        method: "DELETE",
        body: JSON.stringify(id),
      });
      const finalData = await response.json();
      if (finalData) {
        toast.success(finalData?.message);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      fetchVideos();
    }
  };

  return (
    <>
      {isLoading && (
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          sx={{ height: "80vh", justifyContent: "center" }}
        >
          <CircularProgress size="3rem" />
        </Stack>
      )}
      {!isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {videos &&
            videos?.map((video) => (
              <Box key={video.title}>
                <Card
                  sx={{
                    width: 340,
                    height: 500,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    mr: 3,
                    mb: 3,
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ marginTop: "10px", marginLeft: "12px" }}
                  >
                    {video?.title}
                  </Typography>
                  <Divider />
                  <CardContent>
                    {video?.fileType === "video" ? (
                      <Box
                        sx={{
                          width: "100%",
                          aspectRatio: "5 / 4",
                          position: "relative",
                        }}
                      >
                        <IKVideo
                          path={video.fileUrl}
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: 200,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IKImage
                          src={video?.thumbnailUrl}
                          alt={video?.title}
                          transformation={[
                            {
                              height: 200,
                              width: 440,
                            },
                          ]}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Typography variant="body2">
                      {video?.description}
                    </Typography>
                    <Box>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(video?._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            ))}
        </Box>
      )}
      {videos.length === 0 && !isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h6"> No Videos Found</Typography>
        </Box>
      )}
    </>
  );
}

export default Dashboard;
