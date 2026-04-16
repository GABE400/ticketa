import ImageKit from "imagekit";
import { NextResponse } from "next/server";

// Force this route to be dynamic to prevent Next.js from evaluating 
// it during static optimization at build time.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Lazy initialization ensures environment variables are only checked 
    // at request time, not during build time.
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    // Safety check for request-time execution
    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error("Missing ImageKit environment variables");
      return NextResponse.json(
        { error: "ImageKit configuration is missing" }, 
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate with ImageKit" }, 
      { status: 500 }
    );
  }
}
