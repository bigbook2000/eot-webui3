<template>
    <!-- 角色管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_row">
            <div class="eo_row_f">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Add">添加</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p" @click="onButtonClick_Del">删除</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Upd">修改</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">刷新</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_f">
                        <vtable ref="v_table_role" 
                            name="角色"
                            id-field="role_id" 
                            @loading="onTableLoading_role"
                            @row-click="onTableRowClick_role">
                            <el-table-column prop="status_s" label="状态" width="160" />
                            <el-table-column prop="name" label="名称" width="200" />
                            <el-table-column prop="note" label="说明" width="500" />
                            <el-table-column />
                        </vtable>
                    </div>
                </div>
            </div>
            <div class="eo_row_d" style="width:600px;">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Save">保存</el-button>
                                </div>
                                <!--
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p" @click="onButtonClick_SelectAll">全选</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p" @click="onButtonClick_ClearAll">全清</el-button>
                                </div>
                                -->
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_f">
                        <vtable ref="v_table_permit" 
                            name="权限"
                            id-field="permit_id" 
                            @loading="onTableLoading_permit">
                            <el-table-column type="selection" width="55" />
                            <el-table-column prop="name" label="名称" width="300" />
                            <el-table-column prop="note" label="说明" width="500" />
                            <el-table-column />
                        </vtable>
                    </div>
                </div>
            </div>
        </div>
        <vformd ref="v_formd_role" 
            title="角色信息" width="400px"
            :form-types="x_form_types_role"
            @close="onFormdClose_role"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_role" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"

    import vtable from "@/logic/common/vtable.vue"
    import vformd from "@/logic/common/vformd.vue"

    type t_table = InstanceType<typeof vtable>;
    type t_formd = InstanceType<typeof vformd>;

    const v_table_role = ref<t_table>();
    const v_table_permit = ref<t_table>();
    const v_formd_role = ref<t_formd>();

    var x_show_loading = ref(false);
    var x_form_types_role = ref<cform_options[]>([]);

    onMounted(async () => {
        
        x_form_types_role.value = [
            {type: "input", name: "name", span: 100, label: "名称"},
            {type: "input", name: "note", span: 100, label: "说明"},
            {type: "switch", name: "status", span: 100, label: "状态"},
        ];

        v_table_role.value!.init_table({
            on_item: (data) => {

                if (data["status"] != 0)
                    data["status_s"] = "-";
                else
                    data["status_s"] = "失效";
            }
        })

        v_table_role.value!.load_list_net("/api/role/list", {});
        v_table_permit.value!.load_list_net("/api/permit/list", {});
    });

    const onButtonClick_Load = () => {
        v_table_role.value!.load_list_net("/api/role/list", {});
    }
    const onButtonClick_Add = () => {

        v_formd_role.value!.show_dialog({
            "role_id": 0,
            "name": "",            
            "note": "",
            "status": 1,
        });
    }
    const onButtonClick_Upd = () => {
        let data = v_table_role.value!.get_select_data();

        v_formd_role.value!.show_dialog(data);
    }
    const onButtonClick_Del = () => {
        v_table_role.value!.remove_data_net_select("/api/role/del", (data) => {
            return {
                "role_id": data["role_id"]
            }
        });
    }

    const onButtonClick_Save = async () => {

        let roleData = v_table_role.value!.get_select_data(true);
        if (roleData == undefined) return;

        // 组合成逗号分割的ID字符串
        let idString = "";
        let list = v_table_permit.value!.get_check_list();
        for (let d of list) {
            idString += "," + d["permit_id"];
        }
        if (idString.length > 0) idString = idString.substring(1);

        x_show_loading.value = true;
        let ret: any = await eocore.post("/api/role/permits", [{
            "role_id": roleData["role_id"],
            "permits": idString
        }])
        x_show_loading.value = false;

        let data = eocore.check_net_object(ret);
        if (data == undefined) return;

        roleData["permits"] = idString;
        eocore.show_success(roleData["name"] + "权限保存成功");
    }
    const onButtonClick_SelectAll = () => {
        v_table_permit.value!.set_check_all(true);
    }
    const onButtonClick_ClearAll = () => {
        v_table_permit.value!.set_check_all(false);
    }    

    const onTableLoading_role = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableLoading_permit = (show: boolean) => {
        x_show_loading.value = show;
    }

    const onFormdClose_role = (cancel: boolean, data: any, cb: cfunc_boolean): void => {

        if (cancel) {
            cb(true); return;
        }

        if (eocore.check_string(data, "name") <= 0) {
            eocore.show_error("权限不能输入为空");
            cb(false); return;
        }

        v_table_role.value!.update_data_net(
            "/api/role/upd", data, -1, data["role_id"]<=0, true);
        cb(true);
    }

    const onTableRowClick_role = (data: any) => {
        v_table_permit.value!.set_check_string(data["permits"]);
    }

</script>

<style lang="scss" scoped>
</style>