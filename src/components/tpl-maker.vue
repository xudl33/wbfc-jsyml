<template>
<div class="tpl-maker">
    <el-row :gutter="20">
        <el-col :span="12">
            <div class="">
                <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="tpl">
                </el-input>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="">
                <el-button type="primary" @click="addTplItem">新增</el-button>
                <el-button type="success" @click="impTplItem">从左侧导入</el-button>
            </div>
            <el-divider></el-divider>
            <el-collapse v-model="activeNames">
                <el-form ref="form" :model="form">
                    <el-collapse-item :title="item.name" :name="index" v-for="(item, index) in tplData.tplFormElems" :key="'item_' + index">
                        <template v-if="item.group">
                            <el-divider>{{item.group.label}}</el-divider>
                            <div v-for="(gm, i) in item.elems" :key="'tplForm_group_' + index + '_' + i">
                                <el-form-item label="类型">
                                    <el-autocomplete class="item_type" v-model="item.type" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
                                </el-form-item>
                                <el-form-item label="名称">
                                    <el-input v-model="item.name"></el-input>
                                </el-form-item>
                                <el-form-item label="绑定名称">
                                    <el-input v-model="item.bind"></el-input>
                                </el-form-item>
                                <el-form-item label="标签">
                                    <el-input v-model="item.label"></el-input>
                                </el-form-item>
                                <el-form-item v-if="'switch' != item.type" label="默认值">
                                    <el-input v-model="item.defVal"></el-input>
                                </el-form-item>
                                <el-form-item v-else label="默认值">
                                    <el-switch v-model="item.defVal"></el-switch>
                                </el-form-item>
                                <el-form-item v-if="'switch' != item.type" label="模型值">
                                    <el-input v-model="item.modelVal"></el-input>
                                </el-form-item>
                                <el-form-item v-else label="模型值">
                                    <el-switch v-model="item.modelVal"></el-switch>
                                </el-form-item>
                                <el-form-item v-if="item.helps" label="帮助信息">
                                    <el-input v-model="item.helps"></el-input>
                                </el-form-item>
                            </div>
                            <el-divider></el-divider>
                        </template>
                        <template v-else>
                            <el-form-item label="类型">
                                <el-autocomplete class="item_type" v-model="item.type" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
                            </el-form-item>
                            <el-form-item label="名称">
                                <el-input v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="绑定名称">
                                <el-input v-model="item.bind"></el-input>
                            </el-form-item>
                            <el-form-item label="标签">
                                <el-input v-model="item.label"></el-input>
                            </el-form-item>
                            <el-form-item v-if="'switch' != item.type" label="默认值">
                                <el-input v-model="item.defVal"></el-input>
                            </el-form-item>
                            <el-form-item v-else label="默认值">
                                <el-switch v-model="item.defVal"></el-switch>
                            </el-form-item>
                            <el-form-item v-if="'switch' != item.type" label="模型值">
                                <el-input v-model="item.modelVal"></el-input>
                            </el-form-item>
                            <el-form-item v-else label="模型值">
                                <el-switch v-model="item.modelVal"></el-switch>
                            </el-form-item>
                            <el-form-item v-if="item.helps" label="帮助信息">
                                <el-input v-model="item.helps"></el-input>
                            </el-form-item>
                        </template>

                    </el-collapse-item>
                </el-form>
            </el-collapse>
        </el-col>
    </el-row>
</div>
</template>

<style scoped>
.tpl-maker .item_type {
    width: 100%;
}

.tpl-maker>>>.el-collapse-item.is-active {
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
}

.tpl-maker>>>.el-collapse-item__header.is-active {
    font-weight: bold;
    color: #409EFF;
}
</style>

<script>
import _ from 'lodash';
export default {
    name: 'tpl-maker',
    /* mixins: [TempleteBinder],
    components: {
        TempleteEditor,
        JsyamlComponent
    }, */
    data() {
        return {
            tpl: '',
            activeNames: '',
            form: {},
            tplData: {
                tplFormElems: [],
                tplModel: {

                },
            }
        };
    },
    watch: {
        'tplData.tplFormElems': {
            deep: true,
            immediate: true,
            handler: function (val, oldVal) {
                if(!this.tplData.tplModel){
                    this.$set(this.tplData, 'tplModel', {});
                }
                for (let i = 0; i < val.length; i++) {
                    let name = val[i].name;
                    if (name && '' != name && 'newTpl' != name) {
                        let modVal = val[i].modelVal;
                        if (modVal) {
                            // if (val[i].type == 'switch') {
                            //     modVal = ('true' == modVal.toLowerCase());
                            // }
                            this.$set(this.tplData.tplModel, name, modVal);
                        } else {
                            // 如果模型有值就赋值给modelVal
                            if (this.tplData.tplModel[name]) {
                                this.$set(this.tplData.tplFormElems[i], 'modelVal', this.tplData.tplModel[name]);
                            } else {
                                this.$delete(this.tplData.tplModel, name);
                            }
                        }
                    }
                }
                let tempData = _.cloneDeep(this.tplData);
                for (let i = 0; i < tempData.tplFormElems.length; i++) {
                    delete tempData.tplFormElems[i].modelVal;
                    // if ('switch' == tempData.tplFormElems[i].type) {
                    //     if (tempData.tplFormElems[i].type.type == 'switch') {
                    //         let defV = tempData.tplFormElems[i].defVal;
                    //         if (defV && "true" == defV.toLowerCase()) {
                    //             tempData.tplFormElems[i].defVal = true;
                    //         } else {
                    //             tempData.tplFormElems[i].defVal = false;
                    //         }
                    //         let modV = tempData.tplFormElems[i].modelVal;
                    //         if (modV && "true" == modV.toLowerCase()) {
                    //             tempData.tplFormElems[i].modelVal = true;
                    //         } else {
                    //             tempData.tplFormElems[i].modelVal = false;
                    //         }
                    //     }
                    // }
                    //this.$delete(tempData.tplFormElems[i], 'modelVal');
                }
                this.$set(this, 'tpl', JSON.stringify(tempData, null, 2));
            }
        }
    },
    computed: {

    },
    methods: {
        querySearch(queryString, cb) {
            var results = [{
                'value': 'input',
            }, {
                'value': 'hidden',
            }, {
                'value': 'radio',
            }, {
                'value': 'radio-group',
            }, {
                'value': 'checkbox',
            }, {
                'value': 'checkbox-group',
            }, {
                'value': 'select',
            }, {
                'value': 'cascader',
            }, {
                'value': 'switch',
            }, {
                'value': 'slider',
            }, {
                'value': 'time-select',
            }, {
                'value': 'time-picker',
            }, {
                'value': 'date-picker',
            }, {
                'value': 'date-time-picker',
            }, {
                'value': 'rate',
            }, {
                'value': 'color-picker',
            }, {
                'value': 'transfer',
            }, {
                'value': 'custom',
            }];
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        addTplItem() {
            this.tplData.tplFormElems.push({
                type: '',
                name: 'newTpl',
                bind: '',
                label: '',
                defVal: '',
                modelVal: null,
            });
            this.$set(this, 'activeNames', this.tplData.tplFormElems.length - 1);
        },
        // toString(val) {
        //     return val + '';
        // },
        impTplItem() {
            let tplJson = JSON.parse(this.tpl) || {};
            // for (let i in tplJson.tplFormElems) {
            //     let t = tplJson.tplFormElems[i];
            //     if ('switch' == t.type) {
            //         t.defVal = this.toString(t.defVal);
            //         t.modelVal = this.toString(t.modelVal);
            //     }
            // }
            this.$set(this, 'tplData', tplJson);
            this.$set(this, 'activeNames', this.tplData.tplFormElems.length - 1);
        }
    },
    mounted() {

    }
}
</script>
