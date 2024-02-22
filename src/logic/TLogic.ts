import TGlobal from "@/logic/TGlobal"

export default {
	
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

			data.dataList = JSON.parse(data["data"]);
			//console.log(data);
			
		} catch (ex) {
			console.log(ex);
		}
	}
}