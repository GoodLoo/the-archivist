import { Product } from "@/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  desktopCols = 5,
}: {
  products: Product[];
  desktopCols?: 2 | 3 | 4 | 5 | 6;
}) {
  const colClass = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
  }[desktopCols];

  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${colClass}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
