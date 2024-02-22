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
                    id-field="menu_id" 
                    @loading="onTableLoading_menu">
                    <el-table-column prop="name" label="名称" width="160" />
                    <el-table-column prop="menu_pid_s" label="上级" width="160" />
                    <el-table-column prop="level" label="层级" width="80" />
                    <el-table-column prop="order" label="顺序" width="80" />
                    <el-table-column prop="type" label="类型" width="100" />
                    <el-table-column prop="path" label="路径" width="180" />
                    <el-table-column prop="permit" label="权限" width="180" />
                    <el-table-column prop="icon" label="图标" width="160" />
                    <el-table-column prop="status" label="状态" width="80" />
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

        let permitDic = eodic.list_2_dic(list, "permit_id", "name", true);
        
        x_form_types_menu.value = [
            {type: "input", name: "name", span: 2, label: "名称"},
            {type: "list", name: "menu_pid", span: 2, label: "上级", list: []},
            {type: "number", name: "order", span: 2, label: "顺序", precision: 0, step: 1, min: 1, max: 9999},
            {type: "input", name: "type", span: 2, label: "类型"},
            {type: "input", name: "path", span: 100, label: "路径"},
            {type: "list_s", name: "permit", span: 2, label: "权限", list: permitDic},
            {type: "input", name: "icon", span: 2, label: "图标"},
            {type: "switch", name: "status", span: 2, label: "状态"}
        ];

        v_table_menu.value!.load_list_net("/api/menu/list", {});
    });

    const updateMenuPidList = (): cdic_item[] => {        
        let list = v_table_menu.value!.get_list();
        let dicList = eodic.list_2_dic(list, "menu_id", "name");

        // 添加一个默认的顶级菜单，编号1
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
            "menu_id": 0,
            "menu_pid": 1,
            "name": "",            
            "level": 0,
            "order": 1,
            "type": "menu",
            "path": "",
            "permit": "",
            "icon": "",
            "status": 1
        });
        v_formd_menu.value.update_list("menu_pid", updateMenuPidList());
    }

    const onButtonClick_Upd = () => {
        
        let data = v_table_menu.value!.get_select_data();
        //console.log(data);

        v_formd_menu.value.show_dialog(data);
        v_formd_menu.value.update_list("menu_pid", updateMenuPidList());
    }

    const onButtonClick_Del = () => {
        v_table_menu.value!.remove_data_net_select("/api/menu/del", (data) => {
            return {
                "menu_id": data["menu_id"]
            }
        });
    }

    const onFormdClose_menu = (cancel: boolean, data: any, cb: cfunc_boolean): void => {

        if (cancel) {
            cb(true); return;
        }

        if (eocore.check_string(data, "name") <= 0) {
            eocore.show_error("名称不能输入为空");
            cb(false); return;
        }

        // 设置空权限
        if (data["permit"] == "-") data["permit"] = "";

        // 菜单分为2级
        if (data["menu_pid"] == 1)
            data["level"] = 1;
        else
            data["level"] = 2;

        v_table_menu.value!.update_data_net(
            "/api/menu/upd", data, -1, data["menu_id"]<=0, true);
        //console.log(cancel, data, data.menu_id);
        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>