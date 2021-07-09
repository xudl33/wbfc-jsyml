<template>
<div class="tpl-editor">
    <div>{{tpl.name}}</div>
    <TempleteEditor v-if="tplFormElems" :tpl-form-elems="tplFormElems" v-model="tplModel" ref="tpl" :tpl-form="tplForm">
        <template v-slot:showComponent>
            <JsyamlComponent v-model="componentModel" :def-val="tpl.confTpl" />
        </template>
        <template v-slot:form_item_label_insname="sc">

        </template>
        <!-- <template v-slot:form_item_insname="sc">
            {{sc}}
        </template> -->
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
import Axios from 'axios';
import _ from 'lodash'
import JsyamlComponent from './jsyaml-component'
import TempleteBinder from 'wbfc-vs-tpl-editor/components/templete-binder'
import TempleteEditor from 'wbfc-vs-tpl-editor/components/templete-editor'

export default {
    name: 'jsyaml-editor',
    mixins: [TempleteBinder],
    components: {
        TempleteEditor,
        JsyamlComponent
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
        };
    },
    methods: {
        staticData() {
            // 静态加载数据
            setTimeout(function () {
                that.addTplFormElems({
                    type: 'switch',
                    name: 'insboolean',
                    label: '是否安装',
                    bind: 'wbfc.install.enabled',
                }, true);
            }, 1000);
        },
        dynamicData() {
            // 动态加载数据
            let that = this;
            // 加载数据
            Axios({
                url: 'http://localhost:8861/w/KlConfTpl/get',
                contentType: 'application/json;charset=UTF-8',
                headers: {
                    'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJfbmFtZSI6ImFkbWluIiwib3BlbklkIjoiMSIsInVzZXJJZCI6MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9reWxpbl9hZG1pbiIsImtscDp1c3I6b3B0Iiwia2xwOm9wdCIsIlJPTEVfdXNlciIsIlJPTEVfYWNjb3VudCIsIlJPTEVfYWRtaW4iLCJzeXM6YmFja3VwIiwiYXV0aGVkIiwib3B0Om1hZyIsInN5czpjdXN0b21lciIsImFjdGl2ZWQiLCJzeXM6c2NoZWR1bGUiXSwiZXhwIjoxNjI1ODQyMTc0fQ.fD6qj8PpyEX3FmfTarQoH5BqgAPyr9BatGPuQL39gYmxMKQc3CcsUZPuJZwh5BjtfVD-3sRn7BdZDlPpbFxyeoNGMFug2fMwiOQOP44BWgFWSlVwBBSDQkGygQEdmu5t0Xd3FzhAx3D-ucymgNSFRtjnbZ40qcqqBf-5s_XDlB3UJleLGE2m2yvX5dTGtYy3eW2Hn1dGC_fBVHvZwH7mCGtbP1n3DJql97iVzpMNLP0tBHvY8-mqamKke4spCka2Gbc9RDj5kzRR91bSoa772m9lXhAnBuG3PR5i6ymwFYJt5a_LbupeOwnCAMPYjfAaB5Fd_71G2EbLwZYMzp0_cg'
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
                    confRes = eval("(" + (res.result.confResource || {}) + ")");
                }

                _.assign(conf, that.defVal, confRes);
                that.$set(that, 'tplFormElems', conf.tplFormElems || []);
                that.$set(that, 'tplModel', conf.tplModel || {});
                that.$set(that, 'tplForm', conf.tplForm || {});
                console.log(conf.tplForm);
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
        // this.staticData();
        // 加载动态数据
         this.dynamicData();
        // 手填数据
        //this.manulData();
    }
}
</script>
