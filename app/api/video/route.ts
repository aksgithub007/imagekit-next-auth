import { authOptions } from "@/lib/AuthOptions";
import ConnectDB from "@/lib/ConnectDB";
import { User } from "@/models/UserModel";
import { VideoModel } from "@/models/VideoModal";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDB();
    const session = await getServerSession();
    const user = await User.findOne({ email: session?.user.email });
    if (!user || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const videos = await VideoModel.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    //Not Having any user login
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Connect to Database
    await ConnectDB();
    const body = await request.json();

    if (
      !body.title ||
      !body.description ||
      !body.thumbnailUrl ||
      !body.fileUrl
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new video with default values
    const videoData = {
      ...body,
      userId: session.user.id,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
      },
    };

    const newVideo = await VideoModel.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { message: "Failed to create video" },
      { status: 500 }
    );
  }
}
