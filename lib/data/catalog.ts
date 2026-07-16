import type { Brand, Category, Product, ProductFilters } from "@/lib/types/catalog";
import { normalizeSearch, slugify } from "@/lib/utils";

const catalogImage =
  "https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=1200&q=80";

const categoryImageMap: Record<string, string> = {
  "Disposable Products":
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
  "Hospital Furniture":
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
  "Surgical Instruments":
    "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=900&q=80",
  Diagnostics:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
  "Orthopedic Products":
    "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=900&q=80",
  "Medical Equipment":
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=80",
  "Laboratory Equipment":
    "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=900&q=80",
  "Infection Control":
    "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=900&q=80",
  "Emergency Care":
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=900&q=80",
  "Dental Products":
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80",
  "Rehabilitation Products":
    "https://images.unsplash.com/photo-1576765974052-8baea34a0e6b?auto=format&fit=crop&w=900&q=80"
};

const hierarchy = {
  "Disposable Products": [
    "Surgical Gloves",
    "Latex Gloves",
    "Nitrile Gloves",
    "Masks",
    "Syringes",
    "IV Sets",
    "Catheters",
    "Cannulas",
    "Surgical Drapes"
  ],
  "Hospital Furniture": [
    "Hospital Beds",
    "ICU Beds",
    "Fowler Beds",
    "Wheelchairs",
    "Stretchers",
    "Examination Tables",
    "Bedside Lockers"
  ],
  "Surgical Instruments": [
    "Forceps",
    "Scissors",
    "Retractors",
    "Needle Holders",
    "Clamps",
    "Surgical Sets"
  ],
  Diagnostics: [
    "Stethoscopes",
    "BP Monitors",
    "Thermometers",
    "Pulse Oximeters",
    "Glucometers"
  ],
  "Orthopedic Products": [
    "Knee Braces",
    "Cervical Collars",
    "Lumbar Supports",
    "Walkers",
    "Crutches"
  ],
  "Medical Equipment": [
    "ECG Machines",
    "Defibrillators",
    "Nebulizers",
    "Suction Machines",
    "Oxygen Concentrators"
  ],
  "Laboratory Equipment": ["Microscopes", "Centrifuges", "Test Tubes", "Lab Consumables"],
  "Infection Control": ["PPE Kits", "Sanitizers", "Sterilizers", "Disinfectants"],
  "Emergency Care": ["First Aid Kits", "Emergency Stretchers", "Ambu Bags"],
  "Dental Products": ["Dental Instruments", "Dental Chairs", "Dental Consumables"],
  "Rehabilitation Products": ["Walking Sticks", "Mobility Aids", "Support Devices"]
};

export const categories: Category[] = Object.entries(hierarchy).flatMap(
  ([parentName, children], parentIndex) => {
    const parentId = `cat-${slugify(parentName)}`;
    const parent: Category = {
      id: parentId,
      name: parentName,
      slug: slugify(parentName),
      description: `Procurement-ready ${parentName.toLowerCase()} for hospitals, clinics, and care facilities.`,
      imageUrl: categoryImageMap[parentName] || catalogImage,
      parentId: null,
      sortOrder: parentIndex + 1
    };

    return [
      parent,
      ...children.map((childName, childIndex) => ({
        id: `cat-${slugify(childName)}`,
        name: childName,
        slug: slugify(childName),
        description: `${childName} sourced for dependable clinical use and B2B supply.`,
        imageUrl: categoryImageMap[parentName] || catalogImage,
        parentId,
        sortOrder: childIndex + 1
      }))
    ];
  }
);

export const brands: Brand[] = [
  { id: "brand-honey", name: "Honey Surgicals", slug: "honey-surgicals" },
  { id: "brand-3m", name: "3M", slug: "3m" },
  { id: "brand-romsons", name: "Romsons", slug: "romsons" },
  { id: "brand-bpl", name: "BPL Medical", slug: "bpl-medical" },
  { id: "brand-dr-morepen", name: "Dr. Morepen", slug: "dr-morepen" },
  { id: "brand-philips", name: "Philips", slug: "philips" },
  { id: "brand-hindustan", name: "Hindustan Syringes", slug: "hindustan-syringes" }
];

function findCategory(slug: string) {
  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    throw new Error(`Missing seeded category: ${slug}`);
  }
  return category;
}

function findBrand(slug: string) {
  const brand = brands.find((item) => item.slug === slug);
  if (!brand) {
    throw new Error(`Missing seeded brand: ${slug}`);
  }
  return brand;
}

const now = new Date().toISOString();

const productSeeds = [
  {
    name: "Sterile Nitrile Examination Gloves",
    sku: "HS-DP-NG-001",
    category: "nitrile-gloves",
    brand: "honey-surgicals",
    price: 420,
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Powder-free sterile nitrile gloves for examination and minor procedures.",
    features: ["Latex-free", "Textured fingertips", "Ambidextrous fit", "Box of 100"],
    specifications: [
      ["Material", "Nitrile"],
      ["Sterility", "Sterile"],
      ["Sizes", "S, M, L, XL"],
      ["Packaging", "100 pieces per box"]
    ],
    keywords: ["gloves", "nitrile", "disposable", "examination"],
    viewCount: 1540
  },
  {
    name: "3 Ply Surgical Face Mask",
    sku: "HS-DP-MK-003",
    category: "masks",
    brand: "3m",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Comfortable 3 ply mask with melt-blown filtration layer and nose clip.",
    features: ["BFE high filtration", "Soft ear loops", "Adjustable nose strip", "Bulk cartons available"],
    specifications: [
      ["Layers", "3 ply"],
      ["Use", "Single use"],
      ["Color", "Medical blue"],
      ["Pack Size", "50 masks"]
    ],
    keywords: ["mask", "surgical", "infection control"],
    viewCount: 1288
  },
  {
    name: "Romsons IV Infusion Set",
    sku: "HS-DP-IV-021",
    category: "iv-sets",
    brand: "romsons",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Sterile IV infusion set with precision flow control for hospital use.",
    features: ["Sterile and disposable", "Sharp piercing spike", "Flexible drip chamber", "Latex-free tube"],
    specifications: [
      ["Tube Length", "150 cm"],
      ["Chamber", "Transparent"],
      ["Sterilization", "EO"],
      ["Use", "Single use"]
    ],
    keywords: ["iv set", "infusion", "disposable"],
    viewCount: 986
  },
  {
    name: "Five Function ICU Bed",
    sku: "HS-HF-ICU-510",
    category: "icu-beds",
    brand: "honey-surgicals",
    price: 68500,
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Motorized ICU bed with adjustable backrest, knee rest, height, and tilt.",
    features: ["ABS head and foot panels", "Central locking castors", "IV pole provision", "Side safety rails"],
    specifications: [
      ["Functions", "5 motorized"],
      ["Frame", "Mild steel epoxy coated"],
      ["Safe Load", "180 kg"],
      ["Warranty", "12 months"]
    ],
    keywords: ["icu bed", "hospital furniture", "motorized bed"],
    viewCount: 2116
  },
  {
    name: "Stainless Steel Surgical Instrument Set",
    sku: "HS-SI-SET-120",
    category: "surgical-sets",
    brand: "honey-surgicals",
    price: 12800,
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "General surgery instrument set with forceps, scissors, clamps, and holders.",
    features: ["German stainless steel", "Autoclavable", "Packed in tray", "Hospital-grade finish"],
    specifications: [
      ["Pieces", "42"],
      ["Material", "SS 410/420"],
      ["Finish", "Satin"],
      ["Use", "General surgery"]
    ],
    keywords: ["surgical set", "forceps", "scissors", "clamps"],
    viewCount: 1604
  },
  {
    name: "BPL Digital Blood Pressure Monitor",
    sku: "HS-DI-BP-008",
    category: "bp-monitors",
    brand: "bpl-medical",
    price: 2490,
    image:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Automatic BP monitor with clear display and memory for clinic screening.",
    features: ["One-touch operation", "Irregular heartbeat alert", "Large LCD", "Cuff included"],
    specifications: [
      ["Measurement", "Oscillometric"],
      ["Cuff", "Adult"],
      ["Power", "Battery / adapter"],
      ["Memory", "120 readings"]
    ],
    keywords: ["bp monitor", "diagnostic", "blood pressure"],
    viewCount: 1322
  },
  {
    name: "Portable Pulse Oximeter",
    sku: "HS-DI-PO-014",
    category: "pulse-oximeters",
    brand: "dr-morepen",
    price: 1190,
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Fingertip pulse oximeter for SpO2 and pulse rate monitoring.",
    features: ["OLED display", "Auto power-off", "Lightweight", "Suitable for clinics and homecare"],
    specifications: [
      ["Display", "OLED"],
      ["Parameters", "SpO2, PR"],
      ["Battery", "AAA"],
      ["Warranty", "6 months"]
    ],
    keywords: ["pulse oximeter", "spo2", "diagnostics"],
    viewCount: 1844
  },
  {
    name: "Adjustable Knee Brace",
    sku: "HS-OP-KB-018",
    category: "knee-braces",
    brand: "honey-surgicals",
    price: 780,
    image:
      "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Breathable knee support with adjustable compression for orthopedic recovery.",
    features: ["Open patella design", "Hook and loop straps", "Soft neoprene", "Multiple sizes"],
    specifications: [
      ["Material", "Neoprene blend"],
      ["Support Level", "Moderate"],
      ["Sizes", "S to XXL"],
      ["Use", "Rehab and support"]
    ],
    keywords: ["knee brace", "orthopedic", "support"],
    viewCount: 742
  },
  {
    name: "Philips Oxygen Concentrator 5 LPM",
    sku: "HS-ME-OC-505",
    category: "oxygen-concentrators",
    brand: "philips",
    price: 46800,
    image:
      "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Reliable 5 LPM oxygen concentrator for clinics, wards, and homecare supply.",
    features: ["Low noise operation", "Flow meter", "Alarm indicators", "Service support available"],
    specifications: [
      ["Flow", "0.5-5 LPM"],
      ["Purity", "Up to 93 percent"],
      ["Power", "230V AC"],
      ["Warranty", "12 months"]
    ],
    keywords: ["oxygen concentrator", "medical equipment", "respiratory"],
    viewCount: 1910
  },
  {
    name: "Portable Suction Machine",
    sku: "HS-ME-SM-033",
    category: "suction-machines",
    brand: "honey-surgicals",
    price: 9800,
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Compact electric suction machine for emergency, ward, and procedure room use.",
    features: ["Oil-free pump", "Easy-clean jar", "Vacuum gauge", "Portable body"],
    specifications: [
      ["Capacity", "1 liter jar"],
      ["Vacuum", "650 mmHg"],
      ["Noise", "Low noise"],
      ["Application", "Clinical suction"]
    ],
    keywords: ["suction machine", "medical equipment"],
    viewCount: 1014
  },
  {
    name: "Laboratory Binocular Microscope",
    sku: "HS-LE-MIC-044",
    category: "microscopes",
    brand: "honey-surgicals",
    price: 16400,
    image:
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Binocular microscope with LED illumination for laboratory diagnostics.",
    features: ["Coaxial focusing", "LED light", "Achromatic objectives", "Mechanical stage"],
    specifications: [
      ["Magnification", "40x-1000x"],
      ["Head", "Binocular"],
      ["Illumination", "LED"],
      ["Stage", "Mechanical"]
    ],
    keywords: ["microscope", "laboratory", "diagnostics"],
    viewCount: 612
  },
  {
    name: "PPE Kit with Face Shield",
    sku: "HS-IC-PPE-090",
    category: "ppe-kits",
    brand: "honey-surgicals",
    price: 540,
    image:
      "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Disposable PPE kit for infection control and clinical safety protocols.",
    features: ["Coverall", "Face shield", "Shoe cover", "Sterile pack option"],
    specifications: [
      ["Material", "Non-woven laminated"],
      ["GSM", "90"],
      ["Sizes", "M, L, XL"],
      ["Pack", "Individual"]
    ],
    keywords: ["ppe", "infection control", "disposable"],
    viewCount: 1198
  }
] as const;

export const products: Product[] = productSeeds.map((seed) => {
  const id = `prod-${slugify(seed.name)}`;
  const slug = slugify(seed.name);
  return {
    id,
    name: seed.name,
    slug,
    sku: seed.sku,
    brand: findBrand(seed.brand),
    category: findCategory(seed.category),
    price: seed.price,
    extraChargesApply: false,
    shortDescription: seed.shortDescription,
    description: `${seed.shortDescription} HONEY SURGICALS supplies this product for institutional procurement with reliable sourcing, documentation support, and sales assistance for bulk requirements.`,
    specifications: seed.specifications.map(([label, value]) => ({ label, value })),
    features: [...seed.features],
    keywords: [...seed.keywords],
    status: "active",
    images: [
      {
        id: `${id}-image-1`,
        productId: id,
        url: seed.image,
        alt: seed.name,
        sortOrder: 1
      },
      {
        id: `${id}-image-2`,
        productId: id,
        url: catalogImage,
        alt: `${seed.name} alternate view`,
        sortOrder: 2
      }
    ],
    viewCount: seed.viewCount,
    createdAt: now,
    updatedAt: now
  };
});

export function getCategoryTree(source: Category[] = categories) {
  return source
    .filter((category) => !category.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((parent) => ({
      ...parent,
      children: source
        .filter((category) => category.parentId === parent.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    }));
}

export function getFeaturedCategories() {
  return getCategoryTree().slice(0, 8);
}

export function getFeaturedProducts() {
  return [...products].sort((a, b) => b.viewCount - a.viewCount).slice(0, 8);
}

export function searchProducts(filters: ProductFilters = {}) {
  const normalizedQuery = normalizeSearch(filters.query || "");
  let result = products.filter((product) => product.status === "active");

  if (normalizedQuery) {
    result = result.filter((product) => {
      const haystack = normalizeSearch(
        [
          product.name,
          product.sku,
          product.brand.name,
          product.category.name,
          product.shortDescription,
          product.description,
          ...product.keywords,
          ...product.features,
          ...product.specifications.map((spec) => `${spec.label} ${spec.value}`)
        ].join(" ")
      );
      return normalizedQuery.split(" ").every((part) => haystack.includes(part));
    });
  }

  if (filters.category) {
    const category = categories.find((item) => item.slug === filters.category);
    const childSlugs = categories
      .filter((item) => item.parentId === category?.id)
      .map((item) => item.slug);
    result = result.filter(
      (product) =>
        product.category.slug === filters.category || childSlugs.includes(product.category.slug)
    );
  }

  if (filters.brand) {
    result = result.filter((product) => product.brand.slug === filters.brand);
  }

  if (filters.minPrice != null) {
    result = result.filter((product) => (product.price || 0) >= Number(filters.minPrice));
  }

  if (filters.maxPrice != null) {
    result = result.filter((product) => (product.price || 0) <= Number(filters.maxPrice));
  }

  switch (filters.sort) {
    case "price_asc":
      result = result.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "price_desc":
      result = result.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case "newest":
      result = result.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      break;
    case "popular":
      result = result.sort((a, b) => b.viewCount - a.viewCount);
      break;
    default:
      result = result.sort((a, b) => b.viewCount - a.viewCount);
  }

  return result;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) || null;
}

export function getProductsBySlugs(slugs: string[]) {
  return products.filter((product) => slugs.includes(product.slug));
}

export function getRelatedProducts(product: Product) {
  return products
    .filter((item) => item.id !== product.id && item.category.slug === product.category.slug)
    .slice(0, 4);
}
