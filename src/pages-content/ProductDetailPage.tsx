"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  ChevronLeft,
  Check,
  Truck,
  ShieldCheck,
  Wrench,
  Package,
  Clock,
  Hash,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import { api, type Product as ApiProduct } from "@/lib/api-client";

type TabKey = "description" | "specifications" | "features" | "reviews";

type UiProduct = {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  price: number;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  reviews: Array<{ id: number; author: string; date: string; rating: number; title: string; comment: string; verified: boolean }>;
  inStock: boolean;
  stockQuantity: number;
  deliveryTime: string;
  weight: string;
  packageDimensions: string;
  description: string;
  longDescription: string;
  features: string[];
  specifications: Record<string, string>;
};

const mapProduct = (p: ApiProduct): UiProduct => ({
  id: p.id,
  name: p.name,
  category: p.category || "Other",
  brand: "MIS Steel",
  sku: p.id.slice(0, 8).toUpperCase(),
  price: Number(p.price),
  image: p.image_url || "https://placehold.co/600x400?text=Aucune+image",
  gallery: p.image_url ? [p.image_url] : [],
  rating: 4.7,
  reviewCount: 0,
  reviews: [],
  inStock: (p.stock ?? 0) > 0,
  stockQuantity: p.stock ?? 0,
  deliveryTime: "Nous contacter pour le délai de livraison",
  weight: "—",
  packageDimensions: "—",
  description: p.description || "",
  longDescription: p.description || "",
  features: [],
  specifications: {},
});

export function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [product, setProduct] = useState<UiProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const formatPrice = (value: number) =>
    `${value.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} DT`;

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const d = await api.get<{ product: ApiProduct }>(`/api/products/${id}`);
        const mapped = mapProduct(d.product);
        setProduct(mapped);
        const list = await api.get<{ items: ApiProduct[] }>(
          `/api/products?category=${encodeURIComponent(mapped.category)}`
        );
        setRelatedProducts(
          list.items.filter((p) => p.id !== mapped.id).slice(0, 3).map(mapProduct)
        );
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl text-secondary mb-4">Produit introuvable</h1>
          <p className="text-gray-600 mb-8">Le produit que vous cherchez n&apos;existe pas.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
          >
            <ChevronLeft size={18} /> Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews.filter((r) => r.rating === star).length;
    return {
      star,
      count,
      percent: product.reviews.length ? (count / product.reviews.length) * 100 : 0,
    };
  });

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">
              Boutique
            </Link>
            <span>/</span>
            <span className="text-secondary">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ChevronLeft size={18} /> Retour à la boutique
          </Link>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
              <div>
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative rounded-xl overflow-hidden bg-gray-100 h-[480px]"
                >
                  <img
                    src={gallery[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg">
                        Rupture de stock
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm">
                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                    <span className="text-secondary font-semibold">{product.rating}</span>
                    {product.reviewCount > 0 && (
                      <span className="text-gray-500">({product.reviewCount})</span>
                    )}
                  </div>
                </motion.div>

                {gallery.length > 1 && (
                  <div className="flex gap-3 mt-4">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === idx
                            ? "border-primary"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <div className="text-sm text-primary mb-2">{product.category}</div>
                <h1 className="text-3xl lg:text-4xl text-secondary mb-3">{product.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {product.brand}
                  </span>
                  <span
                    className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${
                      product.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? "En stock" : "Rupture de stock"}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">{product.description}</p>

                <div className="text-4xl text-primary mb-6">{formatPrice(product.price)}</div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-secondary">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!product.inStock}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={20} />
                    Ajouter au panier
                  </motion.button>
                </div>

                <Link
                  href="/contact"
                  className="text-center bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all mb-8"
                >
                  Demander un devis
                </Link>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-5 px-5 bg-gray-50 rounded-lg mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash className="text-gray-400" size={16} />
                    <div>
                      <div className="text-xs text-gray-500">Réf.</div>
                      <div className="text-secondary font-medium">{product.sku}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="text-gray-400" size={16} />
                    <div>
                      <div className="text-xs text-gray-500">Disponible</div>
                      <div className="text-secondary font-medium">
                        {product.stockQuantity > 0
                          ? `${product.stockQuantity} en stock`
                          : "Rupture de stock"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400" size={16} />
                    <div>
                      <div className="text-xs text-gray-500">Livraison</div>
                      <div className="text-secondary font-medium">{product.deliveryTime}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="text-gray-400" size={16} />
                    <div>
                      <div className="text-xs text-gray-500">Poids</div>
                      <div className="text-secondary font-medium">{product.weight}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <Truck className="text-primary flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-secondary font-semibold">Livraison</div>
                      <div className="text-xs text-gray-500">Sur tout le territoire</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="text-primary flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-secondary font-semibold">Qualité</div>
                      <div className="text-xs text-gray-500">Normes certifiées</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wrench className="text-primary flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="text-sm text-secondary font-semibold">Support</div>
                      <div className="text-xs text-gray-500">Installation incluse</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 lg:px-10 py-8">
              <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
                {(["description", "specifications", "features", "reviews"] as const).map((tab) => {
                  const labels = {
                    description: "Description",
                    specifications: "Spécifications",
                    features: "Caractéristiques",
                    reviews: "Avis",
                  } as const;
                  return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 capitalize transition-colors relative whitespace-nowrap ${
                      activeTab === tab ? "text-primary" : "text-gray-500 hover:text-secondary"
                    }`}
                  >
                    {labels[tab]}
                    {tab === "reviews" && (
                      <span className="ml-1 text-xs text-gray-400">({product.reviewCount})</span>
                    )}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                  );
                })}
              </div>

              <div className="text-gray-700 leading-relaxed">
                {activeTab === "description" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {product.longDescription ?? product.description}
                  </motion.p>
                )}
                {activeTab === "specifications" && product.specifications && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8"
                  >
                    {Object.entries({
                      ...product.specifications,
                      "Dimensions": product.packageDimensions,
                      "Référence": product.sku,
                    }).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-500">{key}</span>
                        <span className="text-secondary font-medium">{value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === "features" && product.features && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="text-primary flex-shrink-0 mt-0.5" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
                {activeTab === "reviews" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-200">
                      <div className="text-center md:text-left">
                        <div className="text-5xl text-secondary font-semibold mb-2">
                          {product.rating}
                        </div>
                        <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={18}
                              className={
                                s <= Math.round(product.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">
                          Sur la base de {product.reviewCount} avis
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        {ratingDistribution.map(({ star, count, percent }) => (
                          <div key={star} className="flex items-center gap-3 text-sm">
                            <span className="w-12 text-gray-600">{star} étoile{star > 1 ? "s" : ""}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 transition-all"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-gray-500">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 pb-6 last:border-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                                {review.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-secondary font-medium">
                                    {review.author}
                                  </span>
                                  {review.verified && (
                                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                      <BadgeCheck size={14} /> Vérifié
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(review.date)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={14}
                                  className={
                                    s <= review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <h4 className="text-secondary font-semibold mb-1">{review.title}</h4>
                          <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl lg:text-3xl text-secondary mb-8">Produits similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/shop/${p.id}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-gray-500 mb-1">{p.brand}</div>
                      <div className="text-sm text-primary mb-2">{p.category}</div>
                      <h3 className="text-lg text-secondary mb-2 line-clamp-1">{p.name}</h3>
                      <div className="text-xl text-primary">{formatPrice(p.price)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
