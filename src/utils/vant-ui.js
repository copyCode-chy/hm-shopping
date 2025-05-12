import Vue from 'vue'
// 全部导入
// import Vant from 'vant'
// import 'vant/lib/index.css'

// // 插件安装初始化:内部会将所有的vant所有组件进行导入注册
// Vue.use(Vant)

// 按需导入
import { Button, Circle, Tabbar, TabbarItem, NavBar, Toast, Search, Swipe, SwipeItem, Grid, GridItem, Icon, Rate, ActionSheet, Dialog, Checkbox, Tab, Tabs } from 'vant'

Vue.use(Tabbar)
Vue.use(Toast)
Vue.use(NavBar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Circle)
Vue.use(Search)
Vue.use(SwipeItem)
Vue.use(Swipe)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Icon)
Vue.use(Rate)
Vue.use(ActionSheet)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Tab)
Vue.use(Tabs)
