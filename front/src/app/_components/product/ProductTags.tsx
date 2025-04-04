import Tag from "../common/Tag";

interface ProductTagsProps {
  tags: Record<string, number>;
}

const ProductTags = ({ tags }: ProductTagsProps) => {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto">
      {Object.keys(tags)
        .slice(0, 3)
        .map((key) => (
          <Tag children={key} />
        ))}
    </div>
  );
};

export default ProductTags;
