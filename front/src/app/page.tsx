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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="font-cute text-desc">
        오직 당신을 위한 화장품을 찾아주는
      </div>
      <Logo />
      <div className="border border-brown3 p-2 text-head1 text-brown2">
        <a href="./main">main page 이동</a>
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
      <Tag children="tag-pink" radius="custom" className="bg-pink4" />
      <Tag children="tag-gray" radius="custom" />
    </div>
  );
}
