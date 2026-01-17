import Details from "@/components/product/product-details/product-details";
import { fetchProductBySlug } from "@/api/product.api";

export async function generateMetadata({ params }) {
  const { product_slug } = await params;
  const product = await fetchProductBySlug(product_slug);

  return {
    title: `${product.name} | ShowOff`,
    description: `Buy ${product.name} at the best price. Explore features, specifications, and more.`,
    keywords: `${product.name}, buy ${product.name}, online shopping`,
    canonical: `${process.env.NEXT_PUBLIC_API_BASE_URL}product/${product_slug}`,
    openGraph: {
      title: `${product.name} | ShowOff`,
      description: `Buy ${product.name} at the best price. Explore features, specifications, and more.`,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}product/${product_slug}`,
      // type: "product",
      images: [
        {
          url: product?.thumbnail,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ShowOff`,
      description: `Buy ${product.name} at the best price. Explore features, specifications, and more.`,
      images: [product?.thumbnail],
    },
  };
}

export default async function ProductDetails({ params }) {
  const { product_slug } = await params;
  const product = await fetchProductBySlug(product_slug);

  return (
    <main>
      <Details product={product} />
    </main>
  );
}
