import { HttpResponse, http } from "msw";

import { handlers as calendarHandlers } from "./handlers";
import { env } from "@/config/env";

// export const handlers = [
//   ...calendarHandlers,
//   http.get(`${env.API_URL}/healthcheck`, async () => {
//     return HttpResponse.json({ ok: true });
//   }),
// ];

async function initMocks() {
  if (typeof window === "undefined") {
    const { server } = await import("../server");
    server.listen({ onUnhandledRequest: "bypass" });
    console.log("Mocks server listening");
  } else {
    const { worker } = await import("../browser");
    worker.start({ onUnhandledRequest: "bypass" });
    console.log("Mocks server started");
  }
}

initMocks().then(() => console.log("Mocks initialized"));

export {};
