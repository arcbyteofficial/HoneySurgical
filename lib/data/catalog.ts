import type { Brand, Category, Product, ProductFilters, ProductTemplate } from "@/lib/types/catalog";
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
    "https://images.unsplash.com/photo-1576765974052-8baea34a0e6b?auto=format&fit=crop&w=900&q=80",
  "Anesthesia & Respiratory":
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=80",
  "Urology & Nephrology":
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80"
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
    "Surgical Drapes",
    "Surgical Sutures",
    "Gauze & Bandages",
    "Suction Catheters",
    "Urine Bags",
    "Sterilization Pouches"
  ],
  "Hospital Furniture": [
    "Hospital Beds",
    "ICU Beds",
    "Fowler Beds",
    "Wheelchairs",
    "Stretchers",
    "Examination Tables",
    "Bedside Lockers",
    "Overbed Tables",
    "IV Stands",
    "OT Lights",
    "Crash Carts"
  ],
  "Surgical Instruments": [
    "Forceps",
    "Scissors",
    "Retractors",
    "Needle Holders",
    "Clamps",
    "Surgical Sets",
    "Electrosurgical Units",
    "Laparoscopic Instruments",
    "Orthopedic Instruments",
    "Neurosurgery Instruments",
    "Cardiovascular Instruments",
    "Ophthalmic Instruments",
    "ENT Instruments",
    "Gynecological Instruments"
  ],
  Diagnostics: [
    "Stethoscopes",
    "BP Monitors",
    "Thermometers",
    "Pulse Oximeters",
    "Glucometers",
    "ECG Machines",
    "Patient Monitors",
    "Otoscopes",
    "Ultrasound Accessories"
  ],
  "Orthopedic Products": [
    "Knee Braces",
    "Cervical Collars",
    "Lumbar Supports",
    "Walkers",
    "Crutches",
    "Splints & Casts",
    "Orthopedic Implants"
  ],
  "Medical Equipment": [
    "ECG Machines",
    "Defibrillators",
    "Nebulizers",
    "Suction Machines",
    "Oxygen Concentrators",
    "Infusion Pumps",
    "Syringe Pumps",
    "Ventilators"
  ],
  "Laboratory Equipment": [
    "Microscopes",
    "Centrifuges",
    "Test Tubes",
    "Lab Consumables",
    "Micropipettes",
    "Autoclaves",
    "Blood Analyzers"
  ],
  "Infection Control": [
    "PPE Kits",
    "Sanitizers",
    "Sterilizers",
    "Disinfectants",
    "Biohazard Bags",
    "UV Sterilizers"
  ],
  "Emergency Care": [
    "First Aid Kits",
    "Emergency Stretchers",
    "Ambu Bags",
    "Resuscitation Kits",
    "Trauma Bags"
  ],
  "Dental Products": [
    "Dental Instruments",
    "Dental Chairs",
    "Dental Consumables",
    "Dental Handpieces",
    "Dental Scalers"
  ],
  "Rehabilitation Products": [
    "Walking Sticks",
    "Mobility Aids",
    "Support Devices",
    "Commode Chairs",
    "Traction Equipment"
  ],
  "Anesthesia & Respiratory": [
    "Endotracheal Tubes",
    "Laryngeal Masks",
    "Breathing Circuits",
    "Oxygen Masks",
    "Anesthesia Workstations"
  ],
  "Urology & Nephrology": [
    "Foley Catheters",
    "Dialysis Supplies",
    "Ureteral Stents",
    "Urine Drainage Systems"
  ]
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
  { id: "brand-3m", name: "3M Healthcare", slug: "3m" },
  { id: "brand-ethicon", name: "Ethicon (Johnson & Johnson)", slug: "ethicon" },
  { id: "brand-medtronic", name: "Medtronic", slug: "medtronic" },
  { id: "brand-bd", name: "Becton Dickinson (BD)", slug: "becton-dickinson" },
  { id: "brand-romsons", name: "Romsons", slug: "romsons" },
  { id: "brand-b-braun", name: "B. Braun", slug: "b-braun" },
  { id: "brand-bpl", name: "BPL Medical", slug: "bpl-medical" },
  { id: "brand-philips", name: "Philips Healthcare", slug: "philips" },
  { id: "brand-hindustan", name: "Hindustan Syringes (HMD)", slug: "hindustan-syringes" },
  { id: "brand-dr-morepen", name: "Dr. Morepen", slug: "dr-morepen" },
  { id: "brand-stryker", name: "Stryker", slug: "stryker" },
  { id: "brand-olympus", name: "Olympus Medical", slug: "olympus-medical" },
  { id: "brand-karl-storz", name: "Karl Storz", slug: "karl-storz" },
  { id: "brand-teleflex", name: "Teleflex", slug: "teleflex" },
  { id: "brand-terumo", name: "Terumo", slug: "terumo" },
  { id: "brand-smith-nephew", name: "Smith & Nephew", slug: "smith-nephew" },
  { id: "brand-zimmer-biomet", name: "Zimmer Biomet", slug: "zimmer-biomet" },
  { id: "brand-siemens", name: "Siemens Healthineers", slug: "siemens-healthineers" },
  { id: "brand-ge-healthcare", name: "GE HealthCare", slug: "ge-healthcare" },
  { id: "brand-mindray", name: "Mindray Medical", slug: "mindray-medical" },
  { id: "brand-omron", name: "Omron Healthcare", slug: "omron-healthcare" },
  { id: "brand-tynor", name: "Tynor Orthotics", slug: "tynor-orthotics" },
  { id: "brand-polymed", name: "Poly Medicure (Polymed)", slug: "polymed" },
  { id: "brand-surgiwear", name: "Surgiwear", slug: "surgiwear" },
  { id: "brand-vissco", name: "Vissco Rehabilitation", slug: "vissco" },
  { id: "brand-paramount", name: "Paramount Bed", slug: "paramount-bed" },
  { id: "brand-microtek", name: "Microtek Healthcare", slug: "microtek-healthcare" },
  { id: "brand-heine", name: "Heine Optotechnik", slug: "heine-optotechnik" },
  { id: "brand-welch-allyn", name: "Welch Allyn", slug: "welch-allyn" },
  { id: "brand-allied", name: "Allied Medical", slug: "allied-medical" },
  { id: "brand-nipro", name: "Nipro Corporation", slug: "nipro-corporation" },
  { id: "brand-coloplast", name: "Coloplast", slug: "coloplast" },
  { id: "brand-convatec", name: "Convatec", slug: "convatec" },
  { id: "brand-fresenius", name: "Fresenius Medical Care", slug: "fresenius" },
  { id: "brand-baxter", name: "Baxter International", slug: "baxter" },
  { id: "brand-edwards", name: "Edwards Lifesciences", slug: "edwards-lifesciences" },
  { id: "brand-cook", name: "Cook Medical", slug: "cook-medical" },
  { id: "brand-meril", name: "Meril Life Sciences", slug: "meril-life-sciences" },
  { id: "brand-skanray", name: "Skanray Technologies", slug: "skanray-technologies" }
];

export const templates: ProductTemplate[] = [
  {
    id: "tmpl-sterile-nitrile-gloves",
    name: "Sterile Nitrile Examination Gloves",
    slug: "sterile-nitrile-examination-gloves",
    shortDescription: "Powder-free sterile nitrile gloves engineered for clinical examination and surgical preparation.",
    description: "Medical-grade nitrile gloves offering exceptional tactile sensitivity, barrier protection, and tear resistance. Fully latex-free to prevent type I allergic reactions.",
    specifications: [
      { label: "Material", value: "Nitrile Synthetic Rubber" },
      { label: "Sterility", value: "Sterile / EO Sterilized" },
      { label: "Surface Finish", value: "Textured Fingertips" },
      { label: "Powder Content", value: "Powder-Free (< 2mg/glove)" },
      { label: "Available Sizes", value: "S, M, L, XL" },
      { label: "Quality Compliance", value: "ISO 13485, CE, ASTM D6319" }
    ],
    features: [
      "100% Latex-free to eliminate allergic risks",
      "Micro-textured fingertips for secure grip in wet/dry conditions",
      "Beaded cuff for easy donning and anti-roll-down protection",
      "High tensile strength and puncture resistance"
    ],
    keywords: ["nitrile gloves", "examination gloves", "disposable gloves", "sterile gloves", "infection control"]
  },
  {
    id: "tmpl-surgical-latex-gloves",
    name: "Powder-Free Surgical Gloves",
    slug: "powder-free-surgical-gloves",
    shortDescription: "Anatomically shaped powder-free sterile latex surgical gloves for operating room precision.",
    description: "Premium surgical latex gloves designed with curved fingers and ergonomic fit to reduce hand fatigue during long surgical operations.",
    specifications: [
      { label: "Material", value: "Natural Rubber Latex" },
      { label: "Type", value: "Anatomical (Left & Right)" },
      { label: "Sterility", value: "Sterile Gamma Irradiated" },
      { label: "Length", value: "280 mm minimum" },
      { label: "Thickness", value: "0.18 - 0.22 mm" },
      { label: "Sizes", value: "6.0, 6.5, 7.0, 7.5, 8.0, 8.5" }
    ],
    features: [
      "Anatomical shape reduces hand fatigue during lengthy operations",
      "Superior tactile sensitivity and elasticity",
      "Polymer coated interior for effortless damp donning",
      "Double pouch sterile packaging"
    ],
    keywords: ["surgical gloves", "latex gloves", "powder-free", "operating room", "sterile gloves"]
  },
  {
    id: "tmpl-3ply-surgical-mask",
    name: "3-Ply Surgical Face Mask",
    slug: "3-ply-surgical-face-mask",
    shortDescription: "High-filtration 3-ply fluid-resistant surgical face mask with comfortable ear loops.",
    description: "Three-layer medical face mask featuring a high-density melt-blown polypropylene filter layer offering BFE >= 99% against bacteria and particulate matter.",
    specifications: [
      { label: "Layers", value: "3 Ply (Spunbond + Meltblown + Spunbond)" },
      { label: "BFE Rating", value: "≥ 99% Bacterial Filtration Efficiency" },
      { label: "Fluid Resistance", value: "120 mmHg Synthetic Blood Resistance" },
      { label: "Ear Loop", value: "Soft Elastic Polyurethane" },
      { label: "Nose Wire", value: "Flexible Plastic Coated Metal" }
    ],
    features: [
      "Melt-blown filter media for superior fluid and aerosol defense",
      "Breathable and hypoallergenic non-woven material",
      "Ultrasonically sealed ear loops for durability",
      "Adjustable concealed nose piece for snug fit"
    ],
    keywords: ["face mask", "3 ply mask", "surgical mask", "fluid resistant", "infection control"]
  },
  {
    id: "tmpl-n95-respirator",
    name: "N95 Medical Respirator Mask",
    slug: "n95-medical-respirator-mask",
    shortDescription: "NIOSH & CE certified particulate N95 medical respirator mask with head straps.",
    description: "High-efficiency N95 surgical respirator designed for clinical personnel exposed to airborne pathogen particles and respiratory splashes.",
    specifications: [
      { label: "Filter Efficiency", value: "≥ 95% against non-oil aerosols (0.3 micron)" },
      { label: "Design", value: "Cup Shape / Foldable 3D Design" },
      { label: "Fastening", value: "Dual Head Straps" },
      { label: "Certification", value: "NIOSH N95 / CE EN 149" }
    ],
    features: [
      "Multi-layered electrostatic filter media",
      "Cushioned nose foam pad prevents fogging and pressure spots",
      "Secure head strap seal reduces seal leakage",
      "Fluid resistant outer layer"
    ],
    keywords: ["n95 mask", "respirator", "airborne protection", "medical mask", "ppe"]
  },
  {
    id: "tmpl-hypodermic-syringe",
    name: "Single-Use Hypodermic Syringe with Needle",
    slug: "single-use-hypodermic-syringe-with-needle",
    shortDescription: "Sterile 3-part disposable syringe with ultra-sharp luer lock hypodermic needle.",
    description: "Precision medical syringe featuring clear transparent barrel, bold dark graduations, and smooth synthetic rubber plunger stopper.",
    specifications: [
      { label: "Capacity", value: "2ml, 5ml, 10ml, 20ml, 50ml" },
      { label: "Tip Type", value: "Luer Lock / Luer Slip" },
      { label: "Needle Gauge", value: "21G, 22G, 23G, 24G x 1 inch" },
      { label: "Sterilization", value: "Ethylene Oxide (EO)" },
      { label: "Component", value: "3-Part (Barrel, Plunger, Gasket)" }
    ],
    features: [
      "Ultra-clear polypropylene barrel for easy bubble detection",
      "Siliconized rubber gasket ensures smooth, leak-proof plunger travel",
      "Permanent high-contrast graduation markings",
      "Non-toxic, pyrogen-free, single-use"
    ],
    keywords: ["syringe", "hypodermic needle", "luer lock", "disposable syringe", "injection"]
  },
  {
    id: "tmpl-iv-infusion-set",
    name: "Sterile Precision IV Infusion Set",
    slug: "sterile-precision-iv-infusion-set",
    shortDescription: "Medical IV gravity tubing set with sharp spike, drip chamber, precision roller clamp, and luer lock.",
    description: "Sterile intravenous infusion set designed for smooth, controlled fluid and medication delivery in inpatient and emergency departments.",
    specifications: [
      { label: "Drip Rate", value: "20 drops/ml (Macro) / 60 drops/ml (Micro)" },
      { label: "Tubing Length", value: "150 cm / 180 cm Kink-Resistant PVC" },
      { label: "Filter", value: "15 Micron Fluid Filter in Drip Chamber" },
      { label: "Injection Site", value: "Y-Site / Latex-Free Flashback Rubber" },
      { label: "Connector", value: "Male Luer Lock with Protective Cap" }
    ],
    features: [
      "Sharp, easy-piercing spike suitable for rigid and flexible containers",
      "Clear drip chamber with fluid filter to capture contaminants",
      "Smooth roller clamp for precise flow adjustment",
      "Kink-resistant flexible PVC tubing"
    ],
    keywords: ["iv set", "infusion set", "iv tubing", "drip set", "intravenous"]
  },
  {
    id: "tmpl-foley-catheter",
    name: "2-Way Silicone Foley Balloon Catheter",
    slug: "2-way-silicone-foley-balloon-catheter",
    shortDescription: "100% silicone sterile 2-way urinary Foley catheter with symmetrical inflation balloon.",
    description: "Biocompatible silicone Foley catheter offering maximum comfort and reduced encrustation for medium to long-term urinary catheterization.",
    specifications: [
      { label: "Material", value: "100% Medical Grade Silicone" },
      { label: "Way/Lumen", value: "2-Way" },
      { label: "Balloon Capacity", value: "5 ml - 30 ml" },
      { label: "Fr Sizes", value: "Fr 12, 14, 16, 18, 20, 22, 24" },
      { label: "Sterility", value: "Sterile Individual Blister Pack" }
    ],
    features: [
      "100% Silicone construction reduces urethral irritation and encrustation",
      "Radiopaque line throughout catheter length for X-ray visualization",
      "Smooth bevelled eyes facilitate painless insertion and efficient drainage",
      "Color-coded inflation valve for quick size identification"
    ],
    keywords: ["foley catheter", "urinary catheter", "silicone catheter", "2 way catheter", "urology"]
  },
  {
    id: "tmpl-iv-cannula",
    name: "Sterile IV Cannula with Port & Wings",
    slug: "sterile-iv-cannula-with-port-and-wings",
    shortDescription: "Peripheral IV catheter with injection port, flexible wings, and back-cut needle tip.",
    description: "High-performance intravenous cannula featuring PTFE/FEP catheter tube and stainless steel Japanese needle point for painless vein puncture.",
    specifications: [
      { label: "Gauge Sizes", value: "16G, 18G, 20G, 22G, 24G, 26G" },
      { label: "Color Coding", value: "Grey (16G), Green (18G), Pink (20G), Blue (22G), Yellow (24G)" },
      { label: "Catheter Material", value: "FEP / PTFE Kink-Resistant Material" },
      { label: "Needle", value: "Siliconized Stainless Steel AISI 304" }
    ],
    features: [
      "3-facet sharp back-cut needle point reduces insertion force",
      "Color-coded wings for easy gauge size selection and stable anchoring",
      "Integrated injection port with non-return valve for intermittent medication",
      "Hydrophobic filter cap prevents blood leakage during insertion"
    ],
    keywords: ["iv cannula", "vasofix", "venflon", "catheter", "intravenous"]
  },
  {
    id: "tmpl-surgical-suture",
    name: "Absorbable Surgical Suture with Needle",
    slug: "absorbable-surgical-suture-with-needle",
    shortDescription: "Sterile braided polyglycolic acid (PGA) absorbable suture attached to stainless steel needle.",
    description: "Synthetic absorbable surgical suture providing predictable tensile strength retention and smooth tissue passage for soft tissue approximation.",
    specifications: [
      { label: "Suture Type", value: "Polyglycolic Acid (PGA) Braided" },
      { label: "Absorption", value: "Complete absorption in 60-90 days" },
      { label: "Sizes", value: "USP 5-0 to USP 2" },
      { label: "Needle Profile", value: "3/8 Circle Reverse Cutting / Taper Point" },
      { label: "Needle Length", value: "16mm, 20mm, 26mm, 30mm, 40mm" }
    ],
    features: [
      "Coated with polycaprolactone and calcium stearate for smooth knotting",
      "High initial tensile strength holding tissue securely",
      "Minimal tissue reaction during hydrolysis absorption",
      "Precision swaged stainless steel surgical needle"
    ],
    keywords: ["surgical suture", "pga suture", "absorbable suture", "suture needle", "wound closure"]
  },
  {
    id: "tmpl-general-surgery-set",
    name: "General Surgical Instrument Set",
    slug: "general-surgical-instrument-set",
    shortDescription: "Comprehensive 42-piece surgical grade stainless steel instrument kit for laparotomy and general surgery.",
    description: "Complete institutional general surgery instrument set crafted from German surgical stainless steel, supplied in an autoclavable sterilizing tray.",
    specifications: [
      { label: "Total Pieces", value: "42 Instruments" },
      { label: "Material Grade", value: "AISI 410/420 German Stainless Steel" },
      { label: "Finish", value: "Satin Matte (Anti-Glare)" },
      { label: "Autoclavable", value: "Yes (Up to 134°C)" },
      { label: "Includes", value: "Forceps, Scissors, Needle Holders, Retractors, Scalpel Handles, Towel Clamps" }
    ],
    features: [
      "Precision-machined surgical instruments with satin finish to reduce reflection",
      "Corrosion-resistant surgical steel passes passivization and rust tests",
      "Heavy-duty perforated stainless steel sterilizing basket included",
      "Full warranty against manufacturing defects"
    ],
    keywords: ["surgical set", "general surgery", "laparotomy set", "forceps", "scissors", "surgical instruments"]
  },
  {
    id: "tmpl-hemostatic-forceps",
    name: "Surgical Hemostatic Forceps (Kelly / Crile)",
    slug: "surgical-hemostatic-forceps",
    shortDescription: "Straight & curved surgical hemostatic clamps with interlocking ratchet handle.",
    description: "Essential surgical clamp used to control bleeding and clamp blood vessels during operative procedures.",
    specifications: [
      { label: "Design", value: "Kelly / Crile Hemostatic Forceps" },
      { label: "Jaw Options", value: "Straight / Curved Serrated Jaws" },
      { label: "Length", value: "14 cm / 16 cm / 18 cm / 20 cm" },
      { label: "Material", value: "Martensitic Stainless Steel" },
      { label: "Ratchet", value: "3-Position Interlocking Ratchet Lock" }
    ],
    features: [
      "Precision serrations hold vessel walls firmly without slipping",
      "Smooth ratchet mechanism provides incremental clamping pressure",
      "Forged stainless steel with high durability and corrosion resistance",
      "Fully reusable and autoclavable"
    ],
    keywords: ["hemostatic forceps", "kelly forceps", "crile clamp", "artery forceps", "surgical clamp"]
  },
  {
    id: "tmpl-operating-scissors",
    name: "Operating Scissors (Mayo / Metzenbaum)",
    slug: "operating-scissors-mayo-metzenbaum",
    shortDescription: "Precision surgical tissue scissors with sharp/blunt tungsten carbide edge options.",
    description: "Surgical scissors designed for precise dissection and cutting of tissue, sutures, and surgical materials.",
    specifications: [
      { label: "Pattern", value: "Mayo Dissecting / Metzenbaum Fine Tissue" },
      { label: "Blades", value: "Straight / Curved" },
      { label: "Length", value: "14 cm, 17 cm, 20 cm, 23 cm" },
      { label: "Edge Type", value: "Standard Stainless / Tungsten Carbide Gold Handle" }
    ],
    features: [
      "Hand-honed cutting blades maintain edge sharpness through heavy use",
      "Metzenbaum pattern offers thin delicate tips for soft tissue dissection",
      "Mayo pattern suitable for tough fascia and suture cutting",
      "Ergonomic finger rings prevent strain"
    ],
    keywords: ["operating scissors", "mayo scissors", "metzenbaum scissors", "tissue dissecting", "surgical scissors"]
  },
  {
    id: "tmpl-needle-holder",
    name: "Needle Holder with Tungsten Carbide Inserts",
    slug: "needle-holder-with-tungsten-carbide-inserts",
    shortDescription: "Gold-handled Mayo-Hegar / Mayo-Castroviejo needle holder with TC jaws.",
    description: "Heavy-duty needle holder featuring tungsten carbide jaw inserts for firm grip on surgical needles without slippage or turning.",
    specifications: [
      { label: "Pattern", value: "Mayo-Hegar / Mathieu / Castroviejo" },
      { label: "Jaws", value: "Tungsten Carbide Cross-Serrated Jaws" },
      { label: "Length", value: "14 cm, 16 cm, 18 cm, 20 cm, 24 cm" },
      { label: "Handles", value: "Gold Plated Ring Handles" }
    ],
    features: [
      "Tungsten carbide inserts significantly extend operational lifespan",
      "Cross-hatched serrations hold needles securely at any angle",
      "Smooth ratchet engagement allows rapid lock and release",
      "Streamlined box lock prevents thread catching"
    ],
    keywords: ["needle holder", "mayo hegar", "tc jaws", "suturing instrument", "surgical needle holder"]
  },
  {
    id: "tmpl-electrosurgical-cautery",
    name: "Electrosurgical Cautery Generator Unit",
    slug: "electrosurgical-cautery-generator-unit",
    shortDescription: "Digital 400W electrosurgical unit (ESU) for monopolar and bipolar surgical cutting/coagulation.",
    description: "Advanced microprocessor-controlled electrosurgical cautery machine for operating rooms, offering high frequency monopolar cut, blend, fulguration, and bipolar coagulation modes.",
    specifications: [
      { label: "Max Power Output", value: "400 Watts" },
      { label: "Operating Modes", value: "Pure Cut, Blend 1/2, Coag, Bipolar Coag" },
      { label: "Frequency", value: "500 kHz" },
      { label: "Safety Monitoring", value: "REMs Return Electrode Contact Quality Monitor" },
      { label: "Accessories Included", value: "Handswitch Pencil, Patient Plate, Bipolar Forceps & Cable, Footswitch" }
    ],
    features: [
      "Microprocessor control delivers stable tissue power output across changing impedance",
      "Digital LED display for accurate wattage settings",
      "Patient return electrode monitoring protects against accidental burns",
      "Dual foot pedal and hand switch operation"
    ],
    keywords: ["electrosurgical unit", "cautery machine", "diathermy", "esu", "monopolar bipolar"]
  },
  {
    id: "tmpl-laparoscopic-trocar",
    name: "Laparoscopic Trocar & Cannula Assembly",
    slug: "laparoscopic-trocar-and-cannula-assembly",
    shortDescription: "Sterile 5mm / 10mm / 12mm laparoscopic trocar with silicone seal valve.",
    description: "Precision minimal invasive surgical trocar providing leak-free abdominal wall access for laparoscopes and endoscopic surgical tools.",
    specifications: [
      { label: "Diameter", value: "5mm, 10mm, 12mm" },
      { label: "Tip Style", value: "Blunt Safety Tip / Pyramidal Sharp / Optical Shielded" },
      { label: "Sleeve Type", value: "Threaded Sleeve for Abdominal Retention" },
      { label: "Valve Type", value: "Universal Silicone Flap Valve" }
    ],
    features: [
      "Universal seal accommodates 5mm to 12mm instruments without pneumoperitoneum loss",
      "Threaded cannula sleeve prevents accidental displacement during instrument exchange",
      "Low insertion force minimizes tissue trauma",
      "Integrated stopcock for CO2 insufflation"
    ],
    keywords: ["laparoscopic trocar", "cannula", "minimal invasive surgery", "endoscopy", "laparoscopy"]
  },
  {
    id: "tmpl-electric-icu-bed",
    name: "Five Function Electric ICU Bed",
    slug: "five-function-electric-icu-bed",
    shortDescription: "Motorized 5-function ICU hospital bed with CPR quick release and central locking casters.",
    description: "State-of-the-art electric ICU patient bed equipped with heavy-duty linear actuators for backrest, kneerest, height adjustment, Trendelenburg, and Reverse Trendelenburg positioning.",
    specifications: [
      { label: "Functions", value: "5 Motorized Functions (Back, Knee, Height, Trendelenburg, Rev. Trendelenburg)" },
      { label: "Control System", value: "Nurse Control Panel + Patient Hand Remote" },
      { label: "Side Rails", value: "4 Tuck-away ABS Split Side Rails with Angle Indicators" },
      { label: "Safe Working Load", value: "230 kg" },
      { label: "Casters", value: "125mm Central Locking Dust-Proof Wheels" }
    ],
    features: [
      "One-touch manual CPR lever on both sides for immediate cardiac care flat positioning",
      "Removable ABS head and foot boards for quick intubation access",
      "Built-in angle indicators for Trendelenburg and backrest elevation",
      "Mild steel tubular frame with anti-microbial epoxy powder coat"
    ],
    keywords: ["icu bed", "electric hospital bed", "motorized bed", "5 function bed", "hospital furniture"]
  },
  {
    id: "tmpl-hydraulic-operating-table",
    name: "Hydraulic Operating Table",
    slug: "hydraulic-operating-table",
    shortDescription: "Heavy-duty hydraulic surgical OT table with radiolucent top for C-arm imaging.",
    description: "Versatile surgical operating table featuring smooth foot-hydraulic elevation, mechanical gear adjustments for Trendelenburg, lateral tilt, and kidney bridge.",
    specifications: [
      { label: "Operation", value: "Foot-Pump Hydraulic Elevation + Mechanical Control" },
      { label: "Tabletop Material", value: "Radiolucent Bakelite for C-Arm Compatibility" },
      { label: "Max Load Capacity", value: "200 kg" },
      { label: "Sections", value: "5 Section Top (Head, Back, Kidney, Pelvic, Leg)" },
      { label: "Base", value: "Stainless Steel Concealed Heavy Base" }
    ],
    features: [
      "Radiolucent tabletop permits full-length fluoroscopic X-ray examination",
      "Eccentric column positioning provides max unobstructed C-arm access",
      "High-density seamless anti-static mattress pad",
      "Foot brake secures table firmly in place during procedures"
    ],
    keywords: ["operating table", "ot table", "hydraulic surgical table", "c arm table", "hospital furniture"]
  },
  {
    id: "tmpl-led-ot-light",
    name: "High-Intensity Dual Head LED OT Light",
    slug: "high-intensity-dual-head-led-ot-light",
    shortDescription: "Ceiling-mounted shadowless dual dome LED surgical light with adjustable color temperature.",
    description: "Advanced surgical lighting system featuring cold LED technology, deep cavity illumination, high Color Rendering Index (CRI), and sterilizable handle adjustment.",
    specifications: [
      { label: "Intensity", value: "160,000 + 120,000 Lux" },
      { label: "Color Temperature", value: "3800K - 5000K Adjustable" },
      { label: "CRI (Ra)", value: "≥ 96" },
      { label: "Light Field Diameter", value: "150 - 300 mm" },
      { label: "LED Lifespan", value: "> 50,000 Hours" }
    ],
    features: [
      "Shadowless multi-lens optic design produces uniform illumination field",
      "Cold LED light avoids thermal tissue drying and surgeon fatigue",
      "Digital touch panel controls brightness and color temperature",
      "360-degree rotating spring balance arms"
    ],
    keywords: ["ot light", "surgical light", "led ot light", "shadowless light", "operation theater"]
  },
  {
    id: "tmpl-emergency-stretcher",
    name: "Emergency Patient Transport Stretcher Trolley",
    slug: "emergency-patient-transport-stretcher-trolley",
    shortDescription: "Hydraulic height-adjustable emergency transport stretcher with collapsible side rails.",
    description: "Rugged emergency room patient transport trolley with backrest pneumatically supported, IV pole holder, oxygen cylinder cage, and central braking.",
    specifications: [
      { label: "Height Adjustment", value: "Hydraulic Pump Foot Pedal (600mm - 900mm)" },
      { label: "Frame Material", value: "Heavy Epoxy Coated Mild Steel with Stainless Railing" },
      { label: "Side Rails", value: "Drop-Down Collapsible Safety Rails" },
      { label: "Casters", value: "150mm Central Locking Casters with Directional Lock" }
    ],
    features: [
      "Gas-spring assisted backrest adjustment from 0° to 75°",
      "Integrated tray underneath for patient belongings and oxygen tank",
      "Bumper corner wheels absorb wall impacts during fast transit",
      "High-density waterproof foam mattress included"
    ],
    keywords: ["stretcher trolley", "emergency stretcher", "patient transport", "icu trolley", "hospital furniture"]
  },
  {
    id: "tmpl-patient-monitor",
    name: "Multi-Parameter Bedside Patient Monitor",
    slug: "multi-parameter-bedside-patient-monitor",
    shortDescription: "12.1-inch color TFT display multi-para monitor (ECG, SpO2, NIBP, Respiration, Temp).",
    description: "Comprehensive bedside vital signs monitor designed for ICU, OT, recovery, and emergency wards with visual/audible alarms and trend storage.",
    specifications: [
      { label: "Display", value: "12.1 inch High Resolution Color TFT Touch Screen" },
      { label: "Parameters", value: "5-Lead ECG, SpO2, NIBP, Respiration, Dual Temp" },
      { label: "Optional Modules", value: "ETCO2, Dual IBP, Cardiac Output" },
      { label: "Battery Backup", value: "Rechargeable Lithium Battery (Up to 4 hours)" },
      { label: "Trend Memory", value: "120 Hours Graphic & Tabular Trends" }
    ],
    features: [
      "Multi-channel waveform display with high readability",
      "Arrhythmia and ST segment analysis",
      "Central monitoring system (CMS) networking capability via Wi-Fi/LAN",
      "Waterproof panel suitable for harsh clinical environments"
    ],
    keywords: ["patient monitor", "multi para monitor", "bedside monitor", "vital signs", "icu monitor"]
  },
  {
    id: "tmpl-ecg-machine",
    name: "12-Channel ECG Machine",
    slug: "12-channel-ecg-machine",
    shortDescription: "Digital 12-lead electrocardiograph machine with high-resolution thermal printer & screen.",
    description: "Diagnostic 12-channel ECG machine offering simultaneous 12 lead collection, automatic measurement interpretation, and built-in thermal printing.",
    specifications: [
      { label: "Leads", value: "Standard 12 Leads Simultaneous Acquisition" },
      { label: "Display", value: "7-inch Color LCD Display with Preview" },
      { label: "Printer", value: "Built-in 210mm Thermal Array Printer" },
      { label: "Storage", value: "Internal Storage for > 1000 ECG Records" },
      { label: "Filters", value: "AC, EMG, Baseline Drift Filter" }
    ],
    features: [
      "Automatic ECG measurement and diagnostic interpretation algorithm",
      "USB and LAN connection for computer export and PDF printing",
      "Rechargeable battery for mobile bedside diagnostics",
      "High accuracy digital sampling rate"
    ],
    keywords: ["ecg machine", "12 channel ecg", "electrocardiograph", "cardiology", "diagnostics"]
  },
  {
    id: "tmpl-digital-bp-monitor",
    name: "Automatic Digital Blood Pressure Monitor",
    slug: "automatic-digital-blood-pressure-monitor",
    shortDescription: "Clinical-grade digital arm blood pressure monitor with WHO indicator & cuff.",
    description: "Fully automatic upper-arm digital BP monitor using oscillometric measurement to deliver fast, highly accurate systolic, diastolic, and pulse readings.",
    specifications: [
      { label: "Measurement Method", value: "Oscillometric System" },
      { label: "Pressure Range", value: "0 to 299 mmHg (Accuracy ±3 mmHg)" },
      { label: "Pulse Range", value: "40 to 180 beats/min (Accuracy ±5%)" },
      { label: "Cuff Size", value: "Medium / Large Universal Arm Cuff (22 - 42 cm)" },
      { label: "Memory", value: "Dual User 90 Memory Slots Each" }
    ],
    features: [
      "Irregular Heartbeat (IHB) detection notification",
      "Large back-lit LCD screen with clear bold numerals",
      "One-touch start/stop operation for effortless clinical screening",
      "Dual power option: AA batteries or Micro-USB / AC Adapter"
    ],
    keywords: ["bp monitor", "blood pressure monitor", "digital sphygmomanometer", "diagnostics", "bpl omron"]
  },
  {
    id: "tmpl-pulse-oximeter",
    name: "Fingertip Pulse Oximeter",
    slug: "fingertip-pulse-oximeter",
    shortDescription: "Portable dual-color OLED fingertip pulse oximeter for SpO2 and pulse rate.",
    description: "Compact, light-weight pulse oximeter delivering fast non-invasive measurement of arterial oxygen saturation (SpO2) and heart pulse rate.",
    specifications: [
      { label: "SpO2 Range", value: "70% - 100% (Accuracy ±2%)" },
      { label: "Pulse Rate Range", value: "30 - 250 bpm (Accuracy ±2 bpm)" },
      { label: "Display", value: "Dual Color OLED with 4 Direction Display" },
      { label: "Power", value: "2x AAA Alkaline Batteries (Auto Power Off in 8s)" }
    ],
    features: [
      "Provides real-time SpO2, Pulse Rate, Plethysmogram, and Perfusion Index (PI)",
      "Low power consumption allows up to 20 hours continuous operation",
      "Lanyard and carrying case included",
      "Suitable for adult and pediatric fingertip application"
    ],
    keywords: ["pulse oximeter", "spo2 monitor", "fingertip oximeter", "oxygen sensor", "diagnostics"]
  },
  {
    id: "tmpl-oxygen-concentrator",
    name: "5 LPM Portable Medical Oxygen Concentrator",
    slug: "5-lpm-portable-medical-oxygen-concentrator",
    shortDescription: "Continuous flow 5 Liters/min medical oxygen concentrator with purity indicator.",
    description: "Heavy-duty 5 LPM medical oxygen generator producing continuous oxygen purity above 93% for respiratory patient care in hospital wards and home settings.",
    specifications: [
      { label: "Oxygen Flow Rate", value: "0.5 - 5.0 Liters / Minute" },
      { label: "Oxygen Concentration", value: "93% ± 3% at all flow rates" },
      { label: "Outlet Pressure", value: "5.5 - 8.5 PSI" },
      { label: "Noise Level", value: "< 45 dBA" },
      { label: "Weight", value: "14 - 16 kg" }
    ],
    features: [
      "Built-in Oxygen Purity Indicator (OPI) alerts if concentration drops",
      "Low maintenance oil-free compressor with thermal protection",
      "Visual and audible alarms for power fail, low pressure, high pressure",
      "Integrated humidifier bottle recess and smooth caster wheels"
    ],
    keywords: ["oxygen concentrator", "5 lpm concentrator", "respiratory care", "oxygen generator", "medical equipment"]
  },
  {
    id: "tmpl-suction-machine",
    name: "Portable Heavy-Duty Electric Suction Machine",
    slug: "portable-heavy-duty-electric-suction-machine",
    shortDescription: "Oil-free piston pump electric suction apparatus with 2x2.5L jar capacity.",
    description: "High-vacuum high-flow clinical suction unit designed for surgical aspiration, airway mucus clearing, and emergency fluid suction.",
    specifications: [
      { label: "Max Vacuum", value: "≥ 0.09 MPa (675 mmHg)" },
      { label: "Free Air Flow Rate", value: "≥ 20 Liters / Minute" },
      { label: "Storage Jars", value: "2 x 2500 ml Polycarbonate Autoclavable Jars" },
      { label: "Pump Type", value: "Oil-free Maintenance-Free Piston Pump" },
      { label: "Noise Level", value: "< 60 dBA" }
    ],
    features: [
      "Overflow protection valve prevents fluid from entering pump assembly",
      "Stepless vacuum control knob with precise vacuum gauge",
      "Durable shock-resistant ABS plastic body cabinet",
      "Foot switch pedal and manual switch control"
    ],
    keywords: ["suction machine", "suction pump", "aspirator", "surgical suction", "medical equipment"]
  },
  {
    id: "tmpl-infusion-pump",
    name: "Volumetric Infusion Pump",
    slug: "volumetric-infusion-pump",
    shortDescription: "Smart programmable volumetric IV infusion pump with occlusion & air-in-line sensor.",
    description: "High precision medical volumetric pump for accurate intravenous fluid and drug delivery, compatible with standard IV infusion tubing sets.",
    specifications: [
      { label: "Flow Rate Range", value: "0.1 - 1200 ml/h (0.1 ml/h increment)" },
      { label: "VTBI", value: "0.1 - 9999 ml" },
      { label: "Accuracy", value: "± 5%" },
      { label: "Air Sensor", value: "Ultrasonic Detection for Air Bubble" },
      { label: "Bolus Rate", value: "Programmable 100 - 1200 ml/h" }
    ],
    features: [
      "Open system compatible with various standard IV infusion set brands",
      "Color LCD screen displays rate, volume infused, time remaining, and alarms",
      "Multi-level occlusion pressure settings",
      "Dual CPU safety check system"
    ],
    keywords: ["infusion pump", "volumetric pump", "iv pump", "drug delivery", "medical equipment"]
  },
  {
    id: "tmpl-binocular-microscope",
    name: "Binocular Clinical Laboratory Microscope",
    slug: "binocular-clinical-laboratory-microscope",
    shortDescription: "High-resolution binocular lab microscope with LED light, 40x-1000x magnification.",
    description: "Professional biological binocular microscope engineered for clinical pathology, microbiology laboratories, and educational research.",
    specifications: [
      { label: "Optical Head", value: "30° Inclined 360° Swiveling Binocular Head" },
      { label: "Objectives", value: "Achromatic 4x, 10x, 40x (Spring), 100x (Spring, Oil)" },
      { label: "Eyepieces", value: "Wide Field WF10x / 18mm" },
      { label: "Stage", value: "Double Layer Mechanical Stage 140x140mm" },
      { label: "Illumination", value: "Variable 3W LED Light with Abbe Condenser" }
    ],
    features: [
      "Coaxial coarse and fine focusing knobs with tension adjustment",
      "Abbe NA 1.25 condenser with iris diaphragm and blue filter",
      "Anti-fungal optical coatings ensure clarity in tropical climates",
      "Heavy cast metal base for vibration-free stability"
    ],
    keywords: ["microscope", "binocular microscope", "lab microscope", "pathology", "laboratory equipment"]
  },
  {
    id: "tmpl-benchtop-centrifuge",
    name: "High-Speed Benchtop Centrifuge Machine",
    slug: "high-speed-benchtop-centrifuge-machine",
    shortDescription: "Digital benchtop centrifuge 4000 RPM with swing-out / angle rotor for blood samples.",
    description: "Versatile clinical laboratory centrifuge designed for serum separation, blood plasma preparation, and urine sample centrifugation.",
    specifications: [
      { label: "Max Speed", value: "4000 RPM (Adjustable in steps of 100 RPM)" },
      { label: "Max RCF", value: "2200 x g" },
      { label: "Capacity", value: "8 x 15ml / 12 x 5ml Tubes" },
      { label: "Timer", value: "1 - 99 Minutes / Continuous" },
      { label: "Safety Lock", value: "Electronic Lid Interlock Mechanism" }
    ],
    features: [
      "Digital microprocessor control with LCD speed and time readout",
      "Maintenance-free brushless DC motor ensures smooth low-noise run",
      "Lid safety lock prevents lid opening while rotor is spinning",
      "Automatic imbalance detection shut-off"
    ],
    keywords: ["centrifuge", "lab centrifuge", "benchtop centrifuge", "blood centrifuge", "laboratory equipment"]
  },
  {
    id: "tmpl-ppe-kit",
    name: "Complete Personal Protective Equipment (PPE) Kit",
    slug: "complete-personal-protective-equipment-ppe-kit",
    shortDescription: "Full body sterile PPE kit (Coverall, Hood, N95 Mask, Face Shield, Gloves, Shoe Covers).",
    description: "Certified medical protection kit providing full barrier defense against hazardous biological fluids, viruses, and chemical contact.",
    specifications: [
      { label: "Coverall GSM", value: "70 GSM Non-Woven Laminated Breathable Fabric" },
      { label: "Seams", value: "Taped / Ultrasonic Sealed Seams" },
      { label: "Size Options", value: "Medium, Large, Extra Large" },
      { label: "Kit Contents", value: "Full Body Suit, Hood, N95 Mask, PET Face Shield, Nitrile Gloves, Shoe Covers, Waste Bag" },
      { label: "Certification", value: "ISO 16603, SITRA Tested, CE" }
    ],
    features: [
      "Impervious to liquid blood and body fluid penetration",
      "Breathable fabric minimizes thermal discomfort during long clinical shifts",
      "Elastic wrist, ankle, and waist design for snug fit",
      "Individually vacuum-sealed sterile pouch"
    ],
    keywords: ["ppe kit", "personal protective equipment", "coverall suit", "infection control", "protection kit"]
  },
  {
    id: "tmpl-hand-sanitizer",
    name: "Hospital-Grade Hand Sanitizer & Surgical Rub",
    slug: "hospital-grade-hand-sanitizer-and-surgical-rub",
    shortDescription: "70% Isopropyl Alcohol disinfectant hand rub with skin moisturizers.",
    description: "Broad-spectrum antiseptic surgical hand rub formulated for rapid hand disinfection before surgical procedures and routine patient contact.",
    specifications: [
      { label: "Active Ingredients", value: "70% Isopropyl Alcohol / Ethyl Alcohol v/v" },
      { label: "Additives", value: "Chlorhexidine Gluconate 0.5% + Emolrients & Skin Protectants" },
      { label: "Efficacy", value: "Kills 99.99% of germs, bacteria, fungi & enveloped viruses in 30 seconds" },
      { label: "Available Sizes", value: "100ml, 500ml Dispenser Pump, 5 Liter Can" }
    ],
    features: [
      "Fast drying liquid rub formulation requires no water or rinsing",
      "Formulated with moisturizer to prevent skin dryness and cracking",
      "Meets EN 1500 surgical hand disinfection standards",
      "Dispenser pump bottleneck suitable for wall brackets"
    ],
    keywords: ["hand sanitizer", "surgical rub", "alcohol rub", "disinfectant", "infection control"]
  },
  {
    id: "tmpl-steam-autoclave",
    name: "Front-Loading Steam Autoclave Sterilizer",
    slug: "front-loading-steam-autoclave-sterilizer",
    shortDescription: "Class B 24-Liter automatic benchtop steam sterilizer autoclave for surgical tools.",
    description: "Microprocessor Class B vacuum autoclave delivering complete sterilization of wrapped, unwrapped, solid, and hollow surgical instruments.",
    specifications: [
      { label: "Chamber Capacity", value: "24 Liters Stainless Steel 304" },
      { label: "Sterilization Class", value: "Class B (Fractionated Pre-Vacuum)" },
      { label: "Temperature Options", value: "121°C (1.1 bar) & 134°C (2.1 bar)" },
      { label: "Cycle Times", value: "15 to 35 Minutes" },
      { label: "Printer", value: "Built-in Thermal Cycle Printer / USB Logger" }
    ],
    features: [
      "Triple pre-vacuum pulses ensure steam penetration into narrow hollow tools",
      "Vacuum drying cycle leaves surgical instruments completely dry",
      "Dual safety valve and automated door locking under pressure",
      "Digital LCD screen displays real-time temperature and pressure graphs"
    ],
    keywords: ["autoclave", "steam sterilizer", "class b autoclave", "instrument sterilizer", "infection control"]
  },
  {
    id: "tmpl-knee-brace",
    name: "Adjustable Knee Immobilizer Brace",
    slug: "adjustable-knee-immobilizer-brace",
    shortDescription: "Orthopedic 3-panel hinged knee brace support with metallic splints.",
    description: "Post-operative orthopedic knee brace designed to restrict knee movement and provide rigid collateral stabilization following ligament surgery or patella trauma.",
    specifications: [
      { label: "Structure", value: "3-Panel Adjustable Wrap-Around Design" },
      { label: "Splints", value: "Removable Aluminum Posterior & Lateral Stay Bars" },
      { label: "Material", value: "Laminated Foam Fabric with Velour Lining" },
      { label: "Length Options", value: "16 inch, 19 inch, 22 inch, 24 inch" }
    ],
    features: [
      "3-panel construction easily adjusts to fit wide range of thigh/calf circumferences",
      "Lightweight rigid aluminum stays keep leg straight at 0° immobilization angle",
      "High quality Velcro hook and loop straps ensure firm non-slip compression",
      "Skin-friendly breathable fabric minimizes perspiration"
    ],
    keywords: ["knee brace", "knee immobilizer", "orthopedic support", "post operative brace", "tynor vissco"]
  },
  {
    id: "tmpl-cervical-collar",
    name: "Soft Foam Cervical Collar",
    slug: "soft-foam-cervical-collar",
    shortDescription: "Anatomical foam neck collar with cotton stockinette cover for neck strain relief.",
    description: "Supportive neck brace providing gentle cervical spine immobilization and muscle relief for cervical spondylosis, whiplash, and neck stiffness.",
    specifications: [
      { label: "Material Core", value: "High Density Polyurethane Foam" },
      { label: "Covering", value: "100% Hypoallergenic Cotton Stockinette" },
      { label: "Closure", value: "Hook and Loop Velcro Closure" },
      { label: "Sizes", value: "Small, Medium, Large, Extra Large" }
    ],
    features: [
      "Anatomical contour chin cutout provides comfortable jaw positioning",
      "Soft polyurethane core supports neck without restricting breathing",
      "Breathable cotton cover absorbs moisture and prevents chafing",
      "Easy wash and re-application"
    ],
    keywords: ["cervical collar", "neck collar", "neck brace", "orthopedic support", "tynor vissco"]
  },
  {
    id: "tmpl-folding-wheelchair",
    name: "Manual Folding Wheelchair",
    slug: "manual-folding-wheelchair",
    shortDescription: "Chrome plated steel manual wheelchair with flip-up armrests & mag wheels.",
    description: "Durable patient mobility wheelchair featuring heavy-duty steel folding frame, cushioned vinyl seat upholstery, and mag wheels for easy indoor/outdoor transport.",
    specifications: [
      { label: "Frame", value: "Chrome Plated Heavy-Duty Steel" },
      { label: "Seat Width", value: "46 cm (18 inches)" },
      { label: "Max Weight Capacity", value: "110 kg" },
      { label: "Rear Wheels", value: "24 inch Mag Wheels with Solid Rubber Tires" },
      { label: "Front Casters", value: "8 inch Heavy Duty PVC Solid Casters" }
    ],
    features: [
      "Cross-brace folding mechanism allows compact storage and trunk transport",
      "Padded armrests and detachable swing-away footrests with aluminum plates",
      "Dual rear manual wheel hand rims and toggle wheel brakes",
      "Wipe-clean water-resistant leatherette seat upholstery"
    ],
    keywords: ["wheelchair", "manual wheelchair", "folding wheelchair", "mobility aid", "rehabilitation"]
  },
  {
    id: "tmpl-ambu-bag-set",
    name: "Adult Manual Resuscitation Ambu Bag Set",
    slug: "adult-manual-resuscitation-ambu-bag-set",
    shortDescription: "Sterile silicone manual resuscitator bag with reservoir bag & silicone mask.",
    description: "Emergency pulmonary resuscitation bag set designed to provide manual positive pressure ventilation to non-breathing cardiac/respiratory distress patients.",
    specifications: [
      { label: "Bag Volume", value: "1600 ml (Adult) / 550 ml (Pediatric)" },
      { label: "Reservoir Bag Capacity", value: "2500 ml Oxygen Reservoir" },
      { label: "Material", value: "100% Medical Grade Autoclavable Silicone" },
      { label: "Pressure Relief Valve", value: "60 cm H2O (Adult) / 40 cm H2O (Child)" },
      { label: "Mask Size", value: "Transparent Silicone Cushion Mask Size 4/5" }
    ],
    features: [
      "100% Autoclavable silicone construction withstands high temperature sterilization",
      "360° swivel connector for easy mask positioning from any angle",
      "Textured non-slip bag surface offers secure grip during quick compression",
      "Includes transparent face mask, oxygen reservoir bag, and oxygen tubing"
    ],
    keywords: ["ambu bag", "resuscitation bag", "manual resuscitator", "emergency care", "cpr bag"]
  },
  {
    id: "tmpl-endotracheal-tube",
    name: "Cuffed Endotracheal Tube",
    slug: "cuffed-endotracheal-tube",
    shortDescription: "Sterile cuffed endotracheal tube with pilot balloon and radiopaque line.",
    description: "High-volume low-pressure cuffed tracheal tube inserted into trachea to establish and maintain an open airway during general anesthesia and mechanical ventilation.",
    specifications: [
      { label: "Material", value: "Medical Grade Clear Thermosensitive PVC" },
      { label: "Cuff Type", value: "High Volume Low Pressure (HVLP) Balloon Cuff" },
      { label: "Internal Diameter (ID)", value: "5.0mm to 9.0mm (0.5mm increments)" },
      { label: "Connector", value: "Standard 15mm Male Universal Connector" },
      { label: "Sterility", value: "Sterile EO Individual Pack" }
    ],
    features: [
      "Full-length radiopaque X-ray line enables precise tube position check",
      "HVLP balloon cuff provides gentle seal against tracheal wall with low pressure",
      "Smooth Murphy eye tip prevents complete airway occlusion",
      "Self-sealing pilot balloon valve with size indicator"
    ],
    keywords: ["endotracheal tube", "et tube", "cuffed tube", "airway management", "anesthesia"]
  },
  {
    id: "tmpl-dental-ultrasonic-scaler",
    name: "Dental Ultrasonic Scaler Unit",
    slug: "dental-ultrasonic-scaler-unit",
    shortDescription: "Piezoelectric dental scaler with detachable LED handpiece & 5 scaling tips.",
    description: "High-efficiency ultrasonic dental scaler engineered for calculus removal, periodontic treatment, and endodontic cavity cleaning.",
    specifications: [
      { label: "Operating Frequency", value: "28 kHz - 32 kHz Automatic Frequency Tracking" },
      { label: "Handpiece", value: "Detachable Autoclavable LED Optical Handpiece" },
      { label: "Water Pressure", value: "0.01 MPa - 0.5 MPa" },
      { label: "Tips Included", value: "5 Titanium Alloy Tips (G1, G2, G4, P1, E1)" }
    ],
    features: [
      "Automatic frequency tracking system optimizes power output continuously",
      "Brilliant 360-degree LED light ring on handpiece illuminates dark oral cavities",
      "Ergonomic handpiece cast from titanium alloy for long life",
      "Foot pedal and water regulator switch included"
    ],
    keywords: ["dental scaler", "ultrasonic scaler", "dental unit", "scaling handpiece", "dental products"]
  },
  {
    id: "tmpl-urine-bag",
    name: "Urine Drainage Bag with Anti-Reflux Valve",
    slug: "urine-drainage-bag-with-anti-reflux-valve",
    shortDescription: "Sterile 2000ml urine drainage bag with T-tap valve and sampling port.",
    description: "Closed system urinary drainage bag designed for secure collection of urine from catheters in bedridden and post-operative patients.",
    specifications: [
      { label: "Capacity", value: "2000 ml Graduated Volume" },
      { label: "Tubing Length", value: "90 cm - 100 cm Kink-Resistant Tube" },
      { label: "Drainage Valve", value: "T-Tap / Push-Pull Outlet Valve" },
      { label: "Valve Type", value: "One-Way Flutter Anti-Reflux Valve" }
    ],
    features: [
      "Non-return flutter valve prevents backward urine reflux to minimize UTI risk",
      "Needle-free urine sample port allows safe syringe sampling",
      "Reinforced double hanger hooks for rigid bedside suspension",
      "Clear graduations for accurate hourly fluid balance monitoring"
    ],
    keywords: ["urine bag", "drainage bag", "urology", "catheter bag", "disposable products"]
  }
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
