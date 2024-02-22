<template>
    <!-- 下拉字典，不可输入 -->
    <div style="width:100%;">
        <el-select v-if="field=='value'"
            v-model="x_dic_value" placeholder="请选择" style="width:100%"
            @change="onSelectChange">
            <el-option
                v-for="item in x_dic_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-select v-if="field=='label'"
            v-model="x_dic_value" placeholder="请选择" style="width:100%"
            @change="onSelectChange">
            <el-option
                v-for="item in x_dic_list"
                :key="item.label"
                :label="item.label"
                :value="item.label">
            </el-option>
        </el-select>
    </div>
</template>

<script setup lang="ts">

    import { ref, watch } from "vue"

    import type {cdic_item, cform_options} from "@/inc/eotypes";
    import eodic from "@/inc/eodic";

    const props = withDefaults(defineProps<{
        modelValue: number|string,
        dic: string,
        field: string,
        all?: boolean
    }>(), {
        modelValue: "",
        field: "value",
        dic: "",
        all: false
    })

    const emits = defineEmits<{
        (e: 'update:modelValue', value: number|string): void
        (e: 'change', value: number|string): void
    }>()

    var x_dic_value = ref<string|number>("");
    var x_dic_list = ref<cdic_item[]>([]);

    watch(() => props.dic, (newVal, oldVal) => {
        //console.log(newVal, oldVal)

        let dicList = eodic.get_dic_list(newVal, props.all);
        x_dic_list.value = dicList;
    }, {
        immediate: true,
        deep: false
    });

    watch(() => props.modelValue, (newVal, oldVal) => {
        //console.log(newVal, oldVal) 
        x_dic_value.value = newVal;     
    }, {
        immediate: true,
        deep: false
    });

    /**
     * 手动列表
     * @param list 
     */
    const update_list = (dicList: cdic_item[]) => {
        x_dic_list.value = dicList;
    }
    
    const onSelectChange = (value: any) => {

        let ret: number|string = value;

        // if (props.field == "label") {
        //     for (let d of x_dic_list.value) {
        //         if (d.value == value) {
        //             ret = d.label;
        //             break;
        //         }
        //     }
        // }

        emits("update:modelValue", ret);

        // 触发一个事件
        emits("change", ret);
    }

    defineExpose({
        update_list
    })    

</script>

<style lang="scss">
</style>