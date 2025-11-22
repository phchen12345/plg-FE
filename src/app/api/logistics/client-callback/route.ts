import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const token =
      params.get("ExtraData") ??
      params.get("extraData") ??
      params.get("selectionToken") ??
      "";

    const target = new URL("/payment/store-callback", req.nextUrl.origin);
    if (token) {
      target.searchParams.set("token", token);
    }

    return NextResponse.redirect(target, { status: 303 });
  } catch (err) {
    console.error("[client-callback] error", err);
    return NextResponse.json({ message: "callback error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json(
    { message: "Method Not Allowed" },
    { status: 405 }
  );
}
