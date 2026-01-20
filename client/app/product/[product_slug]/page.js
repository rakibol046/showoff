// import Details from "@/components/product/product-details/product-details";
import { fetchProductBySlug } from "@/api/product.api";
import ProductGallery from "@/components/product/product-details/product-gallery";
import ProductInfo from "@/components/product/product-details/product-info";
import ProductTabs from "@/components/product/product-details/product-tabs";
import Link from "next/link";

const product = {
  name: "Premium Wireless Headphones",
  price: 299.99,
  originalPrice: 399.99,
  rating: 4.8,
  reviews: 256,
  description:
    "Experience premium sound quality with our flagship wireless headphones. Featuring advanced noise cancellation, 40-hour battery life, and premium comfort for all-day wear.",
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=800&fit=crop",
  ],
  colors: [
    { name: "Matte Black", value: "black", hex: "#1a1a1a" },
    { name: "Silver", value: "silver", hex: "#c0c0c0" },
    { name: "Rose Gold", value: "rose-gold", hex: "#b76e79" },
    { name: "Navy Blue", value: "navy", hex: "#1e3a8a" },
  ],
  sizes: ["SM", "MD", "LG"],
  inStock: true,
  sku: "WH-PRO-2024",
  features: [
    "Active Noise Cancellation",
    "40-hour battery life",
    "Premium comfort padding",
    "Bluetooth 5.3",
    "Multi-device pairing",
    "Fast charging (10 min = 5 hours)",
  ],
  specifications: {
    "Driver Size": "40mm",
    "Frequency Response": "20Hz - 20kHz",
    Impedance: "32 Ohms",
    Weight: "250g",
    "Bluetooth Version": "5.3",
    "Battery Life": "40 hours",
  },
};

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
      images: [product.images[0]],
      // type: "product.item",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ShowOff`,
      description: `Buy ${product.name} at the best price. Explore features, specifications, and more.`,
      images: [product.images[0]],
    },
  };
}

export default async function ProductDetails({ params }) {
  const { product_slug } = await params;
  const product = await fetchProductBySlug(product_slug);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://showoff-client.vercel.app/",
    "@type": "Product",
    name: product.name,
    image: product.images[0],
    description: product.description,
    sku: product_slug,

    offers: {
      "@type": "Offer",
      url: "https://showoff-client.vercel.app/product/" + product_slug,
      priceCurrency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
      price: product.price,
      availability: product.stock > 0 ? "InStock" : "OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };
  return (
    <>
      {/* Structured Data - Rendered server-side for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb - Server-rendered for SEO */}
          <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/products">Products</Link>
              </li>

              <li>/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Client Component for interactive gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
              discount={discount}
            />

            {/* Client Component for interactive product info */}
            <ProductInfo product={product} />
          </div>

          {/* Client Component for interactive tabs */}
          <ProductTabs product={product} />
        </div>
      </div>
    </>
  );
}
