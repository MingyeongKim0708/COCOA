import { User } from "@/types/user";
import T3 from "../common/T3";
import Tag from "../common/Tag";

interface ReviewUserInfoProps {
  user: User | null;
}

const ReviewUserInfo = ({ user }: ReviewUserInfoProps) => {
  if (user == null) return;
  return (
    <div className="flex gap-3">
      <img
        src={user.imageUrl}
        alt="profile image"
        className="h-20 w-20 rounded-full object-cover"
      />
      <div className="flex flex-col justify-around">
        <T3 children={user.nickname} />
        <div className="flex flex-row gap-x-3">
          <Tag children={user.ageGroup} />
          <Tag children={user.gender} />
          <Tag children={user.skinType} />
          <Tag children={user.skinTone} />
        </div>
      </div>
    </div>
  );
};

export default ReviewUserInfo;
