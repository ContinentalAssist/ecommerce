// Utilidades para tracking de eventos con Google Tag Manager

// Declarar dataLayer globalmente
declare global {
  interface Window { 
    dataLayer: any[] 
  }
}

interface GTMDataLayer {
  event: string;
  [key: string]: any;
}

interface FormStartData {
  form_name: string;
  plan_selected?: string;
  origin?: string;
  destination?: string;
  travel_dates?: string;
  passengers_count?: number;
  adults?: number;
  children?: number;
  seniors?: number;
}

interface AddToCartData {
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
  countryCode?: string;
  planId?: string;
  planName?: string;
  couponCode?: string;
  discount?: number;
  passengersCount?: number;
}

interface PurchaseData {
  transaction_id: string;
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
  countryCode?: string;
  planName?: string;
}

// Función genérica para enviar eventos a GTM
function pushToDataLayer(data: GTMDataLayer): void {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push(data);
  }
}

// Función para verificar si GTM está disponible
function isGTMAvailable(): boolean {
  return typeof window !== 'undefined' && 
         (window as any).dataLayer && 
         (window as any).google_tag_manager;
}


// Evento: Inicio de formulario de cotización (Paso 1 - Buscador)
export function trackFormStart(data: FormStartData): void {
  const eventData: GTMDataLayer = {
    event: 'TrackEventGA4',
    category: 'Flujo asistencia',
    action: 'Paso 1 :: buscador',
    origen: data.origin,
    destino: data.destination,
    desde: data.travel_dates?.split(' - ')[0],
    hasta: data.travel_dates?.split(' - ')[1],
    adultos: data.adults || 0,
    niños_y_jovenes: data.children || 0,
    adultos_mayores: data.seniors || 0,
    page: 'home',
    cta: 'buscar'
  };

  pushToDataLayer(eventData);
}

// Evento: Agregar al carrito (selección de complementos)
export function trackAddToCart(data: AddToCartData): void {
  const eventData: GTMDataLayer = {
    event: 'add_to_cart',
    currency: data.currency,
    value: data.value,
    ecommerce: {
      currency: data.currency,
      value: data.value,
      items: [
        {
          item_id: `${data.countryCode || ""}_${data.planId || ""}`,
          item_name: data.planName || "",
          coupon: data.couponCode || "",
          discount: data.discount || 0.00,
          index: 0,
          item_brand: 'Continental Assist',
          item_category: data.countryCode || "",
          item_list_id: '',
          item_list_name: '',
          item_variant: '',
          location_id: '',
          price: data.value,
          quantity: data.passengersCount || 1
        }
      ]
    }
  };

  pushToDataLayer(eventData);
}

// Evento: Compra completada
export function trackPurchase(data: PurchaseData): void {
  const eventData: GTMDataLayer = {
    event: 'purchase',
    transaction_id: data.transaction_id,
    value: data.value,
    currency: data.currency,
    ecommerce: {
      transaction_id: data.transaction_id,
      value: data.value,
      tax: 0.00,
      shipping: 0.00,
      currency: data.currency,
      coupon: '',
      items: [
        {
          item_id: `${data.countryCode || ""}_${data.transaction_id}`,
          item_name: data.planName || "",
          coupon: '',
          discount: 0.00,
          index: 0,
          item_brand: 'Continental Assist',
          item_category: data.countryCode || "",
          item_list_id: '',
          item_list_name: '',
          item_variant: '',
          location_id: '',
          price: data.value,
          quantity: 1
        }
      ]
    }
  };

  pushToDataLayer(eventData);
}

// Función para trackear con retry si GTM no está disponible
export async function trackEventWithRetry(
  trackFunction: () => void,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    if (isGTMAvailable()) {
      trackFunction();
      return;
    }
    
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.warn('GTM not available after retries, event not tracked');
}

// Función para formatear datos del plan para GTM
export function formatPlanForGTM(plan: any): {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
} {
  return {
    item_id: plan.idplan || plan.id || 'unknown_plan',
    item_name: plan.nombreplan || plan.name || 'Travel Insurance Plan',
    category: 'travel_insurance',
    quantity: 1,
    price: parseFloat(plan.precio_grupal || plan.price || 0),
  };
}

// Función para formatear complementos para GTM
export function formatAddonForGTM(addon: any): {
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
} {
  return {
    item_id: addon.idbeneficio || addon.id || 'unknown_addon',
    item_name: addon.nombrebeneficio || addon.name || 'Additional Benefit',
    category: 'addon',
    quantity: 1,
    price: parseFloat(addon.precio || addon.price || 0),
  };
}

// Función para obtener información de viaje formateada
export function formatTravelInfo(context: any): {
  origin?: string;
  destination?: string;
  travel_dates?: string;
  passengers_count?: number;
  adults?: number;
  children?: number;
  seniors?: number;
} {
  const result: any = {};
  
  if (context.paisorigen) {
    result.origin = context.paisorigen;
  } else if (context.origen) {
    result.origin = typeof context.origen === 'string' ? context.origen : context.origen.label;
  }
  
  if (context.destinos) {
    if (Array.isArray(context.destinos)) {
      result.destination = context.destinos.map((dest: any) => 
        typeof dest === 'string' ? dest : dest.label
      ).join(', ');
    } else {
      result.destination = typeof context.destinos === 'string' ? context.destinos : context.destinos.label;
    }
  }
  
  if (context.desde && context.hasta) {
    result.travel_dates = `${context.desde} - ${context.hasta}`;
  }
  
  if (context.asegurados && Array.isArray(context.asegurados)) {
    result.passengers_count = context.asegurados.length;
  }
  
  // Contar por edades usando los campos específicos del formulario
  // 23: niños y jóvenes (0-23 años)
  // 75: adultos (24-75 años) 
  // 85: adultos mayores (76-85 años)
  result.children = context[23] || 0;        // niños_y_jovenes
  result.adults = context[75] || 0;          // adultos
  result.seniors = context[85] || 0;         // adultos_mayores
  
  return result;
}

//FUNCIONES PARA INTEGRACIÓN CON QWIK

// Función para inicializar dataLayer si no existe
export function initDataLayer(): void {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
}

// Función para emitir eventos a GTM
export function pushGTMEvent(eventData: Record<string, any>): void {
  if (typeof window !== 'undefined') {
    initDataLayer();
    window.dataLayer.push(eventData);
  }
}

// Eventos específicos para componentes
export function trackComponentReady(componentName: string, componentId?: string): void {
  pushGTMEvent({
    event: 'component_ready',
    component: componentName,
    component_id: componentId
  });
}

// Evento de cambio de ruta
export function trackRouteChange(path: string, pageTitle?: string): void {
  pushGTMEvent({
    event: 'route_change',
    path: path,
    page_title: pageTitle || (typeof document !== 'undefined' ? document.title : '')
  });
}

// Evento de interacción con pasajeros
export function trackPaxInteraction(action: 'add' | 'remove', paxType: 'adult' | 'child' | 'senior', count: number): void {
  pushGTMEvent({
    event: 'pax_interaction',
    action: action,
    pax_type: paxType,
    count: count
  });
}

// Evento de formulario completado
export function trackFormComplete(formName: string, formData?: Record<string, any>): void {
  pushGTMEvent({
    event: 'form_complete',
    form_name: formName,
    form_data: formData
  });
}

