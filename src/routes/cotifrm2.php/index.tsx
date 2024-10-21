import {component$, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const location = useLocation();
  const navigate = useNavigate();

  useVisibleTask$(() => {
    const searchParams = new URLSearchParams(location.url.search);
    if (searchParams.has('ux')) {
      const uxParam = searchParams.get('ux');
      if (uxParam) {
        navigate('https://eva.continentalassist.com/login');
      }
    }
  });

  return <div>Redirección en progreso...</div>;
});