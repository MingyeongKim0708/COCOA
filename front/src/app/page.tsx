"use client";

import H1 from "./_components/common/H1";
import H0 from "./_components/common/H0";
import Logo from "./_components/common/Logo";
import H2 from "./_components/common/H2";
import T1 from "./_components/common/T1";
import T2 from "./_components/common/T2";
import T3 from "./_components/common/T3";
import T4 from "./_components/common/T4";
import T5 from "./_components/common/T5";
import T6 from "./_components/common/T6";
import B1 from "./_components/common/B1";
import B2 from "./_components/common/B2";
import B3 from "./_components/common/B3";
import B4 from "./_components/common/B4";
import B5 from "./_components/common/B5";
import B6 from "./_components/common/B6";
import Tag from "./_components/common/Tag";
import Button from "./_components/common/Button";
import OptionButton from "./_components/common/OptionButton";
import { useState } from "react";
import Modal from "./_components/common/Modal";
import { EllipsisVertical } from "lucide-react";
import ContextMenu from "./_components/common/ContextMenu";

// 임시 더미
const options = [
  { id: "건성", label: "건성" },
  { id: "중성", label: "중성" },
  { id: "지성", label: "지성" },
  { id: "복합성", label: "복합성" },
  { id: "수부지", label: "수부지" },
];

const ingredient =
  "정제수, 다이프로필렌글라이콜, 네오펜틸글라이콜다이헵타노에이트, 글리세레스-26, 1,2-헥산다이올, 나이아신아마이드, 솔비톨, 하이드록시에틸우레아, 아보카도오일, 멕시칸치아씨추출물, 바질꽃/잎/줄기추출물, 베타인, 귀리커넬추출물, 부틸렌글라이콜, 흰서양송로추출물(1,740ppm), 글리세린, 해바라기씨오일, 토코페릴아세테이트, 다이소듐이디티에이, 다이포타슘글리시리제이트, 아데노신, 소듐팔미토일프롤린, 비피다발효용해물, 알바수련꽃추출물, 하이드롤라이즈드하이알루로닉애씨드, 돌콩오일, 스노우로투스추출물, 인삼추출물, 연꽃꽃추출물, 뽕나무껍질추출물, 마돈나백합꽃추출물, 에델바이스추출물, 약모밀추출물, 프리지어추출물, 카보머, 데이지꽃추출물, 알지닌, 포타슘솔베이트, 아나토씨오일, 토코페롤, 향료, 리날룰, 헥실신남알, 리모넨, 시트로넬올";

const items = ["수정하기", "삭제하기"];
export default function Home() {
  const [selectedId, setSelectedId] = useState<string>("");
  const [activeModal, setActiveModal] = useState<"ingredient" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (item: string) => {
    console.log("선택했다:", item);
    setMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="font-cute text-desc">
        오직 당신을 위한 화장품을 찾아주는
      </div>
      <Logo />
      <div className="border border-brown3 p-2 text-head1 text-brown2">
        <a href="./main">main page 이동</a>
      </div>

      <div className="text-body p-2 text-brown2">
        <button onClick={() => setActiveModal("ingredient")}>성분 보기</button>
      </div>

      <div className="relative flex items-center">
        컨텍스트 메뉴
        <button onClick={() => setMenuOpen((prev) => !prev)}>
          <EllipsisVertical size={20} />
        </button>
        {menuOpen && (
          <ContextMenu
            items={items}
            onSelect={handleSelect}
            className="absolute right-0 top-full mt-2"
          />
        )}
      </div>
      <H0 children="H0" />
      <H1 children="H1" className="text-red1" />
      <H2 children="H2" className="text-red2" />
      <T1 children="T1" />
      <T2 children="T2" className="text-pink1" />
      <T3 children="T3" className="text-pink2" />
      <T4 children="T4" className="text-pink3" />
      <T5 children="T5" className="text-pink4" />
      <T6 children="T6" className="text-gray2" />
      <B1 children="B1" />
      <B2 children="B2" className="text-pink1" />
      <B3 children="B3" className="text-pink2" />
      <B4 children="B4" className="text-pink3" />
      <B5 children="B5" className="text-pink4" />
      <B6 children="B6" className="text-gray2" />
      <Tag children="tag-pink" className="bg-pink4" />
      <Tag children="tag-gray" />

      <Button
        children="button"
        disabled
        onClick={() => console.log("클릭됨")}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {options.map((opt) => (
          <OptionButton
            key={opt.id}
            id={opt.id}
            label={opt.label}
            selected={selectedId === opt.id}
            onSelect={() => setSelectedId(opt.id)}
          />
        ))}
      </div>
      <Modal
        header={<T3 children="화장품 성분" />}
        body={<B4 children={ingredient} />}
        isOpen={activeModal === "ingredient"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
