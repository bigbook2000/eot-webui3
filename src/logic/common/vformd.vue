<template>
    <vdialog ref="v_dialog"
        :width="width" :title="title"
        @close="onDialogClose">
        <vform ref="v_form" :types="formTypes" :data="x_form_data"></vform>
    </vdialog>
</template>

<script setup lang="ts">

    import { ref, reactive, nextTick } from "vue"

    import eocore from "@/inc/eocore";

    import type {cdic_item, cform_options, cfunc_boolean} from "@/inc/eotypes";

    defineProps<{
        formTypes: cform_options[],
        title?: string,
        width?: string
    }>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    import vdialog from "@/logic/common/vdialog.vue"
    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    import vform from "@/logic/common/vform.vue"
    type t_form = InstanceType<typeof vform>;    
    const v_form = ref<t_form>();

    var x_form_data: any = reactive({});

    const show_dialog = (data: any) => {
        
        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);

        // 创建一个副本
        let dataNew = Object.assign({}, data);
        
        x_form_data = reactive(dataNew);
    }

    const update_list = async (formName: string, list: cdic_item[]) => {

        await eocore.wait_tick(v_form.value);
        v_form.value!.update_list(formName, list);
    }

    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        emits("close", cancel, x_form_data, (result: boolean) => {

            // 传递结果
            cb(result);
        });
    }

    defineExpose({
        show_dialog,
        update_list
    })

</script>

<style lang="scss">
</style>