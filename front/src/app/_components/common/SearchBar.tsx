"use client";

import { Search } from "lucide-react"; // lucide 아이콘
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "검색어를 입력하세요.",
}: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center rounded-lg bg-gray5 px-4 py-3"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-size4 text-gray1 placeholder:text-gray3 focus:outline-none"
      />
      <button type="submit" className="text-gray3 active:text-gray1">
        <Search size={18} />
      </button>
    </form>
  );
}
