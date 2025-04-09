import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmit }) => {
  return (
    <div className="flex w-full items-center justify-between rounded-full bg-gray-100 px-4 py-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder="제품, 키워드 검색"
        className="w-full bg-transparent pr-2 text-sm placeholder-gray-400 outline-none"
      />
      <button onClick={onSubmit}>
        <Search size={20} className="text-gray-500" />
      </button>
    </div>
  );
};

export default SearchBar;
