import { createServerFn } from "@tanstack/react-start";

// El pase que necesita la página del asistente para poder abrir sesiones.

export type TutorPass = {
  token: string;
  sid: string;
  /** Si el servidor tiene clave de OpenAI. */
  ready: boolean;
};

export const getTutorPass = createServerFn({ method: "GET" }).handler(
  async (): Promise<TutorPass> => {
    const { issueTutorToken, newSessionId } = await import("./tutor-token");
    const sid = newSessionId();

    return {
      token: await issueTutorToken(sid),
      sid,
      ready: Boolean(process.env["OPENAI_API_KEY"]),
    };
  },
);
