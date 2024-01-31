import { useDocumentHead } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  // const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      {/* <link rel="canonical" href={loc.url.href} /> */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Continental Assist" />
      <meta name="publisher" content="Continental Assist" />

      {/* <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}
      <link rel="icon" type="image/webp" href="/assets/img/ca/continental-assist-favicon.webp"/>

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}

      {head.scripts.map((s) => (
        <script key={s.key} {...s.props} dangerouslySetInnerHTML={s.script} />
      ))}
    </>
  );
});
