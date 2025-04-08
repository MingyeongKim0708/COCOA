"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/UserStore";
import { User } from "@/types/user";
import { fetchWrapper } from "@/lib/fetchWrapper";

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

      const res = await fetchWrapper(`${baseUrl}/user`);
      try {
        if (res.ok) {
          const {
            data: { user, keywords },
          } = await res.json();
          setUser(user);
          setKeywords(keywords);
          setTimeout(() => router.push("/home"), 0);
        }
      } catch (err) {
        console.error("로그인 오류", err);
        router.push("/");
      }
    };

    fetchUser();
  }, []);
}
