"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../_components/common/BottomNav";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

type UserResponse = {
  userId: number;
  nickname: string;
  gender: string;
  birthDate: string;
  skinType: string;
  skinTone: string;
  topKeywords?: Record<string, number>;
};

export default function MainPage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${baseUrl}/user`, {
        credentials: "include",
      });

      if (response.status === 401) {
        router.push("/");
      }

      if (!response.ok) {
        console.error("유저 조회 실패");
        return;
      }

      const userData = await response.json();
      setUser(userData.data);
    };

    fetchUser();
  }, []);

  if (!user) return <p>불러오는 중...</p>;

  return (
    <div className="text-pink1">
      <div>메인 페이지입니다.</div>
      <a href="/" className="text-size2 text-brown1">
        root로 이동
      </a>

      <BottomNav />
      <hr />

      {/* Typography 샘플 */}
      <h1 className="text-head0 font-head">head0 스타일</h1>
      <h1 className="text-head1 font-head text-red1">head1 스타일</h1>
      <h2 className="text-head2 font-head text-red2">head2 스타일</h2>
      <div className="text-size1 font-title">title1 스타일</div>
      <div className="text-size2 font-title text-pink1">title2 스타일</div>
      <div className="text-size3 font-title text-pink2">title3 스타일</div>
      <div className="text-size4 font-title text-pink3">title4 스타일</div>
      <div className="text-size5 font-title text-pink4">title5 스타일</div>
      <div className="text-size6 font-title text-gray2">title6 스타일</div>
      <div className="text-size1 font-body">body1 스타일</div>
      <div className="text-size2 font-body text-pink1">body2 스타일</div>
      <div className="text-size3 font-body text-pink2">body3 스타일</div>
      <div className="text-size4 font-body text-pink3">body4 스타일</div>
      <div className="text-size5 font-body text-pink4">body5 스타일</div>
      <div className="text-size6 font-body text-gray2">body6 스타일</div>

      {/* 마이페이지 */}
      <div className="p-6">
        <h1 className="text-xl font-bold">마이페이지</h1>
        <p>닉네임: {user.nickname}</p>
        <p>성별: {user.gender}</p>
        <p>생년월일: {user.birthDate}</p>
        <p>피부타입: {user.skinType}</p>
        <p>피부톤: {user.skinTone}</p>
      </div>

      {/* Top Keywords */}
      {user.topKeywords && (
        <div className="mt-4">
          <p className="font-semibold">워드 클라우드 주요 키워드</p>
          <ul className="list-inside list-disc text-sm text-gray-700">
            {Object.entries(user.topKeywords).map(([word, count]) => (
              <li key={word}>
                {word} ({count})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
