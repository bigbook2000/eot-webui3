<template>
    <!-- 个人资料 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="div_form">
            <vform ref="v_form_my" :types="x_form_types_my" :data="x_form_my"></vform>
            <div class="eo_space_v"></div>
            <div class="eo_form">
                <div class="eo_form">
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Password">修改密码</el-button>
                        </div>
                    </div>
                </div>
            </div>
            
            <vformd ref="v_formd_password" width="400px" title="修改密码" 
                :form-types="x_form_types_password"
                @close="onFormdClose_password"/>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_my" }
</script>

<script lang="ts" setup>

    import { ref, reactive, onMounted } from "vue"
    import router from "@/router/index"
    
    import eocore from "@/inc/eocore"
    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"
    import tmd5 from "@/inc/tmd5"; 

    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import vform from "@/logic/common/vform.vue"
    import vformd from "@/logic/common/vformd.vue"

    type t_form = InstanceType<typeof vform>;    
    const v_form_my = ref<t_form>();
    
    type t_formd = InstanceType<typeof vformd>;
    const v_formd_password = ref<t_formd>();   

    var x_form_types_my = ref<cform_options[]>([]);
    var x_form_types_password = ref<cform_options[]>([]);

    var x_form_my = ref({});

    var x_show_loading = ref(false);

    onMounted(() => {

        x_form_types_my.value = [
            {type: "label", name: "login_id", span: 100, label: "账号"},
            {type: "label", name: "name", span: 100, label: "姓名"},
            {type: "label", name: "dept_id_s", span: 100, label: "部门"},
            {type: "label", name: "role_s", span: 100, label: "角色"},
            {type: "label", name: "sex", span: 100, label: "性别"},
            {type: "label", name: "birthday_s", span: 100, label: "出生日期"},
            {type: "label", name: "phone", span: 100, label: "常用电话"},
            {type: "label", name: "bphone", span: 100, label: "紧急电话"},
            {type: "label", name: "weixin", span: 100, label: "微信"},
            {type: "label", name: "register", span: 100, label: "籍贯"},
            {type: "label", name: "location", span: 100, label: "现居地址"},
            {type: "label", name: "entrytime_s", span: 100, label: "入职时间"},
        ];

        x_form_types_password.value = [
            {type: "password", name: "login_psw_old", span: 100, label: "旧密码"},
            {type: "password", name: "login_psw_new", span: 100, label: "新密码"},
            {type: "password", name: "login_psw_confirm", span: 100, label: "确认"},
        ]

        x_form_my.value = TGlobal.userData;
    })

    const onButtonClick_Password = () => {
        v_formd_password.value?.show_dialog({
            "login_psw_old": "",
            "login_psw_new": "",
            "login_psw_confirm": "",
        });
    }

    const onFormdClose_password = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
        if (cancel) {
            cb(true); return;
        }

        let loginPswOld: string = data["login_psw_old"];
        let loginPswNew: string = data["login_psw_new"];
        let loginPswConfirm: string = data["login_psw_confirm"];

        if (loginPswOld.length <= 0) {
            eocore.show_info("旧密码不能为空")
            cb(false);
            return;
        }

        if (loginPswNew != loginPswConfirm) {
            eocore.show_info("密码输入不一致")
            cb(false);
            return;
        }

        if (loginPswNew.length < 4 || loginPswNew.length > 16) {
            eocore.show_info("密码输入不符合[4-16个字符]")
            cb(false);
            return;
        }

        loginPswOld = tmd5.hexMD5(loginPswOld);
        loginPswNew = tmd5.hexMD5(loginPswNew);

        x_show_loading.value = true;
        let ret: any = await eocore.post("/api/user/password", [{
            "user_id": TGlobal.userData["user_id"],
            "login_id": TGlobal.userData["login_id"],
            "login_psw_old": loginPswOld,
            "login_psw_new": loginPswNew
        }])
        x_show_loading.value = false;

        let dataNew = eocore.check_net_object(ret);
        if (dataNew == undefined) {
            cb(false);
            return;
        }

        eocore.show_success("密码修改成功")
        cb(true);
    }
</script>

<style lang="scss" scoped>
.div_form {
    padding: 20px;
    width: 300px;
}
</style>