import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

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
  GiBalloonDog,
} from 'oh-vue-icons/icons'

addIcons(
  IoHomeSharp,
  GiBackwardTime,
  IoCloseSharp,
  BiPeopleFill,
  BiLink45Deg,
  HiSolidPlusCircle,
  GiBalloonDog,
)

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.component('v-icon', OhVueIcon)

app.mount('#app')
