<template>
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Import">导入</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Export">导出</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="default" class="eo_w80p" @click="onButtonClick_Create">生成</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">刷新</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="eo_col_sp"></div>
            <div class="eo_col_f">
                <div class="eo_row">
                    <div class="eo_w2">
                        <div class="eo_col">
                            <div class="eo_tool_bar">
                                <div class="eo_form">
                                    <div class="cell">
                                        <div class="info_w">
                                            <span>字典类别</span>
                                        </div>
                                        <div class="input_w">
                                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_New_dic">添加</el-button>
                                        </div>
                                        <div class="input_w">
                                            <el-button type="default" class="eo_w80p" @click="onButtonClick_Del_dic">删除</el-button>
                                        </div>
                                        <div class="input_w">
                                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Upd_dic">编辑</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="eo_col_f">
                                <vtable ref="v_table_dic" 
                                    name="类别"
                                    id-field="dic_id"
                                    @loading="onTableLoading_dic"
                                    @row-click="onTableRowClick_dic">                                    
                                    <el-table-column prop="label" label="名称" width="180" />
                                    <el-table-column prop="note" label="描述" width="200" />
                                    <el-table-column />
                                </vtable>
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
                                            <span>键值列表</span>
                                        </div>
                                        <div class="input_w">
                                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_New_item">添加</el-button>
                                        </div>
                                        <div class="input_w">
                                            <el-button type="default" class="eo_w80p" @click="onButtonClick_Del_item">删除</el-button>
                                        </div>
                                        <div class="input_w">
                                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Upd_item">编辑</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="eo_col_f">
                                <vtable ref="v_table_item" 
                                    name="键值"
                                    id-field="dic_id"
                                    @loading="onTableLoading_dic">
                                    <el-table-column prop="label" label="名称" width="280" />                                    
                                    <el-table-column prop="value" label="键值" width="100" />
                                    <el-table-column prop="note" label="描述" width="200" />
                                    <el-table-column />
                                </vtable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <vformd ref="v_formd_dic" title="字典类别" width="400px"
            :form-types="x_form_types_dic"
            @close="onFormdClose_dic"/>
        <vformd ref="v_formd_item" title="键值信息" width="400px"
            :form-types="x_form_types_item"
            @close="onFormdClose_item"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_dic" }
</script>

<script lang="ts" setup>

    import { ref, reactive, onMounted } from "vue"
    import router from "@/router/index"

    import eocore from "@/inc/eocore"
    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import vtable from "@/logic/common/vtable.vue"
    import vformd from "@/logic/common/vformd.vue"
    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"

    type t_table = InstanceType<typeof vtable>;
    type t_formd = InstanceType<typeof vformd>;

    const v_table_dic = ref<t_table>();
    const v_table_item = ref<t_table>();
    const v_formd_dic = ref<t_formd>();
    const v_formd_item = ref<t_formd>();

    var x_show_loading = ref(false);

    var x_form_types_dic = ref<cform_options[]>([]);
    var x_form_types_item = ref<cform_options[]>([]);

    onMounted(() => {

        x_form_types_dic.value = [
            { type: "input", name: "label", span: 100, label: "名称" },
            { type: "input", name: "note", span: 100, label: "描述" },
        ]
        x_form_types_item.value = [
            { type: "list", name: "dic_pid", span: 100, label: "类别" },
            { type: "input", name: "label", span: 100, label: "名称" },
            { type: "number", name: "value", span: 100, label: "键值", precision: 0, min: 0, max: 999999 },
            { type: "input", name: "note", span: 100, label: "描述" },
        ]

        v_table_dic.value!.load_list_net("/api/dic/list", {
            "dic_pid": 0
        });
    })

    const onButtonClick_New_dic = () => {
        v_formd_dic.value!.show_dialog({
            "dic_id": 0,
            "dic_pid": 0,
            "level": 0,
            "label": "",
            "value": 1,
            "note": ""
        })
    }
    const onButtonClick_Upd_dic = () => {
        let dicData = v_table_dic.value!.get_select_data();
        if (dicData == undefined) return;

        v_formd_dic.value!.show_dialog(dicData);
    }
    const onButtonClick_Del_dic = async () => {
        await v_table_dic.value!.remove_data_net_select("/api/dic/del", (data) => {
            return {
                "dic_id": data["dic_id"]
            }
        })

        v_table_item.value!.load_list([]);
    }
    const onButtonClick_New_item = () => {

        let dicPid = 0;
        let dicValue = 0;
        let dicData = v_table_dic.value!.get_select_data();
        if (dicData != undefined) dicPid = dicData["dic_id"];

        // 取一个最大值
        let listItem = v_table_item.value!.get_list();
        for (let d of listItem) {
            if (dicValue < d["value"]) dicValue = d["value"];
        }
        dicValue++;

        v_formd_item.value!.show_dialog({
            "dic_id": 0,
            "dic_pid": dicPid,
            "level": 0,
            "label": "_新项",
            "value": dicValue,
            "note": ""
        })

        let list = v_table_dic.value!.get_list();
        for (let d of list) {
            d["value"] = d["dic_id"]
        }
        v_formd_item.value!.update_list("dic_pid", list);
    }
    const onButtonClick_Upd_item = () => {
        let itemData = v_table_item.value!.get_select_data();
        if (itemData == undefined) return;

        v_formd_item.value!.show_dialog(itemData);
    }
    const onButtonClick_Del_item = async () => {
        await v_table_item.value!.remove_data_net_select("/api/dic/del", (data) => {
            return {
                "dic_id": data["dic_id"]
            }
        })
    }
    
    const onButtonClick_Create = async () => {

        let dret = await eocore.show_confirm("该操作将重新生成字典，确信要继续吗？");
        if (!dret) return;

        let ret = await eocore.post("/api/dic/create", [{}]);
        let data = eocore.check_net_array(ret);
        if (data == undefined) return;

        eocore.show_success("字典生成成功，请重新登录平台");
    }
    const onButtonClick_Import = () => {

    }
    const onButtonClick_Export = () => {
        eolib.download_file(eocore.base_url + "/static/dic" + eodic.version + ".json");
    }
    const onButtonClick_Load = () => {
        v_table_dic.value!.load_list_net("/api/dic/list", {
            "dic_pid": 0
        });

        v_table_item.value!.load_list([]);
    }

    const onTableLoading_dic = (show: boolean) => {
        x_show_loading.value = show;
    }    

    const onTableRowClick_dic = (data: any) => {
        v_table_item.value!.load_list_net("/api/dic/list", {
            "dic_pid": data["dic_id"]
        })
    }

    const onFormdClose_dic = (cancel: boolean, data: any, cb: cfunc_boolean): void => {
        if (cancel) {
            cb(true); return;
        }
        
        if (eocore.check_string(data, "label") <= 0) {
            eocore.show_error("名称不能输入为空");
            cb(false); return;
        }

        v_table_dic.value!.update_data_net(
            "/api/dic/upd", data, -1, data["dic_id"]<=0, true);

        cb(true);
    }
    const onFormdClose_item = (cancel: boolean, data: any, cb: cfunc_boolean): void => {
        if (cancel) {
            cb(true); return;
        }

        if (eocore.check_string(data, "label") <= 0) {
            eocore.show_error("名称不能输入为空");
            cb(false); return;
        }

        v_table_item.value!.update_data_net(
            "/api/dic/upd", data, -1, data["dic_id"]<=0, true);

        cb(true);
    }
</script>

<style lang="scss" scoped>
</style>