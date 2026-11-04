"use client";

import { apiClient } from "@/lib/api-client";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";

type ProductActionsProps = {
  productId: string;
};

const ProductActions = ({ productId }: ProductActionsProps) => {
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
    try {
      setLoading(true);

      await apiClient.post("/cart/items", {
        productId,
        quantity: 1,
      });

      alert("Product added to cart successfully!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button onClick={addToCart} disabled={loading}>
        {loading ? "Adding..." : "Add to cart"}
      </Button>

      <Link href={`/store/order/checkout/${productId}`}>
        <Button>Buy Now</Button>
      </Link>
    </div>
  );
};

export default ProductActions;