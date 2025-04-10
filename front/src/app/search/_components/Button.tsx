import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  label: string;
  onRemove: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onRemove }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/search/result?name=${encodeURIComponent(label)}`);
  };

  return (
    <div className="mb-2 mr-2 flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
      <button onClick={handleClick}>
        <span>{label}</span>
      </button>
      <button onClick={onRemove} className="ml-2">
        <X size={16} />
      </button>
    </div>
  );
};

export default Button;
