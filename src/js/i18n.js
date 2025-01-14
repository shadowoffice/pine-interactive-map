const { storage } = require('./util')


const data = {
  en: require('./i18n/en.js'),
  de: require('./i18n/de.js'),
  //fr: require('./i18n/fr.js'),
  //it: require('./i18n/it.js'),
  //es: require('./i18n/es.js'),
  //zh: require('./i18n/zh.js'),
  //ru: require('./i18n/ru.js'),
  //pg: require('./i18n/pg.js'),
  //du: require('./i18n/du.js'),
}


const auto_select = () => {
  const lang = (navigator.language || navigator.userLanguage || 'en').substr(0, 2)
  return ( lang in data ? lang : 'en' )
}


const from_path = (obj, path) => path.reduce((ptr, p) => (ptr ? (ptr[p] || undefined) : ptr), obj)


const i18n = (() => {
  var _lang = storage().get('pine-selected-language') || auto_select()
  var _listeners = []

  const getLang = () => _lang
  const setLang = (lang) => {
    if (_lang !== lang) {
      _lang = lang
      storage().set('pine-selected-language', _lang)
      _listeners.forEach(cb => cb(_lang))
    }
  }
  const translate = (...path) => from_path(data[_lang], path) || from_path(data['en'], path) || ''
  const onLangChange = (callback) => _listeners.push(callback)
  const langComponent = (map, constr) => {
    let comp
    const add = () => {
      if (comp) { comp.remove() }
      comp = constr()
      comp.addTo(map)
    }
    _listeners.push(add)
    add()
    return add
  }

  onLangChange(() => document.title = translate('ui', 'title'))

  return {
    getLang,
    setLang,
    translate,
    onLangChange,
    langComponent,
  }
})()


i18n.langControl = () => {
  const languageControl = L.languageSelector({
    languages: [
      L.langObject('en', 'English'),
      L.langObject('de', 'Deutsch'),
      L.langObject('fr', 'Français'),
      L.langObject('it', 'Italiano'),
      L.langObject('es', 'Español'),
      L.langObject('zh', '中文'),
      L.langObject('ru', 'Русский'),
      L.langObject('pg', 'Português'),
      L.langObject('du', 'Nederlands'),
    ].filter(lo => lo.id in data),
    position: 'bottomleft',
    callback: i18n.setLang,
  })
  const setLangSelected = (lang) => languageControl._container.setAttribute('data-selected', lang)
  i18n.onLangChange(setLangSelected)
  setLangSelected(i18n.getLang())
  Array.from(languageControl._container.children[0].children).forEach(c => c.setAttribute('title', c.innerHTML))
  return languageControl
}

module.exports = i18n
