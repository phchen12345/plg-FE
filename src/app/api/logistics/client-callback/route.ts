import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const allParams: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      allParams[key] = value;
    }

    // ⬇️ 記錄收到的所有資訊
    console.log("=== Received ECPay Callback Parameters ===");
    console.log(allParams);
    console.log("=========================================");

    // ... (您的原有邏輯繼續，並進行 CheckMacValue 驗證)

    // 假設您要取得門市資訊：
    const storeId = allParams["CVSStoreID"];
    console.log(`CVS Store ID received: ${storeId}`);
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
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
