import eocore from "./eocore";

export default {

	/**
	 * 用s1, s2切分字符串，用于路径分析
	 * @param str 
	 * @param s1 
	 * @param s2 
	 * @returns 
	 */
	string_part_last(str: string, s1: string, s2: string): string[] {

		var ss: string[] = ["", "", ""];

		let pos1 = str.lastIndexOf(s1);
		let pos2 = str.lastIndexOf(s2);

		if (pos1 > pos2) pos2 = -1;
		if (pos1 != -1) {
			ss[0] = str.substring(0, pos1);
			ss[1] = str.substring(pos1 + 1);
		}

		if (pos2 != -1) {
			let s: string = ss[1];
			ss[1] = s.substring(0, pos2);
			ss[2] = s.substring(pos2 + 1);
		}

		return ss;
	},

    /**
     * 根据指定的对象字段值，返回数组索引
     * @param list list
     * @param field field
     * @param value value
     * @returns 索引，-1未找到
     */
    get_index(list: any[], field: string, value: any): number {
    
        let index = 0;
		for (let d of list) {
			if (d[field] == value) break;
			index++;
		}
		if (index >= list.length) index = -1;

		return index;
    },

    /**
     * 获取指定项
     * @param list 
     * @param field 
     * @param value 
     * @returns 
     */
    get_item(list: any[], field: string, value: any): any {
    
		for (let d of list) {
			if (d[field] == value) return d;
		}

		return undefined;
    },    


	/**
     * 格式化日期
     * @param dt 
     * @param format 
     * @returns 
     */
	datetime_format(dt: any, format: string): string {

		if (!(dt instanceof Date)) {
			
			let dts = dt.toString().replace("T", " ");
			dt = new Date(dts);
		}

		let sdy = dt.getFullYear().toString();	
			
		let sdm = dt.getMonth() + 1;
		sdm = '00' + sdm;
		sdm = sdm.substr(sdm.length - 2, 2);
		
		let sdd = dt.getDate();
		sdd = '00' + sdd;
		sdd = sdd.substr(sdd.length - 2, 2);

		let sth = dt.getHours();
		sth = '00' + sth;
		sth = sth.substr(sth.length - 2, 2);
		
		let stm = dt.getMinutes();
		stm = '00' + stm;
		stm = stm.substr(stm.length - 2, 2);
		
		let sts = dt.getSeconds();
		sts = '00' + sts;
		sts = sts.substr(sts.length - 2, 2);

		return format.replace('yyyy', sdy)
			.replace('yy', sdy.substring(2))
			.replace('MM', sdm)
			.replace('dd', sdd)
			.replace('HH', sth)
			.replace('mm', stm)
			.replace('ss', sts);
	},
	 
	/**
     * 格式化标准日期时间 yyyy-MM-dd HH:mm:ss
     * @param dt 
     * @param blank 则将1970-01-01转换成空字符串
     * @returns 
     */
	datetime_2_string(dt: any, blank?: boolean): string {

		if (dt == undefined) return "";
		
        let d: number;
		if (dt instanceof Date) {

			let sdy = dt.getFullYear();	

			d = dt.getMonth() + 1;
			let sdm = "00" + d;
			sdm = sdm.substring(sdm.length - 2);
			
			d = dt.getDate();
			let sdd = "00" + d;
			sdd = sdd.substring(sdd.length - 2);

			d = dt.getHours();
			let sth = "00" + d;
			sth = sth.substring(sth.length - 2);
			
			d = dt.getMinutes();
			let stm = "00" + d;
			stm = stm.substring(stm.length - 2);
			
			d = dt.getSeconds();
			let sts = "00" + d;
			sts = sts.substring(sts.length - 2);

			if (blank) {
				if (dt.getFullYear() == 1970 && dt.getMonth() == 0 && dt.getDate() == 1) return "";
			}

			return sdy + "-" + sdm + "-" + sdd + " " +
				sth + ":" + stm + ":" + sts;
			
		} else if (typeof dt === "string" || dt instanceof String) {

            if (dt.length > 19) dt = dt.substring(0, 19);
			dt = dt.replace("T", " ");

			if (blank) {
				if (dt.substring(0, 10) == "1970-01-01") return "";
			}
	
			return dt;
		}
		else {
			return "";
		}
	},
	
    /**
     * 格式化日期
     * @param dt 
     * @param blank 如果true，则将1970-01-01转换成空字符串
     * @returns 
     */
	date_2_string(dt: any, blank?: boolean) {

		if (dt == undefined) return "";

		let dts = "";
        let d: number;

		if (dt instanceof Date) {

			let sdy = dt.getFullYear();	
			
			d = dt.getMonth() + 1;
			let sdm = "00" + d;
			sdm = sdm.substring(sdm.length - 2);
			
			d = dt.getDate();
			let sdd = "00" + d;
			sdd = sdd.substring(sdd.length - 2);
			
			dts = sdy + "-" + sdm + "-" + sdd;
	
		} else if (typeof dt === "string" || dt instanceof String) {
			dts = dt.substring(0, 10);
		} else {
			return "";
		}

		if (blank) {
			if (dts == "1970-01-01") return "";
		}

		return dts;
	},
	 
	/**
     * 短日期时间 MM/dd HH:mm
     * @param dt 
     * @param blank 
     * @returns 
     */
	datetime_2_short(dt: any, blank?: boolean) {

		if (dt == undefined) return "";

        let d: number;
		if (dt instanceof Date) {
		
			d = dt.getMonth() + 1;
			let sdm = "00" + d;
			sdm = sdm.substring(sdm.length - 2);
			
			d = dt.getDate();
			let sdd = "00" + d;
			sdd = sdd.substring(sdd.length - 2);

			d = dt.getHours();
			let sth = "00" + d;
			sth = sth.substring(sth.length - 2);
			
			d = dt.getMinutes();
			let stm = "00" + d;
			stm = stm.substring(stm.length - 2);

			if (blank) {
				if (dt.getFullYear() == 1970 && dt.getMonth() == 0 && dt.getDate() == 1) return "";
			}

			return sdm + '/' + sdd + ' ' + sth + ':' + stm;

		} else if (typeof dt === "string" || dt instanceof String) {

			dt = dt.replace(/\-/g, "/");
			dt = dt.replace("T", " ");

			if (blank) {
				//console.log(dt.substring(0, 10))
				if (dt.substring(0, 10) == "1970/01/01") return "";
			}
	
			return dt.substring(5, 16);
		} else {
			return "";
		}
	},

	/**
	 * 格式化一个查询起始日期
	 * @param dts 
	 * @returns 
	 */
	date_start(dts: any) {
		
		if (dts == undefined) return "1970-01-01 00:00:00";

		let dt: Date;
		if (dts instanceof Date) {
			dt = dts;
		} else {
			dt = new Date(Date.parse(dts));
		}

		dt.setHours(0);
		dt.setMinutes(0);
		dt.setSeconds(0);
		dt.setMilliseconds(0);

		return this.datetime_2_string(dt);
	},
	/**
	 * 格式化一个截至日期，天数+1
	 * @param dts 
	 * @returns 
	 */
	date_end(dts: any) {

		if (dts == undefined) return "2050-01-01 00:00:00";

		let dt: Date;
		if (dts instanceof Date) {
			dt = dts;
		} else {
			dt = new Date(Date.parse(dts));
		}
		dt.setDate(dt.getDate() + 1);

		dt.setHours(0);
		dt.setMinutes(0);
		dt.setSeconds(0);
		dt.setMilliseconds(0);

		return this.datetime_2_string(dt);
	},

	/**
     * 查找树状结构中指定的id
     * @param list 
     * @param did 
     * @param dname 
     * @returns 
     */
    find_tree_node(list: any[], did: any, dname: string): any|undefined {

		let node = undefined;
        for (let d of list) {

            if (d[dname] == did) return d;

            node = this.find_tree_node(d.children, did, dname);
            if (node != undefined) return node;
        }

        return node;
    },
	/**
     * 有序数组转换成树状结构
     * @param list 
     * @param tree 
     * @param dname 
     * @param dpname 
     */
    order_2_tree(list: any[], tree: any[], dname: string, dpname: string) {

        for (let d of list) {

            d.children = [];
            let pnode = this.find_tree_node(tree, d[dpname], dname);
            if (pnode == undefined) {

				d.parent = undefined;
                tree.push(d);
				
            } else {

				d.parent = pnode;
                pnode.children.push(d);
            }
			
			//console.log('**** list2Tree ****', tree);
        }
    },

	/**
     * 无序数组转换成树状结构
     * @param list 
     * @param tree 
     * @param dname 
     * @param dpname 
     */
    list_2_tree(list: any[], tree: any[], dname: string, dpname: string) {

        let pnode: any|undefined;
        for (let d of list) {

            d.children = [];

            pnode = undefined;
            for (let dp of list) {

                if (d[dpname] == dp[dname]) {
                    pnode = dp;
                    break;
                }
            }

            if (pnode == undefined) {

				d.parent = undefined;
                tree.push(d);

            } else {

				d.parent = pnode;
                pnode.children.push(d);
            }
			
			//console.log('**** list2Tree ****', tree);
        }
    },


	/**
     * 展开树，深度优先
     * @param tree 
     * @returns 
     */
	tree_2_list_DFS(tree: any[]) {
            
		let stack: any[] = [];
		let result: any[] = [];

		let root = {
			children: tree
		}
		stack.push(root);

		while (stack.length > 0) {

			//console.log(stack, top);
			let top = stack.pop();
			result.push(top);

			let list = top.children;
            
			if (!eocore.check_empty(list)) {

				for (let d of list) {
					stack.push(d);
				}
			}
		}

		if (!eocore.check_empty(result)) result.splice(0, 1);
		//console.log(result);
		return result;		
	},


	/**
     * 新窗口打开文件
     * @param fileUrl 
     */
	download_file(fileUrl: string) {

		let elm: HTMLAnchorElement = document.getElementById("_EO_DOWNLOAD_DOM") as HTMLAnchorElement;
		if (elm == undefined) elm = document.createElement("a");
  
		elm.id = "_EO_DOWNLOAD_DOM";
		elm.href = fileUrl;
		elm.target = "_blank";
  
		document.body.appendChild(elm);
		elm.click();
		document.body.removeChild(elm);
		// window.URL.revokeObjectURL(b)
	},

}