import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFlag, faBomb, faPlay, faUndo, faHome, faTrophy, faPoop, faClock, faGavel} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFlag, faBomb, faPlay, faUndo, faHome, faTrophy, faPoop, faClock, faGavel)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
