<template>
    <!-- 用户信息 -->
    <vdialog ref="v_dialog"
        width="700px" title="用户"        
        @close="onDialogClose">
        <div class="eo_form eo_w100">
            <div class="cell eo_w2">
                <div class="label_n">账号</div>
                <div class="input">
                    <el-input v-model="x_user_data['login_id']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">姓名</div>
                <div class="input">
                    <el-input v-model="x_user_data['name']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">部门</div>
                <div class="input">
                    <el-input v-model="x_user_data['dept_id_s']" style="width:100%" readonly
                        @click="onInputClick_dept" ></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">角色</div>
                <div class="input">
                    <el-select v-model="x_user_data['role_d']"
                        multiple
                        placeholder="请选择角色"
                        style="width:100%">
                    <el-option
                        v-for="item in x_role_list"
                        :key="item['role_id']"
                        :label="item['name']"
                        :value="item['role_id']" />
                    </el-select>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">性别</div>
                <div class="input">
                    <vdic dic="性别" :all="false" field="label"
                        v-model="x_user_data['sex']" style="width:100%" />
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">出生日期</div>
                <div class="input">
                    <el-date-picker style="width:100%"
                        v-model="x_user_data['birthday']"
                        type="date" format="YYYY-MM-DD"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">常用电话</div>
                <div class="input">
                    <el-input v-model="x_user_data['phone']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">紧急电话</div>
                <div class="input">
                    <el-input v-model="x_user_data['bphone']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">微信</div>
                <div class="input">
                    <el-input v-model="x_user_data['weixin']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">籍贯</div>
                <div class="input">
                    <el-input v-model="x_user_data['register']" style="width:100%"
                        maxlength="32"></el-input>
                </div>
            </div>
            <div class="cell eo_w100">
                <div class="label_n">现居地址</div>
                <div class="input">
                    <el-input v-model="x_user_data['location']" style="width:100%"
                        maxlength="128"></el-input>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">入职日期</div>
                <div class="input">
                    <el-date-picker style="width:100%"
                        v-model="x_user_data['entrytime']"
                        type="date" format="YYYY-MM-DD"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">离职日期</div>
                <div class="input">
                    <el-date-picker style="width:100%"
                        v-model="x_user_data['leavetime']"
                        type="date" format="YYYY-MM-DD"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="cell eo_w2">
                <div class="label_n">状态</div>
                <div class="input">
                    <el-switch v-model="x_user_data['status']" 
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

    import vdic from "@/logic/common/vdic.vue"

    import dept_list from "@/views/platform/dept_list.vue"
    const v_dept_list = ref<InstanceType<typeof dept_list>>();

    const emits = defineEmits<{
        (e: "close", cancel: boolean, data: any, cb: cfunc_boolean): void
    }>()

    const x_role_list = ref<any[]>([]);

    var x_user_data: any = reactive({
    });

    const netLoad_role_list = async () => {

        let ret: any = await eocore.post("/api/role/list", [{}]);
        let list = eocore.check_net_array(ret);
        if (list != undefined) x_role_list.value = list;
    }

    onMounted(() => {
        netLoad_role_list();
    });

    const show_dialog = (data: any) => {

        // 先打开对话框
        v_dialog.value!.show_dialog(undefined);
        
        // 创建一个副本
        let dataNew = Object.assign({}, data);        
        x_user_data = reactive(dataNew);
    }

    const onInputClick_dept = (event: FocusEvent) => {
        //console.log(event);
        v_dept_list.value!.show_dialog(undefined);
    }

    const onDialogOpened = () => {
    }

    const onDialogClose = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        emits("close", cancel, x_user_data, (result: boolean) => {
            cb(result);
        });
    }

    const onDialogClose_deptlist = (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        let deptData = data.dept;        
        if (eocore.check_id(deptData, "dept_id")) {

            x_user_data["dept_id"] = deptData["dept_id"];
            x_user_data["dept_id_s"] = deptData["name"];
        }

        cb(true);
    }

    defineExpose({
        show_dialog
    })

</script>

<style lang="scss">
</style>