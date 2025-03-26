interface ProductTagsProps {
  tags: string[];
}

const ProductTags = ({ tags }: ProductTagsProps) => {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto">
      {tags.slice(0, 3).map((tag, idx) => (
        <span
          key={idx}
          className="whitespace-nowrap rounded-full bg-gray5 px-2 py-[2px] text-size4 font-body text-gray2"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default ProductTags;
