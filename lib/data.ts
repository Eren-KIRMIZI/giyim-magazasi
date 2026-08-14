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
  description: string;
  price: number;
  category: string;
  categoryLabel: string;
  badge?: "NEW" | "LIMITED" | "SOLD OUT";
  colors?: ColorVariant[];
  sizes: string[];
  soldOutSizes?: string[];
  images: ProductImage[];
  variantStock?: VariantStock[];
}

export interface Collection {
  title: string;
  image: string;
  alt: string;
}

const IMG = {
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAong6Glo7Jdhc9729PTYBtVaOpdNgbrB6kyG3wELrQcaoJjpFHh7E2edOJYN9VnjXKf-0x3sqaexIfggmwWU-78Kwnngaea3r1zISQ9TQN1y-cOP7xKG7i0NTMsEG2Py09UJnDm_owUbq6WvabvGAtFrmtSc6Ci4k3Qw5noXYpkYlkZoCdJ7ymqNJB0vB4BljNmU9cVIIyPb86whDEF-eCZiWeYL9han560nGrDfkEIYe34JFnik_6PA",
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzMh6fRDfkSM3SNPiL7576E0rv7YSo_zMVFQMFZs9t5_Nk63qNYz_KlomIWfL-_2IkmpIqnBcDYxxZpRcu0piF3HuW4xPdzeD8SR15ehP4HjEflckOZSbSDku1Rk5sJ8_vs8wzddf3DezYdfAywmYW1wdRwdWqaomM-Dsf1cx6K0OGj527Nzw6FJuiRxK1VT_Z_th-R5oS4tq5rR8mKIBSTsQGwIh6oRKUT7ASzCWaMQ5DLEMl25lKsA",
  blackHoodie:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB3dP2AQM_V5Z8VRogQhzfJnqbg_ID1F0CtA-Ww1OMOKzrpguIGavduJfIbhJqPbTu3W5oAIXHBkm71oYYdbbU63Q-zppWE-55ZDNtL2Au_6a3xCUWoF6ErqfjxKF3O1b7-RNBzeqpkgkAnLsUbKUKYo7zPYUZfA3AR17yj4URFWX25iEEMvwU-rHiTvbduBM1M0ky1j_IoPOaNuKVtfyP9uE1ZYfyvY96LzexWkNsnhdRs0Z_9MJ96uw",
  redHoodie:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDOUJh1fyy5UJKM6Fqf-hjv96law3DjMRpvXL5Es8Q5sMRXdxdlEaK-rWVMEmeWAywi6SVbamZohAnBuR1PKDZyr7TAmTdrS7k6uzOpO_goLXoiGdrifCjmOnM5AwPa_O1Kz59W-KkXlpyMu4L5eUPXVhv641RzcENwLrDLspNiDLG9zqLY75gvfEEfYA3NjIbChNajDhW0Hm1HLlmP0xJX8V7CkeAa1vM81AHAsHNx7Ehtp_xxGbrBtA",
  whiteHoodie:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAz7TfBzjZHRirMOVmD1f-CYdaRy2mK5kCjW_nQeo38S6DEqVZgQ-N1uoo5CUmPzsVWrm9hBIR4A9r1Cf5L6XDgDaFr1tWvL9FaJ9MeTB9PgAS0QQkNMoikaBP14QgLNSGDzUunliGYY52fGW11GhNn8JRQqAgja98O3pg-KUWQqZ5dFGZiOmcag1Z7cCjUKXmtJSfcQ221ffZwquMd7sN6DXh3yssZgfpe0R2thjmr8FM4SYzALVlmgw",
  signatureMain:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAnZn2hKV3hLa8sRrNt84IVuEm_J4k3MfYkvE49CqLhJHYhhBrbdyOisiuducSVWJHbo0Q07oA72fk08Qduvd8R6vnDl0hZJU3VPgt-nDk-KAFWJxpC6JQw6TJndregxSNVso0Ec_ChS79VebdTu7Y00SggO-32G5vFr4W1CMuuF5a46JnVQCB30uvpBld-rbTuXBVm94CWx7L4yVwlv7O01HWlGuPdsCH2-A48-Z8WaSt1AzgmnLp37g",
  signatureTexture:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCjajoyBu3ad7zOyLM8lGvh8a1PvLohKUV8XmV_NjnTUgq9-krsU2EW81KcKJhtAUSAdL1JLV3HE6EFDziwL9tFPXVw_Gg232OmD4G2x18zHo7tj0SfzlBKof24Q4AKhaQXUFH7Ytw9gUiU--uaz4aQjUBCpVmUU-WvViDxH4kfYxqKs5VRwCRnEQj8CSaDLYSZQ2BQ13_Pztrj2yaIwOcFGtdKzYs1HoNNFMb7R8Jl_SCj2g-jwjW5bQ",
  signatureBack:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA6D6XoYsYiBhS9iVvTyQDvzr6RWgqPJ12Mobp1lDtsMEQX8eswjwpV5ID1iXdPUroWI5pli_lS0CZ8JWITVlcm-WLSXUiXy7hDbUTwFGMDWpMSbsMBp4A83dz8-REmeVUo7BRBtaU24sSoT5hdPsenDLumUIDL_sYu2hfKuMAOjtzOY0U7_sXqDqfACFlgdli4CBPrZ5F0Q3zzwt4ovUfU2pn6O8ZkRuLJASRX4f32eouEFTtC_U_pKQ",
  signatureZipper:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCqGrJVo09iww319Jz0Xg7CGSSwLgm69TyFmEm0MeIDGD40HkiRPioQaYrmlPpG8KWv9G0vpj7rwoU9aGYo5PleHKlgxjZjcAhraf5nDYq95uMshC8giMM3VZ8JQL2CkQtGsxUSbNrJg9DZItZrBIuIu3IkeZhSnN2HvXbPJVVfnfabMQ-T3oNZdBySAnc8X5O_cCX3aSM8MRMKzTzag12TaHesr5u0FZqR5WrWXsDmjDWTmGCXv49txA",
  utilityCargo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDFbG5w_EMdbmpU3cECQWl2EPC265LIYvGuCa6hdFfDRAv4yhW4rOi2kgrtVHANoiqQlqebch-KWWfTwGqLiCFc8_xlFY57CP4Kp2X9C0H833FZGXOgEoJj4emdzIWjYCQLr2IgtCVHlix9KV3rATi7K6DfiYxxYSKM-BnYTwPJF6lJTh40cu11g8avnrSArRgg1VVzccJH7C89B3aY6JSldsHuOqhsPO8V6dXFAExYOdr-j1Kx2nT_XQ",
  blockRunner:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDc8YvXzn5aC86GxLlzHHITBX5LzBOgqSHdrqcXR93c96Y296NUYAPBnD7LLEaK9OMDRpJ415LUEmKVMi8F3uKlfLtXQ3bF_dGEUADWkGjPVpjGvl9uMJYvgv8JGy086u7c6b0FP3XxBavTkNrwP4VNp68zwN4OOx2saYWYPkoKF-xAj2vGTkVwL2T-e9MfyuHwnGn70IUwWR6vQxChnnGC4US94kPHcjHl3FNaaETiRbC3FtTreaztiQ",
  techPouch:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCViaENUEUKm1W_oB43vGLOEnwkjxuIygqbHvF7BtQfzZJQDBwCMvvFrd_dEZVsn4wLpNNVFyzlhlrdL-x4wNMZpM1CrvmX2wcWYOA31Uwv-TUJ1IHRVFcANddkpwkttiOO_toxBJF35hpamo17cc-4JJQorAu3S0-whTIR_VPFoia86InbgdZXQQWo88C0u2m9-DVGSpREqng9rFVUa3Z_ulACuR98c-6ThggMvZoL_TByNiwA87Y_GQ",
  stayHighBlack:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAnqQul72DRXcXXF6nQEqLmirQnDsyJu-Q4DGvDlFCEpInCYtu_apLMbdxqmgsJnJR6Cc6z2X6APnWl0lPU8-p-91r5JltQT2Ke7LWP4KJLmMhxbqIel4oCZ2RpAENvL7NhW8rLcVH-jx2Scpe9x7H-RtgRCwzGuezK20ialZwZt6X4tUx_-D8-3JYqh7f3W9jY3CGp7_g-qaglc7m9gfpciMA1E8TNXbRzHXgnrWfQ9j8sdxrZwGSsSw",
  stayHighRed:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD5BeqhR-1OaVW29qwRTNsJU1D22PrgyJ7w_7L4V1__22btch5bqML2CHurMJdLUCq35rlMlBUI5P9eHeVlSQwK8111fm-cGRzUEdgkqNY1iqr8svBKX0d3_EWIBEyxIl0J6dmKQLUwgT0ch3Vo7iRNbJl5t7RWWTuNIYeQfpDHXXNdfn-zspFm_b5K2zKGwxBi_GxhGRmBhJG3oGeShFMTqzHa40hdLDcq5CcKSZ_86dTMgotpvrXh5w",
  stayHighWhite:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD6AjgT3EhW5_CUpq59xdt9iCWhoyMzK1qF4XPR_QhhnbBwYnXvL4GKldhz9c_yfGjRex2I_eZPHcdH4He1K_N4iAvv8EdL7Aos8apV_z5fDUk_MWdEoDJu53HKU8rdGlvqZlq3dOWnQ4a3KJhTo5nKGu_wzE5P0sInyMhcySQHuD7-zLw6p9ELMWb3ZAIPY6y7ZwDCGqqAUmpJKAaw8-Iqiv60maKql_-fu-VHjyjehWvAXfuxJuSwMA",
  heavyweightTee:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDtmGJLpzVXZqTQw4BEGku7cSKSHEu-3leVq7ScOZzNVIqOZY4YlHuBYD4TltKnh8ON6uuGREQ1pjjWhOYe4_e56kmt-o9BEybDpHKUYlSiSe_WrbHY_zpehOwktqcuBlN51fSNcX4yM57_u_ZEGVduFtm_wu1avb1mIYEqAYbd9fMtsw5ndSPn4fg8PBQEvas48d5U5iK6RUqiqsRuIXVXSHVv8njZYhRYfQRZ1mO-j7NWXKFhSb7OWg",
  industrial:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBAMIp_yrl2i-ZHVyakQtSbRFeoOiDQ0j9t_rBf3WNsNKJRLkgvlvj1FJIlZ7ngVxB6u2OGBwaRf0ibRmh69U9aqqqaqnCa6IDLJumLKB7iOpQ1cMQvirZdpyNd5b2-H9Ckdf5VnJu36jq6Sgk1ocE5opopnS9e_HtUJ0jMEIgNHqp20S43JBcg8nDDIoxFO6X2iwK850ijwY21x2DT3FGU_LH-tgVxq2gdblsbd-BLaPZ8E-3UEdm18g",
  heavyweightDenim:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuASnUWsYNAroqTBuH6A_t1IQGwwV9H4r14hGP2L49UBGcte9_rXbmGG564jczunWWH7_vMW5LLh6mLV3pQXDyCMTEKVcbOsXU2SfcYhVfBV_LEI6d4C1Imonk-UpKfz_--XKS7D_xYmeekHrUuaaZ0obCejOrKTyUgiJEjaCSU1gYGlTLenYFiusIi26HMLExJObqQ_Ws0K96NiWOis9T-uiaQLtDRyqBsYHn84fsqP_gRokLd-kzMyrg",
} as const;

export const products: Product[] = [
  {
    id: "signature-hoodie-01",
    slug: "signature-hoodie-01",
    name: "Signature Hoodie.01",
    subtitle: "LAST DANCE // HEAVYWEIGHT",
    description:
      "The definitive silhouette. Engineered from 600GSM organic cotton. Oversized architectural fit with dropped shoulders and an exaggerated hood. Built for the modern urban environment.",
    price: 149,
    category: "hoodies",
    categoryLabel: "Hoodies",
    badge: "LIMITED",
    colors: [{ name: "Black", hex: "#1b1c1c" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    soldOutSizes: ["XXL"],
    images: [
      { src: IMG.signatureMain, alt: "Signature Hoodie editorial studio shot" },
      { src: IMG.signatureTexture, alt: "Heavy black cotton fabric macro detail" },
      { src: IMG.signatureBack, alt: "Back graphic of the Signature Hoodie" },
      { src: IMG.signatureZipper, alt: "Chunky metal zipper and drawstrings detail" },
    ],
  },
  {
    id: "core-black-hoodie",
    slug: "core-black-hoodie",
    name: "Core Black Hoodie",
    subtitle: "LAST DANCE // CORE",
    description:
      "A premium, heavy-weight black hoodie featuring a bold, minimalist white geometric graphic on the chest. The foundation piece of the archive.",
    price: 89,
    category: "hoodies",
    categoryLabel: "Hoodies",
    badge: "NEW",
    colors: [
      { name: "Black", hex: "#1b1c1c" },
      { name: "White", hex: "#faf9f9" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [{ src: IMG.blackHoodie, alt: "Core Black Hoodie flat product shot" }],
  },
  {
    id: "core-red-hoodie",
    slug: "core-red-hoodie",
    name: "Core Red Hoodie",
    subtitle: "LAST DANCE // CORE",
    description:
      "A premium, heavy-weight crimson red hoodie featuring a bold, minimalist white geometric graphic on the chest. Made to be seen from across the street.",
    price: 89,
    category: "hoodies",
    categoryLabel: "Hoodies",
    badge: "NEW",
    colors: [
      { name: "Red", hex: "#dc2626" },
      { name: "Black", hex: "#1b1c1c" },
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [{ src: IMG.redHoodie, alt: "Core Red Hoodie flat product shot" }],
  },
  {
    id: "arch-logo-white",
    slug: "arch-logo-white",
    name: "Arch Logo White",
    subtitle: "LAST DANCE // ARCHIVE",
    description:
      "A premium, heavy-weight crisp white hoodie featuring a bold, grey arched text graphic on the chest. A limited archival piece.",
    price: 95,
    category: "hoodies",
    categoryLabel: "Hoodies",
    badge: "LIMITED",
    colors: [{ name: "White", hex: "#faf9f9" }],
    sizes: ["S", "M", "L", "XL"],
    images: [{ src: IMG.whiteHoodie, alt: "Arch Logo White flat product shot" }],
  },
  {
    id: "stay-high-logo-hoodie-black",
    slug: "stay-high-logo-hoodie-black",
    name: "Stay High Logo Hoodie Black",
    subtitle: "LAST DANCE // STAY HIGH",
    description:
      "A heavy black streetwear hoodie with a bold white geometric triangle logo printed on the chest. High contrast, raw and urgent.",
    price: 29.41,
    category: "hoodies",
    categoryLabel: "Hoodies",
    badge: "LIMITED",
    colors: [{ name: "Black", hex: "#1b1c1c" }],
    sizes: ["S", "M", "L", "XL"],
    images: [{ src: IMG.stayHighBlack, alt: "Stay High Logo Hoodie Black flat product shot" }],
  },
  {
    id: "stay-high-logo-hoodie-red",
    slug: "stay-high-logo-hoodie-red",
    name: "Stay High Logo Hoodie Red",
    subtitle: "LAST DANCE // STAY HIGH",
    description:
      "A vibrant red streetwear hoodie with a bold white geometric triangle logo printed on the chest. High contrast, raw and urgent.",
    price: 29.41,
    category: "hoodies",
    categoryLabel: "Hoodies",
    colors: [{ name: "Red", hex: "#dc2626" }],
    sizes: ["S", "M", "L", "XL"],
    images: [{ src: IMG.stayHighRed, alt: "Stay High Logo Hoodie Red flat product shot" }],
  },
  {
    id: "stay-high-shbzt-hoodie",
    slug: "stay-high-shbzt-hoodie",
    name: "Stay High Shbzt Hoodie",
    subtitle: "LAST DANCE // STAY HIGH",
    description:
      "A stark white streetwear hoodie with a curved arch text logo across the chest. Shot against rugged, brutalist terrain. High fashion streetwear.",
    price: 50.34,
    category: "hoodies",
    categoryLabel: "Hoodies",
    colors: [{ name: "White", hex: "#faf9f9" }],
    sizes: ["S", "M", "L", "XL"],
    images: [{ src: IMG.stayHighWhite, alt: "Stay High Shbzt Hoodie lifestyle editorial shot" }],
  },
  {
    id: "heavyweight-tee-black",
    slug: "heavyweight-tee-black",
    name: "Heavyweight Tee Black",
    subtitle: "LAST DANCE // CORE",
    description:
      "A heavy cotton oversized t-shirt in deep black with a subtle, tonal embroidered logo on the hem. Brutalist streetwear essential.",
    price: 35,
    category: "tees",
    categoryLabel: "Tees",
    badge: "SOLD OUT",
    colors: [{ name: "Black", hex: "#1b1c1c" }],
    sizes: ["S", "M", "L", "XL"],
    images: [{ src: IMG.heavyweightTee, alt: "Heavyweight Tee Black flat lay on concrete" }],
  },
  {
    id: "utility-cargo",
    slug: "utility-cargo",
    name: "Utility Cargo",
    subtitle: "LAST DANCE // BOTTOMS",
    description:
      "Wide fit black cargo pants with structured fabric and utilitarian pockets. Brutalist streetwear aesthetic built for the urban environment.",
    price: 120,
    category: "bottoms",
    categoryLabel: "Bottoms",
    colors: [{ name: "Black", hex: "#1b1c1c" }],
    sizes: ["S", "M", "L", "XL"],
    images: [{ src: IMG.utilityCargo, alt: "Utility Cargo wide fit black cargo pants" }],
  },
  {
    id: "block-runner",
    slug: "block-runner",
    name: "Block Runner",
    subtitle: "LAST DANCE // FOOTWEAR",
    description:
      "Chunky black minimalist sneakers with a geometric, architectural sole design. High-end streetwear footwear.",
    price: 250,
    category: "footwear",
    categoryLabel: "Footwear",
    colors: [{ name: "Black", hex: "#1b1c1c" }],
    sizes: ["39", "40", "41", "42", "43", "44"],
    images: [{ src: IMG.blockRunner, alt: "Block Runner chunky black sneakers" }],
  },
  {
    id: "tech-pouch",
    slug: "tech-pouch",
    name: "Tech Pouch",
    subtitle: "LAST DANCE // ACCESSORIES",
    description:
      "A sleek, minimalist black crossbody bag with heavy metal hardware. Technical streetwear accessory with sharp, dramatic presence.",
    price: 65,
    category: "accessories",
    categoryLabel: "Accessories",
    colors: [{ name: "Black", hex: "#1b1c1c" }],
    sizes: ["ONE SIZE"],
    images: [{ src: IMG.techPouch, alt: "Tech Pouch black crossbody bag" }],
  },
];

export const heroImage = IMG.hero;
export const brandLogo = IMG.logo;

export const collections: Collection[] = [
  {
    title: "The Industrial Complex",
    image: IMG.industrial,
    alt: "Abandoned industrial warehouse interior with a figure in a voluminous black jacket",
  },
  {
    title: "Heavyweight",
    image: IMG.heavyweightDenim,
    alt: "Macro shot of heavy black denim fabric with chunky zipper hardware",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 3);
}

export function getRecommendedProducts(excludeSlug: string): Product[] {
  return products.filter((p) => p.slug !== excludeSlug).slice(0, 3);
}

export function formatPrice(price: number): string {
  return `€${price.toFixed(2).replace(".", ",")}`;
}
