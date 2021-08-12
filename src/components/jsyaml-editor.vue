<template>
<div class="tpl-editor">
    <div>{{tpl.name}}</div>
    <!-- <AsyncComponent url="http://localhost:8861/static/vue/test.js">
    </AsyncComponent> -->
    <!-- <AsyncComponent url="http://localhost:8861/static/vue/testCom.js" @change="asyncChange" v-model="asyncModel">
         <template v-slot:test-slot="sc">
            22222222222
            {{sc}}
        </template>
    </AsyncComponent> -->

    <!-- <AsyncComponent url="http://localhost:8861/static/vue/DatasourceEditor.js" v-model="tplModel.DatasourceEditor">
    </AsyncComponent> -->
    <!-- <componentA></componentA> -->
    <!-- <testCom></testCom> -->
    <TempleteEditor v-if="tplFormElems" :tpl-form-elems="tplFormElems" v-model="tplModel" ref="tpl" :tpl-form="tplForm">
        <template v-slot:showComponent>
            <JsyamlComponent v-model="componentModel" :def-val="tpl.confTpl" />
        </template>
    </TempleteEditor>
</div>
</template>

<style scoped>
/* .tpl-editor>>>.templete-editor {
  --viwer-width: 50%;
}
.tpl-editor>>>.templete-editor .tpl-viewer-container{
  border-right: 10px solid #ccc;
} */
</style>

<script>
import Vue from 'vue';
import Axios from 'axios';
import _ from 'lodash';
import JsyamlComponent from './jsyaml-component';
import TempleteBinder from 'wbfc-vs-tpl-editor/components/templete-binder';
import TempleteEditor from 'wbfc-vs-tpl-editor/components/templete-editor';
import AsyncComponent from './async-component';
// import ListSortEditor from 'wbfc-vs-tpl-editor/components/list-sort-editor';
// import AsyncComponent from '@/../AsyncComponent.min.js';

// import AsyncComponent from '../../test/AsyncComponent.min.aa';

// import DatasourceEditor from './datasource-editor';
//import DatasourceEditor from './datasource-editor.js'
//import DatasourceEditor from 'http://localhost:8861/static/vue/datasource-editor.vue'
// let tc = test.render();
//console.log( new Function(test));
export default {
    name: 'jsyaml-editor',
    mixins: [TempleteBinder],
    components: {
        TempleteEditor,
        JsyamlComponent,
        // ListSortEditor,
        AsyncComponent,
        // DatasourceEditor
        // testCom: testComJs.default
    },
    beforeCreate() {
        //console.log(Vue.VueComponentLoader);
        Vue.$formItemComponentsManager.addComponent({
            AsyncComponent
        });
    },
    data() {
        return {
            defVal: {
                tplFormElems: [{
                    type: 'input',
                    name: 'insname',
                    label: '安装名称',
                    bind: 'wbfc.install.name',
                }],
                tplModel: {
                    insname: 'WTP大宗商品电子交易平台服务',
                },
                tplForm: {
                    rules: {

                    },
                    bottomBtns: [{
                        type: 'primary',
                        label: '打印模板数据到控制台',
                        events: {
                            click: (e) => {
                                var tplData = Object.assign({}, this.componentModel);
                                var str = JSON.stringify(tplData, null, 2);
                                console.log(str);
                                this.$alert('数据已打印到控制台，请查看');
                            }
                        }
                    }]
                }
            },
            tpl: {},
            tplFormElems: [],
            tplModel: {},
            tplForm: {},
            asyncModel: 'yyyyyyyy'
        };
    },
    methods: {
        asyncChange(val) {
            this.asyncModel = val;
            console.log(this.asyncModel);
        },
        datasourceChange(list) {
            let delElem = [];
            this.tplFormElems.forEach((e, i) => {
                // 删除elem
                if (true === e.dataSourceItem) {
                    delElem.push(e);
                }
            });
            if (delElem.length > 0) {
                delElem.forEach(e => {
                    that.deleteElem(e);
                });
                delElem = [];
            }
            list.forEach(e => this.addTplFormElems(e));
        },
        staticData() {
            let that = this;
            // 静态加载数据
            setTimeout(function () {
                let uuid = that.$parent._uid + ' ' + that._uid;
                that.addTplFormElems({
                    type: 'switch',
                    name: 'insboolean',
                    label: '是否安装',
                    bind: 'wbfc.install.enabled',
                }, true);
                that.addTplFormElems({
                    type: 'async-component',
                    name: 'DatasourceEditor',
                    label: '数据源列表',
                    notMapping: true,
                    attrs: {
                        url: "http://localhost:8861/static/vue/DatasourceEditor.js",
                        // url: "http://localhost:8861/static/vue/componentA.js"
                    },
                    events: {
                        change: (list) => {
                            let delElem = [];
                            that.tplFormElems.forEach((e, i) => {
                                // 删除elem
                                if (true === e.dataSourceItem) {
                                    delElem.push(e);
                                }
                            });
                            if (delElem.length > 0) {
                                delElem.forEach(e => {
                                    that.deleteElem(e);
                                });
                                delElem = [];
                            }
                            list.forEach(e => that.addTplFormElems(e));
                        }
                    }
                }, [{
                        "type": "com.alibaba.druid.pool.DruidDataSource",
                        "url": "jdbc:mysql://{ip/domain}:{port}/{db_name}?allowMultiQueries=true&autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=Asia/Shanghai",
                        "driverClassName": "com.mysql.cj.jdbc.Driver",
                        "groupLabel": "aa",
                        "username": "aa",
                        "password": "aa"
                    },
                    {
                        "type": "com.alibaba.druid.pool.DruidDataSource",
                        "url": "jdbc:mysql://{ip/domain}:{port}/{db_name}?allowMultiQueries=true&autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=Asia/Shanghai",
                        "driverClassName": "com.mysql.cj.jdbc.Driver",
                        "groupLabel": "bb",
                        "username": "bb",
                        "password": "bb"
                    }
                ]);
                // that.addTplFormElems({
                //     type: 'datasource-editor',
                //     name: 'DatasourceEditor',
                //     label: '数据源列表',
                //     notMapping: true,
                //     events: {
                //         change: (list) => {
                //             let delElem = [];
                //             that.tplFormElems.forEach((e, i) => {
                //                 // 删除elem
                //                 if (true === e.dataSourceItem) {
                //                     delElem.push(e);
                //                 }
                //             });
                //             if (delElem.length > 0) {
                //                 delElem.forEach(e => {
                //                     that.deleteElem(e);
                //                 });
                //                 delElem = [];
                //             }
                //             list.forEach(e => that.addTplFormElems(e));
                //         }
                //     }
                // }, [{
                //         "type": "com.alibaba.druid.pool.DruidDataSource",
                //         "url": "jdbc:mysql://{ip/domain}:{port}/{db_name}?allowMultiQueries=true&autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=Asia/Shanghai",
                //         "driverClassName": "com.mysql.cj.jdbc.Driver",
                //         "groupLabel": "aa",
                //         "username": "aa",
                //         "password": "aa"
                //     },
                //     {
                //         "type": "com.alibaba.druid.pool.DruidDataSource",
                //         "url": "jdbc:mysql://{ip/domain}:{port}/{db_name}?allowMultiQueries=true&autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=Asia/Shanghai",
                //         "driverClassName": "com.mysql.cj.jdbc.Driver",
                //         "groupLabel": "bb",
                //         "username": "bb",
                //         "password": "bb"
                //     }
                // ]);
            }, 1000);
        },
        dynamicData() {
            // 动态加载数据
            let that = this;
            let jsYamlEditor = this;
            // 加载数据
            Axios({
                url: 'http://localhost:8861/w/KlConfTpl/get',
                contentType: 'application/json;charset=UTF-8',
                headers: {
                    'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJfbmFtZSI6ImFkbWluIiwib3BlbklkIjoiMSIsInVzZXJJZCI6MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9reWxpbl9hZG1pbiIsImtscDp1c3I6b3B0Iiwia2xwOm9wdCIsIlJPTEVfdXNlciIsIlJPTEVfYWNjb3VudCIsIlJPTEVfYWRtaW4iLCJzeXM6YmFja3VwIiwiYXV0aGVkIiwib3B0Om1hZyIsInN5czpjdXN0b21lciIsImFjdGl2ZWQiLCJzeXM6c2NoZWR1bGUiXSwiZXhwIjoxNjI4Mjc2NzM5fQ.Stu_ehLzBzGThj7x5joP77oBM5Ogf4Px5PMI1b7Xcu_tM_iMNO0pW-kFpwKGfD6Vhk-n3NAiAnUqBmp3B0OuTNT6_NjBurzdLN-__fwgIJ7VmwY4nhPAEyokXPjXQlkZxZ_3yHVb7iC8_vU2nzhcMLdQKrlvd8zH47QWsy63s__jXPcRXzlDvrqnf2keBAOA0wpyQY7xF218nacwh8MObA24gRQEkEGFWvbcBcWUeQP-x3MBvh5FwJbLpcatdbYuZih7Qqo5u7_41AaLI4Uno6DN-VuCmxdvC_1QKOFn_OzsYC6KZ_-uUEFFVaG0MV2zoVzRcCdfmCwMqtNGzrkeCg'
                },
                method: 'post',
                data: {
                    'id': "5890022808436942541"
                }
            }).then(function (response) {
                let conf = {};
                let res = response.data;
                let confRes = null;
                that.$set(that, 'tpl', res.result);
                //that.$set(that.tpl, 'confTpl', res.result.confTpl);
                try {
                    confRes = JSON.parse(res.result.confResource || "{}");
                } catch (e) {
                    // let rec = 'conRes = ' + res.result.confResource || {} + '';
                    // console.log(rec)
                    // confRes = eval(rec);
                    confRes = new Function(`return ${res.result.confResource}`).call(that);
                    // eval("(" + (res.result.confResource ) + ")");
                }

                _.assign(conf, that.defVal, confRes);
                that.$set(that, 'tplFormElems', conf.tplFormElems || []);
                that.$set(that, 'tplModel', conf.tplModel || {});
                that.$set(that, 'tplForm', conf.tplForm || {});
                // console.log(conf.tplForm);
                // 需要调用初始化开启属性监控
                that.initWatch();

            }).catch(function (response) {
                console.log('axios exception', response);
            });
        },
        manulData() {
            let dev = 'wbfc:\n' +
                '  sms:\n' +
                '    huaxin:\n' +
                '      username: AC00524 # 华信用户名\n' +
                '      password: AC0052484 # 华信密码\n' +
                '      sendUrl: https://dx.ipyy.net/smsJson.aspx # 华信发送URL\n' +
                '      overageUrl: https://dx.ipyy.net/smsJson.aspx # 华信获取余额URL';
            let conf = {
                "tplFormElems": [{
                        "type": "input",
                        "name": "username",
                        "bind": "wbfc.sms.huaxin.username",
                        "label": "华信用户名",
                        "defVal": ""
                    },
                    {
                        "type": "input",
                        "name": "password",
                        "bind": "wbfc.sms.huaxin.password",
                        "label": "华信用户密码",
                        "defVal": ""
                    },
                    {
                        "type": "input",
                        "name": "sendUrl",
                        "bind": "wbfc.sms.huaxin.sendUrl",
                        "label": "发送接口URL",
                        "defVal": ""
                    },
                    {
                        "type": "input",
                        "name": "overageUrl",
                        "bind": "wbfc.sms.huaxin.overageUrl",
                        "label": "获取余额接口URL",
                        "defVal": ""
                    }
                ],
                "tplModel": {
                    "username": "AC00524",
                    "password": "AC0052484",
                    "sendUrl": "https://dx.ipyy.net/smsJson.aspx",
                    "overageUrl": "https://dx.ipyy.net/smsJson.aspx"
                }
            };
            this.$set(this, 'tplFormElems', conf.tplFormElems);
            this.$set(this, 'tplModel', conf.tplModel);
            this.$set(this, 'tplForm', conf.tplForm);
            this.$set(this.tpl, 'confTpl', dev);
            // 需要调用初始化开启属性监控
            this.initWatch();
        }
    },
    mounted() {
        // 加载静态数据
        this.staticData();
        //console.log(Vue.defineAsyncComponent);
        // 加载动态数据
        //this.dynamicData();
        // 手填数据
        //this.manulData();
    }
}
</script>
