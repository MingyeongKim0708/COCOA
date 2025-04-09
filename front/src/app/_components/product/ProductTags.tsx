import Tag from "../common/Tag";

interface ProductTagsProps {
  tags: string[];
}

const ProductTags = ({ tags }: ProductTagsProps) => {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto">
      {tags.map((item) => (
        <Tag key={item} children={item} />
      ))}
    </div>
  );
};

export default ProductTags;
