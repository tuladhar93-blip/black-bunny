// @ts-nocheck
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, ChevronLeft,
  ChevronRight, Star, Minus, Plus, SlidersHorizontal, Check
} from "lucide-react";

/* ============================== DESIGN TOKENS ============================== */
const C = {
  black: "#0E0D0C",
  ivory: "#F7F3EC",
  cream: "#F1E9DC",
  sand: "#D8C7AE",
  brown: "#5A4632",
  red: "#8C4A45",
};
const JEWEL = ["#3F5A48", "#3B4A6B", "#B8863B", "#8C4A45", "#5B3A52", "#5B6670", "#7A5230", "#4A5B3E"];

/* ============================== PRODUCT DATA ============================== */
const RAW_PRODUCTS = [
  ["Sora Satin Kimono","Kimonos","Long Kimonos","Sora","Vacation","Satin",128,"XS,S,M,L,XL",true,false,false],
  ["Hana Floral Kimono","Kimonos","Printed Kimonos","Hana","Dinner","Satin",148,"XS,S,M,L,XL",true,true,false],
  ["Kyoto Linen Robe","Kimonos","Long Kimonos","Kyoto","Everyday","Linen",118,"XS,S,M,L,XL",false,true,false],
  ["Noir Sheer Kimono","Kimonos","Sheer Kimonos","Nocturne","Event","Silk Chiffon",138,"XS,S,M,L,XL",true,false,false],
  ["Aya Embroidered Kimono","Kimonos","Embroidered Kimonos","Kyoto","Bridal","Silk",168,"XS,S,M,L,XL",false,false,true],
  ["Mizu Printed Kimono","Kimonos","Printed Kimonos","Sora","Vacation","Rayon",142,"XS,S,M,L,XL",true,true,false],
  ["Yoru Silk Kimono","Kimonos","Silk Kimonos","Nocturne","Event","Mulberry Silk",188,"XS,S,M,L,XL",false,false,true],
  ["Hana Petal Short Kimono","Kimonos","Short Kimonos","Hana","Everyday","Cotton",98,"XS,S,M,L,XL",false,true,false],
  ["Kasumi Sheer Overlay","Kimonos","Sheer Kimonos","Nocturne","Beach","Silk Chiffon",132,"XS,S,M,L,XL",true,false,false],
  ["Sora Wave Linen Robe","Kimonos","Long Kimonos","Sora","Vacation","Linen",124,"XS,S,M,L,XL",false,false,false],
  ["Tsuki Embroidered Duster","Kimonos","Embroidered Kimonos","Kyoto","Bridal","Silk Blend",172,"XS,S,M,L,XL",false,false,true],
  ["Hana Bloom Short Robe","Kimonos","Short Kimonos","Hana","Beach","Cotton",92,"XS,S,M,L,XL",true,false,false],
  ["Nocturne Slip Dress","Dresses","","Nocturne","Event","Satin",158,"XS,S,M,L,XL",false,true,false],
  ["Sora Wrap Midi Dress","Dresses","","Sora","Dinner","Rayon",136,"XS,S,M,L,XL",true,false,false],
  ["Hana Floral Maxi Dress","Dresses","","Hana","Vacation","Rayon",152,"XS,S,M,L,XL",false,true,false],
  ["Kyoto Column Dress","Dresses","","Kyoto","Event","Linen",144,"XS,S,M,L,XL",false,false,false],
  ["Mizu Cowl Slip Dress","Dresses","","Sora","Dinner","Satin",149,"XS,S,M,L,XL",true,false,false],
  ["Aya Kimono & Cami Set","Sets","","Kyoto","Everyday","Silk Blend",178,"XS,S,M,L,XL",false,true,false],
  ["Hana Two-Piece Set","Sets","","Hana","Vacation","Rayon",156,"XS,S,M,L,XL",true,false,false],
  ["Sora Robe & Shorts Set","Sets","","Sora","Beach","Cotton",134,"XS,S,M,L,XL",false,false,false],
  ["Nocturne Slip & Robe Set","Sets","","Nocturne","Event","Satin",189,"XS,S,M,L,XL",false,true,true],
  ["Kyoto Wrap Cami","Tops","","Kyoto","Everyday","Silk",78,"XS,S,M,L,XL",false,false,false],
  ["Sora Tie-Front Blouse","Tops","","Sora","Dinner","Rayon",82,"XS,S,M,L,XL",true,false,false],
  ["Hana Cropped Cami","Tops","","Hana","Vacation","Satin",68,"XS,S,M,L,XL",false,true,false],
  ["Kyoto Wide-Leg Trouser","Bottoms","","Kyoto","Everyday","Linen",112,"XS,S,M,L,XL",false,false,false],
  ["Sora Palazzo Pant","Bottoms","","Sora","Vacation","Rayon",104,"XS,S,M,L,XL",true,false,false],
  ["Nocturne Satin Trouser","Bottoms","","Nocturne","Event","Satin",118,"XS,S,M,L,XL",false,false,false],
  ["Sora Resort Cover-Up","Resortwear","Long Kimonos","Sora","Beach","Cotton Voile",96,"XS,S,M,L,XL",true,false,false],
  ["Hana Beach Sarong Wrap","Resortwear","Printed Kimonos","Hana","Beach","Rayon",74,"One Size",false,true,false],
  ["Kyoto Woven Obi Belt","Accessories","","Kyoto","Everyday","Cotton",38,"One Size",false,false,false],
];

const COLORWAYS = [
  [{n:"Ivory",h:"#F1E9DC"},{n:"Black",h:"#0E0D0C"}],
  [{n:"Rosewood",h:"#8C4A45"},{n:"Sand",h:"#D8C7AE"}],
  [{n:"Emerald",h:"#3F5A48"},{n:"Ivory",h:"#F1E9DC"}],
  [{n:"Indigo",h:"#3B4A6B"},{n:"Black",h:"#0E0D0C"}],
  [{n:"Ochre",h:"#B8863B"},{n:"Sand",h:"#D8C7AE"}],
  [{n:"Plum",h:"#5B3A52"},{n:"Ivory",h:"#F1E9DC"}],
];

// Fallback catalog — shown instantly on load, and used if the Google Sheet
// can't be reached. Once the sheet loads, it replaces this entirely.
const FALLBACK_PRODUCTS = RAW_PRODUCTS.map((p, i) => {
  const [name, category, style, collection, occasion, fabric, price, sizesStr, newArrival, bestSeller, limitedEdition] = p;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: i + 1,
    name, category, style, collection, occasion, fabric, price,
    slug,
    sizes: sizesStr.split(","),
    colors: COLORWAYS[i % COLORWAYS.length],
    image: null,
    hue: JEWEL[i % JEWEL.length],
    altHue: JEWEL[(i + 3) % JEWEL.length],
    rating: (4.4 + ((i * 7) % 6) / 10).toFixed(1),
    reviewCount: 24 + ((i * 37) % 180),
    newArrival, bestSeller, limitedEdition,
    description: `A fluid ${style ? style.toLowerCase() + " " : ""}piece crafted from lightweight ${fabric.toLowerCase()}, designed to move easily from day into evening. Part of the ${collection || "core"} collection.`,
    details: [
      "Relaxed, fluid silhouette with wide sleeves",
      "Self-tie waist closure",
      `${fabric} — sourced from long-term mill partners`,
      "Designed in-house, cut and sewn in small batches",
    ],
  };
});

/* ============================== GOOGLE SHEET PRODUCT FEED ==============================
   1. Make a copy of the template sheet (columns below), fill in your products.
   2. File → Share → Publish to web → select the product sheet/tab → CSV → Publish.
   3. Paste the published link here.
   Sheet columns (exact header names, one row per product):
   name | category | style | collection | occasion | fabric | price | sizes | colorNames | colorHexes | image | newArrival | bestSeller | limitedEdition
     - sizes: semicolon-separated, e.g.  XS;S;M;L;XL   (or  One Size)
     - colorNames / colorHexes: semicolon-separated, matching order, e.g.  Ivory;Black  and  #F1E9DC;#0E0D0C
     - image: a direct public image URL (Google Drive share links won't work directly — use imgur, Cloudinary, or your host)
     - newArrival / bestSeller / limitedEdition: TRUE or FALSE
=========================================================================================== */
const SHEET_CSV_URL = ""; // <-- paste your published CSV link here (used only if the /api endpoints aren't reachable)

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inQuotes) {
      if (c === '"' && n === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (field !== "" || row.length) { row.push(field); rows.push(row); row = []; field = ""; }
        if (c === "\r" && n === "\n") i++;
      } else field += c;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function sheetRowsToProducts(rows) {
  const [header, ...data] = rows;
  if (!header) return [];
  return data
    .filter((r) => r.length > 1 && r[0] && r[0].trim())
    .map((r, i) => {
      const obj = {};
      header.forEach((h, idx) => { obj[h.trim()] = (r[idx] || "").trim(); });
      const sizes = obj.sizes ? obj.sizes.split(";").map((s) => s.trim()).filter(Boolean) : ["One Size"];
      const colorNames = obj.colorNames ? obj.colorNames.split(";").map((s) => s.trim()).filter(Boolean) : ["Default"];
      const colorHexes = obj.colorHexes ? obj.colorHexes.split(";").map((s) => s.trim()).filter(Boolean) : [JEWEL[i % JEWEL.length]];
      const colors = colorNames.map((n, idx) => ({ n, h: colorHexes[idx] || colorHexes[0] }));
      const slug = (obj.name || `product-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return {
        id: i + 1,
        name: obj.name || "Untitled",
        category: obj.category || "",
        style: obj.style || "",
        collection: obj.collection || "",
        occasion: obj.occasion || "",
        fabric: obj.fabric || "",
        price: parseFloat(obj.price) || 0,
        slug,
        sizes,
        colors,
        image: obj.image || null,
        hue: JEWEL[i % JEWEL.length],
        altHue: JEWEL[(i + 3) % JEWEL.length],
        rating: (4.4 + ((i * 7) % 6) / 10).toFixed(1),
        reviewCount: 24 + ((i * 37) % 180),
        newArrival: (obj.newArrival || "").toUpperCase() === "TRUE",
        bestSeller: (obj.bestSeller || "").toUpperCase() === "TRUE",
        limitedEdition: (obj.limitedEdition || "").toUpperCase() === "TRUE",
        description: `A fluid piece crafted from lightweight ${(obj.fabric || "fabric").toLowerCase()}, part of the ${obj.collection || "core"} collection.`,
        details: [
          "Relaxed, fluid silhouette",
          `${obj.fabric || "Premium fabric"} — sourced from long-term mill partners`,
          "Cut and sewn in small batches",
        ],
      };
    });
}

const ANNOUNCEMENTS = [
  "COMPLIMENTARY SHIPPING ON ORDERS RS 15,000+",
  "FREE RETURNS WITHIN 30 DAYS",
  "NEW SUMMER COLLECTION AVAILABLE NOW",
];

const NAV = [
  { label: "NEW", cat: null },
  { label: "KIMONOS", cat: "Kimonos" },
  { label: "SETS", cat: "Sets" },
  { label: "DRESSES", cat: "Dresses" },
  { label: "RESORT", cat: "Resortwear" },
];

const KIMONO_STYLES = ["Long Kimonos","Short Kimonos","Silk Kimonos","Printed Kimonos","Embroidered Kimonos","Sheer Kimonos"];
const OCCASIONS = ["Everyday","Vacation","Beach","Dinner","Event","Bridal"];
const COLLECTIONS = ["Kyoto","Sora","Hana","Nocturne"];

/* ============================== HELPERS ============================== */
const fmt = (n) => `Rs ${n.toFixed(0)}`;

// Re-encodes an uploaded video client-side: downsizes resolution, strips
// audio (hero background videos play muted anyway), caps bitrate and
// trims length — using only native browser APIs (canvas + MediaRecorder),
// no external library. Falls back to the original file if the browser
// doesn't support this.
function compressVideoFile(file, { maxWidth = 960, fps = 24, videoBitsPerSecond = 900000, maxDurationSec = 15 } = {}) {
  return new Promise((resolve, reject) => {
    const canRecord = typeof MediaRecorder !== "undefined" && typeof HTMLCanvasElement !== "undefined" && HTMLCanvasElement.prototype.captureStream;
    if (!canRecord) { resolve({ dataUrl: null, compressed: false }); return; }

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const scale = Math.min(1, maxWidth / video.videoWidth);
      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");

      const stream = canvas.captureStream(fps);
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm;codecs=vp8";
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm";

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond });
      const chunks = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        URL.revokeObjectURL(video.src);
        const blob = new Blob(chunks, { type: "video/webm" });
        const reader = new FileReader();
        reader.onload = () => resolve({ dataUrl: reader.result, compressed: true });
        reader.onerror = () => resolve({ dataUrl: null, compressed: false });
        reader.readAsDataURL(blob);
      };
      recorder.onerror = () => resolve({ dataUrl: null, compressed: false });

      let rafId;
      const drawFrame = () => {
        if (video.paused || video.ended) return;
        ctx.drawImage(video, 0, 0, w, h);
        rafId = requestAnimationFrame(drawFrame);
      };

      const stopAt = Math.min(video.duration || maxDurationSec, maxDurationSec);
      const stopTimer = setTimeout(() => {
        cancelAnimationFrame(rafId);
        video.pause();
        recorder.stop();
      }, stopAt * 1000);

      video.onplay = () => { drawFrame(); };
      video.onended = () => { clearTimeout(stopTimer); cancelAnimationFrame(rafId); recorder.stop(); };

      recorder.start();
      video.play().catch(() => { clearTimeout(stopTimer); resolve({ dataUrl: null, compressed: false }); });
    };
    video.onerror = () => resolve({ dataUrl: null, compressed: false });
  });
}

// Resizes an uploaded photo client-side before it's stored, so the catalog
// stays small and fast even with several product photos.
function resizeImageFile(file, maxW = 900, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function GarmentArt({ hue, altHue, hovered, pattern = 0 }) {
  const id = useRef(`g${Math.random().toString(36).slice(2, 9)}`).current;
  return (
    <svg viewBox="0 0 400 520" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={hovered ? altHue : hue} stopOpacity="0.95" />
          <stop offset="100%" stopColor={C.ivory} stopOpacity="0.98" />
        </linearGradient>
      </defs>
      <rect width="400" height="520" fill={C.ivory} />
      <rect width="400" height="520" fill={`url(#${id})`} opacity="0.5" />
      {/* kimono silhouette */}
      <g transform={hovered ? "translate(4,0) rotate(1 200 260)" : ""} opacity="0.9">
        <path d="M200 60 L150 100 L120 480 L170 500 L200 320 L230 500 L280 480 L250 100 Z" fill={hue} opacity="0.55" />
        <path d="M150 100 L60 160 L80 260 L130 220 Z" fill={hue} opacity="0.4" />
        <path d="M250 100 L340 160 L320 260 L270 220 Z" fill={hue} opacity="0.4" />
        <line x1="170" y1="150" x2="170" y2="440" stroke={C.ivory} strokeWidth="2" opacity="0.5" />
        <line x1="230" y1="150" x2="230" y2="440" stroke={C.ivory} strokeWidth="2" opacity="0.5" />
        {pattern === 1 && Array.from({ length: 24 }).map((_, k) => (
          <circle key={k} cx={90 + (k % 6) * 40} cy={150 + Math.floor(k / 6) * 60} r="4" fill={C.ivory} opacity="0.35" />
        ))}
      </g>
      <circle cx="200" cy="40" r="18" fill={hue} opacity="0.6" />
    </svg>
  );
}

// Shows a real product photo when the sheet provides one; falls back to the
// generated placeholder art automatically otherwise.
/* ============================== ASPECT BOX (cross-browser) ============================== */
// Uses the classic padding-top percentage technique instead of the CSS
// `aspect-ratio` property. Some iOS Safari/WebKit versions handle
// aspect-ratio inconsistently (images collapsing to zero height and
// overlapping neighboring content) — this works reliably on every browser,
// old or new, on phone or laptop.
function AspectBox({ ratio, className = "", children }) {
  const pct = (1 / ratio) * 100;
  return (
    <div className={`relative w-full ${className}`} style={{ paddingTop: `${pct}%` }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

function ProductImage({ p, hovered, pattern }) {
  if (p.image) {
    return <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />;
  }
  return <GarmentArt hue={p.hue} altHue={p.altHue} hovered={hovered} pattern={pattern} />;
}

/* ============================== FILE DROPZONE (shared, admin uploads) ============================== */
// A proper drag-and-drop area with a real styled button — replaces the
// plain browser "Choose File" text input everywhere admin uploads a file.
function FileDropzone({ accept, onFile, hint = "Drag & drop a file here, or" }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const take = (files) => { if (files && files[0]) onFile(files[0]); };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); take(e.dataTransfer.files); }}
      className={`border-2 border-dashed rounded-sm px-4 py-5 text-center transition ${dragOver ? "border-black bg-black/5" : "border-black/20"}`}
    >
      <p className="text-[12px] text-[#8a8378] mb-2">{hint}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="border border-black px-4 py-2 text-[11px] tracking-widest hover:bg-black hover:text-white transition"
      >
        CHOOSE FILE
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={(e) => take(e.target.files)} className="hidden" />
    </div>
  );
}

/* ============================== PRODUCT CARD ============================== */
function ProductCard({ p, onOpen, wishlist, toggleWish, size = "normal" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={`group cursor-pointer flex-shrink-0 ${size === "carousel" ? "" : "w-full"}`}
      style={size === "carousel" ? { width: "clamp(230px, 78vw, 300px)" } : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(p.slug)}
    >
      <AspectBox ratio={4 / 5} className="overflow-hidden bg-[#F1E9DC]">
        <div className={`w-full h-full transition-transform duration-700 ${hov ? "scale-105" : "scale-100"}`}>
          <ProductImage p={p} hovered={hov} pattern={p.id % 3 === 0 ? 1 : 0} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center hover:bg-white transition"
          aria-label="Toggle wishlist"
        >
          <Heart size={15} fill={wishlist.includes(p.id) ? C.red : "none"} color={wishlist.includes(p.id) ? C.red : C.black} />
        </button>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {p.newArrival && <span className="bg-black text-white text-[10px] tracking-widest px-2 py-1">NEW</span>}
          {p.limitedEdition && <span className="bg-[#8C4A45] text-white text-[10px] tracking-widest px-2 py-1">LIMITED</span>}
        </div>
      </AspectBox>
      <div className="pt-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[13px] font-medium tracking-wide">{p.name}</h3>
        </div>
        <p className="text-[12px] text-[#8a8378] mt-0.5">{p.colors[0].n}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[13px]">{fmt(p.price)}</span>
          <div className="flex gap-1">
            {p.colors.map((c, i) => (
              <span key={i} className="w-3 h-3 rounded-full border border-black/10" style={{ background: c.h }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== CAROUSEL ============================== */
function Carousel({ title, products, onOpen, wishlist, toggleWish, viewAll }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <section className="px-5 md:px-10 py-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
        <div className="flex items-center gap-4">
          {viewAll && <button onClick={viewAll} className="text-[12px] tracking-widest underline underline-offset-4">VIEW ALL</button>}
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)} className="w-9 h-9 border border-black/15 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"><ChevronLeft size={16} /></button>
            <button onClick={() => scroll(1)} className="w-9 h-9 border border-black/15 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <div ref={ref} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x pb-2">
        {products.map((p) => (
          <div key={p.id} className="snap-start"><ProductCard p={p} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} size="carousel" /></div>
        ))}
      </div>
    </section>
  );
}

/* ============================== MEGA MENU ============================== */
function MegaMenu({ nav, goCollection }) {
  if (nav.cat !== "Kimonos") return null;
  return (
    <div className="absolute left-0 right-0 top-full bg-white border-t border-black/10 shadow-xl grid grid-cols-4 gap-8 px-14 py-10 z-40">
      <div>
        <p className="text-[11px] tracking-widest text-[#8a8378] mb-4">SHOP BY STYLE</p>
        <ul className="space-y-2.5">
          {KIMONO_STYLES.map((s) => (
            <li key={s}><button onClick={() => goCollection("Kimonos", { style: s })} className="text-[13px] hover:text-[#8C4A45] transition">{s}</button></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] tracking-widest text-[#8a8378] mb-4">SHOP BY OCCASION</p>
        <ul className="space-y-2.5">
          {OCCASIONS.map((o) => (
            <li key={o}><button onClick={() => goCollection("Kimonos", { occasion: o })} className="text-[13px] hover:text-[#8C4A45] transition">{o}</button></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] tracking-widest text-[#8a8378] mb-4">COLLECTIONS</p>
        <ul className="space-y-2.5">
          {[...COLLECTIONS, "Summer 26"].map((cn) => (
            <li key={cn}><button onClick={() => goCollection("Kimonos", { collection: cn })} className="text-[13px] hover:text-[#8C4A45] transition">{cn}</button></li>
          ))}
        </ul>
        <p className="text-[11px] tracking-widest text-[#8a8378] mt-6 mb-4">FEATURED</p>
        <ul className="space-y-2.5">
          <li><button onClick={() => goCollection("Kimonos", { featured: "new" })} className="text-[13px] hover:text-[#8C4A45] transition">New Arrivals</button></li>
          <li><button onClick={() => goCollection("Kimonos", { featured: "best" })} className="text-[13px] hover:text-[#8C4A45] transition">Best Sellers</button></li>
          <li><button onClick={() => goCollection("Kimonos", { featured: "limited" })} className="text-[13px] hover:text-[#8C4A45] transition">Limited Edition</button></li>
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative w-full overflow-hidden" style={{ paddingTop: "133.33%" }}><div className="absolute inset-0"><GarmentArt hue={C.red} altHue={C.brown} hovered={false} /></div></div>
        <div className="relative w-full overflow-hidden" style={{ paddingTop: "133.33%" }}><div className="absolute inset-0"><GarmentArt hue={JEWEL[1]} altHue={JEWEL[4]} hovered={false} /></div></div>
      </div>
    </div>
  );
}

/* ============================== HEADER ============================== */
function Header({ scrolled, cartCount, wishCount, openCart, openSearch, openWish, goHome, goCollection, mobileOpen, setMobileOpen }) {
  const [hoverNav, setHoverNav] = useState(null);
  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.06)]" : ""}`}>
      <div className="relative flex items-center justify-between px-5 md:px-10 h-[70px]" onMouseLeave={() => setHoverNav(null)}>
        <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <button
              key={n.label}
              onMouseEnter={() => setHoverNav(n)}
              onClick={() => n.cat ? goCollection(n.cat, {}) : goCollection(null, { featured: "new" })}
              className="text-[12px] tracking-widest font-medium hover:text-[#8C4A45] transition"
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button onClick={goHome} className="absolute left-1/2 -translate-x-1/2 text-xl tracking-[0.15em]" style={{ fontFamily: "'Playfair Display', serif" }}>
          BLACK BUNNY
        </button>
        <div className="flex items-center gap-5">
          <button onClick={openSearch} aria-label="Search"><Search size={19} /></button>
          <button className="hidden md:block" aria-label="Account"><User size={19} /></button>
          <button onClick={openWish} className="relative" aria-label="Wishlist">
            <Heart size={19} />
            {wishCount > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{wishCount}</span>}
          </button>
          <button onClick={openCart} className="relative" aria-label="Bag">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[#8C4A45] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
        {hoverNav && <MegaMenu nav={hoverNav} goCollection={goCollection} />}
      </div>
    </header>
  );
}

/* ============================== MOBILE MENU ============================== */
function MobileMenu({ open, onClose, goCollection }) {
  return (
    <div className={`fixed inset-0 z-[60] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute top-0 left-0 bottom-0 bg-white transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} overflow-y-auto`} style={{ width: "82%", maxWidth: 340 }}>
        <div className="flex justify-between items-center px-6 h-[70px] border-b border-black/10">
          <span className="text-lg tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>BLACK BUNNY</span>
          <button onClick={onClose}><X size={22} /></button>
        </div>
        <div className="p-6 flex flex-col gap-1">
          {NAV.map((n) => (
            <button key={n.label} onClick={() => { goCollection(n.cat, {}); onClose(); }} className="text-left py-3.5 text-[15px] tracking-wide border-b border-black/5">{n.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== ANNOUNCEMENT BAR ============================== */
function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ANNOUNCEMENTS.length), 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-black text-white text-center text-[11px] tracking-widest py-2.5 px-4">
      {ANNOUNCEMENTS[i]}
    </div>
  );
}

/* ============================== HOME PAGE ============================== */
function Hero({ goCollection, media }) {
  const videoRef = useRef(null);

  // iOS Safari has a known quirk where the muted attribute set by React
  // doesn't always register in time for autoplay to be permitted, even
  // though everything else is correct. Setting it imperatively and
  // explicitly calling play() is the reliable fix.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }, [media]);

  return (
    <section className="relative h-[92vh] min-h-[560px] bg-[#EFE6D6] overflow-hidden flex items-end">
      <div className="absolute inset-0">
        {media && media.type === "video" && media.stored ? (
          <video ref={videoRef} src={`/api/hero-video?v=${media.updatedAt || 0}`} autoPlay muted defaultMuted loop playsInline preload="auto" className="w-full h-full object-cover" />
        ) : media && media.type === "video" && media.src ? (
          <video ref={videoRef} src={media.src} autoPlay muted defaultMuted loop playsInline preload="auto" className="w-full h-full object-cover" />
        ) : media && media.type === "image" && media.src ? (
          <img src={media.src} alt="" className="w-full h-full object-cover" />
        ) : (
          <GarmentArt hue={C.red} altHue={C.brown} hovered={false} pattern={1} />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      <div className="relative z-10 px-6 md:px-14 pb-16 max-w-2xl">
        <p className="text-white/80 text-[12px] tracking-[0.2em] mb-4">WEAR THE ART.</p>
        <h1 className="text-white text-[2.6rem] md:text-6xl leading-[1.02]" style={{ fontFamily: "'Playfair Display', serif" }}>The art of movement.</h1>
        <p className="text-white/85 mt-5 max-w-md text-[15px] leading-relaxed">Modern kimonos designed to move with you — reimagined through fluid silhouettes and considered fabrics.</p>
        <div className="flex gap-4 mt-8 flex-wrap">
          <button onClick={() => goCollection(null, { featured: "new" })} className="bg-white text-black px-7 py-3.5 text-[12px] tracking-widest hover:bg-transparent hover:text-white border border-white transition">SHOP NEW ARRIVALS</button>
          <button onClick={() => goCollection("Kimonos", {})} className="border border-white text-white px-7 py-3.5 text-[12px] tracking-widest hover:bg-white hover:text-black transition">EXPLORE KIMONOS</button>
        </div>
      </div>
    </section>
  );
}

function StyleTiles({ goCollection }) {
  const tiles = [
    { label: "LONG KIMONOS", key: { style: "Long Kimonos" } },
    { label: "SHORT KIMONOS", key: { style: "Short Kimonos" } },
    { label: "SILK", key: { fabric: "Silk" } },
    { label: "PRINTED", key: { style: "Printed Kimonos" } },
    { label: "RESORT", cat: "Resortwear", key: {} },
  ];
  return (
    <section className="px-5 md:px-10 py-16">
      <h2 className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Find your style</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tiles.map((t, i) => (
          <button key={t.label} onClick={() => goCollection(t.cat || "Kimonos", t.key)} className="group relative w-full overflow-hidden" style={{ paddingTop: "133.33%" }}>
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110">
              <GarmentArt hue={JEWEL[i % JEWEL.length]} altHue={JEWEL[(i + 2) % JEWEL.length]} hovered={false} />
            </div>
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition" />
            <span className="absolute bottom-5 left-5 text-white text-[13px] tracking-widest">{t.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function EditorialBanner({ goCollection }) {
  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
      <GarmentArt hue={C.brown} altHue={C.red} hovered={false} />
      <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-white text-4xl md:text-5xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Made to be seen.</h2>
        <p className="text-white/85 mb-7">Fluid silhouettes. Statement prints. Effortless movement.</p>
        <button onClick={() => goCollection("Kimonos", {})} className="bg-white text-black px-7 py-3.5 text-[12px] tracking-widest hover:bg-transparent hover:text-white border border-white transition">DISCOVER THE COLLECTION</button>
      </div>
    </section>
  );
}

function OccasionTiles({ goCollection }) {
  return (
    <section className="px-5 md:px-10 py-16 bg-[#F7F3EC]">
      <h2 className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Dress for the moment</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {OCCASIONS.map((o, i) => (
          <button key={o} onClick={() => goCollection(null, { occasion: o })} className="group relative w-full overflow-hidden" style={{ paddingTop: "62.5%" }}>
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110">
              <GarmentArt hue={JEWEL[(i + 4) % JEWEL.length]} altHue={JEWEL[(i + 1) % JEWEL.length]} hovered={false} />
            </div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <span className="absolute bottom-5 left-5 text-white text-[13px] tracking-widest">{o.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function FeaturedCollection({ goCollection }) {
  return (
    <section className="grid md:grid-cols-2">
      <div className="h-[420px] md:h-auto"><GarmentArt hue={C.red} altHue={JEWEL[2]} hovered={false} pattern={1} /></div>
      <div className="flex flex-col justify-center px-8 md:px-16 py-16 bg-[#0E0D0C] text-white">
        <p className="text-[11px] tracking-[0.2em] text-white/60 mb-4">FEATURED COLLECTION</p>
        <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>HANA</h2>
        <p className="text-white/75 mb-8 max-w-sm italic" style={{ fontFamily: "'Playfair Display', serif" }}>Inspired by fleeting blooms and quiet moments.</p>
        <button onClick={() => goCollection(null, { collection: "Hana" })} className="w-fit border border-white px-7 py-3.5 text-[12px] tracking-widest hover:bg-white hover:text-black transition">SHOP HANA</button>
      </div>
    </section>
  );
}

function Lookbook({ goCollection }) {
  const looks = ["Over a slip dress", "With denim", "Over swimwear", "With tailored pants", "Evening styling"];
  return (
    <section className="px-5 md:px-10 py-16">
      <h2 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>The Black Bunny Edit</h2>
      <p className="text-[#8a8378] mb-8 max-w-md">Five ways to wear the kimono, from morning to midnight.</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {looks.map((l, i) => (
          <div key={l} className={`relative w-full overflow-hidden ${i === 2 ? "md:mt-10" : ""}`} style={{ paddingTop: "146.67%" }}>
            <div className="absolute inset-0"><GarmentArt hue={JEWEL[(i + 5) % JEWEL.length]} altHue={JEWEL[i % JEWEL.length]} hovered={false} /></div>
            <span className="absolute bottom-4 left-4 text-white text-[11px] tracking-wide max-w-[80%]">{l}</span>
          </div>
        ))}
      </div>
      <button onClick={() => goCollection(null, {})} className="mt-8 text-[12px] tracking-widest underline underline-offset-4">SHOP THE EDIT</button>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="px-5 md:px-10 py-24 text-center max-w-2xl mx-auto">
      <p className="text-[11px] tracking-[0.2em] text-[#8a8378] mb-5">OUR STORY</p>
      <h2 className="text-3xl md:text-4xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Tradition, reimagined.</h2>
      <p className="text-[#5A4632] leading-relaxed mb-8">Black Bunny takes inspiration from the timeless form of the kimono and reinterprets it through modern fabrics, relaxed silhouettes, and contemporary styling.</p>
      <button className="text-[12px] tracking-widest underline underline-offset-4">OUR STORY</button>
    </section>
  );
}

function SocialGallery() {
  return (
    <section className="px-5 md:px-10 py-16 bg-[#F7F3EC]">
      <h2 className="text-2xl md:text-3xl mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>@BLACKBUNNY</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 overflow-hidden" style={{ width: 160, height: 200 }}><GarmentArt hue={JEWEL[i % JEWEL.length]} altHue={JEWEL[(i + 3) % JEWEL.length]} hovered={false} /></div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="px-5 md:px-10 py-20 bg-[#0E0D0C] text-white text-center">
      <h2 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Enter the world of Black Bunny</h2>
      <p className="text-white/65 mb-8 max-w-md mx-auto">New collections, private releases, and styling inspiration — delivered first.</p>
      {done ? (
        <p className="text-[13px] tracking-wide">You're on the list.</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }} className="flex max-w-sm mx-auto border-b border-white/40">
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="bg-transparent flex-1 py-3 text-[13px] outline-none placeholder:text-white/40" />
          <button type="submit" className="text-[12px] tracking-widest px-2">JOIN</button>
        </form>
      )}
    </section>
  );
}

/* ============================== COLLECTION PAGE ============================== */
function CollectionPage({ products, activeCat, activeFilters, onOpen, wishlist, toggleWish, addToast }) {
  const [filters, setFilters] = useState(activeFilters || {});
  const [sort, setSort] = useState("Featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => setFilters(activeFilters || {}), [activeFilters, activeCat]);

  const base = activeCat ? products.filter((p) => p.category === activeCat) : products;
  const filtered = useMemo(() => {
    let list = base.filter((p) => {
      if (filters.style && p.style !== filters.style) return false;
      if (filters.occasion && p.occasion !== filters.occasion) return false;
      if (filters.collection && p.collection !== filters.collection) return false;
      if (filters.fabric && !p.fabric.toLowerCase().includes(filters.fabric.toLowerCase())) return false;
      if (filters.color && !p.colors.some((c) => c.n === filters.color)) return false;
      if (filters.size && !p.sizes.includes(filters.size)) return false;
      if (filters.featured === "new" && !p.newArrival) return false;
      if (filters.featured === "best" && !p.bestSeller) return false;
      if (filters.featured === "limited" && !p.limitedEdition) return false;
      return true;
    });
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Newest") list = [...list].sort((a, b) => b.newArrival - a.newArrival);
    if (sort === "Best Selling") list = [...list].sort((a, b) => b.bestSeller - a.bestSeller);
    return list;
  }, [base, filters, sort]);

  const allColors = [...new Set(products.flatMap((p) => p.colors.map((c) => c.n)))];
  const allFabrics = [...new Set(products.map((p) => p.fabric))];
  const allSizes = ["XS","S","M","L","XL"];

  const FilterGroup = ({ label, options, field }) => (
    <div className="mb-7">
      <p className="text-[11px] tracking-widest text-[#8a8378] mb-3">{label.toUpperCase()}</p>
      <div className="flex flex-col gap-2">
        {options.map((o) => (
          <button key={o} onClick={() => setFilters((f) => ({ ...f, [field]: f[field] === o ? undefined : o }))}
            className={`text-left text-[13px] flex items-center gap-2 ${filters[field] === o ? "text-[#8C4A45]" : ""}`}>
            <span className={`w-3.5 h-3.5 border flex items-center justify-center ${filters[field] === o ? "bg-[#8C4A45] border-[#8C4A45]" : "border-black/25"}`}>
              {filters[field] === o && <Check size={10} color="white" />}
            </span>
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-5 md:px-10 py-10">
      <h1 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{activeCat || "All Products"}</h1>
      <p className="text-[#8a8378] max-w-lg mb-8">Statement layers designed for everyday dressing, travel, and special moments.</p>

      {activeCat === "Kimonos" && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-8 pb-1">
          {KIMONO_STYLES.map((s) => (
            <button key={s} onClick={() => setFilters((f) => ({ ...f, style: f.style === s ? undefined : s }))}
              className={`flex-shrink-0 px-4 py-2 text-[11px] tracking-widest border ${filters.style === s ? "bg-black text-white border-black" : "border-black/15"}`}>
              {s.replace(" Kimonos", "").toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-y border-black/10 py-3 mb-8">
        <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 text-[12px] tracking-widest">
          <SlidersHorizontal size={14} /> FILTER
        </button>
        <span className="text-[12px] text-[#8a8378]">{filtered.length} PRODUCTS</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-[12px] tracking-widest bg-transparent outline-none">
          {["Featured","Newest","Best Selling","Price: Low to High","Price: High to Low"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-20 text-[#8a8378]">No products match these filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {filtered.map((p) => <ProductCard key={p.id} p={p} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />)}
        </div>
      )}

      <div className={`fixed inset-0 z-[70] ${drawerOpen ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setDrawerOpen(false)} />
        <div className={`absolute top-0 left-0 bottom-0 bg-white p-6 overflow-y-auto transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ width: "85%", maxWidth: 320 }}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[13px] tracking-widest">FILTER</span>
            <button onClick={() => setDrawerOpen(false)}><X size={20} /></button>
          </div>
          <FilterGroup label="Style" options={KIMONO_STYLES} field="style" />
          <FilterGroup label="Occasion" options={OCCASIONS} field="occasion" />
          <FilterGroup label="Collection" options={COLLECTIONS} field="collection" />
          <FilterGroup label="Fabric" options={allFabrics} field="fabric" />
          <FilterGroup label="Color" options={allColors} field="color" />
          <FilterGroup label="Size" options={allSizes} field="size" />
          <button onClick={() => setFilters({})} className="text-[12px] underline underline-offset-4 mt-2">Clear all filters</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== PRODUCT PAGE ============================== */
function ProductPage({ products, slug, onOpen, addToCart, wishlist, toggleWish, addToast }) {
  const p = products.find((x) => x.slug === slug) || products[0];
  const [color, setColor] = useState(p.colors[0].n);
  const [size, setSize] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [openSection, setOpenSection] = useState("Description");
  useEffect(() => { setColor(p.colors[0].n); setSize(null); setImgIdx(0); }, [slug]);

  const shots = ["Front", "Back", "Detail", "Styled Look", "Fabric Close-Up"];

  const related = products.filter((x) => x.collection === p.collection && x.id !== p.id).slice(0, 4);
  const alsoLove = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  const handleAdd = () => {
    if (p.sizes[0] !== "One Size" && !size) { addToast("Select a size first"); return; }
    addToCart(p, size || "One Size", color);
    addToast("Added to bag");
  };

  const Accordion = ({ title, content }) => (
    <div className="border-b border-black/10">
      <button onClick={() => setOpenSection(openSection === title ? null : title)} className="w-full flex justify-between items-center py-4 text-[13px] tracking-wide">
        {title.toUpperCase()}
        <ChevronDown size={15} className={`transition-transform ${openSection === title ? "rotate-180" : ""}`} />
      </button>
      {openSection === title && <div className="pb-4 text-[13px] text-[#5A4632] leading-relaxed">{content}</div>}
    </div>
  );

  return (
    <div className="px-5 md:px-10 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="relative w-full overflow-hidden mb-3" style={{ paddingTop: "125%" }}>
            <div className="absolute inset-0"><ProductImage p={p} hovered={imgIdx % 2 === 1} pattern={imgIdx === 2 ? 1 : 0} /></div>
          </div>
          {!p.image && (
            <div className="flex gap-2">
              {shots.map((s, i) => (
                <button key={s} onClick={() => setImgIdx(i)} className={`relative flex-1 overflow-hidden border-2 ${imgIdx === i ? "border-black" : "border-transparent"}`} style={{ paddingTop: "100%" }}>
                  <div className="absolute inset-0"><GarmentArt hue={p.hue} altHue={p.altHue} hovered={i % 2 === 1} pattern={i === 2 ? 1 : 0} /></div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="md:pt-2">
          <p className="text-[11px] tracking-widest text-[#8a8378] mb-2">{p.collection ? p.collection.toUpperCase() + " COLLECTION" : p.category.toUpperCase()}</p>
          <h1 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</h1>
          <p className="text-lg mb-2">{fmt(p.price)}</p>
          <div className="flex items-center gap-1.5 mb-6 text-[13px]">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill={i < Math.round(p.rating) ? C.black : "none"} color={C.black} />)}
            <span className="text-[#8a8378] ml-1">{p.rating} ({p.reviewCount} Reviews)</span>
          </div>

          <p className="text-[11px] tracking-widest mb-2">COLOR — {color}</p>
          <div className="flex gap-2 mb-6">
            {p.colors.map((c) => (
              <button key={c.n} onClick={() => setColor(c.n)} className={`w-9 h-9 rounded-full border-2 ${color === c.n ? "border-black" : "border-transparent"}`} style={{ background: c.h, boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }} aria-label={c.n} />
            ))}
          </div>

          {p.sizes[0] !== "One Size" && (
            <>
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] tracking-widest">SIZE {size ? `— ${size}` : ""}</p>
                <button className="text-[11px] underline underline-offset-4 text-[#8a8378]">Size Guide</button>
              </div>
              <div className="flex gap-2 mb-6">
                {p.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`w-11 h-11 border text-[12px] ${size === s ? "bg-black text-white border-black" : "border-black/20"}`}>{s}</button>
                ))}
              </div>
            </>
          )}

          <div className="flex gap-3 mb-8">
            <button onClick={handleAdd} className="flex-1 bg-black text-white py-4 text-[12px] tracking-widest hover:bg-[#8C4A45] transition">ADD TO BAG</button>
            <button onClick={() => toggleWish(p.id)} className="w-14 border border-black/20 flex items-center justify-center">
              <Heart size={18} fill={wishlist.includes(p.id) ? C.red : "none"} color={wishlist.includes(p.id) ? C.red : C.black} />
            </button>
          </div>

          <Accordion title="Description" content={p.description} />
          <Accordion title="Fit & Details" content={<ul className="list-disc pl-4 space-y-1">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>} />
          <Accordion title="Fabric & Care" content={`${p.fabric}. Hand wash cold or dry clean. Hang to dry away from direct sun. Cool iron if needed.`} />
          <Accordion title="Shipping & Returns" content="Complimentary shipping on orders Rs 15,000+. Free returns within 30 days of delivery." />
        </div>
      </div>

      {related.length > 0 && <Carousel title="Style It With" products={related} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />}
      {alsoLove.length > 0 && <Carousel title="You May Also Love" products={alsoLove} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />}
    </div>
  );
}

/* ============================== WISHLIST PAGE ============================== */
function WishlistPage({ products, wishlist, onOpen, toggleWish, addToCart, addToast }) {
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="px-5 md:px-10 py-10 min-h-[50vh]">
      <h1 className="text-3xl mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Your Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-[#8a8378]">Nothing saved yet — tap the heart on any product to add it here.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {items.map((p) => (
            <div key={p.id}>
              <ProductCard p={p} onOpen={onOpen} wishlist={wishlist} toggleWish={toggleWish} />
              <button onClick={() => { addToCart(p, p.sizes[0], p.colors[0].n); addToast("Added to bag"); }} className="mt-2 w-full border border-black/20 py-2.5 text-[11px] tracking-widest hover:bg-black hover:text-white transition">ADD TO BAG</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== CART DRAWER ============================== */
function CartDrawer({ open, onClose, cart, changeQty, removeItem, goCheckoutToast, goCollection }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const threshold = 15000;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute top-0 right-0 bottom-0 bg-white flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`} style={{ width: 420, maxWidth: "94vw" }}>
        <div className="flex justify-between items-center px-6 h-[68px] border-b border-black/10">
          <span className="text-[15px] tracking-wide">Your Bag ({cart.reduce((s, i) => s + i.qty, 0)})</span>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="px-6 py-3 border-b border-black/10">
          <p className="text-[12px] mb-2">{remaining > 0 ? `You're Rs ${remaining.toFixed(0)} away from complimentary shipping.` : "You've unlocked complimentary shipping!"}</p>
          <div className="h-1 bg-black/10 rounded-full overflow-hidden"><div className="h-full bg-[#8C4A45] transition-all" style={{ width: `${pct}%` }} /></div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {cart.length === 0 ? (
            <p className="text-center py-20 text-[#8a8378] text-[13px]">Your bag is empty.</p>
          ) : cart.map((item, idx) => (
            <div key={idx} className="flex gap-4 py-5 border-b border-black/5">
              <div className="w-20 h-24 flex-shrink-0 overflow-hidden"><ProductImage p={item} hovered={false} /></div>
              <div className="flex-1">
                <h5 className="text-[13px] mb-1">{item.name}</h5>
                <p className="text-[11px] text-[#8a8378] mb-2">{item.color} / {item.size}</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => changeQty(idx, -1)} className="w-6 h-6 border border-black/20 rounded-full flex items-center justify-center"><Minus size={11} /></button>
                  <span className="text-[12px]">{item.qty}</span>
                  <button onClick={() => changeQty(idx, 1)} className="w-6 h-6 border border-black/20 rounded-full flex items-center justify-center"><Plus size={11} /></button>
                  <button onClick={() => removeItem(idx)} className="ml-auto text-[11px] underline underline-offset-4 text-[#8a8378]">Remove</button>
                </div>
              </div>
              <span className="text-[13px]">{fmt(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-5 border-t border-black/10">
          <div className="flex justify-between text-[14px] mb-4"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          <button onClick={goCheckoutToast} disabled={cart.length === 0} className="w-full bg-black text-white py-3.5 text-[12px] tracking-widest mb-2.5 disabled:opacity-40 hover:bg-[#8C4A45] transition">CHECKOUT</button>
          <button onClick={() => { onClose(); goCollection(null, {}); }} className="w-full border border-black/20 py-3.5 text-[12px] tracking-widest hover:bg-black hover:text-white transition">VIEW BAG / CONTINUE SHOPPING</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== SEARCH OVERLAY ============================== */
function SearchOverlay({ products, open, onClose, onOpen }) {
  const [q, setQ] = useState("");
  const trending = ["Floral Kimono", "Black Kimono", "Vacation", "Silk", "Long Kimono"];
  const results = q.length > 1 ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.fabric.toLowerCase().includes(q.toLowerCase()) || (p.style || "").toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];
  return (
    <div className={`fixed inset-0 z-[90] bg-white transition-transform duration-300 ${open ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="px-6 md:px-14 pt-8">
        <div className="flex justify-between items-center mb-8">
          <span className="text-[13px] tracking-widest text-[#8a8378]">SEARCH BLACK BUNNY</span>
          <button onClick={onClose}><X size={22} /></button>
        </div>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, styles, fabrics…"
          className="w-full text-2xl md:text-3xl border-b border-black/20 pb-4 outline-none" style={{ fontFamily: "'Playfair Display', serif" }} />

        {q.length <= 1 ? (
          <div className="mt-8">
            <p className="text-[11px] tracking-widest text-[#8a8378] mb-3">TRENDING SEARCHES</p>
            <div className="flex flex-wrap gap-2">
              {trending.map((t) => <button key={t} onClick={() => setQ(t)} className="border border-black/15 px-4 py-2 text-[12px] hover:bg-black hover:text-white transition">{t}</button>)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-h-[60vh] overflow-y-auto pb-10">
            {results.length === 0 ? <p className="col-span-full text-[#8a8378] text-[13px]">No results for "{q}"</p> :
              results.map((p) => (
                <button key={p.id} onClick={() => { onOpen(p.slug); onClose(); }} className="text-left">
                  <div className="relative w-full overflow-hidden mb-2" style={{ paddingTop: "125%" }}>
                    <div className="absolute inset-0"><ProductImage p={p} hovered={false} /></div>
                  </div>
                  <p className="text-[12px]">{p.name}</p>
                  <p className="text-[12px] text-[#8a8378]">{fmt(p.price)}</p>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== FOOTER ============================== */
function Footer({ goCollection }) {
  const cols = [
    { h: "CUSTOMER CARE", items: ["Contact","Shipping","Returns","Track Order","Size Guide","Care Guide"] },
    { h: "ABOUT BLACK BUNNY", items: ["Our Story","Journal","Sustainability","Careers"] },
    { h: "DISCOVER", items: ["New Arrivals","Best Sellers","Gift Cards","Lookbook"] },
    { h: "FOLLOW", items: ["Instagram","TikTok","Pinterest"] },
  ];
  return (
    <footer className="bg-[#0E0D0C] text-white/70 px-5 md:px-10 pt-16 pb-8">
      <div className="grid md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
        <div className="md:col-span-1">
          <span className="text-lg tracking-widest text-white" style={{ fontFamily: "'Playfair Display', serif" }}>BLACK BUNNY</span>
          <p className="text-[13px] mt-4 max-w-[220px] leading-relaxed">Modern kimonos, reinterpreted through contemporary silhouettes and premium materials.</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="text-[11px] tracking-widest text-white/50 mb-4">{c.h}</p>
            <ul className="space-y-2.5">
              {c.items.map((i) => <li key={i}><button className="text-[13px] hover:text-white transition text-left">{i}</button></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-[11px]">
        <div className="flex gap-4">
          <select className="bg-transparent border border-white/20 px-3 py-1.5 text-[11px]"><option>United States</option><option>Nepal</option><option>United Kingdom</option></select>
          <select className="bg-transparent border border-white/20 px-3 py-1.5 text-[11px]"><option>NPR Rs</option><option>USD $</option><option>INR ₹</option></select>
        </div>
        <div className="flex gap-5">
          <button className="hover:text-white">Privacy Policy</button>
          <button className="hover:text-white">Terms</button>
          <span>© 2026 Black Bunny. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ============================== TOAST ============================== */
function Toast({ msg }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-6 py-3 text-[13px] tracking-wide transition-all duration-300 ${msg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      {msg}
    </div>
  );
}

/* ============================== HOMEPAGE HERO EDITOR ============================== */
function HeroEditor({ heroMedia, onSaveHero }) {
  const [type, setType] = useState(heroMedia?.type || "image");
  const [src, setSrc] = useState(heroMedia?.src || "");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressNote, setCompressNote] = useState("");
  const [skipCompress, setSkipCompress] = useState(false);
  const [quality, setQuality] = useState("balanced"); // smaller | balanced | high

  const QUALITY_PRESETS = {
    smaller: { maxWidth: 720, videoBitsPerSecond: 800000, maxDurationSec: 15, label: "Smaller file — loads fast, softer image" },
    balanced: { maxWidth: 1080, videoBitsPerSecond: 1800000, maxDurationSec: 12, label: "Balanced — good quality, moderate size" },
    high: { maxWidth: 1440, videoBitsPerSecond: 3200000, maxDurationSec: 8, label: "Higher quality — sharper, shorter clip needed to stay small" },
  };

  const handleFile = async (file) => {
    if (!file) return;
    setCompressNote("");
    if (type === "image") {
      const dataUrl = await resizeImageFile(file, 1600, 0.8);
      setSrc(dataUrl);
    } else if (skipCompress) {
      // Uses the file exactly as uploaded — smoother playback, but the file
      // stays whatever size it already is, so keep the source small.
      const reader = new FileReader();
      reader.onload = (ev) => setSrc(ev.target.result);
      reader.readAsDataURL(file);
      setCompressNote("Using your file as-is, uncompressed. If it doesn't save, it's likely too large — trim/compress it before uploading.");
    } else {
      setCompressing(true);
      const { dataUrl, compressed } = await compressVideoFile(file, QUALITY_PRESETS[quality]);
      setCompressing(false);
      if (dataUrl) {
        setSrc(dataUrl);
        setCompressNote(compressed ? `Compressed at "${QUALITY_PRESETS[quality].label}". Want it sharper? Try a higher quality setting below, or check "Skip auto-compression" with your own pre-edited file.` : "");
      } else {
        // Fallback: browser couldn't compress, so use the original file uncompressed.
        const reader = new FileReader();
        reader.onload = (ev) => setSrc(ev.target.result);
        reader.readAsDataURL(file);
        setCompressNote("Your browser couldn't auto-compress this — using the original file. If it's large, saving may fail; a shorter/smaller clip or a hosted URL works better.");
      }
    }
  };

  const save = async () => {
    setSaving(true);
    await onSaveHero(src ? { type, src } : null);
    setSaving(false);
  };

  const remove = async () => {
    setSrc("");
    setSaving(true);
    await onSaveHero(null);
    setSaving(false);
  };

  return (
    <div className="bg-white border border-black/10 mb-10">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex justify-between items-center px-6 py-4">
        <span className="text-[13px] tracking-widest">HOMEPAGE COVER — PHOTO OR VIDEO</span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4">
          <p className="text-[12px] text-[#8a8378] max-w-lg">This replaces the big banner at the very top of your homepage. Leave it empty to keep the default generated art.</p>

          <div className="flex gap-2">
            {["image", "video"].map((t) => (
              <button key={t} onClick={() => { setType(t); setSrc(""); }} className={`px-4 py-2 text-[11px] tracking-widest border ${type === t ? "bg-black text-white border-black" : "border-black/20"}`}>{t.toUpperCase()}</button>
            ))}
          </div>

          {src && (
            <div className="relative w-full max-w-md bg-black overflow-hidden" style={{ paddingTop: "56.25%" }}>
              <div className="absolute inset-0">
                {type === "video" ? <video src={src} className="w-full h-full object-cover" controls muted /> : <img src={src} alt="" className="w-full h-full object-cover" />}
              </div>
            </div>
          )}
          {compressing && <p className="text-[12px] text-[#8a8378]">Compressing your video… this runs right in your browser and can take a moment for longer clips.</p>}
          {compressNote && <p className="text-[12px] text-[#8a8378]">{compressNote}</p>}

          <div className="space-y-2">
            <label className="text-[11px] tracking-widest text-[#8a8378] block">
              {type === "video" ? "PASTE A VIDEO URL (recommended for longer/higher-quality clips)" : "PASTE AN IMAGE URL, OR UPLOAD BELOW"}
            </label>
            <input value={src.startsWith("data:") ? "" : src} onChange={(e) => setSrc(e.target.value)} placeholder="https://…" className="w-full border border-black/15 px-3 py-2 text-[13px]" />
          </div>

          <div>
            <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">
              {type === "video" ? "OR UPLOAD A CLIP — AUTO-COMPRESSED ON UPLOAD" : "OR UPLOAD A FILE"}
            </label>
            {type === "video" && !skipCompress && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {Object.entries(QUALITY_PRESETS).map(([key, p]) => (
                  <button key={key} type="button" onClick={() => setQuality(key)} className={`px-3 py-1.5 text-[11px] border ${quality === key ? "bg-black text-white border-black" : "border-black/20"}`}>{p.label}</button>
                ))}
              </div>
            )}
            <FileDropzone
              accept={type === "video" ? "video/*" : "image/*"}
              onFile={handleFile}
              hint={type === "video" ? "Drag & drop a video here, or" : "Drag & drop a photo here, or"}
            />
            {type === "video" && (
              <label className="flex items-center gap-2 text-[12px] mt-2">
                <input type="checkbox" checked={skipCompress} onChange={(e) => setSkipCompress(e.target.checked)} />
                Skip auto-compression (use if your video is already small/optimized, or if compressed playback looked choppy)
              </label>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving || compressing} className="bg-black text-white px-6 py-2.5 text-[12px] tracking-widest hover:bg-[#8C4A45] transition disabled:opacity-50">{saving ? "SAVING…" : "SAVE COVER"}</button>
            {heroMedia && <button onClick={remove} className="border border-black/20 px-4 py-2.5 text-[12px] tracking-widest text-[#8C4A45]">REMOVE / USE DEFAULT</button>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== ADMIN LOGIN ============================== */
function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        onLogin(data.key);
      } else {
        setError(data.error || "Incorrect username or password.");
      }
    } catch (err) {
      setError("Couldn't reach the server — check your connection and try again.");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-6">
      <form onSubmit={submit} className="bg-white border border-black/10 p-8 w-full max-w-sm">
        <p className="text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Store Admin</p>
        <p className="text-[12px] text-[#8a8378] mb-6">This page is private. Sign in to continue.</p>

        <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">USERNAME</label>
        <input required autoFocus value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-black/15 px-3 py-2 text-[13px] mb-4" />

        <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">PASSWORD</label>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-black/15 px-3 py-2 text-[13px] mb-5" />

        {error && <p className="text-[12px] text-[#8C4A45] mb-4">{error}</p>}

        <button type="submit" disabled={busy} className="w-full bg-black text-white py-3 text-[12px] tracking-widest hover:bg-[#8C4A45] transition disabled:opacity-50">
          {busy ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}

/* ============================== ADMIN ============================== */
function AdminPage({ products, onSave, onDelete, onBack, heroMedia, onSaveHero, onLogout }) {
  const emptyForm = { id: null, name: "", category: "Kimonos", style: "", collection: "", occasion: "Everyday", fabric: "", price: "", sizes: ["XS", "S", "M", "L", "XL"], colors: [{ n: "Ivory", h: "#F1E9DC" }], image: null, newArrival: false, bestSeller: false, limitedEdition: false, description: "" };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imgDragOver, setImgDragOver] = useState(false);

  const allSizes = ["XS", "S", "M", "L", "XL", "One Size"];
  const categories = ["Kimonos", "Dresses", "Sets", "Tops", "Bottoms", "Resortwear", "Accessories"];

  const startEdit = (p) => { setForm({ ...p, price: String(p.price) }); window.scrollTo(0, 0); };
  const resetForm = () => setForm(emptyForm);

  const handleImage = async (file) => {
    if (!file) return;
    const dataUrl = await resizeImageFile(file);
    setForm((f) => ({ ...f, image: dataUrl }));
  };

  const updateColor = (idx, key, val) => setForm((f) => {
    const colors = [...f.colors];
    colors[idx] = { ...colors[idx], [key]: val };
    return { ...f, colors };
  });
  const addColor = () => setForm((f) => (f.colors.length >= 4 ? f : { ...f, colors: [...f.colors, { n: "New Color", h: "#8C4A45" }] }));
  const removeColor = (idx) => setForm((f) => ({ ...f, colors: f.colors.filter((_, i) => i !== idx) }));
  const toggleSize = (s) => setForm((f) => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s] }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = form.id || (Math.max(0, ...products.map((p) => p.id)) + 1);
    const existing = products.find((p) => p.id === id) || {};
    const hue = existing.hue || JEWEL[id % JEWEL.length];
    const altHue = existing.altHue || JEWEL[(id + 3) % JEWEL.length];
    const product = {
      ...existing,
      id, slug,
      name: form.name, category: form.category, style: form.style, collection: form.collection,
      occasion: form.occasion, fabric: form.fabric, price: parseFloat(form.price) || 0,
      sizes: form.sizes.length ? form.sizes : ["One Size"],
      colors: form.colors.length ? form.colors : [{ n: "Default", h: hue }],
      image: form.image, hue, altHue,
      rating: existing.rating || "4.8",
      reviewCount: existing.reviewCount || 12,
      newArrival: form.newArrival, bestSeller: form.bestSeller, limitedEdition: form.limitedEdition,
      description: form.description || `A fluid piece crafted from ${form.fabric || "premium fabric"}.`,
      details: existing.details || ["Relaxed, fluid silhouette", `${form.fabric || "Premium fabric"}`, "Cut and sewn in small batches"],
    };
    setSaving(true);
    await onSave(product);
    setSaving(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] px-5 md:px-10 py-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>Store Admin</span>
        <div className="flex gap-4">
          <button onClick={onBack} className="text-[12px] tracking-widest underline underline-offset-4">← Back to Store</button>
          <button onClick={onLogout} className="text-[12px] tracking-widest text-[#8C4A45] underline underline-offset-4">Log out</button>
        </div>
      </div>
      <p className="text-[12px] text-[#8a8378] mb-8 max-w-lg">Changes save instantly to the live site for every visitor. Keep this page's link and login private.</p>

      <HeroEditor heroMedia={heroMedia} onSaveHero={onSaveHero} />

      <div className="grid lg:grid-cols-[380px_1fr] gap-10">
        <form onSubmit={submit} className="bg-white p-6 space-y-5 border border-black/10 h-fit">
          <p className="text-[12px] tracking-widest">{form.id ? "EDIT PRODUCT" : "NEW PRODUCT"}</p>

          <div>
            <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">COVER PHOTO</label>
            <label
              onDragOver={(e) => { e.preventDefault(); setImgDragOver(true); }}
              onDragLeave={() => setImgDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setImgDragOver(false); handleImage(e.dataTransfer.files[0]); }}
              className={`relative block w-full bg-[#F1E9DC] border-2 ${imgDragOver ? "border-black border-solid bg-black/5" : "border-black/15 border-dashed"} cursor-pointer overflow-hidden group transition`}
              style={{ paddingTop: "125%" }}
            >
              <div className="absolute inset-0">
                {form.image ? (
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#8a8378] text-[12px] gap-2 px-4 text-center">
                    <span>Drag & drop a photo here</span>
                    <span className="border border-black px-3 py-1.5 text-[11px] tracking-widest mt-1">CHOOSE FILE</span>
                    <span className="text-[10px] tracking-widest">JPG or PNG</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-[11px] tracking-widest border border-white px-3 py-1.5">{form.image ? "CHANGE PHOTO" : "UPLOAD PHOTO"}</span>
                </div>
              </div>
              <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files[0])} className="hidden" />
            </label>
            {form.image && (
              <button type="button" onClick={() => setForm((f) => ({ ...f, image: null }))} className="mt-2 text-[11px] text-[#8C4A45] underline underline-offset-4">Remove photo</button>
            )}
          </div>

          <div>
            <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">NAME</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-black/15 px-3 py-2 text-[13px]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">CATEGORY</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full border border-black/15 px-3 py-2 text-[13px]">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">PRICE (RS)</label>
              <input required type="number" min="0" step="1" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-full border border-black/15 px-3 py-2 text-[13px]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">STYLE</label>
              <select value={form.style} onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))} className="w-full border border-black/15 px-3 py-2 text-[13px]">
                <option value="">—</option>
                {KIMONO_STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">OCCASION</label>
              <select value={form.occasion} onChange={(e) => setForm((f) => ({ ...f, occasion: e.target.value }))} className="w-full border border-black/15 px-3 py-2 text-[13px]">
                {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">COLLECTION</label>
              <select value={form.collection} onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))} className="w-full border border-black/15 px-3 py-2 text-[13px]">
                <option value="">—</option>
                {COLLECTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">FABRIC</label>
              <input value={form.fabric} onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))} className="w-full border border-black/15 px-3 py-2 text-[13px]" placeholder="e.g. Silk, Rayon" />
            </div>
          </div>

          <div>
            <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">SIZES</label>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((s) => (
                <button type="button" key={s} onClick={() => toggleSize(s)} className={`px-3 py-1.5 text-[11px] border ${form.sizes.includes(s) ? "bg-black text-white border-black" : "border-black/20"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">COLORS</label>
            <div className="space-y-2">
              {form.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" value={c.h} onChange={(e) => updateColor(i, "h", e.target.value)} className="w-8 h-8 border border-black/15" />
                  <input value={c.n} onChange={(e) => updateColor(i, "n", e.target.value)} className="flex-1 border border-black/15 px-2 py-1.5 text-[12px]" placeholder="Color name" />
                  {form.colors.length > 1 && <button type="button" onClick={() => removeColor(i)} className="text-[#8a8378]"><X size={14} /></button>}
                </div>
              ))}
              {form.colors.length < 4 && <button type="button" onClick={addColor} className="text-[11px] underline underline-offset-4">+ Add color</button>}
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            {[["newArrival", "New Arrival"], ["bestSeller", "Best Seller"], ["limitedEdition", "Limited Edition"]].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-[12px]">
                <input type="checkbox" checked={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} />
                {label}
              </label>
            ))}
          </div>

          <div>
            <label className="text-[11px] tracking-widest text-[#8a8378] block mb-1.5">DESCRIPTION</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-black/15 px-3 py-2 text-[13px]" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 bg-black text-white py-3 text-[12px] tracking-widest hover:bg-[#8C4A45] transition disabled:opacity-50">
              {saving ? "SAVING…" : form.id ? "SAVE CHANGES" : "ADD PRODUCT"}
            </button>
            {form.id && <button type="button" onClick={resetForm} className="border border-black/20 px-4 text-[12px] tracking-widest">CANCEL</button>}
          </div>
        </form>

        <div>
          <p className="text-[12px] tracking-widest text-[#8a8378] mb-4">{products.length} PRODUCTS LIVE ON SITE</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} onClick={() => startEdit(p)} className="bg-white border border-black/10 p-3 cursor-pointer hover:border-black/30 transition">
                <div className="relative w-full overflow-hidden mb-2 bg-[#F1E9DC]" style={{ paddingTop: "125%" }}>
                  <div className="absolute inset-0">
                    <ProductImage p={p} hovered={false} pattern={0} />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/35 transition flex items-center justify-center opacity-0 hover:opacity-100">
                      <span className="text-white text-[10px] tracking-widest border border-white px-2.5 py-1">EDIT</span>
                    </div>
                  </div>
                </div>
                <p className="text-[13px] mb-0.5">{p.name}</p>
                <p className="text-[11px] text-[#8a8378] mb-2">{p.category} · {fmt(p.price)}</p>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); startEdit(p); }} className="flex-1 border border-black/20 py-1.5 text-[11px] tracking-widest hover:bg-black hover:text-white transition">EDIT</button>
                  <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete "${p.name}"?`)) onDelete(p.id); }} className="border border-black/20 px-3 py-1.5 text-[11px] text-[#8C4A45] hover:bg-[#8C4A45] hover:text-white transition">DELETE</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== APP ============================== */
// This is the only place your admin URL is set. Change it to something only
// you know before you launch — it's the "hidden link" that reaches Admin;
// nothing on the storefront links to it.
const ADMIN_PATH = "/bb-team-2026";

export default function App() {
  const isAdminRoute = typeof window !== "undefined" && window.location.pathname === ADMIN_PATH;
  const [view, setView] = useState(isAdminRoute ? "admin" : "home"); // home | collection | product | wishlist | admin
  const [activeCat, setActiveCat] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [activeSlug, setActiveSlug] = useState(null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState("");

  const [adminKey, setAdminKey] = useState(() => (typeof window !== "undefined" && sessionStorage.getItem("bb_admin_key")) || "");
  const [adminAuthed, setAdminAuthed] = useState(!!adminKey);

  const login = (key) => {
    sessionStorage.setItem("bb_admin_key", key);
    setAdminKey(key);
    setAdminAuthed(true);
  };
  const logout = () => {
    sessionStorage.removeItem("bb_admin_key");
    setAdminKey("");
    setAdminAuthed(false);
    window.history.pushState({}, "", "/");
    setView("home");
  };

  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [sheetStatus, setSheetStatus] = useState(SHEET_CSV_URL ? "loading" : "no-url");
  const [heroMedia, setHeroMedia] = useState(null);

  // Load the shared homepage cover (photo/video) from the server.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/hero");
        if (res.ok) {
          const data = await res.json();
          if (data && (data.src || data.stored)) setHeroMedia(data);
        }
      } catch (e) { /* API not set up yet, or offline */ }
    })();
  }, []);

  const saveHero = async (media) => {
    try {
      // A freshly-uploaded video comes in as a big inline data: URL. Embedding
      // that directly is what made playback unreliable on iPhone — instead,
      // upload the actual video bytes to a real file endpoint, and only save
      // a small pointer/metadata object.
      if (media && media.type === "video" && media.src && media.src.startsWith("data:")) {
        const commaIdx = media.src.indexOf(",");
        const header = media.src.slice(5, commaIdx); // strip "data:"
        const mimeType = header.split(";")[0] || "video/mp4";
        const base64 = media.src.slice(commaIdx + 1);
        const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        const videoRes = await fetch("/api/hero-video", {
          method: "POST",
          headers: { "x-admin-key": adminKey, "x-content-type": mimeType },
          body: binary,
        });
        if (videoRes.status === 401) { logout(); addToast("Session expired — please log in again"); return; }
        if (!videoRes.ok) { addToast("Couldn't save the video — it may be too large."); return; }

        const meta = { type: "video", stored: true, updatedAt: Date.now() };
        const metaRes = await fetch("/api/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
          body: JSON.stringify(meta),
        });
        if (metaRes.status === 401) { logout(); addToast("Session expired — please log in again"); return; }
        setHeroMedia(meta);
        addToast("Cover saved");
        return;
      }

      if (media === null) {
        // Removing the cover also clears any stored video file.
        fetch("/api/hero-video", { method: "DELETE", headers: { "x-admin-key": adminKey } }).catch(() => {});
      }

      setHeroMedia(media);
      const res = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(media),
      });
      if (res.status === 401) { logout(); addToast("Session expired — please log in again"); return; }
      addToast(media ? "Cover saved" : "Cover removed");
    } catch (e) { addToast("Couldn't save — check your connection"); }
  };

  // Load the shared product catalog from the server. Falls back to the
  // Google Sheet feed, then sample data, if the API isn't reachable yet.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            setSheetStatus("server");
            return;
          }
        }
      } catch (e) { /* API not set up yet, or offline */ }

      if (!SHEET_CSV_URL) return;
      fetch(SHEET_CSV_URL)
        .then((r) => { if (!r.ok) throw new Error("bad response"); return r.text(); })
        .then((text) => {
          const parsed = sheetRowsToProducts(parseCSV(text));
          if (parsed.length > 0) { setProducts(parsed); setSheetStatus("loaded"); }
          else setSheetStatus("empty");
        })
        .catch(() => setSheetStatus("error"));
    })();
  }, []);

  const persistProducts = async (list) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(list),
      });
      if (res.status === 401) { logout(); addToast("Session expired — please log in again"); return false; }
      return true;
    } catch (e) { addToast("Couldn't save — check your connection"); return false; }
  };
  const saveProduct = async (product) => {
    const idx = products.findIndex((p) => p.id === product.id);
    // Edits keep their spot; brand-new products go to the front so they show
    // up first in their category instead of buried at the end.
    const next = idx > -1 ? products.map((p) => (p.id === product.id ? product : p)) : [product, ...products];
    setProducts(next);
    setSheetStatus("server");
    const ok = await persistProducts(next);
    if (ok) addToast("Saved");
  };
  const deleteProduct = async (id) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    const ok = await persistProducts(next);
    if (ok) addToast("Product removed");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2000); };

  const goHome = () => { setView("home"); window.scrollTo(0, 0); };
  const goCollection = (cat, filters) => { setActiveCat(cat); setActiveFilters(filters || {}); setView("collection"); window.scrollTo(0, 0); };
  const openProduct = (slug) => { setActiveSlug(slug); setView("product"); window.scrollTo(0, 0); };
  const openWishlistPage = () => { setView("wishlist"); window.scrollTo(0, 0); };

  const toggleWish = (id) => setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);

  const addToCart = (p, size, color) => {
    setCart((c) => {
      const idx = c.findIndex((i) => i.id === p.id && i.size === size && i.color === color);
      if (idx > -1) { const next = [...c]; next[idx].qty += 1; return next; }
      return [...c, { ...p, size, color, qty: 1 }];
    });
  };
  const changeQty = (idx, delta) => setCart((c) => {
    const next = [...c];
    next[idx].qty += delta;
    return next.filter((i) => i.qty > 0);
  });
  const removeItem = (idx) => setCart((c) => c.filter((_, i) => i !== idx));

  const newArrivals = products.filter((p) => p.newArrival);
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <div className="min-h-screen bg-white text-[#0E0D0C]" style={{ fontFamily: "'Inter',sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet" />
      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none} .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      {!isAdminRoute && (
        <>
          <AnnouncementBar />
          <Header
            scrolled={scrolled} cartCount={cart.reduce((s, i) => s + i.qty, 0)} wishCount={wishlist.length}
            openCart={() => setCartOpen(true)} openSearch={() => setSearchOpen(true)} openWish={openWishlistPage}
            goHome={goHome} goCollection={goCollection} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
          />
          <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} goCollection={goCollection} />
        </>
      )}

      {view === "home" && (
        <>
          <Hero goCollection={goCollection} media={heroMedia} />
          <Carousel title="New Arrivals" products={newArrivals} onOpen={openProduct} wishlist={wishlist} toggleWish={toggleWish} viewAll={() => goCollection(null, { featured: "new" })} />
          <StyleTiles goCollection={goCollection} />
          <EditorialBanner goCollection={goCollection} />
          <OccasionTiles goCollection={goCollection} />
          <Carousel title="Most Loved" products={bestSellers} onOpen={openProduct} wishlist={wishlist} toggleWish={toggleWish} viewAll={() => goCollection(null, { featured: "best" })} />
          <FeaturedCollection goCollection={goCollection} />
          <Lookbook goCollection={goCollection} />
          <BrandStory />
          <SocialGallery />
          <Newsletter />
        </>
      )}

      {view === "collection" && (
        <CollectionPage products={products} activeCat={activeCat} activeFilters={activeFilters} onOpen={openProduct} wishlist={wishlist} toggleWish={toggleWish} addToast={addToast} />
      )}

      {view === "product" && (
        <ProductPage products={products} slug={activeSlug} onOpen={openProduct} addToCart={(p, s, c) => addToCart(p, s, c)} wishlist={wishlist} toggleWish={toggleWish} addToast={addToast} />
      )}

      {view === "wishlist" && (
        <WishlistPage products={products} wishlist={wishlist} onOpen={openProduct} toggleWish={toggleWish} addToCart={addToCart} addToast={addToast} />
      )}

      {view === "admin" && (
        adminAuthed
          ? <AdminPage products={products} onSave={saveProduct} onDelete={deleteProduct} onBack={goHome} heroMedia={heroMedia} onSaveHero={saveHero} onLogout={logout} />
          : <AdminLogin onLogin={login} />
      )}

      {view !== "admin" && <Footer goCollection={goCollection} />}

      <CartDrawer
        open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} changeQty={changeQty} removeItem={removeItem}
        goCheckoutToast={() => addToast("This is a portfolio demo — checkout isn't connected to real payment.")}
        goCollection={goCollection}
      />
      <SearchOverlay products={products} open={searchOpen} onClose={() => setSearchOpen(false)} onOpen={openProduct} />

      {sheetStatus === "no-url" && view !== "admin" && (
        <div className="fixed bottom-4 right-4 z-[110] bg-amber-100 border border-amber-300 text-amber-900 text-[11px] px-4 py-2.5 max-w-[260px] rounded shadow-lg">
          Showing sample products — the admin API isn't reachable yet, or your catalog is empty.
        </div>
      )}
      {sheetStatus === "error" && (
        <div className="fixed bottom-4 right-4 z-[110] bg-red-100 border border-red-300 text-red-900 text-[11px] px-4 py-2.5 max-w-[260px] rounded shadow-lg">
          Couldn't load your product sheet — showing sample products instead. Check that the sheet is published to the web as CSV.
        </div>
      )}
      <Toast msg={toast} />
    </div>
  );
}
