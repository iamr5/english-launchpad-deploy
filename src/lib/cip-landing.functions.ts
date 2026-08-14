import { createServerFn } from "@tanstack/react-start";

// La marca del landing de preinscripción sale del demo /democip, configurado en
// /demos: así el landing sigue cualquier cambio de logo o color sin tocar código.

export type CipBrand = {
  institution: string;
  logo: string;
  icon: string;
  accent: string;
  button: string;
  highlight: string;
  phrase: string;
};

export const getCipBrand = createServerFn({ method: "GET" }).handler(async (): Promise<CipBrand> => {
  const fallback: CipBrand = {
    institution: "Colegio de Ingenieros del Perú",
    logo: "",
    icon: "/head.png",
    accent: "#E42D26",
    button: "#F07400",
    highlight: "#1B88EE",
    phrase: "Inglés para los Ingenieros que construyen el Perú",
  };

  try {
    const { getDemoConfig } = await import("@/lib/demo-config");
    const cfg = await getDemoConfig("democip");
    if (!cfg) return fallback;
    return {
      institution: cfg.institution || fallback.institution,
      logo: cfg.splash?.logo || cfg.brand?.logo || cfg.brand?.appbarIcon || "",
      icon: cfg.brand?.appbarIcon || fallback.icon,
      accent: cfg.colors?.accent || fallback.accent,
      button: cfg.colors?.button || cfg.colors?.accent || fallback.button,
      highlight: cfg.colors?.highlight || fallback.highlight,
      phrase: cfg.splash?.phrase || fallback.phrase,
    };
  } catch {
    return fallback;
  }
});
