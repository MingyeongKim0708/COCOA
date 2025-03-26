import { cn } from "@/utils/cn";
import BackButton from "./BackButton";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  className?: string;
}

const PageHeader = ({
  title,
  showBackButton = false,
  className,
}: PageHeaderProps) => {
  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex h-[3.4375rem] w-full items-center bg-white",
        className,
      )}
    >
      {showBackButton && <BackButton className="mr-2" />}
      <h1 className="text-size2 font-title text-gray1">{title}</h1>
    </header>
  );
};

export default PageHeader;
