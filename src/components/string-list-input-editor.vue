<template>
<div class="string-list-input-container">
    <el-input v-model="inputVal" v-bind="$attrs" v-on="$listeners"></el-input>
</div>
</template>

<script>
export default {
    name: 'StringListInputEditor',
    // components: {
    //     NormalTplEditor
    // },
    props: {
        value: {
            type: Array,
            default: () => {
                return [];
            },
            required: true
        }
    },
    data() {
        return {
            inputVal: '', // 输入框值
            valArray: [], // 值对应的数组
        };
    },
    watch: {
        'inputVal': function (val, oldVal) {
            let temp = [];
            if (val) {
                temp = val.split(',');
            }
            this.$set(this, 'valArray', temp);
            // 触发事件
            this.$emit('input', temp);
        },

    },
    computed: {},
    methods: {
        setInputVal(val) {
            let temp = [];
            if (val) {
                temp = val.split(',');
            }
            // 触发事件
            // this.$emit('addToElems', this.$attrs.item, temp);
            this.$emit('input', temp);
        },
        mergerDefVal() {
            let defVal = this.value.join(',');
            this.$set(this, 'inputVal', defVal);
        }
    },
    mounted() {
        // 替换默认的input事件 如果不替换 默认的input事件会导致赋值出现warning警告
        // [Vue warn]: Invalid prop: type check failed for prop "value". Expected Array, got String with value "xxxx,yyyyy".
        this.$set(this.$listeners, 'input', this.setInputVal);
        // 设置默认值
        this.mergerDefVal();

    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->

<style scoped>

</style>
