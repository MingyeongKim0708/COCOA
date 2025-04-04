"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/UserStore";
import { User } from "@/types/user";

export interface UserResponse {
  user: User;
  keywords: Record<string, number> | null;
}

export default function WelcomePage() {
  const router = useRouter();
  const { setUser, setKeywords } = useUserStore();

  useEffect(() => {
    const fetchUser = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/user`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();

        setUser(data.data.user);
        setKeywords(data.data.keywords);

        router.push("/home"); // 홈으로 이동
      } else {
        router.push("/");
      }
    };

    fetchUser();
  }, []);
}
