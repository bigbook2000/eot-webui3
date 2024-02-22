<template>
    <el-dialog v-model="x_show_dialog" 
        width="500px"
        :show-close="false" 
        :close-on-click-modal="false"
        @opened="onDialogOpened"
        @close="onDialogClose">
        <template #header="{ close }">
            <div class="sv_dialog_head">
                <div class="title">
                    <span>选择部门</span>
                </div>
                <div class="close" @click="onButtonClick_Cancel">
                    <div class="icon"></div>
                </div>
            </div>
        </template>
        <div style="height:300px;" class="eo_scroll_v">
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
        <div>
            <div class="sv_dialog_foot">
                <div class="button">
                    <el-button type="default" class="eo_w100" @click="onButtonClick_Cancel">取消</el-button>
                </div>
                <div class="button">
                    <el-button type="primary" class="eo_w100" @click="onButtonClick_Ok">确定</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">

    import { ref, reactive, nextTick } from "vue"

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import type {ctree_node, cfunc_boolean} from "@/inc/eotypes";    

    import { ElTree } from 'element-plus'

    const v_tree_dept = ref<InstanceType<typeof ElTree>>();

    const x_tree_props = {
        children: "children",
        label: "name",
    }
    var x_tree_dept = ref<ctree_node[]>([]);
    var x_dept_data = ref({
        "dept_id": 0,
        "dept_pid": 0,
        "name": "",
        "address": "",
        "contact": "",
        "phone": "",
        "note": "",
        "status": 1
    });

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_show_dialog = ref(false);
    var m_dialog_data: any = {};

    const show_dialog = (data: any) => {
        x_show_dialog.value = true;

        m_dialog_data = Object.assign({}, data);
        x_dept_data = ref({
            "dept_id": 0,
            "dept_pid": 0,
            "name": "",
            "address": "",
            "contact": "",
            "phone": "",
            "note": "",
            "status": 1
        });
        loadTree_dept();
    }

    const onDialogOpened = () => {
    }
    const onDialogClose = () => {
    }
    const onButtonClick_Cancel = () => {

        let ret = {
            data: m_dialog_data,
            dept: x_dept_data.value
        }

        emits("close", true, ret, (result: boolean) => {
            x_show_dialog.value = !result;
        });
    }
    const onButtonClick_Ok = () => {

        let ret = {
            data: m_dialog_data,
            dept: x_dept_data.value
        }

        emits("close", false, ret, (result: boolean) => {
            x_show_dialog.value = !result;
        });        
    }

    const loadTree_dept = async () => {

        let ret:any = await eocore.post("/api/dept/list", [{
            "dept_pid": 1
        }])

        let list = eocore.check_net_array(ret);
        if (list == undefined) return;

        let tree: any[] = [];
        eolib.list_2_tree(list, tree, "dept_id", "dept_pid");
        x_tree_dept.value = tree;
    }

    const onTreeNodeClick_dept = (data: any, node: any, event: any) => {
        //console.log(data);
        x_dept_data.value = data;
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>