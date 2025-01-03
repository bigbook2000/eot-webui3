<script lang="ts">
/** KeepAlive */
export default { name: "device_list" }
</script>

<script lang="ts" setup>

    import { onMounted } from "vue"

    import vbuttonk from "@/logic/common/vbuttonk.vue"
    import vtable from "@/logic/common/vtable.vue"

    import device_info from "@/views/frame/device/device_info.vue"
    import device_control from "@/views/frame/device/device_control.vue"
    import device_config from "@/views/frame/device/device_config.vue"
    import device_version from "@/views/frame/device/device_version.vue"

    import { tsInit } from "./device_"

    /** 避免vue代码过大  */
    const 
    {
        v_table_device,

        v_device_info,
        v_device_control,
        v_device_config,
        v_device_version,        

        x_data_fields,

        x_show_loading,
        x_query_mn,
        x_query_dkey,
        x_query_name,
        x_query_dtype,
        x_query_dversion,

        x_page_index,
        x_page_row_count,
        x_row_total,

        doVue_Mounted,

        onButtonClick_Load,
        onButtonClick_Add,
        onButtonClick_Upd,
        onButtonClick_Del,
        
        onButtonClick_Update,
        onButtonClick_Config,
        onButtonClick_Control,

        onTableItem_device,
        onTablePage_device,        
        onTableLoading_device,
        onTableRowClick_device,
        onTableSortChage_device,

        onPageChange_device,
        onDialogClose_device,
        onDialogClose_control,
        onDialogClose_config,
        onDialogClose_version,
    } 
    = tsInit();

    onMounted(async () => {
        doVue_Mounted(); 
    });

</script>

<style lang="scss" scoped>
.span_dtime0 {
    color: #999;
}
.span_dtime1 {
    color: #000;
}
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
                            <el-input style="width:100%" maxlength="32"></el-input>
                        </div>
                    </div>                    
                    <div class="cell eo_w200p">
                        <div class="label_s">MN</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="64"
                                v-model="x_query_mn"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_s">名称</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="64"
                                v-model="x_query_name"></el-input>
                        </div>
                    </div>
                </div>
                <div class="eo_form">
                    <div class="cell eo_w200p">
                        <div class="label_s">标识</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="64"
                                v-model="x_query_dkey"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_s">类型</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_dtype"></el-input>
                        </div>
                    </div>
                    <div class="cell eo_w200p">
                        <div class="label_s">版本</div>
                        <div class="input">
                            <el-input style="width:100%" maxlength="32"
                                v-model="x_query_dversion"></el-input>
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
                        <div class="input_w">
                            <vbuttonk type="default" class="input_w" permit="device.list.upd" 
                                @click="onButtonClick_Update">升级</vbuttonk>
                        </div>
                        <div class="input_w">
                            <vbuttonk type="default" class="input_w" permit="device.list.upd" 
                                @click="onButtonClick_Config">配置</vbuttonk>
                        </div>
                        <div class="input_w">
                            <vbuttonk type="primary" class="input_w" permit="device.list.upd" 
                                @click="onButtonClick_Control">控制</vbuttonk>
                        </div>
                        <div class="split"></div>
                        <div class="input_w">
                            <vbuttonk type="primary" class="input_w" permit="device.list.upd" 
                                @click="onButtonClick_Add">添加</vbuttonk>
                        </div>
                        <div class="input_w">
                            <vbuttonk type="primary" class="input_w" permit="device.list.upd" 
                                @click="onButtonClick_Del">删除</vbuttonk>
                        </div>
                        <div class="input_w">
                            <vbuttonk type="primary" class="input_w" permit="device.list.upd" 
                                @click="onButtonClick_Upd">修改</vbuttonk>
                        </div>
                    </div>
                </div>
            </div>
            <div class="eo_col_f">
                <vtable ref="v_table_device" 
                    name="设备"
                    id-field="f_device_id" 
                    :on-item="onTableItem_device"
                    :on-page="onTablePage_device"
                    @sort-change="onTableSortChage_device"
                    @loading="onTableLoading_device"
                    @row-click="onTableRowClick_device">
                    <el-table-column prop="f_dtime_s" label="更新时间" width="180">
                        <template #default="scope">
                            <span :class="'span_dtime'+scope.row['f_status']">{{ scope.row['f_dtime_s'] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f_mn" label="MN" sortable width="200" />
                    <el-table-column prop="f_name" label="名称" sortable width="200" />
                    <el-table-column v-for="item in x_data_fields" :key="item['f_dname']"
                        :prop="item['f_dname']" :label="item['f_label']" sortable :width="item['f_width']">
                        <template #default="scope">                            
                            <span>{{ scope.row.dataList[item['f_dname']] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f_dept_id_s" label="部门" sortable width="120" />
                    <el-table-column prop="f_dtype" label="类型" sortable width="90" />
                    <el-table-column prop="f_dversion" label="版本" sortable width="100" />
                    <el-table-column prop="f_ctime_s" label="创建时间" sortable width="180" />
                    <el-table-column prop="f_note" label="备注" width="200" show-overflow-tooltip />
                    <el-table-column prop="f_dkey" label="设备标识" width="400" />
                    <el-table-column />
                </vtable>
            </div>
            <div class="eo_page_bar">
                <el-pagination
                    background
                    @current-change="onPageChange_device"
                    :current-page.sync="x_page_index"
                    :page-size="x_page_row_count"
                    layout="total, prev, pager, next, jumper"
                    :total="x_row_total">
                </el-pagination>
            </div>
        </div>
        <device_info ref="v_device_info" @close="onDialogClose_device"/>
        <device_control ref="v_device_control" @close="onDialogClose_control"/>
        <device_config ref="v_device_config" @close="onDialogClose_config"/>
        <device_version ref="v_device_version" @close="onDialogClose_version"/>
    </div>    
</template>
