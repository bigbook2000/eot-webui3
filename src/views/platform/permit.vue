<template>
    <!-- 权限管理 -->
    <div class="eo_page" v-loading="x_show_loading">
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
                <vtable ref="v_table_permit" 
                    name="权限"
                    id-field="f_permit_id" 
                    @loading="onTableLoading_permit">
                    <el-table-column prop="f_name" label="名称" width="300" />
                    <el-table-column prop="f_note" label="说明" width="500" />
                    <el-table-column />
                </vtable>
            </div>
        </div>
        <vformd ref="v_formd_permit" 
            title="权限信息" width="400px"
            :form-types="x_form_types_permit"
            @close="onFormdClose_permit"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_permit" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from "vue"
    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"

    import vtable from "@/logic/common/vtable.vue"
    import vformd from "@/logic/common/vformd.vue"

    type t_table = InstanceType<typeof vtable>;
    type t_formd = InstanceType<typeof vformd>;

    const v_table_permit = ref<t_table>();
    const v_formd_permit = ref<t_formd>();

    var x_show_loading = ref(false);
    var x_form_types_permit = ref<cform_options[]>([]);

    onMounted(async () => {
        
        x_form_types_permit.value = [
            {type: "input", name: "f_name", span: 100, label: "名称"},
            {type: "input", name: "f_note", span: 100, label: "说明"},
        ];

        v_table_permit.value!.load_list_net("/api/permit/list", {});
    });

    const onButtonClick_Load = () => {
        v_table_permit.value!.load_list_net("/api/permit/list", {});
    }
    const onButtonClick_Add = () => {

        v_formd_permit.value!.show_dialog({
            "f_permit_id": 0,
            "f_name": "",            
            "f_note": ""
        });
    }
    const onButtonClick_Upd = () => {
        let data = v_table_permit.value!.get_select_data();

        v_formd_permit.value!.show_dialog(data);
    }
    const onButtonClick_Del = () => {
        v_table_permit.value!.remove_data_net_select("/api/permit/del", (data) => {
            return {
                "f_permit_id": data["f_permit_id"]
            }
        });
    }

    const onTableLoading_permit = (show: boolean) => {
        x_show_loading.value = show;
    }    
    const onFormdClose_permit = (cancel: boolean, data: any, cb: cfunc_boolean): void => {

        if (cancel) {
            cb(true); return;
        }

        if (eocore.check_string(data, "f_name") <= 0) {
            eocore.show_error("权限不能输入为空");
            cb(false); return;
        }

        v_table_permit.value!.update_data_net(
            "/api/permit/upd", data, -1, data["f_permit_id"]<=0, true);
        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>