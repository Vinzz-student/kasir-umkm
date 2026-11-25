import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isSellerPage = pathname.startsWith("/penjual");
  const isSellerApi = pathname.startsWith("/api/seller");

  if (isSellerPage || isSellerApi) {
    const response = NextResponse.next();

    // Pemeriksaan autentikasi dan role tetap dilakukan di server.
    // Proxy hanya meneruskan request ke pemeriksaan server.
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/penjual/:path*", "/api/seller/:path*"],
};
