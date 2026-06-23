import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout | ShowOff",
};

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 font-asul">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
