import B4 from "@/app/_components/common/B4";
import T4 from "@/app/_components/common/T4";
import { ComparedCosmetic } from "@/types/compare";

export default function Info({ data }: { data: ComparedCosmetic }) {
  return (
    <div>
      <div className="w-full max-w-[160px] bg-white pb-3">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="mx-auto h-[160px] w-[160px] rounded-xl object-cover"
        />

        <div className="mt-2">
          <T4 className="line-clamp-1 text-gray1">{data.brand}</T4>
          <B4 className="mt-1 line-clamp-2 min-h-[2.5rem] whitespace-pre-line text-size4 font-body text-gray1">
            {data.name}
          </B4>
        </div>
      </div>
    </div>
  );
}
