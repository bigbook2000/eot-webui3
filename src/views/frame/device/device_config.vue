<template>
    <!-- 设备配置 -->
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
                <div class="label_n">标识</div>
                <div class="input">
                    <el-input v-model="x_device_data['f_dkey']" style="width:100%"
                        readonly></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">版本</div>
                <div class="input_w" style="width:100px;">
                    <el-input v-model="x_device_data['f_dtype']" style="width:100%"
                        readonly></el-input>
                </div>
                <div class="input">
                    <el-input v-model="x_device_data['f_dversion']" style="width:100%"
                        readonly></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">MN</div>
                <div class="input">
                    <el-input v-model="x_device_data['f_mn']" style="width:100%"
                        readonly></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">名称</div>
                <div class="input">
                    <el-input v-model="x_device_data['f_name']" style="width:100%"
                        readonly></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">配置</div>
                <div class="input">
                    <el-input style="width:100%"
                        v-model="x_device_data['f_config_data_s']" type="textarea" resize="none"
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
                    <el-button type="primary" class="eo_w100" @click="onButtonClick_ConfigGet">同步</el-button>
                </div>
                <div class="button">
                    <el-button type="primary" class="eo_w100" @click="onButtonClick_ConfigSet">上传</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    import { ref, reactive, onMounted } from "vue"
    import eocore from "@/inc/eocore";

    import type {cfunc_boolean} from "@/inc/eotypes";
    import TLogic from "@/logic/TLogic";

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);
    var x_device_data: any = reactive({
    });
    var x_show_loading = ref(false);

    onMounted(() => {
    });

    const updateConfigData = (cpStr: string): string => {

        //console.log(cpStr);
        let cpArray: string[] = cpStr.split(";");

        let pos;
        let key, val;
        // 解析配置参数
        cpStr = "";
        for (let s of cpArray) {

            pos = s.indexOf("=");
            if (pos < 0) continue;
            
            key = s.substring(0, pos);
            val = s.substring(pos+1);            

            // if (key.startsWith("_")) {
            //     if (key == "_DKey") x_device_data["f_dkey"] = val;
            //     if (key == "_DType") x_device_data["f_dtype"] = val;
            //     if (key == "_DVersion") x_device_data["f_dversion"] = val;
            // } 

            cpStr += key + "=" + val + ";\r\n";
        }

        //console.log(cpStr);
        return cpStr;
    }

    const show_dialog = async (data: any) => {

        // 先打开对话框
        x_show_dialog.value = true;
        
        // 创建一个副本
        let dataNew = Object.assign({}, data);
        
        dataNew["f_config_data_s"] = TLogic.configDataDecode(dataNew["f_config_data"]);
        x_device_data = reactive(dataNew);        
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
    /**
     * 点击同步按钮
     */
    const onButtonClick_ConfigGet = async () => {

        x_show_loading.value = true;
        let ret = await eocore.post("/iot/gate/iot/command", [{
            "mn": x_device_data["f_mn"],
            "st": "39",
            "cn": "3020",
            "cp": ""
        }]);
        x_show_loading.value = false;
        let data = eocore.check_net_object(ret);        
        if (data == null) return;

        x_device_data["f_config_data"] = updateConfigData(data["cp"]);
    }
    /**
     * 点击配置按钮
     */
    const onButtonClick_ConfigSet = async () => {

        let dret = await eocore.show_confirm("确信要上传配置信息到设备吗？");
        if (!dret) return;

        let mn = x_device_data["f_mn"];
        let configData: string = x_device_data["f_config_data_s"];
        let jsonStr = TLogic.configDataEncode(configData);

        // 先保存配置
        //console.log(configData);
        
        let ret;

        x_show_loading.value = true;
        ret = await eocore.proc("np_config_set", {
            "v_dkey": x_device_data["f_dkey"],
            "v_config_data": jsonStr
        });

        // 和升级保持一直，但不传bin文件长度
       ret = await eocore.post("/iot/gate/iot/version/update", [{
           "mn": mn,
           "type": "",
           "version": "",
           "total": 0,
           "sign": "",
           "url": "",
       }]);
       x_show_loading.value = false;
       let data = await eocore.check_net_object(ret);
       if (data == null) return;

        eocore.show_success("配置命令已发出，请稍后检查设备状态");
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>