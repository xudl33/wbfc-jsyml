<template>
<div class="tpl-maker">
    <el-row :gutter="20">
        <el-col :span="12">
            <fieldset>
                <legend>组件预览</legend>
                <div class="tpl-maker-shower">
                    <TempleteEditor :tpl-form-elems="tplData.tplFormElems" v-model="tplData.tplModel" ref="tpl" :tpl-form="tplData.tplForm">
                    </TempleteEditor>
                </div>
            </fieldset>
            <fieldset>
                <legend>组件源码</legend>
                <div class="tpl-maker-coder">
                    <el-input type="textarea" :rows="20" placeholder="请输入内容" v-model="tpl">
                    </el-input>
                </div>
            </fieldset>
        </el-col>
        <el-col :span="12">
            <div class="">
                <el-button type="primary" @click="addTplItem">新增</el-button>
                <el-button type="success" @click="impTplItem">从左侧源码导入</el-button>
                <el-button type="info" icon="el-icon-question" @click="drawer = true">帮助</el-button>
            </div>
            <el-divider></el-divider>
            <el-collapse v-model="activeNames">
                <el-form ref="form" :model="form">
                    <el-collapse-item :title="item.name || item.group.name" :name="index" v-for="(item, index) in tplData.tplFormElems" :key="'item_' + index">
                        <template v-if="item.group">
                            <el-divider>{{item.group.label}}</el-divider>
                            <div v-for="(gm, i) in item.elems" :key="'tplForm_group_' + index + '_' + i">
                                <el-form-item label="类型">
                                    <el-autocomplete class="item_type" v-model="gm.type" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
                                </el-form-item>
                                <el-form-item label="标签名称">
                                    <el-input v-model="gm.label"></el-input>
                                </el-form-item>
                                <el-form-item label="模型名称">
                                    <el-input v-model="gm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="绑定名称">
                                    <el-input v-model="gm.bind"></el-input>
                                </el-form-item>
                                <el-form-item v-if="'switch' != gm.type" label="默认值(预览不显示)">
                                    <el-input v-model="gm.defVal"></el-input>
                                </el-form-item>
                                <el-form-item v-else label="默认值(预览不显示)">
                                    <el-switch v-model="gm.defVal"></el-switch>
                                </el-form-item>
                                <el-form-item v-if="'switch' != gm.type" label="模型值">
                                    <el-input v-model="gm.modelVal" @input="((val) => setGroupModelVal(gm, val))"></el-input>
                                </el-form-item>
                                <el-form-item v-else label="模型值">
                                    <el-switch v-model="gm.modelVal"></el-switch>
                                </el-form-item>
                                <el-form-item v-if="gm.helps" label="帮助信息">
                                    <el-input v-model="gm.helps"></el-input>
                                </el-form-item>
                            </div>
                            <el-divider></el-divider>
                        </template>
                        <template v-else>
                            <el-form-item label="类型">
                                <el-autocomplete class="item_type" v-model="item.type" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
                            </el-form-item>
                            <el-form-item label="标签名称">
                                <el-input v-model="item.label"></el-input>
                            </el-form-item>
                            <el-form-item label="模型名称">
                                <el-input v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="绑定名称">
                                <el-input v-model="item.bind"></el-input>
                            </el-form-item>
                            <el-form-item v-if="'switch' != item.type" label="默认值(预览不显示)">
                                <el-input v-model="item.defVal"></el-input>
                            </el-form-item>
                            <el-form-item v-else label="默认值(预览不显示)">
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
    <el-drawer title="使用帮助" :visible.sync="drawer" direction="rtl">
        <div class="tpl-maker-drawer">
            <h2>格式</h2>
            <p>本模板是通过wbfc-vs-tpl-editor编写的, 语法格式为</p>
            <pre>
                {
                    tplFormElems: [], // 编辑器组件参数
                    tplForm: {}, // 编辑器表单参数
                    tplModel: {} // 编辑器数据模型
                }
            </pre>
            <p>本编辑器提供了一些简单的基础功能可视化添加，更为复杂的可配置项具体内容，可以参考在线文档：</p>
            <a href="https://github.com/xudl33/wbfc-vs-tpl-editor#attributes-1" target="_blank">https://github.com/xudl33/wbfc-vs-tpl-editor</a>
            <p>本功能为开发人员使用工具，通过不同的配置可以达到丰富的功能，如果遇到无法使用配置解决的问题，可以联系开发人员或参考帮助文档</p>
        </div>
    </el-drawer>
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

.tpl-maker-shower {
    border: 1px solid #DCDFE6;
    padding: 10px;
}

.tpl-maker-shower>>>.templete-editor {
    --pageViewHeight: 20rem;
}

.tpl-maker fieldset {
    border: 1px solid #409eff;
}

.tpl-maker>>>.tpl-editor-container {
    --viwer-width: 0%;
}

.tpl-maker-drawer{
    padding: 1rem;
}
</style>

<script>
import _ from 'lodash';
import TempleteBinder from 'wbfc-vs-tpl-editor/components/templete-binder';
import TempleteEditor from 'wbfc-vs-tpl-editor/components/templete-editor';
export default {
    name: 'tpl-maker',
    mixins: [TempleteBinder],
    components: {
        TempleteEditor,
    },
    data() {
        return {
            tpl: '',
            activeNames: '',
            form: {},
            tplData: {
                tplFormElems: [],
                tplModel: {

                },
            },
            drawer: false,
        };
    },
    watch: {
        'tplData.tplFormElems': {
            deep: true,
            immediate: true,
            handler: function (val, oldVal) {
                if (!this.tplData.tplModel) {
                    this.$set(this.tplData, 'tplModel', {});
                } else {
                    Object.keys(this.tplData.tplModel).forEach(k => {
                        let exis = false;
                        for (var i in this.tplData.tplFormElems) {
                            if (this.tplData.tplFormElems[i].group) {
                                for (var j in this.tplData.tplFormElems[i].elems) {
                                    if (k === this.tplData.tplFormElems[i].elems[j].name) {
                                        exis = true;
                                        break;
                                    }
                                }
                            } else {
                                if (k === this.tplData.tplFormElems[i].name) {
                                    exis = true;
                                }
                            }
                        }
                        if (!exis) {
                            this.$delete(this.tplData.tplModel, k);
                        }
                    });

                }
                for (let i = 0; i < val.length; i++) {
                    let name = val[i].name;
                    if (name && '' != name) {
                        let modVal = val[i].modelVal;
                        if (modVal && modVal != '') {
                            // if (val[i].type == 'switch') {
                            //     modVal = ('true' == modVal.toLowerCase());
                            // }
                            this.$set(this.tplData.tplModel, name, modVal);
                        } else {
                            // 如果模型有值就赋值给modelVal
                            if (this.tplData.tplModel[name] && modVal != '') {
                                this.$set(this.tplData.tplFormElems[i], 'modelVal', this.tplData.tplModel[name]);
                            } else {
                                this.$delete(this.tplData.tplModel, name);
                            }
                        }
                    } else {
                        // 如果是group要添加到items中
                        if (this.tplData.tplFormElems[i].group) {
                            for (let j = 0; j < this.tplData.tplFormElems[i].elems.length; j++) {
                                let gElem = this.tplData.tplFormElems[i].elems[j];
                                name = gElem.name;
                                if (gElem.name == name) {
                                    this.$set(this.tplData.tplFormElems[i].elems[j], 'modelVal', this.tplData.tplModel[name]);
                                }
                            }
                        }
                    }
                }
                let tempData = _.cloneDeep(this.tplData);
                for (let i = 0; i < tempData.tplFormElems.length; i++) {

                    if (tempData.tplFormElems[i].group) {
                        for (let j = 0; j < this.tplData.tplFormElems[i].elems.length; j++) {
                            delete tempData.tplFormElems[i].elems[j].modelVal;
                        }
                    } else {
                        delete tempData.tplFormElems[i].modelVal;
                    }
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
        setGroupModelVal(gm, val) {
            //this.$set(gElem, 'modelVal', val);
            this.$set(this.tplData.tplModel, gm.name, val);
            //this.$forceUpdate();
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
