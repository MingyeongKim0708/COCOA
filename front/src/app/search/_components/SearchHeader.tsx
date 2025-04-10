"use client";

import SearchBar from "./SearchBar";

type SearchHeaderProps = {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

export default function SearchHeader({
  value,
  onChange,
  onSubmit,
  placeholder = "검색어를 입력하세요",
}: SearchHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white py-4">
      <SearchBar
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
      />
    </div>
  );
}
