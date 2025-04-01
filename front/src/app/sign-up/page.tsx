"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [skinType, setSkinType] = useState("");
  const [skinTone, setSkinTone] = useState("");

  const isFormValid = nickname && birthDate && gender && skinType && skinTone;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const payload = {
      nickname,
      birthDate,
      gender,
      skinType,
      skinTone,
    };

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 자동 포함
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

  const OptionButton = ({ label, value, selectedValue, onClick }: any) => (
    <button
      className={`m-1 rounded-full border px-4 py-2 text-sm ${
        selectedValue === value
          ? "border-red-400 bg-red-100 text-red-600"
          : "border-gray-300"
      }`}
      onClick={() => onClick(value)}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-xl font-semibold">회원가입</h1>

      <label className="text-sm font-medium">닉네임을 입력해주세요</label>
      <input
        maxLength={20}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임은 12자까지 입력 가능합니다."
        className="mb-2 mt-1 w-full rounded border px-3 py-2"
      />
      <p className="mb-4 text-xs text-blue-500">사용 가능한 닉네임입니다.</p>

      <label className="text-sm font-medium">생년월일을 입력해주세요</label>
      <div className="mb-4 flex space-x-2">
        <label className="text-sm font-medium">생년월일을 선택해주세요</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2"
        />
      </div>

      <label className="text-sm font-medium">성별을 선택해주세요</label>
      <div className="mb-4 flex">
        <OptionButton
          label="여성"
          value="여성"
          selectedValue={gender}
          onClick={setGender}
        />
        <OptionButton
          label="남성"
          value="남성"
          selectedValue={gender}
          onClick={setGender}
        />
      </div>

      <label className="text-sm font-medium">피부타입을 선택해주세요</label>
      <div className="mb-4 flex flex-wrap">
        {["건성", "중성", "지성", "복합성", "수부지"].map((type) => (
          <OptionButton
            key={type}
            label={type}
            value={type}
            selectedValue={skinType}
            onClick={setSkinType}
          />
        ))}
      </div>

      <label className="text-sm font-medium">피부톤을 선택해주세요</label>
      <div className="mb-6 flex flex-wrap">
        {["봄웜톤", "여름쿨톤", "가을웜톤", "겨울쿨톤", "톤모름"].map(
          (tone) => (
            <OptionButton
              key={tone}
              label={tone}
              value={tone}
              selectedValue={skinTone}
              onClick={setSkinTone}
            />
          ),
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`w-full rounded py-2 text-lg font-semibold text-white ${
          isFormValid ? "bg-red-500" : "cursor-not-allowed bg-red-300"
        }`}
      >
        가입하기
      </button>
    </div>
  );
}
