import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import hi from './locales/hi.json';
import sw from './locales/sw.json';
import yo from './locales/yo.json';
import ha from './locales/ha.json';
import ig from './locales/ig.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';
import it from './locales/it.json';
import nl from './locales/nl.json';
import id from './locales/id.json';
import bn from './locales/bn.json';
import vi from './locales/vi.json';
import pl from './locales/pl.json';
import ro from './locales/ro.json';
import el from './locales/el.json';
import sv from './locales/sv.json';
import da from './locales/da.json';
import fi from './locales/fi.json';
import no from './locales/no.json';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Fran\u00e7ais', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Espa\u00f1ol', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugu\u00eas', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '\u4e2d\u6587', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '\u65e5\u672c\u8a9e', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '\ud55c\uad6d\uc5b4', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: '\u0939\u093f\u0928\u094d\u0926\u0940', dir: 'ltr' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yor\u00f9b\u00e1', dir: 'ltr' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', dir: 'ltr' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'T\u00fcrk\u00e7e', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: '\u09ac\u09be\u0982\u09b2\u09be', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Ti\u1ebfng Vi\u1ec7t', dir: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr' },
  { code: 'ro', name: 'Romanian', nativeName: 'Rom\u00e2n\u0103', dir: 'ltr' },
  { code: 'el', name: 'Greek', nativeName: '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', dir: 'ltr' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', dir: 'ltr' },
];

const resources = {
  en: { translation: en }, fr: { translation: fr }, es: { translation: es },
  ar: { translation: ar }, pt: { translation: pt }, de: { translation: de },
  zh: { translation: zh }, ja: { translation: ja }, ko: { translation: ko },
  hi: { translation: hi }, sw: { translation: sw }, yo: { translation: yo },
  ha: { translation: ha }, ig: { translation: ig }, ru: { translation: ru },
  tr: { translation: tr }, it: { translation: it }, nl: { translation: nl },
  id: { translation: id }, bn: { translation: bn },
  vi: { translation: vi }, pl: { translation: pl }, ro: { translation: ro },
  el: { translation: el }, sv: { translation: sv }, da: { translation: da },
  fi: { translation: fi }, no: { translation: no },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'xpert_language',
    },
  });

// Listen for language changes and persist to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('xpert_language', lng);
  // Force LTR layout structure as per user request (languages only, no layout change)
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
