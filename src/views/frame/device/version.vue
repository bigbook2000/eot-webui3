<template>
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_row">
            <div class="eo_row_d" style="width:400px;">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="info_w">
                                    <span class="span_label">设备类型</span>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_type">刷新</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_f">
                        <vtable ref="v_table_type" 
                            name="类型"
                            id-field="f_type_id"
                            @loading="onTableLoading_version"
                            @row-click="onTableRowClick_type">                                    
                            <el-table-column prop="f_dtype" label="名称" width="120" />
                            <el-table-column prop="f_note" label="描述" width="240" />
                            <el-table-column />
                        </vtable>
                    </div>
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_New_type">添加</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p" @click="onButtonClick_Del_type">删除</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Upd_type">编辑</el-button>
                                </div>
                            </div>
                        </div>                        
                    </div>                    
                </div>                        
            </div>
            <div class="eo_line_v"></div>
            <div class="eo_row_f">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="info_w">
                                    <span class="span_label">设备版本</span>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_New_version">添加</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p" @click="onButtonClick_Del_version">删除</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Upd_version">编辑</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_f">
                        <vtable ref="v_table_version" 
                            name="版本"
                            id-field="f_version_id"
                            :on-item="onTableItem_version"
                            @loading="onTableLoading_version">
                            <el-table-column prop="f_dversion" label="名称" width="120" />
                            <el-table-column prop="f_bin_file" label="文件" width="280">
                                <template #default="scope">
                                    <a target="_blank" :href="scope.row['f_bin_url']">{{ scope.row['f_name'] }}</a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="f_config" label="操作" width="160" align="center">
                                <template #default="scope">
                                    <el-button size="small" type="primary" 
                                        @click="onTableButtonClick_Upload(scope.$index, scope.row)">上传</el-button>
                                    <el-button size="small" type="primary" 
                                        @click="onTableButtonClick_Config(scope.$index, scope.row)">配置</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="f_note" label="描述" width="240" />
                            <el-table-column />
                        </vtable>
                    </div>
                </div>
            </div>
        </div>
        <vformd ref="v_formd_type" title="设备类型" width="600px"
            :form-types="x_form_types_type" @close="onFormdClose_type"/>
        <vformd ref="v_formd_version" title="设备版本" width="600px"
            :form-types="x_form_types_version" @close="onFormdClose_version"/>
        <version_file ref="v_version_file" @close="onDialogClose_versionfile"/>
        <version_config ref="v_version_config" @close="onDialogClose_versionconfig"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "device_version" }
</script>

<script lang="ts" setup>

    import { ref, reactive, onMounted } from "vue"
    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"

    import vtable from "@/logic/common/vtable.vue"
    import vformd from "@/logic/common/vformd.vue"

    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import version_file from "@/views/frame/device/version_file.vue"
    import version_config from "@/views/frame/device/version_config.vue"
    
    import TLogic from "@/logic/TLogic"
    import TGlobal from "@/logic/TGlobal"

    type t_table = InstanceType<typeof vtable>;
    type t_formd = InstanceType<typeof vformd>;

    const v_version_file = ref<InstanceType<typeof version_file>>();
    const v_version_config = ref<InstanceType<typeof version_config>>();

    const v_table_type = ref<t_table>();
    const v_table_version = ref<t_table>();

    const v_formd_type = ref<t_formd>();
    const v_formd_version = ref<t_formd>();

    var x_show_loading = ref(false);

    var x_form_types_type = ref<cform_options[]>([]);
    var x_form_types_version = ref<cform_options[]>([]);

    onMounted(() => {

        x_form_types_type.value = [
            { type: "input", name: "f_dtype", span: 100, label: "名称" },
            { type: "textarea", name: "f_note", span: 100, label: "描述" },
        ];
        x_form_types_version.value = [
            { type: "label", name: "f_dtype", span: 100, label: "类型" },
            { type: "input", name: "f_dversion", span: 100, label: "名称" },
            { type: "textarea", name: "f_note", span: 100, label: "描述" },
        ];

        v_table_type.value!.load_list_proc("np_dtype_list", {});
    });

    const onTableItem_version = (data: any) => {
        data["f_bin_url"] = TLogic.getStaticFileUrl(data["f_sign"], data["f_ext"]);
    }
    const onTableLoading_version = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onButtonClick_Load_type = () => {
        v_table_type.value!.load_list_proc("np_dtype_list", {});

        // 清空
        v_table_version.value!.clear();
    }

    const onButtonClick_New_type = () => {

        v_formd_type.value!.show_dialog({
            "f_type_id": 0,
            "f_dtype": "",
            "f_note": ""
        });
    }
    const onButtonClick_Del_type = () => {
        v_table_type.value!.remove_data_proc_select("np_dtype_del", (data) => {
            return {
                "v_type_id": data["f_type_id"]
            }
        });
    }
    const onButtonClick_Upd_type = () => {

        let typeData = v_table_type.value!.get_select_data(true);
        if (typeData == undefined) return;

        v_formd_type.value!.show_dialog(typeData);
    }

    const onButtonClick_New_version = () => {

        let typeData = v_table_type.value!.get_select_data(true);
        if (typeData == undefined) return;

        v_formd_version.value!.show_dialog({
            "f_version_id": 0,
            "f_type_id": typeData["f_type_id"],
            "f_dtype": typeData["f_dtype"],
            "f_dversion": "",
            "f_bin_file": "",
            "f_config_data": "",
            "f_note": ""
        });
    }
    const onButtonClick_Del_version = () => {
        v_table_version.value!.remove_data_proc_select("np_dversion_del", (data) => {
            return {
                "v_version_id": data["f_version_id"]
            }
        });
    }
    const onButtonClick_Upd_version = () => {

        let versionData = v_table_version.value!.get_select_data(true);
        if (versionData == undefined) return;

        v_formd_version.value!.show_dialog(versionData);
    }

    const onTableButtonClick_Download = (index: number, row: any) => {

    }
    const onTableButtonClick_Upload = (index: number, row: any) => {
        v_version_file.value!.show_dialog(row);
    }
    const onTableButtonClick_Config = (index: number, row: any) => {
        v_version_config.value!.show_dialog(row);
    }

    const onTableRowClick_type = async (data: any) => {

        x_show_loading.value = true;
        let list = await TLogic.getVersionList(data["f_type_id"]);
        x_show_loading.value = false;

        v_table_version.value!.load_list(list);
    }

    const onFormdClose_type = (cancel: boolean, data: any, cb: cfunc_boolean): void => {
        if (cancel) {
            cb(true); return;
        }
        
        if (eocore.check_string(data, "f_dtype") <= 0) {
            eocore.show_error("名称不能输入为空");
            cb(false); return;
        }

        v_table_type.value!.update_data_proc("np_dtype_upd", {
            "v_type_id": data["f_type_id"],
            "v_dtype": data["f_dtype"],
            "v_note": data["f_note"]
        }, -1, data["f_type_id"] <= 0, true);

        cb(true);
    }
    const onFormdClose_version = (cancel: boolean, data: any, cb: cfunc_boolean): void => {
        if (cancel) {
            cb(true); return;
        }
        
        if (eocore.check_string(data, "f_dversion") <= 0) {
            eocore.show_error("名称不能输入为空");
            cb(false); return;
        }
        
        v_table_version.value!.update_data_proc("np_dversion_upd", {
            "v_version_id": data["f_version_id"],
            "v_type_id": data["f_type_id"],
            "v_dversion": data["f_dversion"],
            "v_bin_file": data["f_bin_file"],
            "v_config_data": data["f_config_data"],
            "v_note": data["f_note"]
        }, -1, data["f_type_id"] <= 0, true);

        cb(true);
    }
    const onDialogClose_versionfile = async (cancel: boolean, data: any, cb: cfunc_boolean): Promise<void> => {
        if (cancel) {
            cb(true); return;
        }

        console.log(data);

        let ss: string[] = data["f_bin_file_s"].split("|");
        if (ss.length != 4) {
            console.log("file data error");
            return;
        }

        let fileData = {
            "f_file_id": parseInt(ss[0]),
            "f_type": ss[1],
            "f_keyid": parseInt(ss[2]),
            "f_index": parseInt(ss[3]),
        }        

        // 读取文件
        let ret = await eocore.post("/api/common/file/get", [{
            "f_type": fileData["f_type"],
            "f_keyid": fileData["f_keyid"],
            "f_index": fileData["f_index"],
        }]);
        let list = eocore.check_net_array(ret);
        if (list == undefined) return;
        if (list.length <= 0) return;

        let dataNew = list[0];
        Object.assign(data, data, dataNew);
        console.log(dataNew);

        v_table_version.value!.update_data(data, -1, false, true);

        cb(true);
    }

    const onDialogClose_versionconfig = (cancel: boolean, data: any, cb: cfunc_boolean): void => {
        if (cancel) {
            cb(true); return;
        }

        console.log(data);
        cb(true);
    }    

    

</script>

<style lang="scss" scoped>
.span_label {
    font-size: 14px;
    color: var(--eo_color_main);
}
</style>