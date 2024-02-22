<template>
    <!-- 设备信息 -->
    <vdialog ref="v_dialog"
        width="500px" title="设备"        
        @close="onDialogClose">
        <div class="eo_form eo_w100">
            <div class="cell eo_w100">
                <div class="label_n">设备标识</div>
                <div class="input">
                    <el-input v-model="x_device_data['dkey']" style="width:100%"
                        readonly></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">部门</div>
                <div class="input">
                    <el-input v-model="x_device_data['dept_id_s']" style="width:100%" readonly
                        @click="onInputClick_dept" ></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">MN</div>
                <div class="input">
                    <el-input v-model="x_device_data['mn']" style="width:100%"
                        maxlength="64"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">名称</div>
                <div class="input">
                    <el-input v-model="x_device_data['name']" style="width:100%"
                        maxlength="64"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">备注</div>
                <div class="input">
                    <el-input style="width:100%"
                        v-model="x_device_data['note']" type="textarea" resize="none"
                        :row="4" :autosize="{minRows: 4, maxRows: 4}"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">创建时间</div>
                <div class="input">
                    <el-input v-model="x_device_data['create_time_s']" style="width:100%"
                        readonly maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">有效</div>
                <div class="input">
                    <el-switch v-model="x_device_data['enable']" 
                        :active-value="1" :inactive-value="0"></el-switch>
                </div>
            </div>
        </div>
        <dept_list ref="v_dept_list" @close="onDialogClose_deptlist"/>
    </vdialog>
</template>

<script setup lang="ts">

    import { ref, reactive, onMounted } from "vue"

    import eocore from "@/inc/eocore";

    import type {cfunc_boolean} from "@/inc/eotypes";

    import vdialog from "@/logic/common/vdialog.vue"
    type t_dialog = InstanceType<typeof vdialog>;
    const v_dialog = ref<t_dialog>();

    import dept_list from "@/views/platform/dept_list.vue"
    const v_dept_list = ref<InstanceType<typeof dept_list>>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    var x_device_data: any = reactive({
    });

    onMounted(() => {
    });

    const show_dialog = async (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本
        let dataNew = Object.assign({}, data);        
        x_device_data = reactive(dataNew);
    }

    const onInputClick_dept = (event: FocusEvent) => {
        //console.log(event);
        v_dept_list.value!.show_dialog(undefined);
    }

    const onDialogOpened = () => {
    }

    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        emits("close", cancel, x_device_data, (result: boolean) => {
            cb(result);
        });
    }

    const onDialogClose_deptlist = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        let deptData = data.dept;        
        if (eocore.check_id(deptData, "dept_id")) {

            x_device_data["dept_id"] = deptData["dept_id"];
            x_device_data["dept_id_s"] = deptData["name"];
        }

        cb(true);
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>