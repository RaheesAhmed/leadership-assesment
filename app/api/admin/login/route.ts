import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Login attempt:", { email }); // Debug log (don't log passwords)

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required", success: false },
        { status: 400 }
      );
    }

    if (email === "admin@leadership.com" && password === "Admin123") {
      console.log("Login successful"); // Debug log
      return NextResponse.json({
        message: "Login successful",
        success: true,
        redirectUrl: "/admin/dashboard",
      });
    } else {
      console.log("Invalid credentials"); // Debug log
      return NextResponse.json(
        { message: "Invalid email or password", success: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Server error:", error); // Debug log
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
