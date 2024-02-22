<template>
    <!-- 个人资料 -->
    <div class="eo_page" v-loading="x_show_loading">
        
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

    import vformd from "@/logic/common/vformd.vue"
    import eolib from "@/inc/eolib"
    import eodic from "@/inc/eodic"

    type t_formd = InstanceType<typeof vformd>;
    const v_formd_item = ref<t_formd>();

    var x_show_loading = ref(false);

    onMounted(() => {
    })

    const onFormdClose_dic = (cancel: boolean, data: any, cb: cfunc_boolean): void => {
        if (cancel) {
            cb(true); return;
        }

        cb(true);
    }
</script>

<style lang="scss" scoped>
</style>