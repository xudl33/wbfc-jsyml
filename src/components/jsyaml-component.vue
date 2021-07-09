<template>
<div class="jsyaml-container">
    <!-- <el-input v-if="value && value.wbfc" v-model="value.wbfc.install.name">
    </el-input> -->
    <el-row :gutter="50">
        <el-col :span="8">
            <div class="">默认值</div>
            <el-input id="defVal" type="textarea" :autosize="{ minRows: 10, maxRows: 20}" v-model="defVal" readOnly="true">
            </el-input>
            <el-button class="copy-btn" @click="copy('defVal')">复制到剪切板</el-button>
        </el-col>
        <el-col :span="8">
            <div class="">YAML格式配置</div>
            <el-input id="tplYaml" type="textarea" :autosize="{ minRows: 10, maxRows: 20}" v-model="tplYaml" readOnly="true">
            </el-input>
            <el-button class="copy-btn" @click="copy('tplYaml')">复制到剪切板</el-button>
        </el-col>
        <el-col :span="8">
            <div class="">JSON格式配置</div>
            <el-input id="tplJson" type="textarea" :autosize="{ minRows: 10, maxRows: 20}" v-model="tplJson" readOnly="true">
            </el-input>
            <el-button class="copy-btn" @click="copy('tplJson')">复制到剪切板</el-button>
        </el-col>
    </el-row>
</div>
</template>

<style scoped>
.jsyaml-container {
    display: -webkit-box;
}

.jsyaml-container>div:nth-child(1) {
    width: 100%;
}

.copy-btn{
    margin-top: 10px;
}
</style>

<script>
export default {
    name: 'jsyaml-component',
    data() {
        return {
            tplJson: '',
            tplYaml: '',
        };
    },
    props: {
        value: {
            type: Object,
            default () {
                return {};
            }
        },
        defVal:{
            type: String,
            default () {
                return '';
            }
        }
    },
    methods: {
        /* getJson(){
            return 
        },
        getYml(){
            return 
        } */
        copy(type) {
            document.getElementById(type).select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
            }
        }
    },
    computed: {
        // tplJson: (v) => {
        //     // return JSON.stringify(this.value, null, 2);
        //     console.log(this.value, JSON.stringify(this.value, null, 2));
        //     return "" + JSON.stringify(this.value, null, 2);
        // },
        // tplYaml: (v) => {
        //     //return jsyaml.dump(this.value);
        //     return 2222222;
        // },
    },
    watch: {
        value: {
            deep: true,
            immediate: true,
            handler: function (val, oldVal) {
                this.$set(this, 'tplJson', JSON.stringify(val, null, 2));
                this.$set(this, 'tplYaml', jsyaml.dump(val));

            }
        }
    },
    created(){
        
    }
}
</script>
