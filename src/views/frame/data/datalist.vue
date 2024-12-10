<script lang="ts">
/** 
 * 历史数据
 * KeepAlive 
 */
export default { name: "data_datalist" }
</script>

<script lang="ts" setup>

    import { onMounted } from "vue"

    import vtable from "@/logic/common/vtable.vue"
    import vdic from "@/logic/common/vdic.vue"

    import { tsInit } from "./datalist_"

    /** 避免vue代码过大  */
    const 
    {
        v_table_data,
        v_table_device,

        x_data_fields,

        x_show_loading,
        x_query_mn,
        x_query_dkey,
        x_query_name,
        x_query_type,
        x_query_date,

        x_page_index_data,
        x_page_row_count_data,
        x_row_total_data,

        x_page_index_device,
        x_page_row_count_device,
        x_row_total_device,

        doVue_Mounted,

        onButtonClick_Load_data,
        onButtonClick_Load_device,
        
        onTableItem_data, 
        onTablePage_data, 
        onTableLoading_data,
        onTableRowClick_data,
        onPageChange_data,

        onTableItem_device,
        onTablePage_device,
        onTableLoading_device,
        onTableRowClick_device,
        onPageChange_device,

        onDicChange_type
    } 
    = tsInit();

    onMounted(async () => {
        doVue_Mounted(); 
    });

</script>

<style lang="scss" scoped>
.span_dtime0 {
    color: #f00;
}
.span_dtime1 {
    color: #000;
    font-weight: bold;
}
</style>

<template>
    <!-- 历史数据 -->
    <div class="eo_page" v-loading="x_show_loading">
        <div class="eo_row">
            <div class="eo_row_f">
                <div class="eo_col">
                    <div class="eo_tool_bar">
                        <div class="eo_form">
                            <div class="cell eo_w200p">
                                <div class="label_n">数据类型</div>
                                <div class="input">
                                    <vdic style="width:100%" dic="数据类型" :all="false" field="label"
                                        v-model="x_query_type" @change="onDicChange_type" />
                                </div>
                            </div>
                            <div class="cell" style="width:400px;">
                                <div class="label_n">数据时间</div>
                                <div class="input">
                                    <el-date-picker style="width:280px;" v-model="x_query_date"
                                        type="daterange" range-separator="-" :clearable="false"
                                        start-placeholder="起始日期" end-placeholder="截至日期" />
                                </div>
                            </div>
                            <div class="cell">
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_data">加载</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eo_col_d" style="height:200px;">
                        <!-- 图表 -->
                    </div>
                    <div class="eo_col_f">
                        <vtable ref="v_table_data" 
                            name="数据"
                            id-field="f_data_id" 
                            :on-item="onTableItem_data"
                            :on-page="onTablePage_data"
                            @loading="onTableLoading_data"
                            @row-click="onTableRowClick_data">
                            <el-table-column prop="f_dtime_s" label="更新时间" width="180" />
                            <el-table-column v-for="item in x_data_fields" :key="item['f_dname']"
                                :prop="item['f_dname']" :label="item['f_label']" :width="item['f_width']">
                                <template #default="scope">                            
                                    <span>{{ scope.row.dataList[item['f_dname']] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="f_datatime_s" label="设备时间" width="180" />
                            <el-table-column prop="f_sqn_s" label="数据时间" width="180" />
                            <el-table-column />
                        </vtable>
                    </div>
                    <div class="eo_page_bar">
                        <el-pagination
                            background
                            @current-change="onPageChange_data"
                            :current-page.sync="x_page_index_data"
                            :page-size="x_page_row_count_data"
                            layout="total, prev, pager, next, jumper"
                            :total="x_row_total_data">
                        </el-pagination>
                    </div>
                </div>
            </div>
            <div class="eo_line_v"></div>
            <div class="eo_row_d">
                <div class="eo_col" style="width:420px;">
                    <div class="eo_tool_bar">
                        <div class="eo_form">                                               
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
                            <div class="cell eo_w200p">
                                <div class="label_s">部门</div>
                                <div class="input">
                                    <el-input style="width:100%" maxlength="32"></el-input>
                                </div>
                            </div>
                            <div class="cell">
                                <div class="input_w">
                                    <el-button type="primary" class="eo_w80p" @click="onButtonClick_Load_device">查找</el-button>
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
                            @loading="onTableLoading_device"
                            @row-click="onTableRowClick_device">
                            <el-table-column prop="f_mn" label="MN" sortable width="200" />
                            <el-table-column prop="f_name" label="名称" sortable width="200" />
                            <el-table-column prop="f_dept_id_s" label="部门" sortable width="140" />
                            <el-table-column prop="f_version_id_s" label="版本" sortable width="160" />                    
                            <el-table-column prop="f_ctime_s" label="创建时间" sortable width="180" />
                            <el-table-column prop="f_dkey" label="设备标识" width="400" />
                            <el-table-column />
                        </vtable>
                    </div>
                    <div class="eo_page_bar">
                        <el-pagination
                            background
                            @current-change="onPageChange_device"
                            :current-page.sync="x_page_index_device"
                            :page-size="x_page_row_count_device"
                            layout="total, prev, pager, next, jumper"
                            :total="x_row_total_device">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>
