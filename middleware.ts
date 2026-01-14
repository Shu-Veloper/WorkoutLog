import { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Vercel Edge에서 제공하는 geo 타입 정의
interface VercelGeo {
  country?: string;
  city?: string;
  region?: string;
}

// 국가 코드 → locale 매핑
const countryToLocale: Record<string, "ja" | "en" | "ko"> = {
  JP: "ja", // 일본
  KR: "ko", // 한국
  // 나머지 국가는 영어로 fallback
};

// 지원하는 locale 목록
const supportedLocales = ["ja", "en", "ko"];

export async function middleware(request: NextRequest) {
  // 1. Supabase 세션 처리
  const response = await updateSession(request);

  // 2. 이미 locale 쿠키가 있으면 스킵 (사용자가 직접 선택한 경우)
  const existingLocale = request.cookies.get("locale")?.value;
  if (existingLocale && supportedLocales.includes(existingLocale)) {
    return response;
  }

  // 3. Vercel Edge에서 국가 감지 (Vercel 배포 시에만 사용 가능)
  const geo = (request as NextRequest & { geo?: VercelGeo }).geo;
  const country = geo?.country;

  // 4. 국가 기반 locale 결정
  let detectedLocale: "ja" | "en" | "ko" = "ja"; // 기본값: 일본어

  if (country && countryToLocale[country]) {
    // 국가 코드로 매핑된 locale 사용
    detectedLocale = countryToLocale[country];
  } else {
    // Fallback: Accept-Language 헤더 파싱
    const acceptLanguage = request.headers.get("Accept-Language");
    if (acceptLanguage) {
      if (acceptLanguage.includes("ja")) {
        detectedLocale = "ja";
      } else if (acceptLanguage.includes("ko")) {
        detectedLocale = "ko";
      }
      // 그 외는 기본값 영어 유지
    }
  }

  // 5. 쿠키에 저장 (1년간 유지)
  response.cookies.set("locale", detectedLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

// Middleware가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
