<template>
    <div class="eo_page">
        <div class="div_back">
            <div class="eo_col">
                <div class="eo_col_f">
                    
                    <!-- 登录面板 begin -->
                    <div class="div_login">
                        <div class="border">
                            <div class="panel">                            
                                <div class="title">{{ x_main_title }}</div>
                                <div style="height:30px"></div>
                                <div class="row">
                                    <el-input v-model="x_login_id" placeholder="请输入账号"></el-input>
                                </div>
                                <div class="row">
                                    <el-input v-model="x_login_psw" placeholder="请输入密码" show-password></el-input>
                                </div>
                                <div class="row">
                                    <el-button type="primary" class="eo_w100"
                                    @click="onButtonClick_Login" :disabled="x_login_disable">登录</el-button>
                                </div>
                                <div class="info">{{x_login_info}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 登录面板 end -->
                </div>
                <div class="eo_col_d">
                    <div style="height:100px;"></div>
                    <div class="div_copyright">
                        <span>{{ x_copyright + " " + x_version }}</span>
                    </div>
                    <div style="height:50px;"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

    import { ref, onMounted } from "vue"

    import router from "@/router/index";

    import tmd5 from "@/inc/tmd5";
    import eocore from "@/inc/eocore";
    import TGlobal from "@/logic/TGlobal";

    var x_login_id = ref("");
    var x_login_psw = ref("");
    var x_login_disable = ref(false);
    var x_login_info = ref("");

    var x_main_title = ref("");
    var x_copyright = ref("");
    var x_version = ref("");

    onMounted(async () => {        
        x_main_title.value = TGlobal.appData["main_title"];
        x_copyright.value = TGlobal.appData["copyright"];
        x_version.value = TGlobal.appData["version"];
    })

    const onButtonClick_Login = async () => {

        x_login_disable.value = true;
        
        // 非明文传输
        let loginPswMd5 = tmd5.hexMD5(x_login_psw.value);

        let ret: any = await eocore.post("/api/user/login", [{
            version: 0,
            mode: 1,
            login_id: x_login_id.value,
            login_psw: loginPswMd5,
        }]);
        
        let info: string = eocore.get_info(ret, 0);
        if (!eocore.check_empty(info)) {
            x_login_info.value = info;
            x_login_disable.value = false;
            return;
        }
        if (eocore.check_empty(ret.data._list)) {
            x_login_info.value = "账号或密码错误";
            x_login_disable.value = false;
            return;
        }

        TGlobal.userData = ret.data._list[0];

        // 获取权限
        let permits = TGlobal.userData["permits"];
        TGlobal.userData["permits"] = "";
        TGlobal.permitString = permits;

        x_login_disable.value = false;
        
        router.replace({ name:'main' });
    }

</script>
<style scoped lang="scss">
.div_back {
    width: 100%;
    height: 100%;
    background-color: var(--eo_color_back);
}
.div_login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .border {        
        width: 360px;
        border: 1px solid var(--eo_color_dark1);
        border-radius: 20px;

        .panel {
            .title {
                text-align: center;
                background-color: var(--eo_color_dark1);
                padding: 10px;
                font-size: 18px;
                color: #fff;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                box-sizing: border-box;
            }
            .row {
                padding: 10px 25px;
                box-sizing: border-box;
            }
            .info {
                padding: 10px 25px;
                box-sizing: border-box;
                height: 80px;
                color: #4099ff;
                word-break: break-all;
                word-wrap: break-word;
            }
        }
    }
}
.div_copyright {
    font-size: 14px;
    color: #333;
    padding: 5px;
    text-align: center;
}
</style>