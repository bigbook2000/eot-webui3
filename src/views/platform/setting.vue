<template>
    <!-- 配置参数 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_tool_bar">
            <div class="eo_form" style="width:800px;">
                <div class="cell">
                    <div class="input_w">
                        <el-button type="primary" class="eo_w120p" @click="onButtonClick_DBList">更新数据接口</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
/** KeepAlive */
export default { name: "platform_setting" }
</script>

<script lang="ts" setup>

    import { ref, reactive, onMounted } from "vue"
    import router from "@/router/index"

    import eocore from "@/inc/eocore"
    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"

    var x_show_loading = ref(false);

    onMounted(() => {
    })

    const onButtonClick_DBList = async () => {

        let bret = await eocore.show_confirm("确信要重新加装数据接口吗？");
        if (!bret) return;

        x_show_loading.value = true;
        let ret:any = await eocore.post("/api/common/query/init", [{
        }]);
        x_show_loading.value = false;

        if (eocore.check_net_empty(ret) == null) return;
        eocore.show_success("数据接口重置成功");
    }
</script>

<style lang="scss" scoped>
</style>