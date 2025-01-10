
import eocore from "@/inc/eocore";

import TGlobal from "@/logic/TGlobal"

/**
 * 应用公共模块
 */
export default {

	// 文件类型

	FILE_EOTAPP_BIN: "file_eotapp_bin",
	
	/**
	 * 检查菜单权限
	 * @param {*} permit 
	 */
	checkPermit(permit: string): boolean {

		if (permit == "") return true;		
		return (TGlobal.permitString.indexOf("," + permit + ",") >= 0);
	},

	/**
	 * 处理设备数据
	 * data["f_data"] 为json字符串
	 * fd["f_data"]和fd["f_chart"] 分别为表格和图表系数转换
	 * @param data 
	 */
	formatDeviceData(fieldList: any[], data: any) {

		data.dataList = {};
		data.chartList = {};

		try {

			let ds = data["f_data"];
			if (ds == undefined) return;

			// f_data为json字符串
			if (typeof(ds) != "string") return;
				
			let dlist = JSON.parse(ds);				
			//console.log(dlist);

			for (let fd of fieldList) {
				let dn = fd["f_dname"];
				let dp = fd["f_precision"];
				let sdd = fd["f_data"];
				let sdc = fd["f_chart"];

				let d = dlist[dn];
				if (d != undefined) {

					let dv1 = parseFloat(d.toString());
					let dv2 = dv1;

					if (sdd.length > 0) {
						sdd = sdd.replace(/\X/g, dv1);
						dv1 = eval(sdd);
					}
					if (sdc.length > 0) {
						sdc = sdc.replace(/\X/g, dv2);
						dv2 = eval(sdd);
					}

					data.dataList[dn] = dv1.toFixed(dp);
					data.chartList[dn] = dv2.toFixed(dp);
				}					
			}

			console.log(data);
			
		} catch (ex) {
			console.log(ex);
		}
	},

	/**
	 * 服务器文件路径
	 * @param fileSign 
	 * @param fileExt 
	 */
	getStaticFileUrl(fileSign: string, fileExt: string): string {

		let fs = "/" + fileSign.substring(0, 1) + "/" + fileSign + fileExt;
        return eocore.base_url + "/" + TGlobal.fileStatic + fs;
	},

	async getVersionFiles(typeId: number): Promise<any[]> {

        let ret;
        let list1, list2;

        ret = await eocore.proc("np_dversion_list", {
            v_dtype_id: typeId
        });
        list1 = eocore.check_net_array(ret);
        if (list1 == undefined) {
            return [];
        }

        let keyids = "";
        for (let d1 of list1) {
            keyids += "," + d1["f_dversion_id"];
        }
        if (keyids.length > 0) keyids = keyids.substring(1);

        ret = await eocore.post("/api/common/file/list", [{
            "f_type": this.FILE_EOTAPP_BIN,
            "f_keyids": keyids
        }]);
        list2 = eocore.check_net_array(ret);

        if (list2 != undefined) {
            for (let d1 of list1) {				
                for (let d2 of list2) {
                    if (d1["f_dversion_id"] == d2["f_keyid"]) {
						d2["f_note_s"] = d2["f_note"];
						d2["f_note"] = d1["f_note"];
                        Object.assign(d1, d1, d2);
                    }
                }
            }
        }

		return list1;
	},

	/**
	 * 获取指定版本id列表对应的名称
	 * @param list 包含dversion_id的对象的数组
	 * @returns 
	 */
	async getVersionNames(list: any[]): Promise<void> {

		let ids = "";
		for (let d1 of list) {

			d1["f_dtype"] = "";
			d1["f_dversion"] = "";

			if (d1["f_dversion_id"] > 0) ids += d1["f_dversion_id"] + ",";
		}

		if (ids.length <= 0) return;

		ids = ids.substring(0, ids.length - 1);
		// 获取版本信息
		let ret = await eocore.proc("np_dversion_list", {        
			"v_dversion_ids" : ids 
		});
		let listVersion = eocore.check_net_array(ret);
		if (listVersion != null) {

			for (let d1 of list) {
				for (let d2 of listVersion) {

					//console.log(d1, d2);
					if (d1["f_dversion_id"] == d2["f_dversion_id"]) {
						d1["f_dtype"] = d2["f_dtype"];
						d1["f_dversion"] = d2["f_dversion"];
						break;
					}
				}
			}
		}
	},

	/**
	 * 处理配置数据，转换成json
	 * @param data 
	 */
	configDataEncode(data: string): string {
		data = data.replace(/[\r\n]/g, "");

		let key, val;
		let obj: any = {};
		let ss = data.split(";");
		for (let s of ss) {

			let ts = s.split("=");
			if (ts.length >= 2) {

				key = ts[0].trim();
				val = ts[1].trim();
				obj[key] = val;
			}
		}
		return JSON.stringify(obj);
	},
	/**
	 * JSON转换成212格式
	 * @param data 
	 * @returns 
	 */
	configDataDecode(data: string): string {

		let str = "";
		try {
		
			let obj: any = JSON.parse(data);
			for (let key in obj) {
				str += key + "=" + obj[key] + ";\r\n";
			}
		} catch (ex) {
			console.log(ex);
		}
		
		return str;
	},

	/**
	 * 
	 * @param d 由于开关值统一为浮点数，避免浮点数问题+0.1
	 * @returns 
	 */
	getDeviceSwitchString(d: any): string {

		let dv = parseInt(d);
		let ss = ["关",  "开"];
		return ss[dv % ss.length];
	}
}