export default async function ProductDetails({ params }) {
  const { product_slug } = await params;
  console.log(product_slug);
  return (
    <>
      <h1>Product details</h1>
      <p>peoducts id is : {product_slug}</p>
    </>
  );
}
