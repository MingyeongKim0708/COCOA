interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-brown2 bg-white px-4 py-2 text-gray1 placeholder:text-gray3 focus:outline-none focus:ring-1 focus:ring-brown2"
      inputMode="text"
    />
  );
};

export default Input;
