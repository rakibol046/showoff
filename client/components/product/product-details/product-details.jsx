import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Product data
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
  sizes: ["One Size"],
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

export default function ProductDetailsPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.images,
            description: product.description,
            sku: product.sku,
            brand: {
              "@type": "Brand",
              name: "Premium Audio",
            },
            offers: {
              "@type": "Offer",
              url: typeof window !== "undefined" ? window.location.href : "",
              priceCurrency: "USD",
              price: product.price,
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviews,
            },
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <ol className="flex items-center space-x-2">
            <li>Home</li>
            <li>/</li>
            <li>Electronics</li>
            <li>/</li>
            <li>Headphones</li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.images[currentImage]}
                alt={`${product.name} - Image ${currentImage + 1}`}
                className="w-full h-full object-cover"
              />

              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  -{discount}% OFF
                </Badge>
              )}

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    currentImage === index
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Color:{" "}
                <span className="font-normal text-gray-600">
                  {product.colors.find((c) => c.value === selectedColor)?.name}
                </span>
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color.value
                        ? "border-blue-600 ring-2 ring-blue-200 scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Size
              </label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 text-base font-semibold"
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-sm">Free Shipping</div>
                  <div className="text-xs text-gray-500">
                    On orders over $50
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-sm">2 Year Warranty</div>
                  <div className="text-xs text-gray-500">Full coverage</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-sm">30-Day Returns</div>
                  <div className="text-xs text-gray-500">
                    Money back guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="description"
              className="mt-6 bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <h4 className="font-semibold mb-3">Key Features:</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent
              value="specifications"
              className="mt-6 bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-4">
                Technical Specifications
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b pb-3">
                    <dt className="font-semibold text-gray-900 mb-1">{key}</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent
              value="reviews"
              className="mt-6 bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-bold">{product.rating}</div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on {product.reviews} reviews
                  </div>
                </div>
              </div>
              <p className="text-gray-500">
                Reviews section would display customer feedback here.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
