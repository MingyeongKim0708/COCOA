"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <button
      onClick={onChange}
      className={`relative h-[1.125rem] w-9 rounded-full transition-colors duration-200 ${
        checked ? "bg-red2" : "bg-gray4"
      }`}
    >
      <span
        className={`absolute left-1 top-[0.1875rem] h-3 w-3 rounded-full bg-white transition-transform duration-200 ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
