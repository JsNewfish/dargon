// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import flexible_css from './lib/flexible_css.debug'
import flexible from './lib/flexible'
import * as filters from './components/filters'
import {
	ToastPlugin,
	ConfirmPlugin,
	LoadingPlugin
} from 'vux';
import customDialog from './components/customDialog';
import realnameDialog from './components/realnameDialog';

Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.use(LoadingPlugin);

FastClick.attach(document.body)
Vue.config.productionTip = false


Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

//全局单位
window.unit = "积分";

let template = [
'<div id="app-wrap" class="app-wrap">',
'<App></App>',
'<custom-dialog v-bind:dialog="dialog" > </custom-dialog>',
'<realname-dialog v-bind:dialog="realNameDialog"></realname-dialog>',
'</div>'];

/* eslint-disable no-new */
window.application = new Vue({
	el: "#app-box",
	router,
	template: template.join(""),
	components: {
		App,
		customDialog,
		realnameDialog
	},
	data() {
		return {
			dialog: {
				content: "<p>hello</p>",
				show: false,
				link: "",
				btnText: "确定",
				action(event) {

				}
			},
			realNameDialog: {
				show: false,
				action() {

				}
			}
		}
	}
})