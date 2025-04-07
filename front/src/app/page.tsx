"use client";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const handleKakaoLogin = () => {
    window.location.href = `${baseUrl}/oauth2/authorization/kakao`;
  };
  return (
    <div className="relative z-0 mx-[-1.25rem] flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white via-pink3 to-brown1 text-center">
      <div className="absolute top-[calc(50%-7rem)] pt-0 font-cute text-desc">
        <p
          className="outlined-text relative text-brown1"
          data-content="오직 당신을 위한 화장품을 찾아주는"
        >
          오직 <span className="text-red2">당신</span>을 위한{" "}
          <span className="text-red2">화장품</span>을 찾아주는
        </p>
      </div>

      <img
        src="/logo_pink.svg"
        alt="logo"
        className="absolute left-1/2 top-[calc(50%-3.5rem)] w-56 -translate-x-1/2 -translate-y-1/2"
      />

      <div className="absolute bottom-12 w-3/4">
        <button
          onClick={handleKakaoLogin}
          className="relative flex h-12 w-full items-center justify-center rounded-xl bg-[#FEE500] pl-5 font-semibold tracking-wider text-[#000000D9] transition hover:brightness-95 active:brightness-90"
        >
          <img
            src="/kakao-icon.svg"
            alt="kakao"
            className="absolute left-5 w-5"
          />
          카카오톡으로 시작하기
        </button>
      </div>
      <img
        src="/melong_landing.png"
        alt="melong"
        className="absolute bottom-0 z-[-1]"
      />
    </div>
  );
}
