<template>
    <!-- 版本配置 -->
    <el-dialog v-model="x_show_dialog" 
        width="900px"
        :show-close="false" 
        :align-center="true"
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>配置</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div class="eo_form eo_w100" v-loading="x_show_loading">
            <div class="cell eo_w2">
                <div class="label_n">版本</div>
                <div class="input_w" style="width:100px;">
                    <el-input v-model="x_version_data['f_dtype']" style="width:100%"
                        readonly></el-input>
                </div>
                <div class="input">
                    <el-input v-model="x_version_data['f_dversion']" style="width:100%"
                        readonly></el-input>
                </div>
            </div>
            <div class="cell eo_w2"></div>
            <div class="cell eo_w100">
                <div class="label_n">配置</div>
                <div class="input">
                    <el-input style="width:100%"
                        v-model="x_version_data['f_config_data_s']" type="textarea" resize="none"
                        :row="4" :autosize="{minRows: 20, maxRows: 20}"></el-input>
                </div>
            </div>
        </div>
        <div>
            <div class="sv_dialog_foot">
                <div class="button">
                    <el-button type="default" class="eo_w100" @click="onButtonClick_Cancel">关闭</el-button>
                </div>
                <div class="button">
                    <el-button type="primary" class="eo_w100" @click="onButtonClick_Save">保存</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    //
    // 版本配置，主要用于初始化版本参数
    // 设备配置主要用于设备对应实际运行中的参数
    //

    import { ref, reactive, onMounted } from "vue"
    import eocore from "@/inc/eocore";

    import type {cfunc_boolean} from "@/inc/eotypes";
    import TLogic from "@/logic/TLogic";

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);
    var x_version_data: any = reactive({
    });
    var x_show_loading = ref(false);

    onMounted(() => {
    });

    const show_dialog = async (data: any) => {

        // 先打开对话框
        x_show_dialog.value = true;
        
        // 创建一个副本
        let dataNew = Object.assign({}, data);

        dataNew["f_config_data_s"] = TLogic.configDataDecode(dataNew["f_config_data"]);
        x_version_data = reactive(dataNew);
    }

    const onDialogOpened = () => {
    }
    const onDialogClose = () => {
    }
    const onButtonClick_Cancel = () => {
        emits("close", true, undefined, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Save = async () => {

        let configData: string = x_version_data["f_config_data_s"];
        let jsonStr = TLogic.configDataEncode(configData);

        x_show_loading.value = true;
        let ret = await eocore.proc("np_dversion_config", {
            "v_dversion_id": x_version_data["f_dversion_id"],
            "v_config_data": jsonStr
        });
        x_show_loading.value = false;
        let data = eocore.check_net_object(ret);
        if (data == null) return;

        eocore.show_success("版本配置保存成功");
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>