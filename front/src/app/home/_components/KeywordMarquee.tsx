import T3 from "@/app/_components/common/T3";
import Tag from "@/app/_components/common/Tag";
import { useUserStore } from "@/stores/UserStore";

export function KeywordMarquee() {
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
      <T3 className="pb-3">{user.nickname}님의 키워드 현황 </T3>
      <div className="animate-marquee inline-flex gap-3 pb-3">
        {/* 단어들을 4 번 반복해서 무한 루프처럼 보이게 */}
        {Array.from({ length: 4 }).flatMap((_, i) =>
          userKeywordList.map((kw, idx) => (
            <Tag key={`${i}-${idx}`} className="bg-gray5 px-3 py-1 text-center">
              {kw}
            </Tag>
          )),
        )}
      </div>
      <div className="animate-marquee inline-flex gap-3">
        {Array.from({ length: 4 }).flatMap((_, i) =>
          reviewKeywordList.map((kw, idx) => (
            <Tag key={`${i}-${idx}`} className="bg-pink4 px-3 py-1 text-center">
              {kw}
            </Tag>
          )),
        )}
      </div>
    </section>
  );
}
