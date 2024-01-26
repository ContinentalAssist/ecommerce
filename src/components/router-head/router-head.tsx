import { component$ } from '@builder.io/qwik';
import { useDocumentHead } from '@builder.io/qwik-city';

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
    const head = useDocumentHead();

    return (
        <>
            <title>{head.title}</title>
            <meta charSet="utf-8" />
            {/* <link rel="canonical" href={loc.url.href} /> */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="author" content="Continental Assist" />
            <meta name="publisher" content="Continental Assist" />
            {/* <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> */}
            <link rel="icon" type="image/webp" href="/assets/img/ca/continental-assist-favicon.webp" />

            {head.meta.map((m) => (
              <meta key={m.key} {...m} />
            ))}

            {head.links.map((l) => (
              <link key={l.key} {...l} />
            ))}

            {head.styles.map((s) => (
              <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
            ))}
        </>
    );
});
