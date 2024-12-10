<template>
    <!-- 设备配置 -->
    <el-dialog v-model="x_show_dialog" 
        width="700px"
        :show-close="false" 
        :align-center="true"
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>升级</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div class="eo_form eo_w100">
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
        </div>
        <div class="div_table">
            <div class="eo_line_h"></div>
            <div class="eo_form eo_w100" v-loading="x_show_loading">
                <div class="cell eo_w100">
                    <div class="label_n">设备类别</div>
                    <div class="input">
                        <el-select v-model="x_update_type" placeholder="请选择" style="width:100%"
                            @change="onSelectChange_type">
                            <el-option
                                v-for="item in x_list_type"
                                :key="item['f_type_id']"
                                :label="item['f_dtype']"
                                :value="item['f_type_id']">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div style="height:300px;">
                <vtable ref="v_table_version" 
                    name="版本"
                    id-field="version_id" 
                    :on-item="onTableItem_version"
                    @loading="onTableLoading_version"
                    @row-click="onTableRowClick_version">
                    <el-table-column prop="f_dversion" label="版本" width="100" />
                    <el-table-column prop="f_dtime_s" label="更新时间" width="180" />
                    <el-table-column prop="f_note" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
        </div>
        <div>
            <div class="sv_dialog_foot">
                <div class="button">
                    <el-button type="default" class="eo_w100" @click="onButtonClick_Cancel">关闭</el-button>
                </div>
                <div class="button">
                    <el-button type="primary" class="eo_w100" @click="onButtonClick_Update">升级</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    import { ref, reactive, onMounted } from "vue"
    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import type {cfunc_boolean} from "@/inc/eotypes";

    import vtable from "@/logic/common/vtable.vue"

    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal";
    
    type t_table = InstanceType<typeof vtable>;
    const v_table_version = ref<t_table>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);
    var x_device_data: any = reactive({
    });
    var x_show_loading = ref(false);

    var x_list_type = ref<any[]>([]);
    var x_update_type = ref("");

    onMounted( async () => {

        let ret = await eocore.proc("np_dtype_list", {});
        let list = eocore.check_net_array(ret);
        if (list == undefined) list = [];
        x_list_type.value = list;
    });

    const show_dialog = async (data: any) => {

        // 先打开对话框
        x_show_dialog.value = true;
        
        // 创建一个副本
        let dataNew = Object.assign({}, data);
        x_device_data = reactive(dataNew);

        //console.log(x_device_data);
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
    const onButtonClick_Update = async () => {

        let dataVersion = v_table_version.value!.get_select_data(true);
        if (dataVersion == undefined) return;

        console.log(dataVersion);
        if (!eocore.check_id(dataVersion, "f_file_id")) {
            eocore.show_info("该版本无Bin文件");
            return;
        }
        if (eocore.check_string(dataVersion, "f_config_data") <= 0) {
            eocore.show_info("该版本无配置");
            return;
        }

        let url = TLogic.getStaticFileUrl(dataVersion["f_sign"], dataVersion["f_ext"]);

        // 测试
        url = url.replace(eocore.base_url, "http://127.0.0.1:56908");

        x_show_loading.value = true;
        let ret = await eocore.post("/iot/gate/iot/version/update", [{
            "mn": x_device_data["f_mn"],
            "type": dataVersion["f_dtype"],
            "version": dataVersion["f_dversion"],
            "total": dataVersion["f_total"],
            "sign": dataVersion["f_sign"],
            "url": url,
        }]);
        x_show_loading.value = false;
        let data = await eocore.check_net_object(ret);
        if (data == null) return;

        eocore.show_success("升级命令已发出，请稍后检查设备状态");
    }

    const onTableItem_version = (data: any) => {
        data["f_dtime_s"] = eolib.datetime_2_string(data['f_dtime']);
    }

    const onSelectChange_type = async (val: any) => {

        x_show_loading.value = true;
        let list = await TLogic.getVersionList(val);
        x_show_loading.value = false;

        v_table_version.value!.load_list(list);
    }

    const onTableLoading_version = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableRowClick_version = (data: any) => {
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss" scoped>
.div_table {
    padding: 10px 2px;
}

</style>