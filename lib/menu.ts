export type MenuVariant = {
  id: string;
  name: string;
  price: number;
};

export type MenuExtra = {
  id: string;
  name: string;
  price: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  happyHourPrice?: number;
  unit?: string;
  badge?: "vegetariano" | "recomendado";
  variants?: MenuVariant[];
};

export type MenuCategory = {
  id: string;
  name: string;
  note?: string;
  items: MenuItem[];
  extras?: MenuExtra[];
};

export const burgerExtras: MenuExtra[] = [
  {
    id: "medallon-adicional",
    name: "Agregado de medallón de carne adicional",
    price: 20000
  },
  {
    id: "bacon-artesanal",
    name: "Agregado de bacon artesanal",
    price: 8000
  }
];

export const menuCategories: MenuCategory[] = [
  {
    id: "snacks",
    name: "Snacks",
    items: [
      {
        id: "brisketcheddar",
        name: "BrisketCheddar",
        description:
          "Brisket, salsa cheddar, cebollita de verdeo y jalapeños (opcional).",
        variants: [
          { id: "papas-fritas", name: "c/ papas fritas", price: 55000 },
          { id: "nachos", name: "c/ nachos (recomendado)", price: 48000 }
        ]
      },
      {
        id: "ahummus",
        name: "Ahummus",
        badge: "vegetariano",
        description:
          "Hummus ahumado con bastones de apio, zanahoria y grisines (palitos) de queso.",
        price: 38000
      },
      {
        id: "empastrami",
        name: "Empastrami",
        description:
          "Empanada (x1) de pastrami ahumado con bechamel de queso paraguayo y cheddar.",
        price: 12000
      },
      {
        id: "jalapeno-popper",
        name: "Jalapeño Popper",
        description:
          "Jalapeño (x1) relleno de queso crema y pork belly ahumado, envuelto en panceta y apanados en panko.",
        price: 25000
      }
    ]
  },
  {
    id: "ahumados-temporada",
    name: "Ahumados de Temporada",
    note: "Consultar disponibilidad",
    items: [
      {
        id: "beef-ribs",
        name: "Beef Ribs",
        description:
          "Costilla ancha vacuna, ahumada x 8hs. Porciones entre 400 y 600gr.",
        price: 200000,
        unit: "por kg"
      },
      {
        id: "cubano",
        name: "Cubano",
        description:
          "Sándwich de pulled pork, jamón tostado, mostaza americana, queso muzzarella, y pepinillos sobre pan francés prensado. Un clásico de la ciudad de Miami.",
        price: 50000
      },
      {
        id: "egg-salad",
        name: "Egg Salad",
        badge: "vegetariano",
        description:
          "Sándwich vegetariano de huevos ahumados con mayo, perejil y pan lactal. Acompañado de kimchi (suave) de pepinos al costado.",
        price: 35000
      }
    ]
  },
  {
    id: "ahumados-al-plato",
    name: "Ahumados al Plato",
    note: "Solo la carne con pickles",
    items: [
      {
        id: "bandeja-sampler",
        name: "Bandeja Sampler",
        description:
          "Los clásicos del Texas BBQ en una sola bandeja. Brisket, Pulled Pork, Ribs BBQ, Coleslaw, Potato Salad, Pan Lactal y Pickles. Para 2 a 3 personas.",
        price: 220000
      },
      {
        id: "bandeja-sampler-xl",
        name: "Bandeja Sampler XL",
        description:
          "Brisket, Ribs BBQ, Pulled Pork, Pork Belly y un chori a elección. Ensalada Coleslaw, Potato Salad, Onion Rings, Papas Fritas, Pan Lactal y Pickles. Para 4 a 5 personas.",
        price: 350000
      },
      {
        id: "brisket",
        name: "Brisket",
        description: "250gr de pecho vacuno / 10hs ahumado.",
        price: 80000
      },
      {
        id: "ribs-bbq",
        name: "Ribs BBQ",
        description:
          "Costillas de cerdo glaseadas en salsa BBQ casera / 6hs ahumado.",
        price: 60000
      },
      {
        id: "pulled-pork",
        name: "Pulled Pork",
        description: "250gr de bondiola de cerdo desmechada / 8hs ahumado.",
        price: 50000
      },
      {
        id: "pork-belly",
        name: "Pork Belly",
        description: "200gr de panceta parrillera de cerdo / 7hs ahumado.",
        price: 60000
      },
      {
        id: "pulled-beef",
        name: "Pulled Beef",
        description: "250gr de brisket desmechado con salsa BBQ / 8hs ahumado.",
        price: 60000
      },
      {
        id: "chorichedar",
        name: "ChoriCheddar",
        description:
          "200gr de chori artesanal. Blend de panceta, bondiola y costilla con cheddar / 4hs ahumado. Incluye pan lactal y pickles.",
        price: 35000
      },
      {
        id: "choripeno",
        name: "ChoriPeño",
        description:
          "200gr de ChoriCheddar pero con jalapeños / 4hs ahumado. Incluye pan lactal y pickles.",
        price: 38000
      },
      {
        id: "choribeef",
        name: "ChoriBeef",
        description:
          "200gr de chori artesanal de brisket vacuno / 4hs ahumado. Incluye pan lactal y pickles.",
        price: 42000
      }
    ]
  },
  {
    id: "sandwiches-ahumados",
    name: "Sándwiches Ahumados",
    items: [
      {
        id: "texas",
        name: "Texas",
        badge: "recomendado",
        description:
          "Brisket, lactonesa de ajo y cebollas encurtidas. Sándwich recomendado de la casa.",
        price: 50000
      },
      {
        id: "chanchino",
        name: "Chanchino",
        description:
          "Desmechado de cerdo, lacto ajo, pepinillos, salsa bbq y papas pay.",
        price: 38000
      },
      {
        id: "chopped",
        name: "Chopped",
        description:
          "Desmechado de brisket vacuno, jalapeños, cebolla fresca, cheddar y mucha salsa bbq.",
        price: 45000
      },
      {
        id: "tribbiani",
        name: "Tribbiani",
        description:
          "Pastrami ahumado, mostaza americana, chucrut casero y pepinillos. Influenciado por Katz's. Agregado de queso gruyere gratinado: Gs. 10.000.",
        price: 78000
      },
      {
        id: "pblt",
        name: "PBLT",
        description:
          "Pork Belly, Lechuga, Tomate y mayo. Un sándwich clásico en versión Texas Barbecue.",
        price: 42000
      },
      {
        id: "brisketmelt",
        name: "BrisketMelt",
        description:
          'Sándwich "grilled cheese" con brisket desmechado, abundante queso cheddar, salsa bbq de la casa y jalapeños.',
        price: 47000
      },
      {
        id: "falafel-sando",
        name: "Falafel Sando",
        badge: "vegetariano",
        description:
          "Croquetas de garbanzo, coleslaw, pepinillos, hummus ahumado y lacto ajo. Te va a sorprender.",
        price: 40000
      }
    ]
  },
  {
    id: "burgers",
    name: "Burgers Ahumadas",
    note:
      "Las burgers tienen un color rosa por el efecto del ahumado, no están semi crudas.",
    extras: burgerExtras,
    items: [
      {
        id: "brisketburger",
        name: "BrisketBurger",
        description:
          'Burger ahumada de 170gr, cheddar, relish, mayo, cebolla fresca, lechuga y tomate. Tipo "Whopper" ahumada.',
        price: 48000
      },
      {
        id: "mc-brisket",
        name: "Mc Brisket",
        description:
          'Burger ahumada de 170gr, salsa Mc Brisket, doble cheddar, pepinillos, lechuga. Tipo "BigMac" ahumada.',
        price: 53000
      },
      {
        id: "royale",
        name: "Royale",
        description:
          'Burger ahumada de 170gr, cheddar, pepinillos, mostaza americana, ketchup y cebolla. Tipo "1/4 de libra" ahumada.',
        price: 45000
      },
      {
        id: "cheeseburger",
        name: "Cheeseburger",
        description: "Burger ahumada de 170gr, cheddar y mayo.",
        price: 38000
      },
      {
        id: "baconbrisket",
        name: "BaconBrisket",
        description:
          "Burger ahumada de 170gr con bacon artesanal, aros de cebolla, cheddar y bbq de la casa.",
        price: 50000
      }
    ]
  },
  {
    id: "acompanamientos-calientes",
    name: "Acompañamientos Calientes",
    items: [
      {
        id: "combo",
        name: "Combo",
        description:
          "Agregado de papas fritas + bebida (gaseosa de 500ml o chopp Munich de 300ml).",
        price: 18000
      },
      {
        id: "papas-fritas",
        name: "Papas Fritas",
        description:
          "El acompañamiento número #1 del mundo con nuestra sazón secreta.",
        price: 15000
      },
      {
        id: "mac-cheese",
        name: "Mac & Cheese",
        description: "Fideos cortaditos con salsa cheddar y paprika ahumada.",
        price: 15000
      },
      {
        id: "onion-rings",
        name: "Onion Rings",
        description:
          "Aros de cebolla blanca apanados y crocantes con sazón secreta.",
        price: 20000
      }
    ]
  },
  {
    id: "acompanamientos-frios",
    name: "Acompañamientos Fríos",
    items: [
      {
        id: "potato-salad",
        name: "Potato Salad",
        description:
          "Ensalada sureña de papas asadas con huevos, jugo de pickles, cebolla, verdeo, crema ácida y mayonesa.",
        price: 15000
      },
      {
        id: "coleslaw",
        name: "Coleslaw",
        description: "Ensalada fresca de repollos asados, zanahorias y mayonesa.",
        price: 15000
      },
      {
        id: "pan-lactal",
        name: "Pan Lactal",
        description: "2 rodajas de pan gruesitos, blanditos y esponjosos.",
        price: 5000
      },
      {
        id: "adicional-pickles",
        name: "Adicional de Pickles",
        description:
          "Agregá más pepinillos, cebollas y zanahorias encurtidas a tus comidas.",
        price: 7000
      }
    ]
  },
  {
    id: "menu-kids",
    name: "Menú Kids",
    items: [
      {
        id: "nuggets",
        name: "Nuggets de Pollo",
        description: "8 unidades / con papas fritas.",
        price: 28000
      }
    ]
  },
  {
    id: "postres",
    name: "Postres",
    items: [
      {
        id: "ice-cream-sandwich",
        name: "Ice Cream Sandwich",
        description:
          "2 cookies con chips de chocolate rellenas con helado de crema americana.",
        price: 30000
      },
      {
        id: "volcan-chocolate",
        name: "Volcán de Chocolate",
        description: "Volcán caliente con helado de crema americana.",
        price: 35000
      },
      {
        id: "volcan-ddl",
        name: "Volcán de DDL",
        description: "Volcán caliente con helado de crema americana.",
        price: 35000
      },
      {
        id: "banana-bread",
        name: "Banana Bread",
        description:
          "Bizcocho bananoso caliente acompañado de helado de crema americana.",
        price: 25000
      },
      {
        id: "brownie",
        name: "Brownie c/ Helado",
        description:
          "Brownie de chocolate con helado de crema americana.",
        price: 25000
      },
      {
        id: "season-pie",
        name: "Season Pie",
        description:
          "Pie de temporada con helado de crema americana, consultar por sabor disponible.",
        price: 30000
      }
    ]
  },
  {
    id: "bebidas-cerveza",
    name: "Cervezas",
    note:
      "Cervezas artesanales Herken, Sacramento y Birrini disponibles — preguntar en barra.",
    items: [
      {
        id: "chopp-300",
        name: "Chopp Munich 300ml",
        price: 12000,
        happyHourPrice: 8000
      },
      {
        id: "chopp-500",
        name: "Chopp Munich 500ml",
        price: 15000,
        happyHourPrice: 10000
      }
    ]
  },
  {
    id: "bebidas-sin-alcohol",
    name: "Sin Alcohol",
    items: [
      { id: "agua-sin-gas", name: "Agua sin Gas", price: 6000 },
      { id: "agua-con-gas", name: "Agua con Gas", price: 6000 },
      { id: "gaseosa-500", name: "Gaseosas 500ml", price: 10000 },
      { id: "jugo-natural", name: "Jugos Naturales", price: 18000 },
      { id: "heineken-0", name: "Heineken 0% (sin alcohol)", price: 12000 }
    ]
  },
  {
    id: "tragos",
    name: "Tragos",
    items: [
      {
        id: "tinto-verano",
        name: "Tinto de Verano 300ml",
        price: 25000,
        happyHourPrice: 20000
      },
      {
        id: "aperol-spritz",
        name: "Aperol Spritz 300ml",
        price: 35000,
        happyHourPrice: 28000
      },
      {
        id: "gin-tonic",
        name: "Gin Tonic 500ml",
        price: 25000,
        happyHourPrice: 20000
      },
      {
        id: "amaro-tonic",
        name: "Amaro Tonic 500ml",
        price: 18000,
        happyHourPrice: 12000
      },
      {
        id: "fernet-cola",
        name: "Fernet Cola 500ml",
        price: 20000,
        happyHourPrice: 15000
      },
      { id: "jack-coke", name: "Jack & Coke 500ml", price: 30000 }
    ]
  },
  {
    id: "vinos",
    name: "Vinos por Botella",
    items: [
      {
        id: "santa-julia-cabernet",
        name: "Santa Julia - Cabernet",
        price: 85000
      },
      {
        id: "vina-maipo-carmenere",
        name: "Viña Maipo - Carmenere",
        price: 70000
      }
    ]
  }
];
