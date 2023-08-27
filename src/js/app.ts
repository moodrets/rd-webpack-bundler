import { createApp } from 'vue'
import { includeSvgSprite } from '@/js/helpers/includeSvgSprite'
import App from '@/js/App.vue'

const app = createApp(App)
app.mount('#app')

includeSvgSprite()
import '@/styles/app.scss'