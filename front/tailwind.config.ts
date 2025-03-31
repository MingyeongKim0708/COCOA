import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/utils/**/*.{ts,tsx}", // ← cn 함수 등도 포함 가능
  ],
  theme: {
    extend: {
      // 색상
      colors: {
        black: "var(--color-black)",
        white: "var(--color-white)",

        red1: "var(--color-red1)",
        red2: "var(--color-red2)",

        blue1: "var(--color-blue1)",
        blue2: "var(--color-blue2)",

        gray1: "var(--color-gray1)",
        gray2: "var(--color-gray2)",
        gray3: "var(--color-gray3)",
        gray4: "var(--color-gray4)",
        gray5: "var(--color-gray5)",

        pink1: "var(--color-pink1)",
        pink2: "var(--color-pink2)",
        pink3: "var(--color-pink3)",
        pink4: "var(--color-pink4)",

        brown1: "var(--color-brown1)",
        brown2: "var(--color-brown2)",
        brown3: "var(--color-brown3)",
        brown4: "var(--color-brown4)",
      },

      // 폰트
      fontFamily: {
        sans: ["FreesentationVF", "sans-serif"],
        cocoa: ["'Lilita One'", "cursive"],
        cute: ["Jua", "sans-serif"],
      },

      // 크기
      fontSize: {
        head0: ["3rem", { lineHeight: "3.9rem" }], // Figma의 Head0에 상응
        head1: ["2.5rem", { lineHeight: "3.25rem" }],
        head2: ["2.25rem", { lineHeight: "2.925rem" }],

        size1: ["2rem", { lineHeight: "2.6rem" }], // Figma의 Title1, Body1에 상응
        size2: ["1.5rem", { lineHeight: "1.95rem" }],
        size3: ["1.25rem", { lineHeight: "1.625rem" }],
        size4: ["1rem", { lineHeight: "1.3rem" }], // 기본 크기
        size5: ["0.75rem", { lineHeight: "0.975rem" }],
        size6: ["0.625rem", { lineHeight: "0.8125rem" }],

        logo: ["4rem", { lineHeight: "5.2rem" }], // COCOA 로고용
        desc: ["1rem", { lineHeight: "1.3rem" }], // COCOA 로고 위 설명글
      },

      // 굵기
      fontWeight: {
        head: "900",
        title: "680",
        body: "410",
      },

      // 여백, 높이, 넓이
      padding: {
        base: "var(--base-width)",
        nav: "var(--bottom-nav-height)",
        header: "var(--top-header-height)",
      },
      height: {
        nav: "var(--bottom-nav-height)",
        header: "var(--top-header-height)",
      },
      width: {
        base: "var(--base-width)",
        header: "var(--top-header-width)",
      },
      maxWidth: {
        base: "var(--base-width)",
      },

      // 모서리 둥글기
      borderRadius: {
        custom: "0.625rem", //10px
      },
    },
  },
  plugins: [],
};

export default config;
