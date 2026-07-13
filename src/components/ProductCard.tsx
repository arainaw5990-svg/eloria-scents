import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Product } from '../lib/types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? '',
    });
    showToast('Added to cart — check your cart to proceed');
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-50">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-50 to-ink-100">
            <Star size={32} className="text-ink-300" />
          </div>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-ink-900 px-4 py-1.5 text-xs font-semibold text-white">Out of Stock</span>
          </div>
        )}
        {product.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-ink-900">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        {product.category && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gold-600">
            {product.category.name}
          </p>
        )}
        <h3 className="font-serif text-lg font-semibold text-ink-900 line-clamp-1">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-bold text-ink-900">{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            disabled={product.stock_quantity === 0}
            className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gold-400 hover:text-ink-900 disabled:opacity-40"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
