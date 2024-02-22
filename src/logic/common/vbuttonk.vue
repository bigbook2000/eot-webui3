<template>
    <!-- 权限按钮 -->
    <div v-if="x_show_button">
        <el-button :type="type" class="eo_w80p" @click="onButtonClick">
            <slot></slot>
        </el-button>
    </div>
</template>

<script setup lang="ts">

    import { onMounted, ref, watch } from "vue"

    import TLogic from "@/logic/TLogic"

    var x_show_button = ref(true);

    const props = defineProps<{
        type: string,
        permit: string,
        exclude?: boolean
    }>()

    const emits = defineEmits<{
        (e: "click"): void
    }>()

    onMounted(() => {        
        if (props.exclude)
            x_show_button.value = !TLogic.checkPermit(props.permit);
        else
            x_show_button.value = TLogic.checkPermit(props.permit);
    });

    const onButtonClick = () => {

        // 触发一个事件
        emits("click");
    }
</script>

<style lang="scss">
</style>