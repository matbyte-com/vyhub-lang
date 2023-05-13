import en from './en.json';

// Load English eager, lazy-load other languages (to allow for fallback locale)
export default {
  en: {
    name: 'English',
    messages: en,
  },
  de: {
    name: 'Deutsch',
    load: () => import('@/lang/de.json'),
  },
  nl: {
    name: 'Nederlands',
    load: () => import('@/lang/nl.json'),
  },
  pt: {
    name: 'Português',
    load: () => import('@/lang/pt_BR.json'),
  },
  uk: {
    name: 'Українська',
    load: () => import('@/lang/uk.json'),
  },
};
