import { $ } from '@builder.io/qwik';

// Clave para localStorage
const QUOTE_STORAGE_KEY = 'continental_assist_quote_data';

// Función para guardar datos del cotizador en localStorage
export const saveQuoteData$ = $((data: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Error al guardar datos del cotizador:', error);
    }
  }
});

// Función para cargar datos del cotizador desde localStorage
export const loadQuoteData$ = $(() => {
  if (typeof window !== 'undefined') {
    try {
      const savedData = localStorage.getItem(QUOTE_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.warn('Error al cargar datos del cotizador:', error);
      return null;
    }
  }
  return null;
});

// Función para limpiar datos del cotizador (solo cuando se hace clic en el logo)
export const clearQuoteData$ = $(() => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(QUOTE_STORAGE_KEY);
    } catch (error) {
      console.warn('Error al limpiar datos del cotizador:', error);
    }
  }
});

// Exportar también como QRL para compatibilidad
export const clearQuoteDataQrl = clearQuoteData$;

// Función para verificar si hay datos guardados
export const hasQuoteData$ = $(() => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(QUOTE_STORAGE_KEY) !== null;
    } catch (error) {
      return false;
    }
  }
  return false;
});

// Función para obtener solo ciertos campos específicos si existen
export const getQuoteField$ = $((field: string) => {
  if (typeof window !== 'undefined') {
    try {
      const savedData = localStorage.getItem(QUOTE_STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        return data[field] || null;
      }
    } catch (error) {
      console.warn('Error al obtener campo del cotizador:', error);
    }
  }
  return null;
});
