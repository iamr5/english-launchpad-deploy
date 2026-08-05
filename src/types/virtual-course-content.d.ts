declare module "virtual:course-content" {
  const bundle: { course: { modules: unknown[]; [k: string]: unknown }; placement: unknown[] };
  export default bundle;
}
