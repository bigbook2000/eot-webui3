<script setup lang="ts">
    import { onMounted } from 'vue'

    import eocore from '@/inc/eocore';
    import eodic from '@/inc/eodic';

    import TGlobal from '@/logic/TGlobal'
    //import { useRouter } from 'vue-router';
    import router from "@/router/index";

    const getMainArgs = (argName: string): number => {

        try {

            let query = window.location.search.substring(1);
            let vars = query.split("&");

            for (let i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if (pair[0] == argName) {
                    return parseInt(pair[1]); 
                }
            }

        } catch (ex: any) {
            console.log(ex);
        }

        return 0;
    }

    const netLoad_setting_list = async () => {

        let ret = await eocore.post('/api/common/setting/list', [{}]);

        let array = eocore.check_net_array(ret);
        if (array == undefined) array = [];
            
        for (let d of array) {
            TGlobal.settingList[d["key"]] = d["value"];
        }

        console.log(TGlobal.settingList);
    }

    const netLoad_menu_list = async () => {

        let ret = await eocore.post("/api/menu/list", [{}]);

        let array = eocore.check_net_array(ret);
        if (array == undefined) array = new Array();
            
        TGlobal.menuList = array;
    }

    const loadDic = async (dicVersion: any) => {
        await eocore.json("/static/dic" + dicVersion + ".json");
    }

    onMounted(async () => {

        TGlobal.appId = getMainArgs("deptid");
        console.log("EOT物联网大数据平台", TGlobal.appId);

        let ret = await eocore.json("/rc/app/app" + TGlobal.appId + ".json", "");
        Object.assign(TGlobal.appData, TGlobal.appData, ret.data);

        console.log(TGlobal.appData);
        window.document.title = TGlobal.appData["main_title"];

        eocore.base_url = "http://111.14.43.12:56901";

        await netLoad_setting_list();
        await netLoad_menu_list();

        await eodic.net_load_dic(TGlobal.settingList["dic_version"]);

        //let router = useRouter();
        router.replace({ name:'login' });
    })

</script>

<template>
    <div>正在加载..</div>
</template>

<style>
</style>