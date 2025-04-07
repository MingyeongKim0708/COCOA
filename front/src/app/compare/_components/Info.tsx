import { ComparedCosmetic } from "@/types/compare";

export default function Info({ data }: { data: ComparedCosmetic }) {
  return (
    <div>
      <div className="w-full max-w-[160px] bg-white pb-4">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="mx-auto h-[160px] w-[160px] rounded-xl object-cover"
        />

        <div className="mt-2">
          <h3 className="line-clamp-1 text-size4 font-title text-gray1">
            {data.brand}
          </h3>
          <p className="mt-1 line-clamp-3 min-h-[3.9rem] whitespace-pre-line text-size4 font-body text-gray1">
            {data.name}
          </p>
        </div>
      </div>
    </div>
  );
}
