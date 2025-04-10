import { User } from "@/types/user";
import T3 from "../common/T3";
import Tag from "../common/Tag";
import { useUserStore } from "@/stores/UserStore";
import EditUserButton from "./EditUserButton";

interface UserInfoProps {
  user: User | null;
}

const UserInfo = ({ user }: UserInfoProps) => {
  const loginUser = useUserStore().user;
  if (user == null) return;
  return (
    <div className="flex gap-3">
      <img
        src={user.imageUrl}
        alt="profile image"
        className="h-20 w-20 rounded-full object-cover"
      />
      <div className="flex flex-col justify-around">
        <div className="flex flex-row items-center gap-1 pl-1">
          <T3 children={user.nickname} />
          {user.id === loginUser?.id && <EditUserButton />}
        </div>
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

export default UserInfo;
