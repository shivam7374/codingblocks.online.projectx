import Mixin from '@ember/object/mixin';

// Modified over: https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name, defaultValue = window.btoa('{}')){
  var pattern = RegExp(name + "=.[^;]*")
  var matched = document.cookie.match(pattern)
  if(matched){
      var cookie = matched[0].split('=')
      return cookie[1]
  }
  return defaultValue
}

const utm_params = ['utm_campaign', 'utm_source', 'utm_medium']

export default Mixin.create({
  queryParams: {
    utm_campaign: {
      replace: true
    },
    utm_source: {
      replace: true
    },
    utm_medium: {
      replace: true
    }
  },
  beforeModel(transition) {
    const qp = transition.to.queryParams
    const new_cbutm = Object.keys(qp).reduce((acc, key) => utm_params.includes(key) && qp[key] ? {...acc, [key]: qp[key]} : acc , {})
    const old_cbutm = JSON.parse(window.atob((getCookie('_cbutm'))))
    const _cbutm = window.btoa(JSON.stringify({
      ...old_cbutm,
      ...new_cbutm
    }))
    const expiry = moment().add("7", "days").toDate()
    document.cookie = `_cbutm=${_cbutm}; expires=${expiry}; path=/; domain=.codingblocks.com`
    // document.cookie = `_cbutm=${_cbutm}; expires=${expiry}; path=/; domain=test.online` // in dev uncomment this
    this._super(...arguments)
  },
  actions: {
    didTransition() {
      this._super(...arguments)
      this.controller.setProperties({
        utm_campaign: null,
        utm_source: null,
        utm_medium: null,
        code: null
      })
    }
  }
})