import { ref, reactive } from "vue"
import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

import eocore from "@/inc/eocore"
import eolib from "@/inc/eolib";

import TGlobal from "@/logic/TGlobal";
import TLogic from "@/logic/TLogic";

import vtable from "@/logic/common/vtable.vue"

type t_table = InstanceType<typeof vtable>;
const v_table_data = ref<t_table>();
const v_table_device = ref<t_table>();

var x_show_loading = ref(false);

/** 查询条件 */
var x_query_mn = ref("");
var x_query_dkey = ref("");
var x_query_name = ref("");
var x_query_version = ref("");

var x_page_index_data = ref(0);
var x_page_row_count_data = ref(48);
var x_row_total_data = ref(0);

var x_page_index_device = ref(0);
var x_page_row_count_device = ref(20);
var x_row_total_device = ref(0);

/** 数据字段 */
var x_data_fields = ref<any[]>([]);

var x_query_type = ref("2061");
var x_query_date = ref<Date[]>([]);

/**
 * 处理vue onMounted事件
 */
const doVue_Mounted = async () => {

    let dtStart = new Date();
    dtStart.setMonth(dtStart.getMonth() - 1);
    let dtEnd = new Date();
    x_query_date.value = [dtStart, dtEnd];
    
    await netLoad_datafield_list();

    netLoad_device_query(-1);
}

const netLoad_datafield_list = async () => {

    // 先读取数据字段参数清单
    let ret = await eocore.proc("np_datafield_list", {
        "v_dept_id": TGlobal.userData["f_dept_id"],
        "v_type": x_query_type.value
    })
    let list = eocore.check_net_array(ret);
    if (list != undefined) x_data_fields.value = list;

    //console.log(x_data_fields);
}

/**
 * 查询终端
 * @param pageIndex 
 */
const netLoad_device_query = (pageIndex: number) => {

    let orderBy = "";

    let pageRowCount = x_page_row_count_device.value;
    let rowIndex = pageIndex * pageRowCount;
    if (pageIndex < 0) x_page_index_device.value = 1;

    // 分页使用 s_page_row_index 和 s_page_row_count
    v_table_device.value!.load_list_proc("np_device_query", {
        "v_dkey": x_query_dkey.value,
        "v_dtype": "",
        "v_dversion": "",
        "v_mn": x_query_mn.value,
        "v_name": x_query_name.value,
        "v_version_code": x_query_version.value,
        "v_start_ctime": "2020-01-01 00:00:00",
        "v_end_ctime": "2050-01-01 00:00:00",
        "v_order_by": orderBy,
        "s_page_row_index": rowIndex,
        "s_page_row_count": pageRowCount
    });
}

/**
 * 查询历史数据
 * @param pageIndex 
 */
const netLoad_data_query = (pageIndex: number) => {

    let deviceData = v_table_device.value!.get_select_data(true);
    if (deviceData == undefined) return;

    let deviceId = deviceData["f_device_id"];

    let pageRowCount = x_page_row_count_data.value;
    let rowIndex = pageIndex * pageRowCount;
    if (pageIndex < 0) x_page_index_data.value = 1;

    let startTime = eolib.date_start(x_query_date.value[0]);
    let endTime = eolib.date_end(x_query_date.value[1]);
    v_table_data.value!.load_list_proc("np_data_query", {
        "v_device_id": deviceId,
        "v_type": x_query_type.value,
        "v_start_time": startTime,
        "v_end_time": endTime,
        "v_order_by": " order by f_data_id desc",
        "s_page_row_index": rowIndex,
        "s_page_row_count": pageRowCount
    });
}


const onTableItem_data = (data: any) => {
    data["f_dtime_s"] = eolib.datetime_2_string(data["f_dtime"]);
    data["f_datatime_s"] = eolib.datetime_2_string(data["f_datatime"]);
    data["f_qn_s"] = eolib.datetime_2_string(data["f_qn"]);

    // 格式化数据
    TLogic.formatDeviceData(data);
}
const onTablePage_data = (n: number): number => {
    x_row_total_data.value = n;
    return n;
}
const onTableItem_device = (data: any) => {
}
const onTablePage_device = (n: number): number => {
    x_row_total_device.value = n;
    return n;
}

const onButtonClick_Load_data = () => {
    netLoad_data_query(-1);
}

const onButtonClick_Load_device = () => {
    netLoad_device_query(-1);
}

const onTableLoading_data = (show: boolean) => {
    x_show_loading.value = show;
}
const onTableRowClick_data = (data: any) => {
}
/**
 * 点击数据分页
 * @param pageIndex 
 */
const onPageChange_data = (pageIndex: number) => {
    x_page_index_data.value = pageIndex;
    netLoad_data_query(pageIndex - 1);
}


const onTableLoading_device = (show: boolean) => {
    x_show_loading.value = show;
}
const onTableRowClick_device = (data: any) => {    
    // 点击终端查询对应数据
    netLoad_data_query(-1);
}
/**
 * 点击设备分页
 * @param pageIndex 
 */
const onPageChange_device = (pageIndex: number) => {
    x_page_index_device.value = pageIndex;
    netLoad_device_query(pageIndex - 1);
}

const onDicChange_type = (val: number|string) => {
    netLoad_datafield_list();
}

export const tsInit = () => {

    return {

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
}