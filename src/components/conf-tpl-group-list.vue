<template>
<div class="conf-tpl-container">
    <el-row>
        <el-button type="primary" @click="openDialog">{{btnTitle}}</el-button>
    </el-row>
    <el-row>
        <el-table ref="confGroupTable" :data="confTplGroupList" style="width:100%">
            <template v-for="(item, index) in showColumn" v-if="tplFormElems && tplFormElems.length > 0">
                <el-table-column type="index" v-if="item === 'index'" :key="'confGroupTableCloumn_' + index">
                </el-table-column>
                <el-table-column v-else :prop="tplFormElems[item].name" :label="tplFormElems[item].label" :key="'confGroupTableCloumn_' + index">
                </el-table-column>
            </template>
            <el-table-column label="排序" v-if="showSortColumn">
                <template slot-scope="scope">
                    <ListSortEditor v-model="confTplGroupList" :index="scope.$index" @change="sortChange" />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" v-if="showOperateColumn">
                <template slot-scope="scope">
                    <slot v-if="tplFormElems" :name="'confTplGroupListOperate'" :data="tplFormElems[scope.$index]">
                        <el-button @click.native.prevent="editItem(scope.$index)" type="text">
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="delItem(scope.$index)" type="text">
                            删除
                        </el-button>
                    </slot>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="closeDialog">
        <!-- <NormalTplEditor v-model="value" v-bind="editorProps"></NormalTplEditor> -->
        <TempleteEditor ref="templeteEditor" :tpl-form-elems="tplFormElems" v-model="tplModel" :tpl-form="editorProps.tplForm">

        </TempleteEditor>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="confimDialog">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import _assign from 'lodash/assign';
import _concat from 'lodash/concat';
import TempleteBinder from 'wbfc-vs-tpl-editor/components/templete-binder';
import TempleteEditor from 'wbfc-vs-tpl-editor/components/templete-editor';
import ListSortEditor from 'wbfc-vs-tpl-editor/components/list-sort-editor';

export default {
    name: 'ConfTplGroupList',
    mixins: [TempleteBinder],
    components: {
        TempleteEditor,
        ListSortEditor
    },
    // components: {
    //     NormalTplEditor
    // },
    props: {
        value: {
            type: Array,
            required: true
        },
        editorProps: { // 动态表单编辑器属性
            type: Object,
            required: true
        },
        showColumn: {
            type: Array,
            default () {
                return ['index'];
            }
        },
        btnTitle: { // 按钮文字
            type: String,
            default () {
                return '添加';
            }
        },
        dialogTitle: { // 对话框标题
            type: String,
            default () {
                return '- 添加 -';
            }
        },
        showSortColumn: { // 显示排序列
            type: Boolean,
            default () {
                return true;
            }
        },
        showOperateColumn: { // 显示操作列
            type: Boolean,
            default () {
                return true;
            }
        },
        submitDialog: { // 确认对话框回调
            type: Function,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            dialogFormVisible: false, // 对话框是否显示
            confTplGroupList: [], // 分组数据列表
            currentEditIndex: null // 当前编辑的索引,
        };
    },
    methods: {
        openDialog() {
            // 打开对话框
            this.dialogFormVisible = true;
        },
        closeDialog() {
            // 关闭对话框
            // 清空当前编辑索引
            this.currentEditIndex = null;
            this.dialogFormVisible = false;
            // 清空表单项
            this.$refs.templeteEditor.resetFields();
        },
        sortChange() {
            // 排序值变更回调
            if (this.submitDialog) {
                this.submitDialog(this.confTplGroupList);
            }
        },
        confimDialog() {
            // 确认对话框按钮回调
            let result = null;
            let valid = this.$refs.templeteEditor.validate();
            if (valid) {
                if (this.submitDialog) {
                    var val = _assign({}, this.tplModel);
                    // if (this.resultMapping) {
                    //     val = this.resultMapping.call(this, Object.assign({}, val));
                    // }
                    if (this.currentEditIndex != null) {
                        this.confTplGroupList.splice(this.currentEditIndex, 1, val);
                    } else {
                        this.confTplGroupList.push(val);
                    }
                    result = this.submitDialog(this.confTplGroupList);
                }
                if (result === false) {
                    return;
                }
                this.closeDialog();
            }
        },
        delItem(index) {
            // 删除项
            this.confTplGroupList.splice(index, 1);
            this.sortChange();
        },
        editItem(index) {
            // 编辑项
            this.currentEditIndex = index;
            // 先打开对话框
            this.openDialog();
            // 后更新值，否则会出现先开哪个 哪个就是默认值的问题
            this.$nextTick(() => {
                var val = _assign({}, this.confTplGroupList[index]);
                this.tplModel = val;
            });
        }
    },
    mounted() {
        // 初始化添加监控属性
        if (this.editorProps.tplFormElems) {
            this.tplFormElems = this.editorProps.tplFormElems;
        }
        this.initWatch();
        // console.log(this.tplModel)
        // 如果有默认值需要设置默认值到列表
        if (this.value) {
            this.confTplGroupList = _concat([], this.value);
            this.sortChange();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.conf-tpl-container>>>.tpl-editor-container {
    width: 100%;
}

.conf-tpl-container>>>.templete-editor {
    --pageViewHeight: 100%;
}

.conf-tpl-container>>>.el-form-item {
    margin-bottom: 22px;
}
</style>
