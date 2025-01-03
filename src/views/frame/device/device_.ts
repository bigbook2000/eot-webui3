import { ref, reactive } from "vue"
import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

import eocore from "@/inc/eocore"
import eolib from "@/inc/eolib";

import TGlobal from "@/logic/TGlobal";
import TLogic from "@/logic/TLogic";

import vtable from "@/logic/common/vtable.vue"

import device_info from "@/views/frame/device/device_info.vue"
import device_control from "@/views/frame/device/device_control.vue"
import device_config from "@/views/frame/device/device_config.vue"
import device_version from "@/views/frame/device/device_version.vue"

type t_table = InstanceType<typeof vtable>;
const v_table_device = ref<t_table>();

const v_device_info = ref<InstanceType<typeof device_info>>();
const v_device_control = ref<InstanceType<typeof device_control>>();
const v_device_config = ref<InstanceType<typeof device_config>>();
const v_device_version = ref<InstanceType<typeof device_version>>();

var x_show_loading = ref(false);

/** 查询条件 */
var x_query_mn = ref("");
var x_query_dkey = ref("");
var x_query_name = ref("");
var x_query_dtype = ref("");
var x_query_dversion = ref("");

var x_page_index = ref(0);
var x_page_row_count = ref(20);
var x_row_total = ref(0);

/** 数据字段 */
var x_data_fields = ref<any[]>([]);

/** 排序数组 */
var m_orderby_list = [{
    name: "f_mn",
    field: "`n_device`.`f_mn`"
}, {
    name: "f_name",
    field: "`n_device`.`f_name`"
}, {
    name: "f_dept_id_s",
    field: "`n_device`.`f_dept_id`"
}, {
    name: "f_version_id_s",
    field: "`n_device`.`f_dversion_id`"
}, {
    name: "f_ctime_s",
    field: "`n_device`.`f_ctime`"
}];

var m_orderby = [{
    name: "f_device_id",
    order: " DESC"
}];

/**
 * 处理vue onMounted事件
 */
const doVue_Mounted = async () => {
    
    // 先读取数据字段参数清单
    let ret = await eocore.proc("np_datafield_list", {
        "v_dept_id": TGlobal.userData["f_dept_id"],
        "v_type": '2011'
    })
    let list = eocore.check_net_array(ret);
    if (list != undefined) x_data_fields.value = list;

    netLoad_device_query(-1);
}

const getOrderByString = () => {

    let s = "";
    let df;
    for (let d of m_orderby) {

        df = "";
        for (let d1 of m_orderby_list) {
            if (d.name == d1.name) df = d1.field;
        }

        if (df == "") continue;

        s += "," + df + d.order;
    }

    if (s.length > 0) {

        // ORDER BY 前面必须有空格
        s = " ORDER BY " + s.substring(1);
    }
    
    return s;
}

/**
 * 获取一个空的device对象
 */
const getEmpty_device = (): any => {

    return {
        "f_device_id": 0,
        "f_dkey": "",
        "f_mn": "",
        "f_name": "",
        "f_dept_id": 0,
        "f_dept_id_s": "",            
        "f_dversion_id": 0,
        "f_config_data": "",
        "f_ctime": "",            
        "f_enable": 1,
        "f_note": ""
    }
}

const netLoad_device_query = async (pageIndex: number) => {

    let orderBy = getOrderByString();
    console.log(orderBy)

    let pageRowCount = x_page_row_count.value;
    let rowIndex = pageIndex * pageRowCount;
    if (pageIndex < 0) x_page_index.value = 1;

    let ret;
    x_show_loading.value = true;
    ret = await eocore.proc("np_device_query", {        
        "v_dkey": x_query_dkey.value,
        "v_dtype": x_query_dtype.value,
        "v_dversion": x_query_dversion.value,
        "v_mn": x_query_mn.value,
        "v_name": x_query_name.value,
        "v_start_ctime": "2020-01-01 00:00:00",
        "v_end_ctime": "2050-01-01 00:00:00",
        "v_order_by": orderBy,
        "_page_row_index": rowIndex,
        "_page_row_count": pageRowCount
    });

    let list = eocore.check_net_array(ret);
    if (list == null) list = [];

    await TLogic.getVersionNames(list);

    v_table_device.value!.load_list(list);

    x_show_loading.value = false;
}

const onButtonClick_Load = () => {
    netLoad_device_query(-1);
}

/**
 * 点击添加设备按钮
 */
const onButtonClick_Add = async () => {

    let deviceData = getEmpty_device();

    let ret = await eocore.post("/api/common/uuid", [{}]);
    let data = eocore.check_net_object(ret);
    if (data == null) {
        eocore.show_info("无法获取设备标识")
        return;
    }
      
    v_device_info.value!.show_dialog(deviceData);
}
/**
 * 点击更新设备
 */
const onButtonClick_Upd = () => {

    let deviceData = v_table_device.value!.get_select_data(true);
    if (deviceData == undefined) return;

    v_device_info.value!.show_dialog(deviceData);
}
/**
 * 点击移除设备
 */
const onButtonClick_Del = () => {
    v_table_device.value!.remove_data_proc_select("np_device_del", (data) => {
        return {
            "v_device_id": data["f_device_id"]
        }
    });
}

const onButtonClick_Update = async () => {

    let deviceData = v_table_device.value!.get_select_data(true);
    if (deviceData == undefined) return;

    v_device_version.value!.show_dialog(deviceData);
}

/**
 * 点击配置设备参数
 */
const onButtonClick_Config = async () => {
    let deviceData = v_table_device.value!.get_select_data(true);
    if (deviceData == undefined) return;

    // 读取配置参数
    let ret = await eocore.proc("np_config_get", {
        v_device_id: deviceData["f_device_id"]
    });
    let dataConfig = eocore.check_net_empty(ret);
    if (!eocore.check_id(dataConfig, "f_device_id")) {
        eocore.show_info("设备无配置信息");
        deviceData["f_config_data"] = "";        
    } else {
        deviceData["f_config_data"] = dataConfig["f_config_data"];
    }

    v_device_config.value!.show_dialog(deviceData);
}

/**
 * 向设备发送控制命令
 */
const onButtonClick_Control = async () => {

    let deviceData = v_table_device.value!.get_select_data(true);
    if (deviceData == undefined) return;

    v_device_control.value!.show_dialog(deviceData);
}


const onTableItem_device = (data: any) => {
    data["f_ctime_s"] = eolib.datetime_2_string(data["f_ctime"]);
    data["f_dtime_s"] = eolib.datetime_2_string(data["f_dtime"]);

    // 格式化数据
    TLogic.formatDeviceData(data);
}

const onTablePage_device = (n: number): number => {
    x_row_total.value = n;
    return n;
}

const onTableLoading_device = (show: boolean) => {
    x_show_loading.value = show;
}
const onTableRowClick_device = (data: any) => {
}
const onTableSortChage_device = (evt: any) => {

    // 排序
    console.log(evt.column, evt.prop, evt.order);

    let dn = evt.prop;

    let ds = "";
    if (evt.order == "descending") ds = " DESC";

    // 先移除以前的
    let i = 0;
    for (let d of m_orderby) {
        if (d.name == dn) break;
        ++i;
    }
    if (i < m_orderby.length) {
        m_orderby.splice(i, 1);
    }

    m_orderby.unshift({
        name: dn,
        order: ds
    })

    console.log(m_orderby);
    netLoad_device_query(-1);
}
/**
 * 点击分页
 * @param pageIndex 
 */
const onPageChange_device = (pageIndex: number) => {
    netLoad_device_query(pageIndex - 1);
}

/**
 * 关闭设备信息对话框
 * @param cancel 
 * @param data 
 * @param cb 
 * @returns 
 */
const onDialogClose_device = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
    if (cancel) {
        cb(true); return;
    }

    console.log(data);

    if (eocore.to_int(data["f_dept_id"]) <= TGlobal.topDeptId) {
        eocore.show_info("选择正确的部门");
        return;
    }

    let mn = eocore.to_string(data["f_mn"]);
    let pat = /^[a-zA-Z0-9_-]{2,64}$/;
    if (!pat.test(mn)) {
        eocore.show_error('mn输入不符合规范[2-64]');
        return;
    }
    // 统一转换成大写
    data["mn"] = mn.toUpperCase();

    console.log(data);
    let deviceId = data["f_device_id"];

    v_table_device.value!.update_data_proc("np_device_upd", {
        "v_device_id": deviceId,
        "v_dept_id": data["f_dept_id"],
        "v_mn": data["f_mn"],
        "v_name": data["f_name"],            
        "v_enable": data["f_enable"],
        "v_note": data["f_note"]
    }, -1, deviceId <= 0, true);

    cb(true);
}

/**
 * 关闭控制对话框
 * @param cancel 
 * @param data 
 * @param cb 
 */
const onDialogClose_control = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
    if (cancel) {
        cb(true); return;
    }

    cb(true);
}

const onDialogClose_config = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
    if (cancel) {
        cb(true); return;
    }

    cb(true);
}

const onDialogClose_version = async (cancel: boolean, data: any, cb: cfunc_boolean) => {

    if (cancel) {
        cb(true); return;
    }

    cb(true);
}

export const tsInit = () => {

    return {

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
}