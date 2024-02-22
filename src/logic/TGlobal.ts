class TGlobal {

    /** 全局性标识 */
    appId: number = 0;
    appData: any = {};

    userData: any = {
        user_id: 0,        
        name: "未登录"
    };

    settingList: any = {};

    menuList: any[] = [];
    permitString: string = "";

    /** 顶级部门 */
    topDeptId: number = 1;
}


export default new TGlobal();