"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OptionButton from "../_components/common/OptionButton";
import PageHeader from "../_components/common/PageHeader";
import InputSection from "../_components/common/InputSection";
const genderOptions = [
  { id: "여성", label: "여성" },
  { id: "남성", label: "남성" },
];

const skinTypeOptions = [
  { id: "건성", label: "건성" },
  { id: "중성", label: "중성" },
  { id: "지성", label: "지성" },
  { id: "복합성", label: "복합성" },
  { id: "수부지", label: "수부지" },
];

const skinToneOptions = [
  { id: "봄웜톤", label: "봄웜톤" },
  { id: "여름쿨톤", label: "여름쿨톤" },
  { id: "가을웜톤", label: "가을웜톤" },
  { id: "겨울쿨톤", label: "겨울쿨톤" },
  { id: "톤모름", label: "톤모름" },
];

export default function SignUpPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [skinType, setSkinType] = useState("");
  const [skinTone, setSkinTone] = useState("");

  const isFormValid = nickname && birthDate && gender && skinType && skinTone;

  const handleSubmit = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!isFormValid) return;

    const payload = {
      nickname,
      birthDate,
      gender,
      skinType,
      skinTone,
    };

    try {
      const response = await fetch(`${baseUrl}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/main");
      } else {
        console.error("회원가입 실패");
      }
    } catch (error) {
      console.error("서버 요청 오류", error);
    }
  };

  return (
    <div>
      <PageHeader title="회원가입" />
      <InputSection titlePink="닉네임" titleGray="을 입력해주세요">
        <input
          maxLength={20}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임은 12자까지 입력 가능합니다."
          className="w-full rounded border-2 border-brown3 px-3 py-2 placeholder-brown3 focus:border-red2 focus:outline-none focus:ring-0"
        />
        <p className="pt-1 text-xs text-blue-500">사용 가능한 닉네임입니다.</p>
      </InputSection>

      <InputSection titlePink="생년월일" titleGray="을 입력해주세요">
        <input
          type="date"
          max="9999-12-31"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full rounded border-2 border-brown3 px-3 py-2 text-brown3 placeholder-brown3 focus:border-red2 focus:outline-none focus:ring-0"
        />
      </InputSection>

      <InputSection titlePink="성별" titleGray="을 선택해주세요">
        <div className="flex justify-center gap-6">
          {genderOptions.map((opt) => (
            <OptionButton
              key={opt.id}
              id={opt.id}
              label={opt.label}
              selected={gender === opt.id}
              onSelect={setGender}
            />
          ))}
        </div>
      </InputSection>

      <InputSection titlePink="피부타입" titleGray="을 선택해주세요">
        <div className="flex flex-wrap justify-center gap-4">
          {skinTypeOptions.map((opt) => (
            <OptionButton
              key={opt.id}
              id={opt.id}
              label={opt.label}
              selected={skinType === opt.id}
              onSelect={setSkinType}
            />
          ))}
        </div>
      </InputSection>

      <InputSection titlePink="피부톤" titleGray="을 선택해주세요">
        <div className="flex flex-wrap justify-center gap-4">
          {skinToneOptions.map((opt) => (
            <OptionButton
              key={opt.id}
              id={opt.id}
              label={opt.label}
              selected={skinTone === opt.id}
              onSelect={setSkinTone}
            />
          ))}
        </div>
      </InputSection>

      <div className="fixed bottom-6 left-0 flex w-full justify-center px-4">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`h-[2.5rem] w-[20rem] rounded-md px-8 py-[0.5625rem] text-size4 font-title text-white ${!isFormValid ? "bg-gray4" : "bg-red2"}`}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
