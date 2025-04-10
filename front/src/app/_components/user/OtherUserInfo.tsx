import { UserWithKeywords } from "@/types/userInfo";
import UserInfo from "./UserInfo";
import Tag from "../common/Tag";

interface UserInfoProps {
  userInfos: UserWithKeywords;
}

const OtherUserInfo = ({ userInfos }: UserInfoProps) => {
  return (
    <div className="flex flex-col gap-4 py-2">
      <UserInfo user={userInfos?.user} />
      {userInfos.keywords && (
        <div className="no-scrollbar flex flex-row gap-x-3 overflow-x-auto">
          {Object.keys(userInfos.keywords).map((item) => (
            <Tag key={item} children={item} className="bg-pink4" />
          ))}
        </div>
      )}
      <hr />
    </div>
  );
};

export default OtherUserInfo;
