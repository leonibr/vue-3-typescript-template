import { createI18n } from 'vue-i18n'

import { getLanguage } from '@/utils/cookies'

// element-ui built-in lang
import elementEnLocale from 'element-plus/es/locale/lang/en'
import elementZhLocale from 'element-plus/es/locale/lang/zh-cn'
import elementEsLocale from 'element-plus/es/locale/lang/es'
import elementJaLocale from 'element-plus/es/locale/lang/ja'
import elementKoLocale from 'element-plus/es/locale/lang/ko'
import elementItLocale from 'element-plus/es/locale/lang/it'

// User defined lang
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'
import jaLocale from './ja'
import koLocale from './ko'
import itLocale from './it'

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  es: {
    ...esLocale,
    ...elementEsLocale
  },
  ja: {
    ...jaLocale,
    ...elementJaLocale
  },
  ko: {
    ...koLocale,
    ...elementKoLocale
  },
  it: {
    ...itLocale,
    ...elementItLocale
  }
}

const getLocale = () => {
  const cookieLanguage = getLanguage()
  if (cookieLanguage) {
    document.documentElement.lang = cookieLanguage
    return cookieLanguage
  }

  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      document.documentElement.lang = locale
      return locale
    }
  }

  // Default language is english
  return 'en'
}

const i18n = createI18n({
  locale: getLocale(),
  legacy: false,
  globalInjection: true,
  messages
  // something vue-i18n options here ...
})

export default i18n
