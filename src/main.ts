import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import 'vue3-colorpicker/style.css'
import VueCropper from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import VChart from "vue-echarts";
import "echarts";
import 'echarts-wordcloud'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(VueCropper)
app.component("VChart", VChart);

app.mount('#app')
