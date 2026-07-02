"use client";

import Image from "next/image";
import {
  Beef,
  CalendarHeart,
  Clock,
  ChevronRight,
  Facebook,
  Flame,
  Instagram,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Truck,
  Users,
  X,
  Sun,
  Moon
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent
} from "react";
import { formatGuarani, isWhatsappPlaceholder, siteConfig } from "@/lib/site";
import {
  menuCategories,
  type MenuCategory,
  type MenuExtra,
  type MenuItem,
  type MenuVariant
} from "@/lib/menu";

type DraftSelection = {
  quantity: number;
  variantId?: string;
  extraIds: string[];
};

type CartEntry = {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unit?: string;
  variant?: MenuVariant;
  extras: MenuExtra[];
  categoryName: string;
};

type MenuEntry = {
  item: MenuItem;
  category: MenuCategory;
};

const steps = [
  {
    title: "Elegí",
    copy: "Sumá ahumados, sandwiches y acompañamientos al pedido.",
    icon: ShoppingBag
  },
  {
    title: "Ajustá",
    copy: "Confirmá cantidades antes de enviar el mensaje.",
    icon: Plus
  },
  {
    title: "Coordiná",
    copy: "El equipo confirma disponibilidad, tiempo y forma de entrega.",
    icon: MessageCircle
  }
];

const allCategory = {
  id: "todo",
  name: "Todo",
  description: "Todo el menú 2026 S01 disponible para armar tu pedido."
};

function isParaguayHappyHour(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Asuncion",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  const minutes = hour * 60 + minute;

  return (
    (weekday === "Thu" || weekday === "Fri") &&
    minutes >= 18 * 60 &&
    minutes <= 20 * 60 + 30
  );
}

function getDefaultSelection(item: MenuItem): DraftSelection {
  return {
    quantity: 0,
    variantId: item.variants?.[0]?.id,
    extraIds: []
  };
}

function getVariant(item: MenuItem, selection: DraftSelection) {
  return item.variants?.find((variant) => variant.id === selection.variantId);
}

function getBasePrice(item: MenuItem, selection: DraftSelection, isHappyHour: boolean) {
  const variant = getVariant(item, selection);
  if (variant) return variant.price;
  if (isHappyHour && item.happyHourPrice) return item.happyHourPrice;
  return item.price ?? 0;
}

function getSelectedExtras(category: MenuCategory, selection: DraftSelection) {
  return (
    category.extras?.filter((extra) => selection.extraIds.includes(extra.id)) ?? []
  );
}

function getUnitPrice(
  item: MenuItem,
  category: MenuCategory,
  selection: DraftSelection,
  isHappyHour: boolean
) {
  return (
    getBasePrice(item, selection, isHappyHour) +
    getSelectedExtras(category, selection).reduce((sum, extra) => sum + extra.price, 0)
  );
}

function getLineName(entry: CartEntry) {
  const variant = entry.variant ? ` (${entry.variant.name})` : "";
  const extras =
    entry.extras.length > 0
      ? ` + ${entry.extras.map((extra) => extra.name).join(" + ")}`
      : "";
  return `${entry.name}${variant}${extras}`;
}

function buildWhatsAppMessage(entries: CartEntry[]) {
  if (entries.length === 0) {
    return "¡Hola Barbakóa! 🔥 Quiero hacer un pedido. ¿Me pasan el menú disponible de hoy?";
  }

  const lines = entries.map(
    (entry) =>
      `- ${entry.quantity}x ${getLineName(entry)} - ${formatGuarani(
        entry.unitPrice * entry.quantity
      )}`
  );
  const total = entries.reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0);

  return [
    "¡Hola Barbakóa! 🔥 Quiero hacer este pedido:",
    "",
    ...lines,
    "",
    `Total: ${formatGuarani(total)}`,
    "",
    "¿Me confirman disponibilidad y tiempo de entrega?"
  ].join("\n");
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(allCategory.id);
  const [draftSelections, setDraftSelections] = useState<
    Record<string, DraftSelection>
  >({});
  const [cart, setCart] = useState<Record<string, CartEntry>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [isHappyHour, setIsHappyHour] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const categoryScrollerRef = useRef<HTMLDivElement>(null);
  const categoryDragRef = useRef({
    isDragging: false,
    moved: false,
    startX: 0,
    scrollLeft: 0
  });

  useEffect(() => {
    const updateHappyHour = () => setIsHappyHour(isParaguayHappyHour());
    updateHappyHour();
    const interval = window.setInterval(updateHappyHour, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("barbakoa-theme") as "dark" | "light" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("barbakoa-theme", theme);
  }, [theme]);

  const categoryTabs = [allCategory, ...menuCategories];
  const activeCategoryData = menuCategories.find(
    (category) => category.id === activeCategory
  );
  const activeEntries: MenuEntry[] =
    activeCategory === allCategory.id
      ? menuCategories.flatMap((category) =>
          category.items.map((item) => ({ item, category }))
        )
      : (activeCategoryData?.items ?? []).map((item) => ({
          item,
          category: activeCategoryData as MenuCategory
        }));
  const activeDescription =
    activeCategory === allCategory.id
      ? allCategory.description
      : activeCategoryData?.note ?? "Elegí tus productos y sumalos al pedido.";

  const cartEntries = useMemo<CartEntry[]>(() => Object.values(cart), [cart]);

  const itemCount = cartEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const cartTotal = cartEntries.reduce(
    (sum, entry) => sum + entry.unitPrice * entry.quantity,
    0
  );
  const totalLabel = itemCount === 0 ? "Pedido vacío" : formatGuarani(cartTotal);

  function handleCategoryPointerDown(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    if (event.button !== 0 || !categoryScrollerRef.current) return;
    categoryDragRef.current = {
      isDragging: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: categoryScrollerRef.current.scrollLeft
    };
  }

  function handleCategoryPointerMove(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    const drag = categoryDragRef.current;
    const scroller = categoryScrollerRef.current;
    if (!drag.isDragging || !scroller) return;

    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 4) {
      drag.moved = true;
      if (!scroller.hasPointerCapture(event.pointerId)) {
        scroller.setPointerCapture(event.pointerId);
      }
    }
    scroller.scrollLeft = drag.scrollLeft - delta;
  }

  function handleCategoryPointerEnd(
    event: ReactPointerEvent<HTMLDivElement>
  ) {
    const scroller = categoryScrollerRef.current;
    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
    categoryDragRef.current.isDragging = false;
    window.setTimeout(() => {
      categoryDragRef.current.moved = false;
    }, 0);
  }

  function handleCategoryClick(
    event: ReactMouseEvent<HTMLButtonElement>,
    categoryId: string
  ) {
    if (categoryDragRef.current.moved) {
      event.preventDefault();
      return;
    }
    setActiveCategory(categoryId);
  }

  function getSelection(item: MenuItem) {
    return draftSelections[item.id] ?? getDefaultSelection(item);
  }

  function updateDraftQuantity(item: MenuItem, delta: number) {
    setDraftSelections((current) => {
      const selection = current[item.id] ?? getDefaultSelection(item);
      return {
        ...current,
        [item.id]: {
          ...selection,
          quantity: Math.max(0, Math.min(99, selection.quantity + delta))
        }
      };
    });
  }

  function selectVariant(item: MenuItem, variantId: string) {
    setDraftSelections((current) => ({
      ...current,
      [item.id]: {
        ...(current[item.id] ?? getDefaultSelection(item)),
        variantId
      }
    }));
  }

  function toggleExtra(item: MenuItem, extraId: string) {
    setDraftSelections((current) => {
      const selection = current[item.id] ?? getDefaultSelection(item);
      const extraIds = selection.extraIds.includes(extraId)
        ? selection.extraIds.filter((id) => id !== extraId)
        : [...selection.extraIds, extraId];

      return {
        ...current,
        [item.id]: {
          ...selection,
          extraIds
        }
      };
    });
  }

  function addOneToCart(entry: MenuEntry) {
    const { item, category } = entry;
    const selection = getSelection(item);
    const variant = getVariant(item, selection);
    const extras = getSelectedExtras(category, selection);
    const unitPrice = getUnitPrice(item, category, selection, isHappyHour);
    const lineId = [
      item.id,
      variant?.id ?? "base",
      extras.map((extra) => extra.id).sort().join("+") || "sin-extras",
      unitPrice
    ].join("|");

    setCart((current) => {
      const existing = current[lineId];
      return {
        ...current,
        [lineId]: existing
          ? { ...existing, quantity: Math.min(99, existing.quantity + 1) }
          : {
              id: lineId,
              itemId: item.id,
              name: item.name,
              quantity: 1,
              unitPrice,
              unit: item.unit,
              variant,
              extras,
              categoryName: category.name
            }
      };
    });
  }

  function addToCart(entry: MenuEntry) {
    addOneToCart(entry);
  }

  function updateCartQuantity(id: string, delta: number) {
    setCart((current) => {
      const existing = current[id];
      if (!existing) return current;
      const nextQuantity = existing.quantity + delta;
      const next = { ...current };
      if (nextQuantity <= 0) {
        delete next[id];
      } else {
        next[id] = {
          ...existing,
          quantity: Math.min(99, nextQuantity)
        };
      }
      return next;
    });
  }

  function openWhatsApp() {
    const message = buildWhatsAppMessage(cartEntries);
    window.location.href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
  }

  function scrollToMenu() {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-pit pb-24 text-bone md:pb-0">
      <Header onOrderClick={openWhatsApp} theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />

      <section className="hero-shell relative isolate min-h-[78svh] border-b border-bone/10 px-4 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[calc(78svh-6rem)] w-full max-w-[92rem] items-center gap-10 pb-12 pt-10 lg:grid-cols-[1fr_0.72fr]">
          <div className="w-full min-w-0 max-w-full">
            <ResponsiveLogo
              alt="Logo oficial de Barbakóa"
              width={112}
              height={112}
              priority
              className="mb-6 h-24 w-24 rounded-full border border-bone/20 object-cover shadow-ember"
            />
            <p className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-bone/20 bg-pit/65 px-4 text-sm font-semibold uppercase tracking-[0.22em] text-brass backdrop-blur">
              <Flame aria-hidden className="h-4 w-4 text-ember" />
              {siteConfig.tagline}
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-black uppercase leading-[0.95] text-bone sm:text-7xl lg:text-8xl">
              Barbakóa
            </h1>
            <p className="mt-5 w-full max-w-2xl break-words text-lg leading-8 text-bone/82 md:text-xl">
              Backyard barbecue americano en Barrio Jara: brisket, pulled pork,
              ribs, pastrami y burgers ahumados por horas, hechos para pedir y
              coordinar por WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToMenu}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-ember px-5 py-3 text-base font-black uppercase text-white shadow-ember transition hover:bg-[#D21F2B] focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pit"
              >
                <ShoppingBag aria-hidden className="h-5 w-5" />
                Ver menú
              </button>
              <button
                type="button"
                onClick={openWhatsApp}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded border border-bone/25 bg-bone/10 px-5 py-3 text-base font-black uppercase text-bone backdrop-blur transition hover:bg-bone/18 focus:outline-none focus:ring-2 focus:ring-bone focus:ring-offset-2 focus:ring-offset-pit"
              >
                <MessageCircle aria-hidden className="h-5 w-5" />
                Pedí por WhatsApp
              </button>
            </div>
          </div>
          <div className="grid gap-5 border-t border-bone/12 pt-7 text-bone/74 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-brass">
                2019
              </p>
              <p className="mt-1 text-lg font-semibold text-bone">
                Empezó como hobby de dos amigos de colegio.
              </p>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-brass">
                Barrio Jara
              </p>
              <p className="mt-1 text-lg font-semibold text-bone">
                Patio, humo y servicio directo en Florida 1008.
              </p>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-brass">
                Eventos
              </p>
              <p className="mt-1 text-lg font-semibold text-bone">
                Catering y privados desde 25 personas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="historia" className="wood-texture px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brass">
              Nosotros
            </p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight text-bone sm:text-5xl">
              Humo de patio, técnica de Texas, carne paraguaya.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-bone/78 sm:text-lg">
            <p>
              Barbakóa empezó en 2019 como el hobby de Fernando Samaniego y
              Franco Scappini, dos amigos de colegio que se juntaban los domingos
              a experimentar con un ahumador.
            </p>
            <p>
              En 2020 se formalizó como Chanchino BBQ y después evolucionó a
              Barbakóa, mezclando el Texas Barbecue con un guiño al guaraní. Hoy
              el local funciona en el patio de una casa en Barrio Jara y mantiene
              esa idea de asado de domingo, pero con horas de humo y paciencia.
            </p>
          </div>
        </div>
      </section>

      <section id="menu" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[92rem]">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brass">
                Menú
              </p>
              <h2 className="font-display text-4xl font-black uppercase leading-tight text-bone sm:text-5xl">
                Armá tu pedido
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-bone/70">
              Menú Nuevo 2026 S01 con precios reales. Disponibilidad sujeta al
              día y confirmación por WhatsApp.
            </p>
          </div>

          <div className="relative mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
            <div
              ref={categoryScrollerRef}
              className="no-scrollbar flex cursor-grab select-none gap-2 overflow-x-auto overscroll-x-contain px-4 pb-3 pr-14 active:cursor-grabbing sm:px-6 sm:pr-16 lg:px-8 lg:pr-20"
              aria-label="Categorías del menú"
              onPointerDown={handleCategoryPointerDown}
              onPointerMove={handleCategoryPointerMove}
              onPointerUp={handleCategoryPointerEnd}
              onPointerCancel={handleCategoryPointerEnd}
              onDragStart={(event) => event.preventDefault()}
            >
              {categoryTabs.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={(event) => handleCategoryClick(event, category.id)}
                  className={`min-h-11 shrink-0 rounded border px-4 text-sm font-black uppercase transition focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pit ${
                    activeCategory === category.id
                      ? "border-ember bg-ember text-white"
                      : "border-bone/15 bg-bone/5 text-bone/76 hover:border-bone/35 hover:bg-bone/10"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-pit via-pit/88 to-transparent lg:w-20" />
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex min-h-14 items-center gap-3 rounded border border-bone/12 bg-bone/6 px-4 py-3 text-sm font-semibold text-bone/76">
              <Clock aria-hidden className="h-5 w-5 shrink-0 text-brass" />
              <span>La cocina cierra a las 23hs. El local cierra a las 24hs.</span>
            </div>
            <div
              className={`flex min-h-14 flex-wrap items-center justify-between gap-2 rounded border px-4 py-3 text-sm font-semibold ${
                isHappyHour
                  ? "border-ember/45 bg-ember/15 text-bone"
                  : "border-bone/12 bg-bone/6 text-bone/70"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Flame aria-hidden className="h-5 w-5 shrink-0 text-ember" />
                Happy hour jueves y viernes 18:00-20:30
              </span>
              <span className="rounded bg-pit/70 px-2 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-brass">
                {isHappyHour ? "Activo ahora" : "Fuera de horario"}
              </span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem] 2xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <div className="mb-5 flex items-center gap-3 text-sm text-bone/68">
                <Beef aria-hidden className="h-5 w-5 text-ember" />
                <span>
                  {activeDescription}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-5">
                {activeEntries.map((entry) => {
                  const { item, category } = entry;
                  const selection = getSelection(item);
                  const selectedVariant = getVariant(item, selection);
                  const unitPrice = getUnitPrice(
                    item,
                    category,
                    selection,
                    isHappyHour
                  );
                  const hasHappyHourPrice =
                    Boolean(item.happyHourPrice) && isHappyHour && !selectedVariant;
                  const cartLineId = [
                    item.id,
                    selectedVariant?.id ?? "base",
                    selection.extraIds.slice().sort().join("+") || "sin-extras",
                    unitPrice
                  ].join("|");
                  const cartQty = cart[cartLineId]?.quantity ?? 0;

                  return (
                    <article
                      key={`${category.id}-${item.id}`}
                      className="flex min-h-[22rem] flex-col rounded border border-bone/12 bg-card p-4 shadow-[0_18px_50px_rgba(0,0,0,0.24)] transition hover:border-ember/45 xl:min-h-[19.5rem] xl:p-3 2xl:min-h-[20.5rem] 2xl:p-4"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded border border-ember/35 bg-ember/12 text-ember xl:mb-3 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12">
                        <Beef aria-hidden className="h-6 w-6 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap gap-2">
                              {activeCategory === allCategory.id && (
                                <span className="rounded bg-bone/8 px-2 py-1 text-[0.66rem] font-black uppercase tracking-[0.1em] text-bone/58">
                                  {category.name}
                                </span>
                              )}
                              {category.note && (
                                <span className="rounded bg-brass/12 px-2 py-1 text-[0.66rem] font-black uppercase tracking-[0.1em] text-brass">
                                  {category.note}
                                </span>
                              )}
                              {item.badge && (
                                <span className="rounded bg-ember/14 px-2 py-1 text-[0.66rem] font-black uppercase tracking-[0.1em] text-ember">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <h3 className="font-display text-2xl font-black leading-tight text-bone xl:text-xl 2xl:text-2xl">
                              {item.name}
                            </h3>
                          </div>
                          <div className="shrink-0 text-right">
                            {hasHappyHourPrice && item.price ? (
                              <>
                                <span className="block text-[0.66rem] font-black uppercase tracking-[0.12em] text-ember">
                                  Happy hour
                                </span>
                                <span className="block text-xs font-bold text-bone/42 line-through">
                                  {formatGuarani(item.price)}
                                </span>
                              </>
                            ) : (
                              <span className="block text-[0.66rem] font-black uppercase tracking-[0.12em] text-brass">
                                Precio
                              </span>
                            )}
                            <span className="block text-base font-black text-brass xl:text-sm 2xl:text-base">
                              {formatGuarani(unitPrice)}
                            </span>
                            {item.unit && (
                              <span className="block text-[0.66rem] font-black uppercase tracking-[0.12em] text-bone/45">
                                {item.unit}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-bone/68 xl:text-[0.82rem] xl:leading-5 2xl:text-sm 2xl:leading-6">
                          {item.description ?? "Disponible para sumar al pedido."}
                        </p>
                        {item.variants && (
                          <div className="mt-4 grid gap-2">
                            {item.variants.map((variant) => {
                              const selected = selectedVariant?.id === variant.id;

                              return (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={() => selectVariant(item, variant.id)}
                                  className={`flex min-h-10 items-center justify-between gap-3 rounded border px-3 text-left text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-card xl:min-h-9 xl:px-2 xl:text-xs 2xl:min-h-10 2xl:px-3 2xl:text-sm ${
                                    selected
                                      ? "border-ember bg-ember/16 text-bone"
                                      : "border-bone/12 bg-pit/45 text-bone/70 hover:border-bone/30"
                                  }`}
                                >
                                  <span className="min-w-0">{variant.name}</span>
                                  <span className="shrink-0 text-brass">
                                    {formatGuarani(variant.price)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {category.extras && (
                          <div className="mt-4 space-y-2 rounded border border-bone/10 bg-pit/35 p-3 xl:mt-3 xl:p-2 2xl:mt-4 2xl:p-3">
                            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-bone/50">
                              Extras
                            </p>
                            {category.extras.map((extra) => {
                              const checked = selection.extraIds.includes(extra.id);

                              return (
                                <label
                                  key={extra.id}
                                  className="flex min-h-9 cursor-pointer items-center gap-2 text-xs font-semibold text-bone/74"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleExtra(item, extra.id)}
                                    className="sr-only"
                                  />
                                  <span
                                    className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${
                                      checked
                                        ? "border-ember bg-ember"
                                        : "border-bone/20 bg-bone/5"
                                    }`}
                                    aria-hidden
                                  >
                                    {checked && (
                                      <span className="h-2.5 w-2.5 rounded-sm bg-white" />
                                    )}
                                  </span>
                                  <span className="min-w-0 flex-1">{extra.name}</span>
                                  <span className="shrink-0 text-brass">
                                    +{formatGuarani(extra.price)}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                        <div className="mt-auto pt-5 xl:pt-4 2xl:pt-5">
                          {cartQty === 0 ? (
                            <button
                              type="button"
                              onClick={() => addToCart(entry)}
                              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-bone text-sm font-black uppercase text-charcoal transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-bone focus:ring-offset-2 focus:ring-offset-card xl:min-h-10 xl:text-xs 2xl:min-h-11 2xl:text-sm"
                            >
                              <Plus aria-hidden className="h-4 w-4" />
                              Agregar
                            </button>
                          ) : (
                            <div className="grid h-11 grid-cols-[2.75rem_1fr_2.75rem] overflow-hidden rounded bg-ember xl:h-10 2xl:h-11">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(cartLineId, -1)}
                                className="grid place-items-center text-white transition hover:bg-black/15 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50"
                                aria-label={`Restar ${item.name}`}
                              >
                                <Minus aria-hidden className="h-4 w-4" />
                              </button>
                              <span className="grid place-items-center text-sm font-black text-white">
                                {cartQty}
                              </span>
                              <button
                                type="button"
                                onClick={() => addOneToCart(entry)}
                                className="grid place-items-center text-white transition hover:bg-black/15 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50"
                                aria-label={`Sumar ${item.name}`}
                              >
                                <Plus aria-hidden className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="hidden xl:block">
              <CartPanel
                entries={cartEntries}
                totalLabel={totalLabel}
                onChangeQuantity={updateCartQuantity}
                onSend={openWhatsApp}
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-bone/10 bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[92rem]">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brass">
            Cómo pedís
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="border-l border-bone/14 py-2 pl-5"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded bg-ember text-white">
                    <Icon aria-hidden className="h-6 w-6" />
                  </div>
                  <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-brass">
                    Paso {index + 1}
                  </p>
                  <h3 className="font-display text-3xl font-black uppercase text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-bone/68">{step.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="eventos" className="smoke-ring relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brass">
              Catering y eventos
            </p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight text-bone sm:text-5xl">
              El ahumador también va a tu evento.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-bone/74 sm:text-lg">
              Barbakóa ofrece catering y eventos privados desde 25 personas,
              ideal para mesas grandes, cumpleaños, equipos y encuentros donde el
              centro sea la carne ahumada.
            </p>
          </div>
          <div className="flex flex-col gap-3 border border-bone/12 bg-bone/5 p-5">
            <div className="flex items-center gap-3 text-bone">
              <Users aria-hidden className="h-6 w-6 text-ember" />
              <span className="font-black uppercase">Desde 25 personas</span>
            </div>
            <button
              type="button"
              onClick={openWhatsApp}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-ember px-5 py-3 text-base font-black uppercase text-white transition hover:bg-[#D21F2B] focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pit"
            >
              <CalendarHeart aria-hidden className="h-5 w-5" />
              Cotizar evento
            </button>
          </div>
        </div>
      </section>

      <section id="delivery" className="wood-texture border-y border-bone/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <div className="flex h-36 items-center justify-center border border-bone/12 bg-pit/45">
            <Truck aria-hidden className="h-16 w-16 text-ember" />
          </div>
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brass">
              Delivery
            </p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight text-bone">
              Canales alternativos a confirmar.
            </h2>
            <p className="mt-4 text-base leading-8 text-bone/74">
              El sitio deja preparado el espacio para mencionar Monchis y
              PedidosYa una vez que el cliente confirme que siguen vigentes. No se
              muestran logos oficiales hasta tener esa aprobación.
            </p>
          </div>
        </div>
      </section>

      <section id="contacto" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-brass">
              Ubicación y contacto
            </p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight text-bone sm:text-5xl">
              Barrio Jara, Asunción.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-bone/76">
              <p className="flex gap-3">
                <MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-ember" />
                <span>{siteConfig.address}</span>
              </p>
              <p>
                Horarios a confirmar con el cliente antes de publicar. El flujo
                principal del sitio queda preparado para coordinar disponibilidad
                directamente por WhatsApp.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded border border-bone/18 px-4 text-sm font-black uppercase text-bone transition hover:bg-bone/10 focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pit"
              >
                <Instagram aria-hidden className="h-5 w-5" />
                Instagram
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded border border-bone/18 px-4 text-sm font-black uppercase text-bone transition hover:bg-bone/10 focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pit"
              >
                <Facebook aria-hidden className="h-5 w-5" />
                Facebook
              </a>
            </div>
          </div>
          <div className="min-h-80 overflow-hidden rounded border border-bone/12 bg-bone/5">
            <iframe
              title="Mapa de Barbakóa en Barrio Jara"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                siteConfig.mapQuery
              )}&output=embed`}
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-bone/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-4 text-sm text-bone/60 sm:flex-row sm:items-center sm:justify-between">
          <a href="#" className="flex items-center gap-3 hover:opacity-80 transition">
            <ResponsiveLogo
              alt="Logo de Barbakóa"
              width={44}
              height={44}
              className="rounded-full border border-bone/20"
            />
            <span>© 2026 Barbakóa. Texas Barbecue Paraguay.</span>
          </a>
          <div className="flex flex-wrap gap-3">
            <a href={siteConfig.instagramUrl} className="hover:text-bone">
              Instagram
            </a>
            <a href={siteConfig.facebookUrl} className="hover:text-bone">
              Facebook
            </a>
            <a href="https://synaptixofficial.com" target="_blank" rel="noreferrer" className="hover:text-bone">
              Desarrollado por Synaptix
            </a>
          </div>
        </div>
      </footer>

      {itemCount > 0 && (
        <MobileCartBar
          itemCount={itemCount}
          totalLabel={totalLabel}
          onOpenCart={() => setCartOpen(true)}
          onSend={openWhatsApp}
        />
      )}

      {cartOpen && (
        <CartDrawer
          entries={cartEntries}
          totalLabel={totalLabel}
          onClose={() => setCartOpen(false)}
          onChangeQuantity={updateCartQuantity}
          onSend={openWhatsApp}
        />
      )}
    </main>
  );
}

function ResponsiveLogo({
  alt,
  width,
  height,
  className,
  priority = false
}: {
  alt: string;
  width: number;
  height: number;
  className: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/assets/barbakoa-logo-desktop.jpg"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}

function Header({ onOrderClick, theme, onToggleTheme }: {
  onOrderClick: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-bone/10 bg-pit/82 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex h-20 max-w-[92rem] items-center justify-between gap-4">
        <a href="#" className="flex min-w-0 items-center gap-3">
          <ResponsiveLogo
            alt="Logo de Barbakóa"
            width={48}
            height={48}
            priority
            className="rounded-full border border-bone/18"
          />
          <span className="min-w-0 font-display text-xl font-black uppercase tracking-[0.08em] text-bone">
            Barbakóa
          </span>
        </a>
        <nav className="hidden items-center gap-5 text-sm font-bold uppercase tracking-[0.12em] text-bone/64 md:flex">
          <a className="transition hover:text-bone" href="#menu">
            Menú
          </a>
          <a className="transition hover:text-bone" href="#eventos">
            Eventos
          </a>
          <a className="transition hover:text-bone" href="#contacto">
            Contacto
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid h-9 w-9 place-items-center rounded border border-bone/20 bg-bone/8 text-bone/70 transition hover:bg-bone/15 hover:text-bone focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pit"
            aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          >
            {theme === "dark" ? <Sun aria-hidden className="h-4 w-4" /> : <Moon aria-hidden className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onOrderClick}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded bg-ember px-4 text-sm font-black uppercase text-white transition hover:bg-[#D21F2B] focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-pit"
          >
            <MessageCircle aria-hidden className="h-5 w-5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function CartPanel({
  entries,
  totalLabel,
  onChangeQuantity,
  onSend
}: {
  entries: CartEntry[];
  totalLabel: string;
  onChangeQuantity: (id: string, delta: number) => void;
  onSend: () => void;
}) {
  return (
    <div className="sticky top-28 rounded border border-bone/12 bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl font-black uppercase text-bone">
          Tu pedido
        </h3>
        {isWhatsappPlaceholder && (
          <span className="whatsapp-pending-badge rounded bg-coalred px-2 py-1 text-[0.64rem] font-black uppercase tracking-[0.12em] text-bone">
            WhatsApp pendiente
          </span>
        )}
      </div>
      <CartLines entries={entries} onChangeQuantity={onChangeQuantity} />
      <div className="mt-5 border-t border-bone/10 pt-4">
        <div className="mb-4 flex items-center justify-between gap-4 text-sm">
          <span className="uppercase tracking-[0.16em] text-bone/54">Total</span>
          <span className="font-black text-brass">{totalLabel}</span>
        </div>
        <button
          type="button"
          onClick={onSend}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-ember px-4 font-black uppercase text-white transition hover:bg-[#D21F2B] focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-card"
        >
          <Send aria-hidden className="h-5 w-5" />
          Enviar por WhatsApp
        </button>
      </div>
    </div>
  );
}

function CartLines({
  entries,
  onChangeQuantity
}: {
  entries: CartEntry[];
  onChangeQuantity: (id: string, delta: number) => void;
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded border border-dashed border-bone/18 p-4 text-sm leading-6 text-bone/62">
        Podés enviar un saludo directo o agregar productos para armar el mensaje.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const lineTotal = entry.unitPrice * entry.quantity;
        const unitLabel = entry.unit
          ? `${formatGuarani(entry.unitPrice)} ${entry.unit}`
          : `${formatGuarani(entry.unitPrice)} c/u`;

        return (
          <div
            key={entry.id}
            className="grid grid-cols-[1fr_auto] gap-3 border-b border-bone/8 pb-3"
          >
            <div className="min-w-0">
              <p className="truncate font-black text-bone">{entry.name}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-brass">
                {entry.categoryName}
              </p>
              {entry.variant && (
                <p className="mt-1 text-xs text-bone/62">{entry.variant.name}</p>
              )}
              {entry.extras.length > 0 && (
                <p className="mt-1 text-xs text-bone/62">
                  + {entry.extras.map((extra) => extra.name).join(" + ")}
                </p>
              )}
              <p className="mt-2 text-sm font-black text-brass">
                {formatGuarani(lineTotal)}
              </p>
              <p className="text-xs text-bone/45">{unitLabel}</p>
            </div>
            <div className="grid h-10 grid-cols-[2.25rem_2rem_2.25rem] overflow-hidden rounded border border-bone/16 bg-pit">
              <button
                type="button"
                onClick={() => onChangeQuantity(entry.id, -1)}
                className="grid place-items-center text-bone/80 transition hover:bg-bone/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ember"
                aria-label={`Restar ${entry.name} del pedido`}
              >
                <Minus aria-hidden className="h-4 w-4" />
              </button>
              <span className="grid place-items-center text-sm font-black">
                {entry.quantity}
              </span>
              <button
                type="button"
                onClick={() => onChangeQuantity(entry.id, 1)}
                className="grid place-items-center text-bone/80 transition hover:bg-bone/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ember"
                aria-label={`Sumar ${entry.name} al pedido`}
              >
                <Plus aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileCartBar({
  itemCount,
  totalLabel,
  onOpenCart,
  onSend
}: {
  itemCount: number;
  totalLabel: string;
  onOpenCart: () => void;
  onSend: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bone/12 bg-pit/92 p-3 backdrop-blur-xl xl:hidden">
      <div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto] gap-3">
        <button
          type="button"
          onClick={onOpenCart}
          className="flex min-h-12 min-w-0 items-center justify-between gap-3 rounded border border-bone/14 bg-bone/8 px-4 text-left focus:outline-none focus:ring-2 focus:ring-ember"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-black text-bone">
              {itemCount} {itemCount === 1 ? "ítem" : "ítems"}
            </span>
            <span className="block truncate text-xs uppercase tracking-[0.12em] text-brass">
              {totalLabel}
            </span>
          </span>
          <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-bone/70" />
        </button>
        <button
          type="button"
          onClick={onSend}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-ember px-4 font-black uppercase text-white transition hover:bg-[#D21F2B] focus:outline-none focus:ring-2 focus:ring-ember"
          aria-label="Enviar pedido por WhatsApp"
        >
          <Send aria-hidden className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function CartDrawer({
  entries,
  totalLabel,
  onClose,
  onChangeQuantity,
  onSend
}: {
  entries: CartEntry[];
  totalLabel: string;
  onClose: () => void;
  onChangeQuantity: (id: string, delta: number) => void;
  onSend: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm xl:hidden" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full max-w-md flex-col rounded border border-bone/12 bg-card p-5 shadow-ember">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl font-black uppercase text-bone">
              Tu pedido
            </h3>
            {isWhatsappPlaceholder && (
              <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-brass">
                Reemplazar número de WhatsApp antes de publicar
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded border border-bone/14 text-bone transition hover:bg-bone/10 focus:outline-none focus:ring-2 focus:ring-ember"
            aria-label="Cerrar pedido"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <CartLines entries={entries} onChangeQuantity={onChangeQuantity} />
        </div>
        <div className="mt-5 border-t border-bone/10 pt-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="text-sm uppercase tracking-[0.16em] text-bone/54">
              Total
            </span>
            <span className="font-black text-brass">{totalLabel}</span>
          </div>
          <button
            type="button"
            onClick={onSend}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-ember px-4 font-black uppercase text-white transition hover:bg-[#D21F2B] focus:outline-none focus:ring-2 focus:ring-ember focus:ring-offset-2 focus:ring-offset-card"
          >
            <Send aria-hidden className="h-5 w-5" />
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

