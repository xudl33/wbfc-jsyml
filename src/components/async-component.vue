<template>
<div>
    <component :is="mode" v-model="value" v-bind="$attrs" v-on="$listeners" :ref="'async_' + _uid">
        <template v-for="s in scopedSlotsList" :slot="s.name">
            <slot :name="s.name" :data="s.value"></slot>
        </template>
    </component>
</div>
</template>

<script>
import Axios from 'axios';
export default {
    name: 'AsyncComponent',
    install(Vue, options) {
        Vue.component(this.name, this);
    },
    props: {
        value: {
            type: Object | Array | String | Boolean | Function | Number | Promise
        },
        // 父组件提供请求地址
        url: {
            type: String,
            default: ''
        }
    },
    inheritAttrs: true,
    data() {
        return {
            resData: '',
            mode: '',
            scopedSlotsList: [],
        };
    },
    watch: {
        url: {
            immediate: true,
            async handler(val, oldVal) {
                if (!this.url) return;
                // Cache 缓存 根据 url 参数
                if (!window.SyncComponentCache) {
                    window.SyncComponentCache = {};
                }
                let res;
                if (!window.SyncComponentCache[this.url]) {
                    window.SyncComponentCache[this.url] = Axios.get(this.url);
                    res = await window.SyncComponentCache[this.url];
                } else {
                    res = await window.SyncComponentCache[this.url];
                }
                // console.log('lodash = ', _);

                let Fn = Function;
                let com = new Fn(`return ${res.data}`)();
                // let that = this;
                // com.mounted = () => {
                //     console.log(that, this);
                // }
                this.mode = com;
                // console.log("async get component = %o", this.mode);
                // this.$nextTick(() => {
                //     console.log(this, this.$refs['async_' + this._uid]);
                // });
            }
        }
    },
    created() {

    },
    mounted() {
        // console.log('async slots = %o ', this.$Slots);
        // console.log('async scopedSlots = %o ', this.$scopedSlots);

        Object.keys(this.$scopedSlots).forEach(s => {
            this.scopedSlotsList.push({
                'name': s,
                'value': this.value
            });
        });

        console.log('async listeners = %o ', this.$listeners);
    }
};
</script>
