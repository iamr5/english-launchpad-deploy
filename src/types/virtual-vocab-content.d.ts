declare module "virtual:vocab-content" {
  const bank: {
    general: { s: string; chips: unknown[] }[];
    packs: Record<string, { n: string; e: string; secs: { s: string; chips: unknown[] }[] }>;
  };
  export default bank;
}
