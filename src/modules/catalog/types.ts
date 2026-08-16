export interface ProductImage {
  src: string;
  alt: string;
}

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface VariantStock {
  size: string;
  color: string | null;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  category: string;
  categoryLabel: string;
  badge?: "NEW" | "LIMITED" | "SOLD OUT";
  objectNumber?: string | null;
  campaign?: string | null;
  material?: string | null;
  weight?: string | null;
  fit?: string | null;
  releaseDate?: string | null;
  colors?: ColorVariant[];
  sizes: string[];
  soldOutSizes?: string[];
  images: ProductImage[];
  variantStock?: VariantStock[];
}
