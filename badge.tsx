import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/lib/supabase";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock <= 0;

  return (
    <Card className="group overflow-hidden border-border/60 transition-shadow hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-secondary">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge variant="secondary" className="mb-2 capitalize">{product.category}</Badge>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-semibold leading-tight line-clamp-1 hover:text-primary">{product.name}</h3>
            </Link>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold">{formatCurrency(product.price)}</span>
          {outOfStock ? (
            <span className="text-xs font-medium text-destructive">Out of stock</span>
          ) : lowStock ? (
            <span className="text-xs font-medium text-accent">Only {product.stock} left</span>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={outOfStock}
          onClick={() => addItem(product)}
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? "Unavailable" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
