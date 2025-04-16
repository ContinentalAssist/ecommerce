import { component$, Slot,  useStyles$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { RequestHandler } from '@builder.io/qwik-city';

import { Header } from '~/components/starter/header/Header';
import { Footer } from '~/components/starter/footer/Footer';

import styles from './index.css?inline';
import { ChatGenesys } from '~/components/starter/chat-genesys/ChatGenesys';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 1,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
    return {
        date: new Date().toISOString(),
    };
});


export const useRedirectIfNeeded = routeLoader$(({ redirect, request, url }) => {
    const referer = request.headers.get('referer');

    // Si no hay referer y no estamos en '/', significa que es una entrada directa
    if (!referer && url.pathname !== '/') {
        throw redirect(302, '/');
    }
});


export default component$(() => {
    return (
        <>
            <Slot />
        </>
    );
});

