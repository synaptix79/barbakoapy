export const siteConfig = {
  name: "Barbakóa",
  tagline: "Texas Barbecue Paraguay",
  description:
    "Primer restaurante 100% dedicado a Texas Barbecue en Asunción, Paraguay. Carnes ahumadas por horas, pedidos por WhatsApp, catering y eventos.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://barbakoa.vercel.app",
  // TODO(cliente): reemplazar por el número real antes de publicar.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "595XXXXXXXXX",
  instagramUrl: "https://www.instagram.com/barbakoa.py/",
  facebookUrl: "https://www.facebook.com/barbakoa.py/",
  address: "Florida 1008 esq. Dr. Ciancio, Barrio Jara, Asunción",
  mapQuery:
    "Florida 1008 esq. Dr. Ciancio, Barrio Jara, Asuncion, Paraguay"
};

export const isWhatsappPlaceholder =
  siteConfig.whatsappNumber.includes("X") ||
  siteConfig.whatsappNumber === "595XXXXXXXXX";

export function formatGuarani(value: number) {
  return `Gs. ${new Intl.NumberFormat("es-PY", {
    maximumFractionDigits: 0
  }).format(value)}`;
}
