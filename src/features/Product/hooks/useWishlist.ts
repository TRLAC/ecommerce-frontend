// features/product/list/hooks/useWishlist.ts
import { useState, useCallback } from "react";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return { wishlist, toggleWishlist };
}