"use client";

import { User } from "@/types/user";
import T3 from "../common/T3";
import Tag from "../common/Tag";
import T2 from "../common/T2";

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
        <T3>{user.nickname}</T3>
        <div className="flex flex-row gap-x-3">
          <Tag children={user.ageGroup}></Tag>
          <Tag children={user.gender}></Tag>
          <Tag children={user.skinType}></Tag>
          <Tag children={user.skinTone}></Tag>
        </div>
      </div>
    </div>
  );
};

export default ReviewUserInfo;
