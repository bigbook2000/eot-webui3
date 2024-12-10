
<script lang="ts">
/** KeepAlive */
export default { name: "data_datafield" }
</script>

<script lang="ts" setup>

    import { onMounted } from "vue"

    import vtable from "@/logic/common/vtable.vue"
    import vformd from "@/logic/common/vformd.vue"

    import dept_input from "@/views/platform/dept_input.vue"

    import { tsInit } from "./datafield_"

    /** 避免vue代码过大  */
    const 
    {
        v_table_field,
        v_formd_field,

        x_form_types,
        x_show_loading,
        x_query_dept_id_s,

        doVue_Mounted,
        onButtonClick_Load,

        onButtonClick_Add,
        onButtonClick_Upd,
        onButtonClick_Del,

        onTableItem_field,
        onTableLoading_field,
        onTableRowClick_field,
        onDialogClose_field,

        onInputChange_dept
    } 
    = tsInit();

    onMounted(async () => {
        doVue_Mounted(); 
    });

</script>

<style lang="scss" scoped>
</style>

<template>
    <!-- 设备管理 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_col">
            <div class="eo_tool_bar">
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_s">部门</div>
                        <div class="input">
                            <dept_input :deptName="x_query_dept_id_s" style="width:100%"
                                @change="onInputChange_dept"></dept_input>
                        </div>
                    </div>
                    <div class="cell">
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load">刷新</el-button>
                        </div>
                        <div class="split"></div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p"
                                @click="onButtonClick_Add">添加</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="default" class="eo_w80p"
                                @click="onButtonClick_Del">删除</el-button>
                        </div>
                        <div class="input_w">
                            <el-button type="primary" class="eo_w80p"
                                @click="onButtonClick_Upd">修改</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="eo_col_f">
                <vtable ref="v_table_field" 
                    name="参数字段"
                    id-field="f_data_field_id" 
                    :on-item="onTableItem_field"
                    @loading="onTableLoading_field"
                    @row-click="onTableRowClick_field">                    
                    <el-table-column prop="f_order" label="顺序" width="80" />
                    <el-table-column prop="f_visible" label="显示" width="80" />
                    <el-table-column prop="f_type" label="类型" width="100" />
                    <el-table-column prop="f_label" label="名称" width="160" />
                    <el-table-column prop="f_dname" label="协议参数" width="160" />
                    <el-table-column prop="f_kname" label="解析参数" width="160" />
                    <el-table-column prop="f_precision" label="精度" width="80" />
                    <el-table-column prop="f_unit" label="单位" width="120" />
                    <el-table-column prop="f_width" label="宽度" width="120" />
                    <el-table-column prop="f_note" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column />
                </vtable>
            </div>
        </div>
        <vformd ref="v_formd_field" width="700px"
            :formTypes="x_form_types" @close="onDialogClose_field"></vformd>
    </div>    
</template>
