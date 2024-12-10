<template>
    <!-- 版本文件 -->
    <vdialog ref="v_dialog"
        width="500px" title="版本文件"        
        @close="onDialogClose">
        <div class="eo_form eo_w100">
            <div class="cell eo_w2">
                <div class="label_n">类型</div>
                <div class="input">
                    <el-input v-model="x_version_data['f_dtype']" style="width:100%"
                        readonly></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">版本</div>
                <div class="input">
                    <el-input v-model="x_version_data['f_dversion']" style="width:100%"
                        readonly></el-input>                    
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">文件</div>
                <div class="input">
                    <vfile :readOnly="false" 
                        v-model="x_version_data['f_bin_file_s']"                        
                        :onFileName="onFileName_version" />
                </div>
            </div>
        </div>
    </vdialog>
</template>

<script setup lang="ts">

    import { ref, reactive, onMounted } from "vue"

    import eocore from "@/inc/eocore";

    import type { cfile_item, cfunc_boolean } from "@/inc/eotypes";

    import vfile from "@/logic/common/vfile.vue"
    import vdialog from "@/logic/common/vdialog.vue"

    import TLogic from "@/logic/TLogic";
    import eolib from "@/inc/eolib";


    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_version_data: any = reactive({
    });

    onMounted(() => {
    });

    const show_dialog = async (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本
        let dataNew = Object.assign({}, data);        
        x_version_data = reactive(dataNew);

        // |分割
        x_version_data['f_bin_file_s'] = 
            0 + "|" + TLogic.FILE_EOTAPP_BIN + "|" + x_version_data['f_version_id'] + "|0";
    }

    const onDialogOpened = () => {
    }

    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        emits("close", cancel, x_version_data, (result: boolean) => {
            cb(result);
        });
    }

    const onFileName_version = (fileName: string): string => {

        let d = x_version_data;
        let fn = d["f_dtype"] + "_" + d["f_dversion"] + "_" + 
            eolib.datetime_format(new Date(), "yyMMddHHmmss");

        return fn;
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>