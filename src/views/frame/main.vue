<template>
    <div class="eo_page">
        <div class="eo_col">
            <!-- 顶部 begin -->
            <div class="eo_col_d" style="height:60px;">
                <div class="div_top">
                    <div class="item">
                        <div class="logo">
                            <img class="eo_fill" src="../../assets/images/logo.png" />
                        </div>
                    </div>
                    <div class="item">
                        <div class="title">
                            <span>{{ x_main_title }}</span>
                        </div>
                    </div>
                    <div class="pad">
                    </div>
                    <div class="item">
                        <div class="info">
                            <span>{{ x_user_name }}</span>
                        </div>
                    </div>
                    <div class="item">
                        <div class="logout" @click="onViewClick_logout">
                            <span>注销</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 顶部 end -->
            <div class="eo_col_f">
                <div class="eo_row">
                    <!-- 导航 begin -->
                    <div class="eo_row_d" :class="'div_menu_panel_'+x_menu_collapse">
                        <div class="eo_col">
                            <div class="eo_col_f eo_scroll_v">
                                <el-menu style="height:100%;"
                                    :collapse-transition="false"
                                    :collapse="x_menu_collapse"
                                    unique-opened
                                    :default-active="x_current_menu"
                                    @select="onMenuSelect_Main">
                                    <el-sub-menu v-for="item in x_menu_list" 
                                        :index="item.index" :key="item.index">
                                        <template #title>
                                            <img :src="item.icon_path" class="img_icon" />
                                            <span>{{item.title}}</span>
                                        </template>
                                        <el-menu-item v-for="itemSub in item.children"
                                            :index="itemSub.index" :key="itemSub.index">
                                            {{itemSub.title}}</el-menu-item>
                                    </el-sub-menu>
                                </el-menu>
                            </div>
                            <div class="eo_col_d div_menu_status"
                                @click="onViewClick_MenuStatus">
                                <div :class="'div_menu_status_'+x_menu_collapse"></div>
                            </div>
                        </div>
                    </div>
                    <!-- 导航 end -->
                    <div class="eo_row_f">
                        <div class="eo_col">
                            <div class="eo_col_d">
                                <el-tabs type="card" closable
                                    v-model="x_tab_name"
                                    @tab-remove="onTabRemove_Page"
                                    @tab-click="onTabClick_Page">
                                    <el-tab-pane
                                        v-for="item in x_tab_list"
                                        :key="item.path"
                                        :label="item.title"
                                        :name="item.path">
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                            <div class="eo_col_f">
                                <router-view v-slot="{ Component }">
                                    <!-- 需要在组件中定义名称，而不是路由中的名称 -->
                                    <keep-alive :include="x_keep_alive_list">
                                        <component :is="Component" />
                                    </keep-alive>
                                </router-view>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

    import { ref, nextTick } from "vue"
    import { onMounted } from 'vue'
    import router from "@/router/index"

    import eocore from "@/inc/eocore"
    import TGlobal from "@/logic/TGlobal"
    import TLogic from "@/logic/TLogic"

    import type { TabPaneName, TabsPaneContext } from "element-plus"

    var x_main_title = ref("");
    var x_user_name = ref("");

    var x_menu_width = ref("200px");
    var x_menu_collapse = ref(false);
    var m_current_index = ref("");
    var x_current_menu = ref("m1");
    var x_menu_list = ref(new Array<any>());

    var x_tab_list = ref<any[]>([]);
    var x_tab_name = ref("");

    /** 缓存列表 */
    var x_keep_alive_list = ref<string[]>([]);

    onMounted(() => {       
        
        x_main_title.value = TGlobal.appData["main_title"];
        x_user_name.value = TGlobal.userData["name"];

        x_menu_list.value = loadMenuList();
        //console.log(x_menu_list.value);

        // 默认选择 home
        for (let d1 of x_menu_list.value) {
            for (let d2 of d1.children) {
                if (d2.path == "home") {                
                    x_current_menu.value = d2.index;
                    break;
                }
            }
        }
        onMenuSelect_Main(x_current_menu.value, {}, {});
    });

    const addTabPage = (item: any) => {
        
        let exists = false;
        for (let d of x_tab_list.value) {
            if (d.path == item.path) {
                exists = true;
                break;
            }
        }

        //console.log(d2);
        if (!exists) {
            x_tab_list.value.push({
                path: item.path,
                title: item.title
            });

            // 追加到缓存中
            // 需要在组件中定义名称，而不是路由中的名称
            // 和x_tab_list保持一致
            x_keep_alive_list.value.push(item.path);
        }

        router.replace({name: item.path});
        nextTick(() => {
            x_tab_name.value = item.path;
            //x_tab_name.value = x_tab_list.value.length - 1;
            //console.log(x_tab_name.value)
        });
    }

    const onMenuSelect_Main = (index: any, path: any, item: any) =>{
        //console.log(index, path, item);

        for (let d1 of x_menu_list.value) {
            for (let d2 of d1.children) {
                if (d2.index == index) {
                    addTabPage(d2);
                    break;
                }
            }
        }
    }

    const onViewClick_MenuStatus = () => {
        x_menu_collapse.value = !x_menu_collapse.value;
    }

    const loadMenuList = (): Array<any> => {

        var menuList = new Array<any>();
        let menuListAll = new Array<any>();

        let lastMenu = undefined;
        for (let d of TGlobal.menuList) {

            if (d["type"] != "menu") continue;

            if (!TLogic.checkPermit(d["permit"])) continue;

            let menuPid = d['menu_pid'];
            if (menuPid == 1) {

                menuListAll.push({
                    index: 'm' + d['menu_id'],
                    title: d['name'],
                    icon: d['icon'],
                    icon_path: eocore.get_path("/assets/icon/" + d['icon'] + ".png"),
                    path: d['path'],
                    children: new Array<any>()
                });

            } else {

                if (lastMenu == undefined || lastMenu.index != menuPid) {

                    lastMenu = undefined;
                    for (let d2 of menuListAll) {

                        if (d2.index == 'm' + menuPid) {
                            lastMenu = d2;
                            break;
                        }
                    }
                }

                if (lastMenu == undefined) {
                    console.log('未找到菜单' + d['name']);
                    continue;
                }

                lastMenu.children.push({
                    index: 'm' + d['menu_id'],
                    title: d['name'],
                    icon: d['icon'],
                    icon_path: eocore.get_path("/assets/icon/" + d['icon'] + ".png"),
                    path: d['path'],
                    children: new Array<any>()
                });
            }
        }

        for (let d of menuListAll) {
            if (eocore.check_empty(d.children)) continue;
            menuList.push(d);
        }

        //console.log(TGlobal.menuList, menuList, menuListAll);
        return menuList;
    }

    const onViewClick_logout = async () => {
        let ret: any = await eocore.post("/api/user/logout", [{}])
        eocore.check_net_object(ret);

        window.location.href = "/";
    }

    const onTabRemove_Page = (name: TabPaneName) => {
        //console.log(name);

        if (name == "home") {
            // 永远保留home,避免清空
            return;
        }

        let i = 0;
        for (let d of x_tab_list.value) {
            if (d.path == name) {
                break;
            }
            i++;
        }

        if (i >= x_tab_list.value.length) return;

        x_tab_list.value.splice(i, 1);
        // 从清单中移除
        // 和x_tab_list保持一致
        x_keep_alive_list.value.splice(i, 1);

        //console.log(i, x_tab_list.value, x_tab_list.value[i]);
        if (x_tab_name.value == name) {
            x_tab_name.value = x_tab_list.value[i - 1].path;

            // 切换路由
            router.replace({name: x_tab_name.value});
        }
    }

    const onTabClick_Page = (pane: TabsPaneContext, event: Event) => {
        //console.log(pane.paneName, pane.index);

        for (let d of TGlobal.menuList) {            
            if (pane.paneName == d.path) {
                router.replace({name: d.path});
                //x_tab_name.value = d.path;
                break;
            }
        }
    }

</script>
<style scoped lang="scss">
.div_top {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: var(--eo_color_grey_dark);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    padding: 0px 20px;

    .item {
        padding: 10px 10px;
        box-sizing: border-box;

        .logo {
            width: 40px;
            height: 40px;
        }
        .title {
            padding: 5px 0px;
            font-size: 20px;
            color: var(--eo_color_light3);
        }        
        .info {
            padding: 10px 0px;
            font-size: 14px;
            color: #fff;
        }
        .logout {
            padding: 10px 0px;
            width: 40px;
            font-size: 14px;
            color: #ccc;
            cursor: pointer;
        }
    }
    .pad {
        flex: 1 1 auto;
        width: 0;
        height: 100%;
    }
}

.img_icon {
    margin: 0px 10px 0px 0px;
    width: 20px;
    height: 20px;
}

.div_menu_panel_true {
    width: 64px;
    background-color: var(--el-menu-bg-color);
}
.div_menu_panel_false {
    width: 180px;
    background-color: var(--el-menu-bg-color);
}

.div_menu_status {
    width: 100%;
    height: 40px;
    padding: 5px 15px;
    background-color: var(--el-menu-bg-color);
    box-sizing: border-box;
    overflow: hidden;    
}


%div_menu_status_image {    
    width: 28px;
    height: 28px;
    background-size: 28px 28px;
    background-image: url('../../assets/icon/arrow_left.png');
    transform-origin: center;
    transition: transform 0.3s;
}

.div_menu_status_true {
    @extend %div_menu_status_image;
    transform: rotate(180deg);
}
.div_menu_status_false {
    @extend %div_menu_status_image;
    transform: rotate(0deg);
}


</style>