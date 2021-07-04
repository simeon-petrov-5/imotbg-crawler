import Vue from 'vue'
import Unicon from 'vue-unicons/dist/vue-unicons-vue2.umd'
import { uniApps,  uniSpinner,uniTimes } from 'vue-unicons/dist/icons'

Unicon.add([uniApps, uniSpinner, uniTimes])
Vue.use(Unicon)