<template>
    <!-- 部门选择输入框 -->
    <div style="width:100%">
        <el-input v-model="x_dept_id_s" style="width:100%" readonly
            @click="onInputClick_dept" ></el-input>
        <dept_list ref="v_dept_list" @close="onDialogClose_deptlist"/>
    </div>
</template>

<script setup lang="ts">

    import { ref, watch, reactive, onMounted } from "vue"

    import eocore from "@/inc/eocore";

    import type {cfunc_boolean} from "@/inc/eotypes";

    import dept_list from "@/views/platform/dept_list.vue"
    const v_dept_list = ref<InstanceType<typeof dept_list>>();

    const props = defineProps<{
        /** 单向输入 */
        deptName: string
    }>();

    const emits = defineEmits<{
        (e: "change", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_dept_id_s = ref("");

    watch(() => props.deptName, (newVal, oldVal) => {

        //console.log(x_dept_id_s);
        x_dept_id_s.value = newVal;
    }, {
        immediate: true,
        deep: false
    });

    onMounted(() => {
    });

    const onInputClick_dept = (event: FocusEvent) => {
        //console.log(event);
        v_dept_list.value!.show_dialog(undefined);
    }

    const onDialogClose_deptlist = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        let deptData = data.dept;        
        if (eocore.check_id(deptData, "f_dept_id")) {

            // 选择部门信息
            x_dept_id_s.value = deptData["f_name"];

            emits("change", false, deptData, (result: boolean) => {
            });
        }

        cb(true);
    }
</script>

<style lang="scss">
</style>