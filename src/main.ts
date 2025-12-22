import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  IoHomeSharp,
  GiBackwardTime,
  IoCloseSharp,
  BiPeopleFill,
  BiLink45Deg,
  HiSolidPlusCircle,
} from 'oh-vue-icons/icons'

addIcons(IoHomeSharp, GiBackwardTime, IoCloseSharp, BiPeopleFill, BiLink45Deg, HiSolidPlusCircle)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('v-icon', OhVueIcon)

app.mount('#app')
