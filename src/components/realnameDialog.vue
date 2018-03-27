<template>
	<x-dialog v-model="dialog.show" class="dg-dialog dg-dialog-name-modify">
		<div class="title">请填写您的旺旺昵称</div>
		<div class="operation">
			<input type="text" v-model="value">
			<p class="error-message">{{errorMessage}}</p>
		</div>
		<div class="dialog-operation">
			<button v-on:click="doOk" class="dialog-btn">确定</button>
		</div>
	</x-dialog>
</template>
<script>
import {
    XDialog
} from 'vux';
import rest from '../scripts/restClient';

export default {
	name: "aa",
	data(){
		return {
			value:"",
			errorMessage:""
		}
	},
	props: {
		dialog: Object
	},
	methods: {
		doOk(data) {
			this.dialog.action(this.value);
		}
	},
	components: {
		XDialog
	}
}
</script>
<style lang="scss">
	.dg-dialog-name-modify{
		.title{
			font-size: 0.373333rem;
		    margin-bottom: 0.266667rem;
		}
		input{
			font-size: 0.373333rem;
		    border: 1px solid #ddd;
		    height: 0.8rem;
		    border-radius: 0.053333rem;
		    margin-bottom: 0.2rem;
		    padding: 0 0.266667rem;
		}
		.error-message{
			font-size: 0.266667rem;
		    color: #d00;
		    margin-bottom: 0.266667rem;
		    height: 0.266667rem;
		    line-height: 0.266667rem;
		}
	}
</style>
