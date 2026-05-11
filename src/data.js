export const doctors = ["Dr. KIM", "Dr. JEONG", "Dr. LEE"];

export const categories = [
  "Eye",
  "Rhinoplasty",
  "Secondary Rhinoplasty",
  "Face",
  "Contouring",
  "Reconstruction",
  "Breast",
  "Stem Cell"
];

export const subcategories = {
  Eye: ["All", "Double Eyelid", "Ptosis Correction", "Epicanthoplasty", "Revision Eye"],
  Rhinoplasty: ["All", "Bridge", "Tip Plasty", "Alar Reduction", "Functional Nose"],
  "Secondary Rhinoplasty": ["All", "Implant Removal", "Contracted Nose", "Deviation Correction", "Rib Cartilage"],
  Face: ["All", "Facelift", "Fat Grafting", "Thread Lift", "Skin Tightening"],
  Contouring: ["All", "Jawline", "Cheekbone", "Chin", "V-line"],
  Reconstruction: ["All", "Scar Revision", "Trauma", "Congenital", "Revision Repair"],
  Breast: ["All", "Augmentation", "Reduction", "Lift", "Revision Breast"],
  "Stem Cell": ["All", "Stem Cell Therapy", "Regeneration", "Anti-aging", "Recovery Care"]
};

export const initialCases = [
  {
    id: "kim-eye-001",
    title: "Natural double eyelid refinement",
    doctor: "Dr. KIM",
    category: "Eye",
    subcategory: "Double Eyelid",
    tags: ["EYE B&A", "Natural", "3 months"],
    timeline: "3 months post-op",
    summary: "Balanced fold height and softer upper-eye contour with a natural expression.",
    beforeImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=900&q=80",
    consent: true,
    featured: true
  },
  {
    id: "kim-nose-002",
    title: "Primary rhinoplasty profile balance",
    doctor: "Dr. KIM",
    category: "Rhinoplasty",
    subcategory: "Tip Plasty",
    tags: ["NOSE B&A", "Profile", "6 months"],
    timeline: "6 months post-op",
    summary: "Improved bridge definition and tip support while keeping the profile calm.",
    beforeImage: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=900&q=80",
    consent: true,
    featured: true
  },
  {
    id: "jeong-revision-003",
    title: "Secondary rhinoplasty reconstruction",
    doctor: "Dr. JEONG",
    category: "Secondary Rhinoplasty",
    subcategory: "Contracted Nose",
    tags: ["Revision", "Reconstruction", "1 year"],
    timeline: "1 year post-op",
    summary: "Structural correction for a cleaner nasal line and improved symmetry.",
    beforeImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    consent: true,
    featured: false
  },
  {
    id: "lee-breast-004",
    title: "Breast surgery silhouette correction",
    doctor: "Dr. LEE",
    category: "Breast",
    subcategory: "Augmentation",
    tags: ["Breast Surgery", "Silhouette", "8 months"],
    timeline: "8 months post-op",
    summary: "A refined silhouette plan focused on proportion, comfort, and recovery pacing.",
    beforeImage: "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&w=900&q=80",
    afterImage: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=80",
    consent: true,
    featured: false
  }
];
