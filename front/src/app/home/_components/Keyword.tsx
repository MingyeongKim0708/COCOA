import T3 from "@/app/_components/common/T3";
import Tag from "@/app/_components/common/Tag";
import { useUserStore } from "@/stores/UserStore";
import { KeywordMarquee } from "./KeywordMarquee";

export function Keyword() {
  const { user, keywords } = useUserStore();

  const userKeywordList = [
    user.gender,
    user.ageGroup,
    user.skinType,
    user.skinTone,
  ];
  const reviewKeywordList = [...(keywords ? Object.keys(keywords) : [])];
  return (
    <section className="w-full overflow-hidden pb-5">
      <T3 children={`${user.nickname}님의 키워드 현황`} className="pb-4"></T3>
      <KeywordMarquee keywords={userKeywordList} color="bg-gray5" />
      <KeywordMarquee keywords={reviewKeywordList} color="bg-pink4" />
    </section>
  );
}
