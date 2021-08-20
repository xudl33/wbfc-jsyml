<template>
<div class="conf-tpl-container">
    <ConfTplGroupList ref="confTpl" :btn-title="btnTitle" :dialog-title="dialogTitle" :showColumn="showColumn" :editor-props="editorProps" v-model="value" :submitDialog="submitDialog" :beforeOpenDialog="checkDataSourceNames"></ConfTplGroupList>
</div>
</template>

<script>
import ConfTplGroupList from './conf-tpl-group-list.vue';

export default {
    name: 'DatasourceEditor',
    components: {
        ConfTplGroupList
    },
    // components: {
    //     NormalTplEditor
    // },
    props: {
        value: {
            type: Array,
            required: true,
            default: () => {
                return [];
            }
        },
        // resultMapping: {
        //     type: Function,
        //     default: () => {}
        // }
    },
    data() {
        return {
            dataSourceNames: '', // 数据源名称表
            groupLabelArray: [], // 数据源名下拉框
            resultValue: [], // 返回值
            btnTitle: '添加数据源',
            dialogTitle: '- 添加数据源 -',
            showColumn: ['index', 0],
            editorProps: {
                tplForm: {
                    labelWidth: '20%', // 对话框中表单文字区域宽度
                    rules: {
                        groupLabel: [{
                            required: true,
                            message: '请选择数据源名称',
                            trigger: 'change'
                        }, {
                            validator: (rule, value, callback) => {
                                let reg = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
                                if (!reg.test(value)) {
                                    callback(new Error('只允许英文字母、数字、下划线[_]和横线[-]，且不能以数字开头'));
                                } else {
                                    if (this.dataSourceNames) {
                                        // let dataSourceName = 
                                    }
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }],
                        type: [{
                            required: true,
                            message: '请输入连接池驱动类型',
                            trigger: 'blur'
                        }],
                        url: [{
                            required: true,
                            message: '请输入数据库链接',
                            trigger: 'blur'
                        }],
                        username: [{
                            required: true,
                            message: '请输入数据库用户名',
                            trigger: 'blur'
                        }],
                        password: [{
                            required: true,
                            message: '请输入数据库密码',
                            trigger: 'blur'
                        }],
                        driverClassName: [{
                            required: true,
                            message: '驱动类名',
                            trigger: 'blur'
                        }]
                    }
                },
                tplFormElems: [{
                        'type': 'select',
                        'name': 'groupLabel',
                        'bind': 'group.label',
                        'label': '数据源名称',
                        'helps': '数据源名称要与数据源名称表中的一一对应'
                    },
                    {
                        'type': 'input',
                        'name': 'type',
                        'label': '连接池驱动类型',
                        'defVal': 'com.alibaba.druid.pool.DruidDataSource'
                    },
                    {
                        'type': 'input',
                        'name': 'url',
                        'label': '数据库链接',
                        'defVal': 'jdbc:mysql://{ip/domain}:{port}/{db_name}?allowMultiQueries=true&autoReconnect=true&useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull&useSSL=false&serverTimezone=Asia/Shanghai'
                    },
                    {
                        'type': 'input',
                        'name': 'username',
                        'label': '数据库用户名',
                        'defVal': ''
                    },
                    {
                        'type': 'input',
                        'name': 'password',
                        'label': '数据库密码',
                        'defVal': ''
                    },
                    {
                        'type': 'input',
                        'name': 'driverClassName',
                        'label': '驱动类名',
                        'defVal': 'com.mysql.cj.jdbc.Driver'
                    }
                ]
            }
        };
    },
    watch: {

    },
    methods: {
        checkDataSourceNames() {
            if (this.dataSourceNames && this.dataSourceNames.length > 0) {
                return true;
            }
            this.$parent.validate();
            return false;
        },
        submitDialog(val) {
            let result = [];
            if (val) {
                val.forEach((e, i) => {
                    result.push({
                        'dataSourceItem': true,
                        'group': {
                            'name': e.groupLabel,
                            'label': '数据源: ' + e.groupLabel,
                            'visible': false
                        },
                        'elems': [{
                                'type': 'input',
                                'name': 'type' + i,
                                'bind': 'wbfc.datasource.' + e.groupLabel + '.type',
                                'label': '连接池驱动类型',
                                'defVal': e.type
                            },
                            {
                                'type': 'input',
                                'name': 'url' + i,
                                'bind': 'wbfc.datasource.' + e.groupLabel + '.url',
                                'label': '数据库链接',
                                'defVal': e.url
                            },
                            {
                                'type': 'input',
                                'name': 'username' + i,
                                'bind': 'wbfc.datasource.' + e.groupLabel + '.username',
                                'label': '数据库用户名',
                                'defVal': e.username
                            },
                            {
                                'type': 'input',
                                'name': 'password' + i,
                                'bind': 'wbfc.datasource.' + e.groupLabel + '.password',
                                'label': '数据库密码',
                                'defVal': e.password
                            },
                            {
                                'type': 'input',
                                'name': 'driverClassName' + i,
                                'bind': 'wbfc.datasource.' + e.groupLabel + '.driver-class-name',
                                'label': '驱动类名',
                                'defVal': e.driverClassName
                            }
                        ]
                    });
                });
            }
            this.$set(this, 'resultValue', result);
            // this.$set(this, 'resultValue', );
            this.$emit('change', result);
            this.$emit('addToElems', this.$attrs.item, result);
        },
        setDataSourceNames(names) {
            if (names) {
                let arr = names.split(',');
                let arrMap = arr.map((a) => {
                    return {
                        value: a,
                        label: a
                    };
                });
                this.$set(this.editorProps.tplFormElems[0], 'items', arrMap);
            } else {
                this.$set(this.editorProps.tplFormElems[0], 'items', []);
            }
        }
    },
    mounted() {
        //console.log(this)
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->

<style scoped>

</style>
