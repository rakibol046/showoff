import { fetchProductBySlug } from "@/api/product.api";
import ProductGallery from "@/components/product/product-details/product-gallery";
import ProductInfo from "@/components/product/product-details/product-info";
import ProductTabs from "@/components/product/product-details/product-tabs";
import Link from "next/link";
import { notFound } from "next/navigation";

const IMG_BASE = (process.env.NEXT_PUBLIC_API_IMAGE_URL || "").replace(/\/$/, "");
const IMG_FALLBACK = "/images/default-product.webp";
function getImgSrc(path) {
  if (!path) return IMG_FALLBACK;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return IMG_BASE ? `${IMG_BASE}/${path.replace(/^\//, "")}` : IMG_FALLBACK;
}

export async function generateMetadata({ params }) {
  const { product_slug } = await params;
  try {
    const product = await fetchProductBySlug(product_slug);
    const firstImage = product.images?.[0];
    return {
      title: `${product.name} | ShowOff`,
      description: `Buy ${product.name} at the best price.`,
      openGraph: {
        title: `${product.name} | ShowOff`,
        description: `Buy ${product.name} at the best price.`,
        images: firstImage ? [getImgSrc(firstImage)] : [],
      },
    };
  } catch {
    return { title: "Product | ShowOff" };
  }
}

export default async function ProductDetails({ params }) {
  const { product_slug } = await params;

  let product;
  try {
    product = await fetchProductBySlug(product_slug);
  } catch {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: getImgSrc(product.images?.[0]),
    description: product.description || "",
    sku: product_slug,
    offers: {
      "@type": "Offer",
      priceCurrency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
      price: product.sell_price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/">Home</Link></li>
              <li>/</li>
              <li><Link href="/products">Products</Link></li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ProductGallery
              images={product.images || []}
              productName={product.name}
              discount={product.discount || 0}
            />
            <ProductInfo product={product} />
          </div>

          <ProductTabs product={product} />
        </div>
      </div>
    </>
  );
}
