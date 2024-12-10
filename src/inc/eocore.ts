import axios, { type AxiosInstance } from 'axios'

import { nextTick } from "vue"
import { useRouter } from 'vue-router';

import { ElMessage, ElMessageBox } from 'element-plus'

export default {

    /** 成功 */
    RESULT_SUCCESS: 0,
    /** 一般错误 */
    RESULT_ERROR: -1,
    /** 未执行 */
    RESULT_UNKNOWN: -10,
	/** 会话超时 */
    RESULT_SESSION: -50,
    /** 异常 */
    RESULT_EXCEPT: -100,
    /** 超时 */
    RESULT_TIMEOUT: -110,
    /** 无权限 */
    RESULT_PERMIT: -120,
    /** 本地 */
    RESULT_LOCAL: -1000,

    /** 调用基地址 */
    base_url: "",
    /** 超时设置 */
    timeout: 15000,
    /** 调用令牌 */
    token: "debug",

	/**
	 * 获取资源路径
	 * @param file 前面带 / 绝对路径 
	 * @returns 
	 */
	get_path(file: string): string {
		return new URL(".." + file, import.meta.url).href;
	},

	/**
	 * 判断数组是否为空
	 * @param {*} list 
	 * @returns 对象为null，非数组或者长度为0都返回true
	 */
	check_empty: function (list: any): boolean {
		return list == undefined || list.length == undefined || list.length <= 0;
	},


	/**
	 * 如果是空或者空字符串，返回空字符串
	 * 如果非空，trim之后返回
	 * @param str 
	 * @returns 
	 */
	to_string(str: any): string {
		if (str == undefined) return "";
		str = str.toString();
		return str.trim();
	},
	/**
	 * 检查并处理字符串长度
	 * @param data 
	 * @param key 
	 * @returns 返回字符串长度
	 */
	check_string(data: any, key: string): number {

		if (data == undefined) {
			console.log("******** ********", "check_string: data is undefined", data, key);
			return -1;
		}

		let str = data[key];
		if (str == undefined) {
			console.log("******** ********", "check_string: key not found", data, key);
			return -1;
		}

		str = str.toString().trim();
		return str.length;
	},

	/**
	 * 返回有效的整数
	 * @param val 
	 * @returns 
	 */
	to_int(val: any): number {

		if (val == undefined) return 0;

		let n = 0;
		try {
			n = parseInt(val.toString());
		} catch (ex) {
            console.log(ex);
		}
		if (isNaN(n) || !isFinite(n)) n = 0;
		
		return n;
	},	
	/**
	 * 如果不是ID，则返回false
	 * @param data 
	 * @param key 
	 * @returns 
	 */
	check_id(data: any, key: string): boolean {

		if (data == undefined) {
			console.log("******** ********", "check_id: data is undefined", data, key);
			return false;
		}

		let val = data[key];

		if (val == undefined) {
			console.log("******** ********", "check_id: key not found", data, key);
			return false;
		}

		let n = 0;
		try {
			n = parseInt(val.toString());
		} catch (ex) {
            console.log(ex);
			return false;
		}

		return (n > 0);
	},


	/**
	 * 返回有效的浮点数
	 * @param val 
	 * @returns 
	 */
	to_float(val: any): number {
		
		let f = 0;
		try {
			f = parseFloat(val);
		} catch (ex) {
            console.log(ex);
		}
		if (isNaN(f) || !isFinite(f)) f = 0;
		
		return f;
	},


	/**
	 * 判断是否是数字
	 * @param val 
	 * @returns 
	 */
	is_number(val: any): boolean {

		if (val == undefined) return false;
		let reg = /^(-?\d+)(\.\d+)?$/;
		return (reg.test(val.toString()));
	},	

	/**
	 * 参数是一个数组对象
	 * _d: 0,
	 * _s: "info",
	 * _k: "token",
	 * _t: 9999999,
	 * _list: [
	 *     {
	 *         prop1: value1,
	 *         prop2: value2,
	 *         prop3: value3
	 *     }
	 * ]
	 */

	/**
	 * 网络接口返回信息
	 * @param ret 返回对象 
	 * @param arraySize 最少参数数组长度
	 * @returns 
	 */
	get_info: function (ret: any, arraySize: number): string {
		
		let that = this;
		if (ret == undefined) {			
			return "[E]返回错误 undefined";
		}

		let data = ret.data;
		if (data == undefined || data._d == undefined || data._s == undefined) {
			console.log("******** ********", 'eocore.get_info, no await?', data);
			return "[E]返回错误,d,s";
		}

		if (data._d == this.RESULT_SESSION) {

			let router = useRouter();
			let rname = router.currentRoute.value.name;
			if (rname != "login") {
				ElMessage.error("[E]会话超时");
				window.location.href = '/';
				//router.push({name: 'vlogin'});
				return "";
			}			
		}

		if (data._d != 0) {
			
			if (data._s == undefined) {				
				return "[E]未知描述";
			} else {
				
				if (data._s.length <= 0) data._s = "[E]未知描述";
				return data._s;
			}
		}

		// 必须返回数组
		let array = data._list;
		if (array == undefined || array.length == undefined || array.length < arraySize) {			
			return "[E]数据错误,array";
		}
				
		// 更新新的Token
		if (data._k != undefined && data._k.length != undefined && data._k.length > 0) {
			that.token = data._k;
		}
		
		return "";
	},


	/**
	 * 获取返回数组，如果错误弹出提示，返回null
	 * @param res 
	 * @returns 
	 */
	check_net_array(res: any): Array<any>|undefined {
		
		let info = this.get_info(res, 0);
		if (info.length > 0) {
			
			// uni.showToast({
			// 	icon: 'none',
			// 	title: info,
			// 	duration: 5000
			// });
            ElMessage.error(info);
			return undefined;
		} 

		return res.data._list;
	},
	/**
	 * 获取返回对象，如果错误弹出提示，返回null
	 * @param res 
	 * @returns 
	 */
	check_net_object(res: any): any|undefined {
		
		let info = this.get_info(res, 1);		
		if (info.length > 0) {
			
			// uni.showToast({
			// 	icon: 'none',
			// 	title: info,
			// 	duration: 5000
			// });
            ElMessage.error(info);			
			return undefined;
		}

		return res.data._list[0];
	},
	/**
	 * 获取网络接口返回对象，如果错误弹出提示，返回null
	 * 如果未能返回对象，则创建一个新的对象，防止调用错误
	 * @param {*} res 
	 * @returns 
	 */
	check_net_empty(res: any): any {
		
		let info = this.get_info(res, 0);
		if (info.length > 0) {
			
			// uni.showToast({
			// 	icon: 'none',
			// 	title: info,
			// 	duration: 5000
			// });
            ElMessage.error(info);			
			return undefined;
		}

		let list = res.data._list;
		if (list == undefined || list.length == undefined || list.length <= 0) {

			// 返回一个非空对象
			return {
				_d: 0,
				_s: "",
				_k: "",
				_t: 0
			}
		}

		return list[0];
	},	

	create_axios: function (baseUrl: string, contentType?: string): AxiosInstance {

		let that = this;
		if (contentType == undefined) contentType = "application/json";

		return axios.create({
			baseURL: baseUrl,
			timeout: that.timeout,
			headers: {
				"Authorization": that.token,
				"Content-Type": contentType
			},
			validateStatus: function (status) {
				return status >= 200 && status < 300;
			}
		});
	},

	/**
	 * 同步 POST 接口
	 * @param url 
	 * @param params 
	 * @returns 
	 */
	async post(url: string, params: Array<any>): Promise<any> {

		let that = this;		
		var ret = { data: { d_: that.RESULT_UNKNOWN, s_: '未执行任何操作' } };

		try {

			let dt = new Date();
			let request = that.create_axios(that.base_url);

			let data = {
				_d: 0,
				_s: "",
				_k: that.token,
				_t: dt.getTime(),
				_list: params
			}

			await request({
				url: url,
				method: 'POST',
				data: data
			}).then (function(res) {
				ret = res;
			}, function(err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			}).catch(function (err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			});
			
		} catch (ex: any) {
			ret = { data: { d_: that.RESULT_LOCAL, s_: ex.toString() } };
		}

		console.log("**** post ****", url, params, ret);
		return ret;
	},


	/**
	 * 同步 GET 接口
	 * @param url 
	 * @param params 
	 * @returns 
	 */
	async get(url: string, params: Array<any>): Promise<any> {

		let that = this;
		var ret = { data: { d_: that.RESULT_UNKNOWN, s_: '未执行任何操作' } };

		try {

			let dt = new Date();
			let request = that.create_axios(that.base_url);

			let data = {
				_d: 0,
				_s: "",
				_k: that.token,
				_t: dt.getTime(),
				_list: params
			}

			await request({
				url: url,
				method: 'GET',
				data: data
			}).then (function(res) {
				ret = res;
			}, function(err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			}).catch(function (err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			});
			
		} catch (ex: any) {
			ret = { data: { d_: that.RESULT_LOCAL, s_: ex.toString() } };
		}

		console.log("**** get ****", url, params, ret);
		return ret;
	},



	/**
	 * 获取json文件
	 * @param url string
	 * @param baseUrl string 可选
	 * @returns 
	 */
	async json(url: string, baseUrl?: string): Promise<any> {

		let that = this;		
		var ret = {};

		try {

			let dt = new Date();

			if (baseUrl == undefined) baseUrl = that.base_url;
			let request = that.create_axios(baseUrl);

			await request({
				url: url + "?t=" + dt.getTime(),
				method: 'GET'
			}).then (function(res) {
				ret = res;
			}, function(err) {
				console.log(err);
				ret = {};
			}).catch(function (err) {
				console.log(err);
				ret = {};
			});
			
		} catch (ex: any) {
			console.log(ex);
			ret = {};
		}

		console.log("**** json ****", url, ret);
		return ret;
	},	


	/**
	 * 通过网络接口上传文件
	 * @param {*} url 
	 * @param {*} data 
	 * @returns 
	 */
	async file(url: string, data: any): Promise<any> {
		
		let that = this;		
		var ret = { data: { d_: that.RESULT_UNKNOWN, s_: '未执行任何操作' } };

		try {
			
			let request = that.create_axios(that.base_url, "multipart/form-data");
			//"Content-Type": "application/x-www-form-urlencoded"

			await request({
				url: url,
				method: 'POST',
				data: data
			}).then (function(res) {
				ret = res;
			}, function(err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			}).catch(function (err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			});
			
		} catch (ex: any) {
			ret = { data: { d_: that.RESULT_LOCAL, s_: ex.toString() } };
		}

		console.log("**** file ****", url, data, ret);
		return ret;
	},


	/**
	 * 直接调用数据接口
	 * @param name 数据接口名称 
	 * @param params 数据接口参数
	 * @returns 
	 */
	async proc2(name: string, params: any): Promise<any> {

		let that = this;		
		var ret = { data: { d_: that.RESULT_UNKNOWN, s_: '未执行任何操作' } };

		try {

			let dt = new Date();
			let request = that.create_axios(that.base_url);

			let data = {
				_d: 0,
				_s: "",
				_k: that.token,
				_t: dt.getTime(),
				_list: [{
					name: name,
					pms: params
				}]
			}

			await request({
				url: "/api/common/proc",
				method: 'POST',
				data: data
			}).then (function(res) {
				ret = res;
			}, function(err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			}).catch(function (err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			});
			
		} catch (ex: any) {
			ret = { data: { d_: that.RESULT_LOCAL, s_: ex.toString() } };
		}

		console.log("**** proc ****", name, params, ret);
		return ret;
	},


	/**
	 * 直接调用数据接口
	 * @param name 数据接口名称 
	 * @param params 数据接口参数
	 * @returns 
	 */
	async proc(name: string, params: any): Promise<any> {

		let that = this;		
		var ret = { data: { d_: that.RESULT_UNKNOWN, s_: '未执行任何操作' } };

		try {

			let dt = new Date();
			let request = that.create_axios(that.base_url);

			let data = {
				_d: 0,
				_s: "",
				_k: that.token,
				_t: dt.getTime(),
				_list: [{
					name: name,
					pms: params
				}]
			}

			await request({
				url: "/api/common/query",
				method: 'POST',
				data: data
			}).then (function(res) {
				ret = res;
			}, function(err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			}).catch(function (err) {
				ret = { data: { d_: that.RESULT_LOCAL, s_: err.toString() } };
			});
			
		} catch (ex: any) {
			ret = { data: { d_: that.RESULT_LOCAL, s_: ex.toString() } };
		}

		console.log("**** proc ****", name, params, ret);
		return ret;
	},

    /**
     * 刷新直到显示
     * @param target 
     * @param count 
     */
	async wait_tick(target: any, count?: number) {

        if (count == undefined) count = 256;
		let i;
		for (i=0; i<count; i++) {
			await nextTick();
			if (target != undefined) break;
		}
	},

    /**
     * 异步对话框改为同步
     * 请添加 await
     * @param msg 提示信息
     * @returns 异步对象
     */
    show_confirm(msg: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            ElMessageBox.confirm(msg, "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning',
            }).then(() => {
                resolve(true);
            }).catch(() => {
                reject(false);
            })
        })
    },

    show_success(msg: string) {
        ElMessage.success(msg);
    },
    show_info(msg: string) {
        ElMessage.info(msg);
    },
    show_error(msg: string) {
        ElMessage.error(msg);
    },	
}