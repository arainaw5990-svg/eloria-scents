import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/types';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { settings } = useSettings();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_enabled', true)
      .eq('is_featured', true)
      .order('sort_order')
      .limit(8)
      .then(({ data }) => setFeatured(data ?? []));

    supabase
      .from('categories')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order')
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-ink-900">
        {settings.hero_image_url ? (
          <img src={settings.hero_image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-950" />
        )}
        <div className="relative z-10 px-4 text-center text-white sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <Sparkles size={32} className="mx-auto mb-4 text-gold-400" />
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {settings.brand_name}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-200">
              {settings.tagline}
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-400 px-8 py-3.5 text-sm font-semibold text-ink-900 transition hover:bg-gold-300 active:scale-95"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-serif text-3xl font-bold text-ink-900">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group relative flex h-32 items-center justify-center overflow-hidden rounded-xl bg-ink-100 transition hover:shadow-lg md:h-40"
              >
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-ink-100 to-ink-200" />
                )}
                <span className="relative z-10 rounded-lg bg-white/90 px-4 py-2 text-center text-sm font-semibold text-ink-900 backdrop-blur-sm">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-ink-900">Featured Fragrances</h2>
          <Link to="/shop" className="flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink-200 py-20 text-center">
            <p className="text-ink-400">No products yet. Check back soon!</p>
            <Link to="/shop" className="mt-4 inline-block text-sm font-medium text-gold-600 hover:text-gold-700">
              Browse all products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
