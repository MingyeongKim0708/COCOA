import { X } from "lucide-react";

interface ButtonProps {
  label: string;
  onRemove: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onRemove }) => {
  return (
    <div className="mb-2 mr-2 flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
      <span>{label}</span>
      <button onClick={onRemove} className="ml-2">
        <X size={16} />
      </button>
    </div>
  );
};

export default Button;
