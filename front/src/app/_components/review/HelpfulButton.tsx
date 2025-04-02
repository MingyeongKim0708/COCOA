import { ThumbsUp } from "lucide-react";
import B4 from "../common/B4";
import B5 from "../common/B5";

interface HelpfulButtonProps {
  helpfulCount: number;
  helpfulForMe: boolean;
  onClick: () => void;
}

const HelpfulButton = ({
  helpfulCount,
  helpfulForMe,
  onClick,
}: HelpfulButtonProps) => {
  return (
    <div
      className="flex cursor-pointer flex-row items-center gap-2"
      onClick={onClick}
    >
      <ThumbsUp
        className={`${helpfulForMe ? "text-pink1" : "text-gray3"} text-base`}
      />
      <B5
        children={`${helpfulCount} 명에게 이 리뷰가 도움이 되었어요!`}
        className={helpfulForMe ? "text-pink1" : "text-gray3"}
      ></B5>
    </div>
  );
};

export default HelpfulButton;
