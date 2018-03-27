<template>
	<x-dialog v-model="dialog.show" class="dg-dialog">
      <div class="dialog-content" v-html="dialog.content">
      </div>
      <div class="dialog-operation">
        <button v-on:click="dialog.action" class="dialog-btn">{{dialog.btnText}}</button>
      </div>
      <a v-on:click="dialog.show=false" class="dialog-btn-close" ></a>
    </x-dialog>
</template>
<script>
	import {
    XDialog
  } from 'vux';

export default {
	name: "customDialog",
	props: {
		dialog: Object
	},
	components: {
		XDialog
	}
}
</script>

