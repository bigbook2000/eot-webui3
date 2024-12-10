
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
	 * @param data 
	 */
	formatDeviceData(data: any) {

		data.dataList = {};

		try {

			let ds = data["f_data"];
			if (ds == undefined) return;

			if (typeof(ds) == "string") {
				data.dataList = JSON.parse(ds);
				//console.log(data);
			}
			
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

	async getVersionList(typeId: number): Promise<any[]> {

        let ret;
        let list1, list2;

        ret = await eocore.proc("np_dversion_list", {
            v_type_id: typeId
        });
        list1 = eocore.check_net_array(ret);
        if (list1 == undefined) {
            return [];
        }

        let keyids = "";
        for (let d1 of list1) {
            keyids += "," + d1["f_version_id"];
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
                    if (d1["f_version_id"] == d2["f_keyid"]) {
						d2["f_note_s"] = d2["f_note"];
						d2["f_note"] = d1["f_note"];
                        Object.assign(d1, d1, d2);
                    }
                }
            }
        }

		return list1;
	},
}