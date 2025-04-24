import ConnectDB from "@/lib/ConnectDB";
import { User } from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    //Connect to Database
    await ConnectDB();
    //check user is existing or not
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exist", success: false },
        { status: 400 }
      );
    }

    const isCreated = await User.create({
      email,
      password,
      username,
    });

    if (isCreated) {
      return NextResponse.json(
        { message: "User Register Successfully", success: true },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Something Wents goes wrong ::  ${error}`, success: false },
      { status: 500 }
    );
  }
}
