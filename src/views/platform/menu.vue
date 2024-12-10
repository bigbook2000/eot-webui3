<template>
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
                <vtable ref="v_table_menu" 
                    name="菜单"
                    id-field="f_menu_id" 
                    @loading="onTableLoading_menu">
                    <el-table-column prop="f_name" label="名称" width="160" />
                    <el-table-column prop="f_menu_pid_s" label="上级" width="160" />
                    <el-table-column prop="f_level" label="层级" width="80" />
                    <el-table-column prop="f_order" label="顺序" width="80" />
                    <el-table-column prop="f_type" label="类型" width="100" />
                    <el-table-column prop="f_path" label="路径" width="180" />
                    <el-table-column prop="f_permit" label="权限" width="180" />
                    <el-table-column prop="f_icon" label="图标" width="160" />
                    <el-table-column prop="f_status" label="状态" width="80" />
                    <el-table-column />
                </vtable>
            </div>
        </div>
        <vformd ref="v_formd_menu" title="菜单信息" 
            :form-types="x_form_types_menu"
            @close="onFormdClose_menu"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_menu" }
</script>

<script lang="ts" setup>
    
    import { ref, reactive, onMounted } from "vue"
    import router from "@/router/index"

    import eocore from "@/inc/eocore"
    import eodic from "@/inc/eodic"

    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    import type { cform_options, cdic_item, cfunc_boolean } from "@/inc/eotypes";
    import vtable from "@/logic/common/vtable.vue"
    import vformd from "@/logic/common/vformd.vue"
    

    type t_table = InstanceType<typeof vtable>;

    const v_table_menu = ref<t_table>();
    const v_formd_menu = ref();

    var x_show_loading = ref(false);

    var x_form_types_menu = ref<cform_options[]>([]);

    onMounted(async () => {

        x_show_loading.value = true;
        let ret: any = await eocore.post("/api/permit/list", [{}]);
        x_show_loading.value = false;

        let list = eocore.check_net_array(ret);
        if (list == undefined) list = [];

        let permitDic = eodic.list_2_dic(list, "f_permit_id", "f_name", true);
        //console.log(permitDic)
        
        x_form_types_menu.value = [
            {type: "input", name: "f_name", span: 2, label: "名称"},
            {type: "list", name: "f_menu_pid", span: 2, label: "上级", list: []},
            {type: "number", name: "f_order", span: 2, label: "顺序", precision: 0, step: 1, min: 1, max: 9999},
            {type: "input", name: "f_type", span: 2, label: "类型"},
            {type: "input", name: "f_path", span: 100, label: "路径"},
            {type: "list_s", name: "f_permit", span: 2, label: "权限", list: permitDic},
            {type: "input", name: "f_icon", span: 2, label: "图标"},
            {type: "switch", name: "f_status", span: 2, label: "状态"}
        ];

        v_table_menu.value!.load_list_net("/api/menu/list", {});
    });

    const updateMenuPidList = (): cdic_item[] => {        
        let list = v_table_menu.value!.get_list();
        let dicList = eodic.list_2_dic(list, "f_menu_id", "f_name");

        // 添加一个默认的顶级菜单，编号1
        // 下拉选择项使用 value-label字段
        dicList.unshift({
            value: 1,
            label: "-"
        });
        return dicList;
    }

    const onTableLoading_menu = (show: boolean) => {
        x_show_loading.value = show;
    }

    const onButtonClick_Load = () => {
        v_table_menu.value!.load_list_net("/api/menu/list", {});
    }

    const onButtonClick_Add = () => {

        v_formd_menu.value.show_dialog({
            "f_menu_id": 0,
            "f_menu_pid": 1,
            "f_name": "",            
            "f_level": 0,
            "f_order": 1,
            "f_type": "menu",
            "f_path": "",
            "f_permit": "",
            "f_icon": "",
            "f_status": 1
        });
        v_formd_menu.value.update_list("f_menu_pid", updateMenuPidList());
    }

    const onButtonClick_Upd = () => {
        
        let data = v_table_menu.value!.get_select_data();
        //console.log(data);

        v_formd_menu.value.show_dialog(data);
        v_formd_menu.value.update_list("f_menu_pid", updateMenuPidList());
    }

    const onButtonClick_Del = () => {
        v_table_menu.value!.remove_data_net_select("/api/menu/del", (data) => {
            return {
                "f_menu_id": data["f_menu_id"]
            }
        });
    }

    const onFormdClose_menu = (cancel: boolean, data: any, cb: cfunc_boolean): void => {

        if (cancel) {
            cb(true); return;
        }

        if (eocore.check_string(data, "f_name") <= 0) {
            eocore.show_error("名称不能输入为空");
            cb(false); return;
        }

        // 设置空权限
        if (data["f_permit"] == "-") data["f_permit"] = "";

        // 菜单分为2级
        if (data["f_menu_pid"] == 1)
            data["f_level"] = 1;
        else
            data["f_level"] = 2;

        v_table_menu.value!.update_data_net(
            "/api/menu/upd", data, -1, data["f_menu_id"]<=0, true);
        //console.log(cancel, data, data.f_menu_id);
        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>