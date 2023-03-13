export default {
  en: {
    name: 'English',
    load: () => import('@/lang/en.json'),
  },
  de: {
    name: 'Deutsch',
    load: () => import('@/lang/de.json'),
  },
};
