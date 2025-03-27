import { cn } from "@/utils/cn";
import BackButton from "./BackButton";

interface PageHeaderProps {
  title?: string | null;
  showBackButton?: boolean;
  className?: string;
}

const PageHeader = ({
  title,
  showBackButton = false,
  className,
}: PageHeaderProps) => {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex w-full justify-center bg-transparent">
      <div
        className={cn(
          "h-header max-w-base flex w-full items-center border-b border-gray5 bg-white p-5",
          className,
        )}
      >
        {showBackButton && <BackButton className="mr-1 pb-[0.1rem]" />}
        <h1 className="text-size2 font-title text-gray1">{title}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
