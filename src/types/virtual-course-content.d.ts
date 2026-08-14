declare module "virtual:course-content" {
  const bundle: {
    course: { modules: unknown[]; [k: string]: unknown };
    placement: unknown[];
    practice: Record<string, unknown[]>;
    speaking: Record<string, unknown[]>;
  };
  export default bundle;
}
