<template>
    <el-table ref="v_table" :data="x_list" class="eo_fill"
        stripe border fit highlight-current-row
        @row-click="onTableRowClick">
        <slot></slot>
    </el-table>
</template>

<script setup lang="ts">

    import { ref, reactive, computed } from "vue"

    import type { cfunc_confirm, ctable_func_item, ctable_func_page } from "@/inc/eotypes"
    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import { ElTable } from 'element-plus'
    const v_table = ref<InstanceType<typeof ElTable>>();
    
    // withDefaults
    const props = withDefaults(defineProps<{
        name: string,
        idField: string,
        /** 格式化 */
        onItem?: ctable_func_item,
        /** 分页 */
        onPage?: ctable_func_page;
    }>(), {
        name: "列表",
        idField: "",
        onItem: undefined,
        onPage: undefined,
    })

    // const propIdField = computed(() => props.idField)

    const emits = defineEmits<{
        (e: "row-click", data: any): void
        (e: "loading", show: boolean): void
    }>()    

    /** 总数 */
    var m_total = 0;
    var x_list = ref(new Array<any>());
    var m_select_data: any = {};

    const get_list = (): any[] => {
        return x_list.value;
    }

    const get_select_data = (confirm?: boolean): any => {

        if (confirm) {
            if (m_select_data == undefined) {
                eocore.show_info("请先选择" + props.name + "项");
            }
        }
        return m_select_data;
    }

    const get_index = (dataId: number): number => {
        return eolib.get_index(x_list.value, props.idField, dataId);
    }

    const clear = () => {
        x_list.value = [];

        if (props.onPage != undefined) {
            m_total = props.onPage(0);
        }
    }

    const load_list = (list: Array<any>): Array<any> => {

        if (props.onItem != undefined) {
            for (let d of list) {
                d = props.onItem(d);
            }
        }

        if (list.length > 0) {
            let d = list[0];
            if (d["page_row_index"] < 0) {
                let n = eocore.to_int(d["total_count"]);

                if (props.onPage != undefined) {
                    m_total = props.onPage(n);
                }
            }
        }

        x_list.value = list;

        // 清除选择
        m_select_data = null;

        return list;
    }

    const load_list_net = async (url: string, params: any): Promise<any[]> => {

        emits("loading", true);

        let ret = await eocore.post(url, [params]);
        let list = eocore.check_net_array(ret);
        if (list == undefined) list = new Array<any>();

        emits("loading", false);

        return load_list(list);
    }


    /**
     * 调用数据接口
     * @param call 
     * @param params 
     */
    const load_list_proc = async (name: string, params: any): Promise<any[]> => {

        emits("loading", true);

        let ret = await eocore.proc(name, params);
        let list = eocore.check_net_array(ret);
        if (list == undefined) list = new Array<any>();

        emits("loading", false);

        return load_list(list);
    }


    /**
     * 变更一行表格数据
     * @param data data
     * @param index index
     * @param insert insert
     * @param showMsg showMsg
     */
    const update_data = (
        data: any, 
        index: number, 
        insert: boolean, 
        showMsg: boolean) => {

        if (data == undefined) {
            console.log("**** ****", "vtable::update_data: undefined");
            return;
        }

        data["_index"] = index;
        data["_insert"] = insert;

        if (props.onItem != undefined) {
            props.onItem(data);
        }

        if (insert) {

            // 如有指定索引，从索引处增加
            //console.log(index);
            if (index < 0)
                x_list.value.unshift(data);
            else
                x_list.value.splice(index, 0, data);

            if (showMsg) {
                eocore.show_success(props.name + "增加成功");
            }

        } else {

            let dataId = data[props.idField];
            if (dataId == undefined) {
                console.log("**** ****", "vtable::update_data: no id_field = ", props.idField);
                return;
            }

            if (index < 0) {
                index = eolib.get_index(x_list.value, props.idField, dataId);
                //console.log(x_list.value, dataId, index);
                if (index != -1) {
                    x_list.value[index] = Object.assign({}, x_list.value[index], data);
                } else {
                    x_list.value.unshift(data);
                }
            }

            if (showMsg) {
                eocore.show_success(props.name + "修改成功");
            }
        }

        m_select_data = data;
        v_table.value!.setCurrentRow(data);
        //console.log("------------", this);
    }

    /**
    * 调用一个网络接口，5个参数
    * @param {*} url 
    * @param {*} params 
    * @param {*} insert 是否插入
    * @param {*} msg 弹出提示 
    * @param {*} index 插入或更新索引，-1不指定
    * @returns 
    */
    const update_data_net = async (
        url: string, 
        params: any, 
        index: number, 
        insert: boolean, 
        showMsg: boolean): Promise<any> => {

        emits("loading", true);

        let ret = await eocore.post(url, [params]);
        let data = eocore.check_net_object(ret);

        emits("loading", false);

        if (data == undefined) return data;

        //console.log("------", data);

        update_data(data, index, insert, showMsg);

        return data;
    }

    /**
     * 调用数据接口更新
     * @param name 
     * @param params 
     * @param index 
     * @param insert 
     * @param showMsg 
     */
    const update_data_proc = async (
        name: string,
        params: any, 
        index: number, 
        insert: boolean, 
        showMsg: boolean): Promise<any> => {

        emits("loading", true);

        let ret = await eocore.proc(name, params);
        let data = eocore.check_net_object(ret);

        emits("loading", false);

        if (data == undefined) return data;

        //console.log("------", data);

        update_data(data, index, insert, showMsg);

        return data;
    }


    /**
     * 移除一行数据
     * @param {*} data
     * @param {String} idName id对应字段名
     */
    const remove_data = (data: any, idField: string) => {

        if (idField.trim() == "") {
            idField = props.idField;
        }

        let dataId = data[idField];
        //console.log(x_list.value, idField, data)
        let index = eolib.get_index(x_list.value, idField, dataId);
        if (index == -1) {
            console.log("**** ****", "vtable::remove_data: not data = " + idField);
            return;
        }
        
        if (data[props.idField] == m_select_data[props.idField]) {
            m_select_data = undefined;
        }

        x_list.value.splice(index, 1);
    }

    /**
     * 通过网络接口移除表格数据
     * @param {*} url
     * @param {*} idValue
     */
    const remove_data_net = async (url: string, params: any) => {

        emits("loading", true);
        
        let ret = await eocore.post(url, [params]);
        let data = eocore.check_net_object(ret);

        emits("loading", false);
        
        if (data == undefined) return;

        remove_data(data, "");
    }


    /**
     * 通过数据接口移除表格数据
     * @param {*} name
     * @param {*} idValue
     */
     const remove_data_proc = async (name: string, params: any) => {

        emits("loading", true);

        let ret = await eocore.proc(name, params);
        let data = eocore.check_net_object(ret);

        emits("loading", false);

        if (data == undefined) return;

        remove_data(data, "");
    }

    /**
     * 请添加 await
     * 网络接口移除当前选择数据
     * @param {*} url
     * @param {*} callbackConfirm 回调接口用来确认选择的数据是否可以移除，async 返回移除参数
     */
    const remove_data_net_select = async (url: string, callbackConfirm: cfunc_confirm) => {

        let data = m_select_data;
        if (data == undefined) {
            eocore.show_info("请先选择" + props.name + "删除项")
            return;
        }

        let dret = await eocore.show_confirm("此操作将删除该项, 是否继续?");
        if (dret) {
            
            // 回调获取参数
            let params = await callbackConfirm(data);
            remove_data_net(url, params);
        }
    }


    /**
     * 请添加 await
     * 数据接口移除当前选择数据
     * @param {*} name
     * @param {*} callbackConfirm 回调接口用来确认选择的数据是否可以移除，async 返回移除参数
     */
     const remove_data_proc_select = async (name: string, callbackConfirm: cfunc_confirm) => {

        let data = m_select_data;
        if (data == undefined) {
            eocore.show_info("请先选择" + props.name + "删除项")
            return;
        }

        let dret = await eocore.show_confirm("此操作将删除该项, 是否继续?");
        if (dret) {
            
            // 回调获取参数
            let params = await callbackConfirm(data);
            remove_data_proc(name, params);
        }
    }

    /**
     * 获取勾选列表
     */
    const get_check_list = (): any[] => {
        return v_table.value!.getSelectionRows();
    }

    /**
     * 全选或全清
     * @param check 
     */
    const set_check_all = (check: boolean) => {

        v_table.value!.clearSelection();
        if (check) v_table.value!.toggleAllSelection();
    }

    /**
     * 设置勾选列表
     * @param list 
     */
    const set_check_list = (list: any[]) => {

        v_table.value!.clearSelection();
        for (let d1 of x_list.value) {
            for (let d2 of list) {
                if (d1[props.idField] == d2[props.idField]) {
                    v_table.value!.toggleRowSelection(d2, true);
                    break;
                }
            }
        }
    }
    /**
     * 通过逗号分割的ID字符串勾选
     * @param idString 
     */
    const set_check_string = (idString: string) => {

        let list = idString.split(",");

        let ids;
        v_table.value!.clearSelection();
        for (let d1 of list) {
            for (let d2 of x_list.value) {
                ids = ("" + d2[props.idField]);
                if (ids == d1) {
                    v_table.value!.toggleRowSelection(d2, true);
                    break;
                }
            }
        }
    }

    const onTableRowClick = (row: any, column: any, event: any) => {
        m_select_data = row;
        emits("row-click", m_select_data);
    }

    defineExpose({
        get_list,
        get_select_data,
        clear,
        load_list,        
        load_list_net,
        load_list_proc,
        update_data,
        update_data_net,
        update_data_proc,
        remove_data,
        remove_data_net,
        remove_data_proc,
        remove_data_net_select,
        remove_data_proc_select,
        get_check_list,
        set_check_all,
        set_check_list,
        set_check_string
    })

</script>

<style lang="scss">
</style>