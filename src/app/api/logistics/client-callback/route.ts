import { NextRequest, NextResponse } from "next/server";

const TARGET_PATH = "/payment/store-callback"; // 換成你想導向的頁面

export async function POST(req: NextRequest) {
  try {
    // 綠界的 ClientReplyURL 會用 x-www-form-urlencoded 格式
    const body = await req.text();
    const params = new URLSearchParams(body);
    const token =
      params.get("ExtraData") ??
      params.get("selectionToken") ??
      params.get("extraData") ??
      "";

    const redirectUrl = new URL(TARGET_PATH, req.nextUrl.origin);
    if (token) {
      redirectUrl.searchParams.set("token", token);
    }

    // 303 讓瀏覽器用 GET 重新載入頁面
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (err) {
    console.error("[client-callback] error", err);
    return NextResponse.json({ message: "callback error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
