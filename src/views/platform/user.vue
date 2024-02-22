<template>
    <!-- 用户管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_s">账号</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_login_id"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_s">姓名</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_name"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_s">电话</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_phone"></el-input>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">查找</el-button>
                        </div>                        
                    </div>
                </div>
                <div class="eo_form">
                    <div class="cell">
                        <vbuttonk type="primary" class="input_w" permit="platform.user.upd"
                            @click="onButtonClick_Reset">重置密码</vbuttonk>
                        <div class="split"></div>
                        <vbuttonk type="primary" class="input_w" permit="platform.user.upd" 
                            @click="onButtonClick_Add">添加</vbuttonk>
                        <vbuttonk type="primary" class="input_w" permit="platform.user.upd" 
                            @click="onButtonClick_Del">删除</vbuttonk>
                        <vbuttonk type="primary" class="input_w" permit="platform.user.upd" 
                            @click="onButtonClick_Upd">修改</vbuttonk>                        
                    </div>
                </div>
            </div>
            <div class="eo_col_f">
                <vtable ref="v_table_user" 
                    name="用户"
                    id-field="user_id" 
                    @loading="onTableLoading_user"
                    @row-click="onTableRowClick_user">
                    <el-table-column prop="status_s" label="状态" width="70" />
                    <el-table-column prop="login_id" label="账号" width="180" />
                    <el-table-column prop="name" label="姓名" width="100" />
                    <el-table-column prop="dept_id_s" label="部门" width="140" />
                    <el-table-column prop="role_s" label="角色" width="200" />
                    <el-table-column prop="sex" label="性别" width="70" />
                    <el-table-column prop="birthday_s" label="出生日期" width="120" />
                    <el-table-column prop="phone" label="电话" width="140" />
                    <el-table-column prop="location" label="现居地址" width="200" />
                    <el-table-column prop="entrytime_s" label="入职日期" width="120" />
                    <el-table-column prop="leavetime_s" label="离职日期" width="120" />
                    <el-table-column />
                </vtable>
            </div>
        </div>
        <user_info ref="v_user_info" 
            @close="onDialogClose_userinfo"/>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_user" }
</script>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from "vue"
    import type { cform_options, cfunc_boolean, ctree_node } from "@/inc/eotypes";

    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib";

    import vbuttonk from "@/logic/common/vbuttonk.vue"

    import vtable from "@/logic/common/vtable.vue"
    type t_table = InstanceType<typeof vtable>;
    const v_table_user = ref<t_table>();

    import user_info from "@/views/platform/user_info.vue"
    const v_user_info = ref<InstanceType<typeof user_info>>();

    var x_show_loading = ref(false);

    /** 查询条件 */
    var x_query_login_id = ref("");
    var x_query_name = ref("");
    var x_query_phone = ref("");

    var m_role_list: any[];

    onMounted(async () => { 

        v_table_user.value!.init_table({
            on_item: (data) => {

                if (data["status"] != 0)
                    data["status_s"] = "-";
                else
                    data["status_s"] = "失效";

                data["birthday_s"] = eolib.date_2_string(data["birthday"]);
                data["entrytime_s"] = eolib.date_2_string(data["entrytime"]);
                data["leavetime_s"] = eolib.date_2_string(data["leavetime"]);

                let rd = getRoleInfo(data["role"]);
                data["role_s"] = rd["roleStr"];
                data["role_d"] = rd["roleIds"];
            }
        })

        let ret: any = await eocore.post("/api/role/list", [{}]);
        let list = eocore.check_net_array(ret);
        if (list != undefined) m_role_list = list;

        netLoad_user_query();
    });

    const getRoleInfo = (role: string): any => {

        let roleStr: string = "";
        let ss = role.split(',');

        let roleIds: number[] = [];

        if (ss == undefined) {
            return {
                "roleStr": "",
                "roleIds": roleIds,
            };
        } 
        
        for (let d of ss) {

            let item = eolib.get_item(m_role_list, "role_id", d);            
            if (item != undefined) {
                roleStr += item["name"] + ",";
            }

            roleIds.push(parseInt(d));
        }

        return {
            "roleStr": roleStr,
            "roleIds": roleIds,
        }
    }

    const getEmpty_user = (): any => {
        return {
            "user_id": 0,
            "login_id": "",
            "name": "",
            "dept_id": 0,
            "dept_id_s": "",
            "role": "", // id字符串
            "role_d": [], // id数组
            "role_s": "", // 名称字符串
            "sex": "男",
            "birthday": "2000-01-01 00:00:00",
            "phone": "",
            "bphone": "",
            "weixin": "",
            "register": "",
            "location": "",
            "entrytime": "1970-01-01 00:00:00",
            "leavetime": "1970-01-01 00:00:00",
            "note": "",
            "status": 1
        }
    }

    const netLoad_user_query = () => {

        v_table_user.value!.load_list_net("/api/user/query", {
            "login_id": x_query_login_id.value,
            "name": x_query_name.value,
            "phone": x_query_phone.value,
        });
    }

    const onButtonClick_Load = () => {
        netLoad_user_query();
    }
    const onButtonClick_Add = () => {

        let userData = getEmpty_user();
        userData["entrytime"] = eolib.date_2_string(new Date());
        v_user_info.value!.show_dialog(userData);
    }
    const onButtonClick_Upd = () => {

        let userData = v_table_user.value!.get_select_data(true);
        if (userData == undefined) return;

        v_user_info.value!.show_dialog(userData);
    }
    const onButtonClick_Del = async () => {
        v_table_user.value!.remove_data_net_select("/api/user/del", (data) => {
            return {
                "user_id": data["user_id"]
            }
        });
    }
    const onButtonClick_Reset = async () => {

        let userData = v_table_user.value!.get_select_data(true);
        if (userData == undefined) return;

        let dret: boolean = await eocore.show_confirm("是否确认重置该用户密码？");
        if (!dret) return;

        x_show_loading.value = true;
        let ret: any = await eocore.post("/api/user/reset", [{
            "user_id": userData["user_id"],
            "login_id": userData["login_id"]
        }])
        x_show_loading.value = false;

        let data = eocore.check_net_object(ret);
        if (data == undefined) return;

        eocore.show_success("密码重置成功");
    }    

    const onTableLoading_user = (show: boolean) => {
        x_show_loading.value = show;
    }
    const onTableRowClick_user = (data: any) => {
    }

    const onDialogClose_userinfo = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        console.log(data);
        let userId = data["user_id"];
        
        let loginId = eocore.to_string(data["login_id"]);
        let pat = /^[a-zA-Z0-9_-]{4,16}$/;
        if (!pat.test(loginId)) {
            eocore.show_error('账号输入不符合[4-16个字符]');
            return;
        }
        data["login_id"] = loginId;

        // let loginPsw = data["login_psw"];
        // if (loginPsw.length < 4 || loginPsw.length > 16) {
        //     eocore.show_error('密码输入不符合[4-16个字符]');
        //     return;
        // }

        if (eocore.check_string(data, "name") <= 0) {
            eocore.show_error("姓名不能输入为空");
            cb(false); return;
        }

        if (!eocore.check_id(data, "dept_id")) {
            eocore.show_error("请选择部门");
            cb(false); return;
        }

        let roleList = data["role_d"];
        if (eocore.check_empty(roleList)) {
            eocore.show_error("请选择角色");
            cb(false); return;
        }

        let roleIds = "";
        for (let d of roleList) {
            roleIds += "," + d;
        }
        roleIds = roleIds.substring(1);
        data["role"] = roleIds;

        data["birthday"] = eolib.datetime_2_string(data["birthday"]);
        data["entrytime"] = eolib.date_2_string(data["entrytime"]);
        data["leavetime"] = eolib.date_2_string(data["leavetime"]);

        v_table_user.value!.update_data_net("/api/user/upd", {
            "user_id": userId,
            "login_id": loginId,
            "login_psw": "",
            "name": data["name"],
            "dept_id": data["dept_id"],
            "role": data["role"],
            "sex": data["sex"],
            "birthday": data["birthday"],
            "phone": data["phone"],
            "bphone": data["bphone"],
            "weixin": data["weixin"],
            "register": data["register"],
            "location": data["location"],
            "entrytime": data["entrytime"],
            "leavetime": data["leavetime"],
            "status": data["status"],
            "note": data["note"]
        }, -1, userId <= 0, true);
            
        cb(true);
    }

</script>

<style lang="scss" scoped>
</style>