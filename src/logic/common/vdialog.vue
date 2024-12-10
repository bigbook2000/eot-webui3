<template>
    <el-dialog v-model="x_show_dialog" 
        :width="width"
        :show-close="false" 
        :align-center="true"
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>{{ title }}</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div>
            <!-- 默认插槽 -->
            <slot></slot>
        </div>
        <div>
            <div class="sv_dialog_foot">
                <div class="button">
                    <el-button type="default" class="eo_w100" @click="onButtonClick_Cancel">取消</el-button>
                </div>
                <div class="button">
                    <el-button type="primary" class="eo_w100" @click="onButtonClick_Ok">确定</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    import { ref, reactive, nextTick } from "vue"
    import type {cfunc_boolean} from "@/inc/eotypes";

    defineProps<{
        title?: string,
        width?: string
    }>();

    const emits = defineEmits<{
        (e: "open", tag: any): void
        (e: "close", cancel: boolean, tag: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);

    /** 外挂数据  */
    var m_dialog_tag: any = undefined;

    const show_dialog = (tag: any) => {
        x_show_dialog.value = true;        
        m_dialog_tag = tag;
    }

    const onDialogOpened = () => {
        emits("open", m_dialog_tag);
    }
    const onDialogClose = () => {
    }
    const onButtonClick_Cancel = () => {
        emits("close", true, m_dialog_tag, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Ok = () => {

        x_show_dialog.value = true;
        emits("close", false, m_dialog_tag, (result: boolean) => {
            x_show_dialog.value = !result;
            x_show_dialog.value = false;
        });
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>