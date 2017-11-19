import i18n from 'i18n-js';
import en from './en.json';
import es from './es.json';

i18n.fallbacks = true;
i18n.translations = { en, es };

export default class String {
  static t(key, options) {
    return i18n.t(key, options);
  }
}
