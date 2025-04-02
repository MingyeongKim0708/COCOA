import B3 from "./B3";

const InputSection = ({
  titlePink,
  titleGray,
  children,
}: {
  titlePink: string;
  titleGray: string;
  children: React.ReactNode;
}) => (
  <div className="w-full py-3">
    <div className="inline-flex gap-1 pb-3">
      <B3 className="text-pink1">{titlePink}</B3>
      <B3 className="text-gray1">{titleGray}</B3>
    </div>
    {children}
  </div>
);

export default InputSection;
