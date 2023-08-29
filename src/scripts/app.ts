import { createApp } from 'vue'
import { includeSvgSprite } from '@/scripts/helpers/svgSprite'
import App from '@/scripts/App.vue'

const app = createApp(App)
app.mount('#app')

includeSvgSprite()
import '@/styles/app.scss'