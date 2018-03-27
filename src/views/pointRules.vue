<template>
  <div>
    <div class="no-items text-center" v-show="!rule">
      <img class="img" src="../assets/images/icon_record.png">
      <div class="remind-text">
        您还未定义规则！
      </div>
    </div>
    <div v-show="rule" class="pointRules" v-html="ruleContent">
    </div>
  </div>
</template>
<script >
  import rest from '../scripts/restClient';
  import {
    unitFormat
  } from '../components/filters';
  import {
    getShop
  } from '../scripts/global';

  export default {
    name: 'pointRules',
    data() {
      return {
        rule: ""
      }
    },
    computed: {
      ruleContent() {
        return unitFormat(this.rule.replace(/[\r\n]/ig, "<br>"));
      }
    },
    methods: {
      init() {
        var self = this;
        getShop().then(function() {
          rest.get("dragon/pointSetting", null, function(data) {
            self.rule = data.data?data.data.rule:"";
          })
        })
      }
    },
    created: function() {
      this.init();
    }
  }
</script>
