<template>
    <div class="eo_form eo_w100">
        <div v-for="form in types" :key="form.name" 
            :class="'cell eo_w' + form.span">
            <div class="label_w" :style="{width:labelWidth}">{{form.label}}</div>
            <!-- blank 空占位 -->
            <div v-if="form.type=='blank'" class="input">
                &nbsp;
            </div>
            <div v-if="form.type=='input'" class="input">
                <el-input v-model="data[form.name]" style="width:100%"
                    maxlength="128"></el-input>
            </div>
            <div v-if="form.type=='label'" class="input">
                <el-input v-model="data[form.name]" style="width:100%" readonly></el-input>
            </div>
            <div v-if="form.type=='password'" class="input">
                <el-input v-model="data[form.name]" style="width:100%" show-password></el-input>
            </div>
            <!-- select 显示字符串，点击弹出 -->
            <div v-if="form.type=='select'" class="input">
                <el-input v-model="data[form.name + '_s']" style="width:100%" 
                    readonly @focus="onClick_Select(form.name)"></el-input>
            </div>
            <!-- list 显示字符串，输入数字 -->
            <div v-if="form.type=='list'" class="input">
                <el-select v-model="data[form.name]" placeholder="请选择" style="width:100%" >
                    <el-option
                        v-for="item in form.list"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <!-- list_s 显示字符串，输入也是字符串 -->
            <div v-if="form.type=='list_s'" class="input">
                <el-select v-model="data[form.name]" placeholder="请选择" style="width:100%" >
                    <el-option
                        v-for="item in form.list"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
            </div>
            <!-- input_s -->
            <!--
            <div v-if="form.type=='input_s'" class="input">
                <el-autocomplete style="width:100%"
                    v-model="data[form.name]"
                    :fetch-suggestions="((queryString, cb)=>{onSelect_Input(form.name, queryString, cb)})"
                    placeholder="请输入内容"
                    :trigger-on-focus="true">
                </el-autocomplete>
            </div>
            -->
            <!-- number -->
            <div v-if="form.type=='number'" class="input">
                <el-input-number style="width:100%"
                    v-model="data[form.name]" 
                    :precision="form.precision" 
                    :step="form.step"
                    :min="form.min" 
                    :max="form.max">
                </el-input-number>
            </div>
            <!-- dic -->
            <div v-if="form.type=='dic'" class="input">
                <vdic :dic="form.dic" :all="form.all" :field="form.field"
                    v-model="data[form.name]" style="width:100%" />
            </div>
            <div v-if="form.type=='date'" class="input">
                <el-date-picker style="width:100%"
                    v-model="data[form.name]"
                    type="date" format="YYYY-MM-DD"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
            <div v-if="form.type=='datetime'" class="input">
                <el-date-picker style="width:100%"
                    v-model="data[form.name]"
                    type="datetime" format="YYYY-MM-DD HH:mm:ss"
                    placeholder="选择日期时间">
                </el-date-picker>
            </div>
            <div v-if="form.type=='switch'" class="input">
                <el-switch v-model="data[form.name]" 
                    :active-value="1" :inactive-value="0"></el-switch>
            </div>
            <!-- 固定高度多行输入框，高度 4 -->
            <div v-if="form.type=='textarea'" class="input">
                <el-input style="width:100%"
                    v-model="data[form.name]" type="textarea" resize="none"
                    :row="4" :autosize="{minRows: 4, maxRows: 4}"></el-input>
            </div>
            <!-- 变高度多行输入框，高度 row -->
            <div v-if="form.type=='textarea2'" class="input">
                <el-input style="width:100%"
                    v-model="data[form.name]" type="textarea" resize="none"
                    :row="form.row" :autosize="{minRows: form.row, maxRows: form.row}"></el-input>
            </div>
            <!-- select 显示行政区域，如果绑定，分三个参数，分别以123结尾，点击弹出 -->
            <!--
            <div v-if="form.type=='region'" class="input">
                <el-select v-model="data[form.name+'1']" placeholder="请选择" style="width:30%" 
                    @change="((val)=>{onSelectChange_Province(form.name, val)})">
                    <el-option
                        v-for="item in x_province_list"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
                <el-select v-model="data[form.name+'2']" placeholder="请选择" style="width:30%"
                    @change="((val)=>{onSelectChange_City(form.name, val)})">
                    <el-option
                        v-for="item in x_city_list"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
                <el-select v-model="data[form.name+'3']" placeholder="请选择" style="width:40%" >
                    <el-option
                        v-for="item in x_region_list"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
            </div>
            
            <div v-if="form.type=='file'" class="input">
                <tfile v-model="data[form.name]" :p_type="data[form.keytype]" :p_name="data[form.keyname]"></tfile> 
            </div>
            -->
        </div>
    </div>    
</template>

<script setup lang="ts">

    import { ref } from "vue"

    import type {cdic_item, cform_options} from "@/inc/eotypes";
    import eocore from "@/inc/eocore";

    import vdic from "@/logic/common/vdic.vue"

    const props = withDefaults(defineProps<{
        types: cform_options[],
        labelWidth?: string,
        data: any
    }>(), {
        labelWidth: "60px"
    })

    const emits = defineEmits<{
        (e: 'change', id: number): void
        (e: 'update', value: string): void
    }>()

    // const get_types = (formName: string): any => {

    //     if (props.types == undefined) return undefined;
    //     for (let form of props.types) {
    //         if (form.name == formName) return form;
    //     }
    //     return undefined;
    // };

    const update_list = (formName: string, list: cdic_item[]) => {

        if (props.types == undefined) return;

        for (let form of props.types) {
            if (form.name == formName) {

                if (form.type == "list" || form.type == "list_s") {
                    form.list = list;
                } else {
                    console.log("**** **** Form type not match: " + form.type);
                }

                break;
            }
        }
    }
    
    const onClick_Select = (formName: string) => {
        //this.$emit('on_select', formName, this.x_form_data, this.x_form_types);
    }

    // const onSelect_Input = (formName: string, queryString: string, cb: Function) => {

    //     let checkList = false;
    //     let form = getForm(formName);
    //     if (form != undefined) {

    //         if (!eocore.check_empty(form.list)) {
    //             console.log(form.list);
    //             cb(form.list);
    //             checkList = true;
    //         }
    //     }

    //     // if (!checkList)
    //     //     $emit('on_input', formName, queryString, cb);
    // }

    defineExpose({
        update_list
    })    

</script>

<style lang="scss">
</style>