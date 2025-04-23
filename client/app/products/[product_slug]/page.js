import Details from "@/components/product/product-details/product-details";

export default async function ProductDetails({ params }) {
  const { product_slug } = await params;
  console.log(product_slug);
  const exampleProduct = {
    name: "Premium Cotton T-Shirt",
    description:
      "High-quality, breathable cotton T-shirt available in multiple colors and sizes.",
    sell_price: 500,
    discount: 10,
    thumbnail: "/images/img6.webp",
    product_images: [
      "/images/img1.webp",
      "/images/img2.webp",
      "/images/img3.webp",
    ],
    variants: [
      {
        size: "M",
        color: "Red",
        sell_price: 500,
        stock: 10,
        image: "/images/img1.webp",
      },
      {
        size: "L",
        color: "Red",
        sell_price: 520,
        stock: 0,
        image: "/images/img2.webp",
      },
      {
        size: "XL",
        color: "Blue",
        sell_price: 510,
        stock: 5,
        image: "/images/img3.webp",
      },
      {
        size: "2XL",
        color: "Green",
        sell_price: 530,
        stock: 3,
        image: "/images/img4.webp",
      },
    ],
  };

  return (
    <>
      <h1>Product details</h1>
      <p>peoducts id is : {product_slug}</p>

      <Details product={exampleProduct} />
    </>
  );
}
