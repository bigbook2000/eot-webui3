<template>
    <!-- 文件上传 -->
    <div class="sv_file" v-loading="x_show_loading">
        <div class="border">
            <div class="remove" @click="onButtonClick_Remove" v-if="!readOnly">
                <el-icon size="14" color="#666">
                    <Delete />
                </el-icon>
            </div>
            <div class="download">
                <a :href="x_file_url" target="_blank">{{ x_file_name }}</a>
            </div>
            <div v-if="!readOnly">
                <el-upload
                    ref="v_upload"
                    name="file"
                    :action="x_action_url"
                    :headers="x_file_headers"
                    :accept="x_file_types"
                    :data="x_post_data"
                    :show-file-list="false"
                    :on-remove="onFileRemove"
                    :on-success="onFileSuccess"
                    :on-error="onFileError"
                    :on-change="onFileChange"
                    :on-progress="onFileProgress"
                    :before-upload="onBeforeUpload"
                    :before-remove="onBeforeRemove"
                    :limit="0"
                    :file-list="x_file_list"
                    :auto-upload="true">
                    <div class="upload" slot="trigger">
                        <el-icon size="14" color="#c01020">
                            <Edit />
                        </el-icon>
                    </div>
                </el-upload>
            </div>
        </div>
  </div>
</template>

<script setup lang="ts">

    import { ref, watch } from "vue"

    import { ElUpload } from 'element-plus'
    import type { UploadRawFile, UploadFile, UploadFiles, UploadProgressEvent } from 'element-plus'

    import eocore from "@/inc/eocore";
    import eolib from "@/inc/eolib";

    import TLogic from "@/logic/TLogic";

    import type { cfile_func_name } from "@/inc/eotypes";

    /**
     * modelValue 绑定四个参数，使用|分割 
     * file_id|type|keyid|index
     * 
     * type 每个具体的应用模块对应不同的文件类别
     * 设备版本文件对应的类别为 FILE_EOTAPP_BIN，在TLogic定义
     * keyid 关联每个设备版本的 version_id
     * index 附加，如果每个keyid可以对应多文件，index即为文件索引
     * 
     * withDefaults 绑定对象或数组需要使用函数初始化 modelValue: () => { return {} }
     * 
     */
    const props = withDefaults(defineProps<{
        modelValue: string,
        readOnly?: boolean,
        onFileName?: cfile_func_name
    }>(), {
        modelValue: ":::",
        readOnly: false,
        onFileName: undefined
    })

    const emits = defineEmits<{
        (e: 'update:modelValue', value: string): void
        (e: "complete", value: string): string
    }>()
    
    var x_action_url = ref(eocore.base_url + "/api/common/file/upload");

    /**
     * 文件上传HTTP Head，请不要添加 Content-Type
     */
    var x_file_headers = ref({
        "Authorization": eocore.token,
        //"Content-Type": "application/x-www-form-urlencoded"
        //"Content-Type": "multipart/form-data"        
    });
    var x_file_types = ref("*");
    var x_post_data = ref({        
        "f_type": "",
        "f_keyid": 0,
        "f_index": 0,
        "f_name": ""
    });

    var x_show_loading = ref(false);
    
    var x_file_url = ref("#");
    var x_file_name = ref("");
    var x_file_list = ref<any[]>([]);

    var m_file_data = {
        "f_file_id": 0,
        "f_type": "",
        "f_keyid": 0,
        "f_index": 0,
    }

    const v_upload = ref<InstanceType<typeof ElUpload>>();


    /**
     * 远程读取文件信息
     * 请放在watch之前
     * Cannot access 'get_file' before initialization
     */
     const get_file = async () => {

        if (m_file_data["f_type"].length <= 0) return;
        if (m_file_data["f_file_id"] > 0) return;

        let ret = await eocore.post("/api/common/file/get", [{
            ["f_type"]: m_file_data["f_type"],
            ["f_keyid"]: m_file_data["f_keyid"],
            ["f_index"]: m_file_data["f_index"],
        }]);
        let list = eocore.check_net_array(ret);
        if (list == undefined) return;
        if (list.length <= 0) return;

        let data = list[0];

        m_file_data["f_file_id"] = data["f_file_id"];
        x_file_name.value = data["f_name"];
        x_file_url.value = TLogic.getStaticFileUrl(data["f_sign"], data["f_ext"]);

        let valueStr = data["f_file_id"] + "|" + data["f_type"] + "|" + data["f_keyid"] + "|" + data["f_index"];
        emits("update:modelValue", valueStr);
    }

    watch(() => props.modelValue, (newVal, oldVal) => {
        
        console.log(newVal, oldVal) 
        let ss: string[] = newVal.split("|");
        if (ss.length != 4) {
            console.log("file data error");
            return;
        }

        m_file_data = {
            "f_file_id": parseInt(ss[0]),
            "f_type": ss[1],
            "f_keyid": parseInt(ss[2]),
            "f_index": parseInt(ss[3]),
        }

        get_file();

    }, {
        immediate: true,
        deep: false
    });


    /**
     * 清除文件
     */
    const clearFile = () => {

        v_upload.value!.clearFiles();
        x_file_list.value = [];
    }

    const onFileRemove = (file: UploadFile, fileList: UploadFiles) => {

    }
    const onFileSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
        console.log(response);

        let data = eocore.check_net_object({
            data: response
        });
        if (data == null) return;

        x_file_url.value = TLogic.getStaticFileUrl(data["f_sign"], data["f_ext"]);
        x_file_name.value = data["f_name"];
        
        x_show_loading.value = false;
        //console.log(this.x_file_list);

        let valueStr = data["f_file_id"] + "|" + data["f_type"] + "|" + data["f_keyid"] + "|" + data["f_index"];
        console.log(valueStr);

        emits("update:modelValue", valueStr);
        emits("complete", valueStr);
    }
    const onFileError = (err: Error, file: UploadFile, fileList: UploadFiles) => {
        //console.log(err);
        x_show_loading.value = false;
    }
    const onFileChange = (file: UploadFile, fileList: UploadFiles) => {
        //console.log(file);
    }
    const onFileProgress = (event: UploadProgressEvent, file: UploadFile, fileList: UploadFiles) => {
    }
    const onBeforeUpload = (rawFile: UploadRawFile): any => {

        //console.log(file);

        x_show_loading.value = true;

        let fi: string[] = eolib.string_part_last(rawFile.name, "/", ".");
        let fn = "";
        if (props.onFileName != undefined)
            fn = props.onFileName(rawFile.name);
        else
            fn = fi[1];

        x_post_data.value = {
            "f_type": m_file_data["f_type"],
            "f_keyid": m_file_data["f_keyid"],
            "f_index": m_file_data["f_index"],
            "f_name": fn
        };
    }
    const onBeforeRemove = (file: UploadFile, fileList: UploadFiles): any => {
        //console.log(file);
    }

    /**
     * 点击移除
     */
    const onButtonClick_Remove = () => {
        clearFile();
    }

</script>

<style lang="scss">
</style>