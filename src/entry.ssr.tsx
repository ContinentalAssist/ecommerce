/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import Root from "./root";

export default function (opts: RenderToStreamOptions) {
  // Agregar headers para desactivar Attribution Reporting API
  if (opts.serverData?.response) {
    const response = opts.serverData.response;
    
    // Solución directa: desactivar la API problemática
    response.headers.set('Attribution-Reporting', 'disable');
    
    // Opcional: headers específicos si necesitas la funcionalidad
    // response.headers.set('Attribution-Reporting-Eligible', 'trigger');
    // response.headers.set('Attribution-Reporting-Support', 'os');
  }

  return renderToStream(<Root />, {
    manifest,
    ...opts,
    containerAttributes: {
      lang: "en-us",
      ...opts.containerAttributes,
    },
    serverData: {
      ...opts.serverData,
    },
  });
}