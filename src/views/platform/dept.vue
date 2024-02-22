<template>
    <!-- 部门管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_row">
            <div class="eo_row_f">
                <el-tree ref="v_tree_dept"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    node-key="dept_id"
                    :data="x_tree_dept" 
                    :props="x_tree_props" 
                    @node-click="onTreeNodeClick_dept">
                    <template #default="{ node, data }">
                        <el-icon size="20" color="#333">
                            <Management />
                        </el-icon>
                        <span>{{ node.label }}</span>
                    </template>
                </el-tree>
            </div>
            <div class="eo_row_sp"></div>
            <div class="eo_row_d" style="width:600px;">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell">
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p" @click="onButtonClick_Index">索引</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="default" class="eo_w80p" @click="onButtonClick_Parent">移动</el-button>
                                </div>
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">刷新</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_d">
                        <vform ref="v_form_dept" :types="x_form_types_dept" :data="x_dept_data"></vform>
                    </div>
                    <div class="eo_line_h"></div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <vformd ref="v_formd_dept" title="部门" width="500px"
            :form-types="x_form_types_dept"
            @close="onFormdClose_dept"/>
        <dept_list ref="v_dept_list" @close="onFormdClose_deptlist"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_dept" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from "vue"
    import type { cform_options, cfunc_boolean, ctree_node } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vform from "@/logic/common/vform.vue"
    import vformd from "@/logic/common/vformd.vue"

    import { ElTree } from 'element-plus'
    import dept_list from "@/views/platform/dept_list.vue"
    

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_dept = ref<t_formd>();

    const v_tree_dept = ref<InstanceType<typeof ElTree>>();    
    const v_dept_list = ref<InstanceType<typeof dept_list>>();
        
    
    const x_tree_props = {
        children: "children",
        label: "name",
    }
    var x_tree_dept = ref<ctree_node[]>([]);

    var x_show_loading = ref(false);
    var x_form_types_dept = ref<cform_options[]>([]);
    var x_dept_data = ref({
        "dept_id": 0,
        "dept_pid": 0,
        "dept_pid_s": "",
        "name": "",
        "address": "",
        "contact": "",
        "phone": "",
        "note": "",
        "status": 1
    });

    onMounted(async () => {
        
        x_form_types_dept.value = [
            {type: "label", name: "dept_pid_s", span: 100, label: "上级"},
            {type: "input", name: "name", span: 100, label: "名称"},
            {type: "input", name: "address", span: 100, label: "地址"},
            {type: "input", name: "contact", span: 100, label: "联系人"},
            {type: "input", name: "phone", span: 100, label: "电话"},
            {type: "input", name: "note", span: 100, label: "说明"},
            {type: "switch", name: "status", span: 100, label: "状态"},
        ];

        loadTree_dept();
    });

    const getEmpty_dept = (deptPid: number, deptPid_s: string): any => {
        return {
            "dept_id": 0,
            "dept_pid": deptPid,
            "dept_pid_s": deptPid_s,
            "level": 0,
            "name": "",
            "address": "",
            "contact": "",
            "phone": "",
            "note": "",
            "status": 1
        }
    }

    const loadTree_dept = async () => {

        x_show_loading.value = true;
        let ret:any = await eocore.post("/api/dept/list", [{
            "dept_pid": 1
        }])
        x_show_loading.value = false;

        let list = eocore.check_net_array(ret);
        if (list == undefined) return;

        let tree: any[] = [];
        eolib.list_2_tree(list, tree, "dept_id", "dept_pid");
        x_tree_dept.value = tree;
    }

    const updateTreeNode_dept = (data: any, insert: boolean) => {

        let deptId = data["dept_id"];
        let deptPid = data["dept_pid"];

        if (insert) {

            let pnode = eolib.find_tree_node(x_tree_dept.value, deptPid, "dept_id");
            if (pnode == undefined) {
                eocore.show_info("未能找到对应的节点");
                return;
            }

            data.parent = pnode;
            data.children = [];
            //pnode.children.push(data);

            v_tree_dept.value!.append(data, pnode);
            v_tree_dept.value!.setCurrentKey(deptId);

            console.log(x_tree_dept)

        } else {

            let node = eolib.find_tree_node(x_tree_dept.value, deptId, "dept_id");
            if (node == undefined) {
                eocore.show_info("未能找到对应的节点");
                return;
            }

            Object.assign(node, node, data);
        }

        let dataCopy: any = {};
        Object.assign(dataCopy, {}, data);
        x_dept_data.value = dataCopy;
    }

    const onTreeNodeClick_dept = (data: any, node: any, event: any) => {
        //console.log(data);
        if (data.parent != undefined) {
            data["dept_pid_s"] = data.parent["name"];
        }

        let dataCopy: any = {};
        Object.assign(dataCopy, {}, data);
        x_dept_data.value = dataCopy;
    }

    const onButtonClick_Load = () => {
        loadTree_dept();
    }
    const onButtonClick_Add = () => {

        let node = v_tree_dept.value!.getCurrentNode();
        if (node == undefined) {
            eocore.show_info("请选择父节点");
            return;
        }
        //console.log(node);

        let deptPid = 1;
        let deptPid_s = "全部";
        if (node != undefined) {
            deptPid = node["dept_id"];
            deptPid_s = node["name"];
        }

        let dataNew = getEmpty_dept(deptPid, deptPid_s);
        v_formd_dept.value!.show_dialog(dataNew);
    }
    const onButtonClick_Upd = () => {

        let node = v_tree_dept.value!.getCurrentNode();
        if (node == undefined) {
            eocore.show_info("请选择编辑节点");
            return;
        }

        v_formd_dept.value!.show_dialog(node);
    }
    const onButtonClick_Del = async () => {

        let node = v_tree_dept.value!.getCurrentNode();
        if (node == undefined) {
            eocore.show_info("请选择删除节点");
            return;
        }

        let dret = await eocore.show_confirm("确信要删除部门 " + node["name"] + " 吗？");
        if (!dret) return;

        x_show_loading.value = true;
        let ret: any = await eocore.post("/api/dept/del", [{
            "dept_id": node["dept_id"]
        }]);
        x_show_loading.value = false;
        let data = eocore.check_net_object(ret);
        if (data == undefined) return;

        v_tree_dept.value!.remove(data);
        v_tree_dept.value!.setCurrentKey(0);

        let dataNew = getEmpty_dept(0, "");
        x_dept_data.value = dataNew;
    }

    const onButtonClick_Index = async () => {

        let dret = await eocore.show_confirm("确信要重建索引吗，这将花费一定的时间？");
        if (!dret) return;

        x_show_loading.value = true;
        let ret: any = await eocore.post("/api/dept/index", [{}]);
        x_show_loading.value = false;

        let data = eocore.check_net_object(ret);
        if (data == undefined) return;

        eocore.show_success("重建索引成功");
    }
    const onButtonClick_Parent = () => {

        let node = v_tree_dept.value!.getCurrentNode();
        if (node == undefined) {
            eocore.show_info("请选择移动节点");
            return;
        }

        v_dept_list.value!.show_dialog(node);
    }

    const onFormdClose_dept = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }
        
        if (eocore.check_string(data, "name") <= 0) {
            eocore.show_error("名称不能输入为空");
            cb(false); return;
        }

        x_show_loading.value = true;
        let ret: any = await eocore.post("/api/dept/upd", [{
            "dept_id": data["dept_id"],
            "dept_pid": data["dept_pid"],
            "level": data["level"],
            "name": data["name"],
            "address": data["address"],
            "contact": data["contact"],
            "phone": data["phone"],
            "note": data["note"],
            "status": data["status"],
        }]);
        x_show_loading.value = false;

        let dataNew = eocore.check_net_object(ret);
        if (dataNew != null) {
            updateTreeNode_dept(dataNew, (data["dept_id"]<=0));
        }

        cb(true);
    }
    const onFormdClose_deptlist = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        let dept = data.data;
        let deptParent = data.dept;
        
        if (!eocore.check_id(deptParent, "dept_id")) {
            eocore.show_info("请选择移动目标节点");
            return;
        }

        let dp = deptParent;
        let i;
        for (i=0; i<256; i++) {

            //console.log(dept, dp);
            if (dept["dept_id"] == dp["dept_id"]) {
                eocore.show_info("无法移动到子节点");
                return;
            }

            dp = dp.parent;
            if (dp == undefined) break;
        }

        x_show_loading.value = true;
        let ret: any = await eocore.post("/api/dept/parent", [{
            "dept_id": dept["dept_id"],
            "dept_pid_new": deptParent["dept_id"],
            "level": 0
        }]);
        x_show_loading.value = false;

        eocore.check_net_object(ret);
        loadTree_dept();

        cb(true);
    }
    
</script>

<style lang="scss" scoped>
</style>