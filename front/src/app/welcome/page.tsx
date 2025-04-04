"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/UserStore";

export default function WelcomePage() {
  const router = useRouter();
  const { setUser } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/user`, {
        credentials: "include",
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData.data); // Zustand 저장
        router.push("/main"); // 메인으로 이동
      } else {
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  return <p>로그인 중입니다...</p>;
}
