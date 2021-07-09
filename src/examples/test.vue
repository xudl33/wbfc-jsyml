<template>
<div>
    <el-input type="textarea" :autosize="{ minRows: 10}" placeholder="请输入内容" v-model="tplText">
    </el-input>
    <el-input v-model="tpl.wbfc.install.name" placeholder="请输入内容"></el-input>
</div>
</template>

<script>
export default {
    data() {
        return {
            tpl: {
                wbfc: {
                    install: {}
                }
            },
            tplText: ''
        };
    },
    watch: {
      'tpl': {
        deep: true,
        handler: function(val, oldVal){
          this.tplText = JSON.stringify(val, null, 2);
        }
      }
    },
    mounted() {
        let tpl = "wbfc:\r\n  install:\n    name: WTP大宗商品电子交易平台服务 # 安装名称";
        this.$set(this, 'tpl', jsyaml.load(tpl))
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
