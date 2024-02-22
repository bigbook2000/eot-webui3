
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


// 表单对话框字段
var x_form_types = ref<cform_options[]>([
    {type: "input", name: "label", span: 2, label: "名称"},
    {type: "dic", name: "type", span: 2, label: "类型", dic: "数据类型", all: false, field: "label"},  
    {type: "number", name: "order", span: 2, label: "顺序"},  
    {type: "switch", name: "visible", span: 2, label: "可见"},
    {type: "input", name: "dname", span: 2, label: "协议参数"},
    {type: "input", name: "kname", span: 2, label: "解析参数"},
    {type: "number", name: "precision", span: 2, label: "精度"},
    {type: "input", name: "unit", span: 2, label: "单位"},
    {type: "number", name: "width", span: 2, label: "宽度"},    
    {type: "input", name: "note", span: 100, label: "备注"},
]);

var x_show_loading = ref(false);

var x_query_dept_id_s = ref("");
var m_query_dept_id = 0;

/**
 * 处理vue onMounted事件
 */
const doVue_Mounted = () => {

    // 给部门赋值
    x_query_dept_id_s.value = TGlobal.userData["dept_id_s"];
    m_query_dept_id = TGlobal.userData["dept_id"];

    v_table_field.value!.init_table({
        on_item: (data) => {
            data["create_time_s"] = eolib.datetime_2_string(data["create_time"]);
        }
    })

    netLoad_data_field();
}

/**
 * 获取一个空的field对象
 */
const getEmpty_field = (): any => {

    return {
        "data_field_id": 0,
        "dept_id": 0,
        "type": "",
        "dname": "",
        "kname": "",
        "label": "",
        "precision": 0,
        "unit": "",
        "order": 0,
        "width": 100,
        "visible": 1,
        "note": ""
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
    fieldData["dept_id"] = m_query_dept_id;

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
            "v_data_field_id": data["data_field_id"]
        }
    });
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

    if (!eocore.check_id(data, "dept_id")) {
        eocore.show_error("请选择部门");
        return;
    }

    if (eocore.check_string(data, "label") <= 0) {
        eocore.show_error("请输入名称");
        return;
    }
    if (eocore.check_string(data, "type") <= 0) {
        eocore.show_error("请选择类型");
        return;
    }

    let fieldId = data["data_field_id"];

    v_table_field.value!.update_data_proc("np_datafield_upd", {
        "v_data_field_id": fieldId,
        "v_dept_id": data["dept_id"],
        "v_type": data["type"],
        "v_dname": data["dname"],
        "v_kname": data["kname"],
        "v_label": data["label"],
        "v_precision": data["precision"],
        "v_unit": data["unit"],
        "v_order": data["order"],
        "v_width": data["width"],
        "v_visible": data["visible"],
        "v_note": data["note"],
    }, -1, fieldId <= 0, true);

    cb(true);
}

const onInputChange_dept = (cancel: boolean, data: any, cb: cfunc_boolean) => {

    if (cancel) {
        cb(true);
        return;
    }

    // 给部门赋值
    x_query_dept_id_s.value = data["name"];
    m_query_dept_id = data["dept_id"];

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

        onTableLoading_field,
        onTableRowClick_field,
        onDialogClose_field,

        onInputChange_dept
    }
}