
import { ref, onMounted } from "vue"
import type { cform_options, cfunc_boolean } from "@/inc/eotypes";

import eocore from "@/inc/eocore"
import eolib from "@/inc/eolib";

import TGlobal from "@/logic/TGlobal";

import vtable from "@/logic/common/vtable.vue"
import vformd from "@/logic/common/vformd.vue"

import dept_input from "@/views/platform/dept_input.vue"

type t_table = InstanceType<typeof vtable>;
const v_table_field = ref<t_table>();

type t_formd = InstanceType<typeof vformd>;
const v_formd_field = ref<t_formd>();


// 每个用户使用的设备不同，对应不同的字段信息

// 表单对话框字段
var x_form_types = ref<cform_options[]>([
    {type: "input", name: "f_label", span: 2, label: "名称"},
    {type: "dic", name: "f_type", span: 2, label: "类型", dic: "数据类型", all: false, field: "label"},  
    {type: "number", name: "f_order", span: 2, label: "顺序"},  
    {type: "switch", name: "f_visible", span: 2, label: "可见"},
    {type: "input", name: "f_dname", span: 2, label: "协议参数"},
    {type: "input", name: "f_kname", span: 2, label: "解析参数"},
    {type: "number", name: "f_precision", span: 2, label: "精度"},
    {type: "input", name: "f_unit", span: 2, label: "单位"},
    {type: "number", name: "f_width", span: 2, label: "宽度"},    
    {type: "input", name: "f_note", span: 100, label: "备注"},
]);

var x_show_loading = ref(false);

var x_query_dept_id_s = ref("");
var m_query_dept_id = 0;

/**
 * 处理vue onMounted事件
 */
const doVue_Mounted = () => {

    // 给部门赋值
    x_query_dept_id_s.value = TGlobal.userData["f_dept_id_s"];
    m_query_dept_id = TGlobal.userData["f_dept_id"];

    netLoad_data_field();
}

/**
 * 获取一个空的field对象
 */
const getEmpty_field = (): any => {

    return {
        "f_data_field_id": 0,
        "f_dept_id": 0,
        "f_type": "",
        "f_dname": "",
        "f_kname": "",
        "f_label": "",
        "f_precision": 0,
        "f_unit": "",
        "f_order": 0,
        "f_width": 100,
        "f_visible": 1,
        "f_note": ""
    }
}

/**
 * 加载数据字段参数清单
 */
const netLoad_data_field = () => {

    v_table_field.value!.load_list_proc("np_datafield_list", {
        "v_dept_id": m_query_dept_id,
        "v_type": ''
    });
}

const onButtonClick_Load = () => {
    netLoad_data_field();
}

/**
 * 点击添加设备按钮
 */
const onButtonClick_Add = async () => {

    if (m_query_dept_id <= 0) {
        eocore.show_info("请选择部门");
        return;
    }

    let fieldData = getEmpty_field();
    fieldData["f_dept_id"] = m_query_dept_id;

    //console.log(fieldData);
    v_formd_field.value!.show_dialog(fieldData);
}
/**
 * 点击更新设备
 */
const onButtonClick_Upd = () => {

    let fieldData = v_table_field.value!.get_select_data(true);
    if (fieldData == undefined) return;

    //console.log(fieldData);
    v_formd_field.value!.show_dialog(fieldData);
}
/**
 * 点击移除设备
 */
const onButtonClick_Del = () => {
    v_table_field.value!.remove_data_proc_select("np_datafield_del", (data) => {
        return {
            "v_data_field_id": data["f_data_field_id"]
        }
    });
}

const onTableItem_field = (data: any) => {
    data["f_ctime_s"] = eolib.datetime_2_string(data["f_ctime"]);
}
const onTableLoading_field = (show: boolean) => {
    x_show_loading.value = show;
}
const onTableRowClick_field = (data: any) => {
}

const onDialogClose_field = async (cancel: boolean, data: any, cb: cfunc_boolean) => {
    if (cancel) {
        cb(true); return;
    }

    //console.log(data);

    if (!eocore.check_id(data, "f_dept_id")) {
        eocore.show_error("请选择部门");
        return;
    }

    if (eocore.check_string(data, "f_label") <= 0) {
        eocore.show_error("请输入名称");
        return;
    }
    if (eocore.check_string(data, "f_type") <= 0) {
        eocore.show_error("请选择类型");
        return;
    }

    let fieldId = data["f_data_field_id"];

    v_table_field.value!.update_data_proc("np_datafield_upd", {
        "v_data_field_id": fieldId,
        "v_dept_id": data["f_dept_id"],
        "v_type": data["f_type"],
        "v_dname": data["f_dname"],
        "v_kname": data["f_kname"],
        "v_label": data["f_label"],
        "v_precision": data["f_precision"],
        "v_unit": data["f_unit"],
        "v_order": data["f_order"],
        "v_width": data["f_width"],
        "v_visible": data["f_visible"],
        "v_note": data["f_note"],
    }, -1, fieldId <= 0, true);

    cb(true);
}

const onInputChange_dept = (cancel: boolean, data: any, cb: cfunc_boolean) => {

    if (cancel) {
        cb(true);
        return;
    }

    // 给部门赋值
    x_query_dept_id_s.value = data["f_name"];
    m_query_dept_id = data["f_dept_id"];

    //console.log(data);

    cb(true);
}


export const tsInit = () => {

    return {

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
}