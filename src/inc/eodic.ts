import eocore from "./eocore"
import eolib from "./eolib"

import type { cdic_item } from "@/inc/eotypes";

/**
 * 字典全局性模块
 */
class eodic {

    version: number = 0;

    /** 字典map表 */
    dic_map: Map<string, cdic_item[]> = new Map<string, cdic_item[]>();


    /**
     * 将列表转换成字典
     * @param list 
     */
    list_2_dic(list: any[], valueField: string, labelField: string, showAll?: boolean) {

        let dics: cdic_item[] = [];

        if (showAll) {
            dics.push({
                value: -1,
                label: "-"
            })
        }
        for (let d of list) {
            dics.push({
                value: d[valueField],
                label: d[labelField]
            })
        }

        return dics;
    }

    /**
     * 手动增加一个字典
     * @param dicName 字典名称
     * @param list 字典列表
     * @param valueField 键值字段名
     * @param labelField 显示字段名
     */
    add_list(dicName: string, 
        list: Array<any>, 
        valueField: string, labelField: string) {

        let dicList = this.list_2_dic(list, valueField, labelField);
        this.dic_map.set(dicName, dicList);
    }

	/**
	 * 克隆一个新的的字典列表，带空值 -1 的字典列表
	 * @param {*} list 
	 */
    clone_list_all(list: Array<any>): Array<any> {

		let listNew = new Array();
		listNew.push({
            value: -1,
            key: "-"
        });
        for (let d of list) {
            listNew.push({
				value: d.value,
				key: d.key
			});
        }

		return listNew;
	}

	/**
	 * 克隆一个新的的字典列表
	 * @param {*} list 
	 */
    clone_list(list: Array<any>) {

		let listNew = new Array();
        for (let d of list) {
            listNew.push({
				value: d.value,
				key: d.key
			});
        }

		return listNew;
	}

    /**
     * 复制字典列表
     * @param dicName 
     * @param all 
     * @returns 
     */
    get_dic_list(dicName: string, all?: boolean): cdic_item[] {

        let dicList = this.dic_map.get(dicName);
        if (dicList == undefined) {
            console.log("******** ********", "dic not found", dicName);
            return [];
        }
        let listNew: cdic_item[] = [];

        if (all) {
            listNew.push({
                value: -1,
                label: "-"
            });
        }

        for (let d of dicList) {
            listNew.push({
				value: d.value,
				label: d.label
			});
        }

		return listNew;
    }


	/**
     * 返回字典名称
     * @param dicName 
     * @param value 
     * @returns 
     */
    get_dic_key(dicName: string, value: any): string {

		// let dicList = this.dicMap[dicName];
        // if (dicList == undefined) {
        //     console.log("******** ********", "getDicKey: dicName not found", dicName, value, this.dicMap);
        //     return "";
        // }

		// for (let f of dicList) {
		// 	if (f.value == value) {
		// 		return f.key;
		// 	};	
		// }

		return '-';
	} 

    /**
     * 返回字典值
     * @param dicName 
     * @param key 
     * @returns 
     */
    get_dic_value(dicName: string, key: string): any {

        // let dicList = this.dicMap[dicName];
        // if (dicList == undefined) {
        //     console.log("******** ********", "getDicKey: dicName not found", dicName, value, this.dicMap);
        //     return "";
        // }

        // for (let f of dicList) {
        //     if (f.key == key) {
        //         return f.value;
        //     };	
        // }

        return '-';
    }

    /**
     * 获取第一个字典
     * @param dicName 
     * @returns 
     */
    get_first(dicName: string): any {

        // let dicList = this.dicMap[dicName];
        // if (JInc.checkEmpty(dicList)) {

        //     console.log("******** ********", "getFirst: is empty", dicName, this.dicMap);
        //     return {
        //         value: -1,
        //         key: ""
        //     }
        // }

        //return dicList[0];
        return undefined;
    }

    
    /**
     * 获取字典默认第一个项
     * @param dicName 
     * @param key 
     * @returns 
     */
    get_dic_item(dicName: string, key: string): any {

        // let dicList = this.dicMap[dicName];
        // if (!JInc.checkEmpty(dicList)) {
            
        //     for (let d of dicList) {
        //         if (d.key == key) return d;
        //     }
        // }

        //console.log("******** ********", "getDicItem: not found", dicName, key, this.dicMap);

        return {
            value: -1,
            key: ""
        };
    }

    /**
     * 读取字典
     */
    async net_load_dic(dicVersion: any) {

        this.version = eocore.to_int(dicVersion);
        let ret = await eocore.json("/static/dic" + this.version + ".json");
        
        let list: any[] = ret["data"];
        let tree: any[] = [];

        // 列表转换成树状结构
        eolib.order_2_tree(list, tree, "dic_id", "dic_pid");

        // 将树变成map表
        this.dic_map.clear();

        for (let node of tree) {
            this.dic_map.set(node.label, node.children);
        };

        console.log(this.dic_map);
    }
}

export default new eodic();