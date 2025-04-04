export async function fetchWrapper(
  input: RequestInfo,
  options: RequestInit = {},
): Promise<Response> {
  // 기본 fetch 옵션
  const isFormData = options.body instanceof FormData;
  const config: RequestInit = {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    credentials: "include", // 쿠키 포함
  };

  let res = await fetch(input, config);

  // accessToken 만료 → refreshToken으로 재발급 시도
  if (res.status === 401) {
    try {
      const accessRes = await fetch("/token-refresh", {
        method: "POST",
        credentials: "include",
      });

      if (accessRes.ok) {
        // 재발급 성공 → 요청 재시도
        res = await fetch(input, config);
      } else {
        // 재발급도 실패 → 로그인 페이지로 보내는 로직 등
        console.warn("Refresh token expired. Redirecting to login...");
        alert("로그인이 필요합니다.");
        window.location.href = "/";
      }
    } catch (e) {
      console.error("토큰 재발급 중 오류 발생", e);
      throw e;
    }
  }

  return res;
}
