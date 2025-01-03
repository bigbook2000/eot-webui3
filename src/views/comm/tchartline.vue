<script setup lang="ts">

    import { ref, reactive, onMounted } from "vue"

    import eocore from '@/inc/eocore';
    import TGlobal from '@/logic/TGlobal'

    import * as echarts from 'echarts';
    type EChartsOption = echarts.EChartsOption;

    var v_chart_id = ref("v_chart_" + (Math.random() * 1000000).toFixed(0));
    var m_chart: any; 

    onMounted(() => {

        var chartDom = document.getElementById(v_chart_id.value)!;
        m_chart = echarts.init(chartDom);
    })

    const update_data = (list: any[], subItem: string, xName: string, yNames: string[]) => {

        //console.log(list, subItem, xName, yNames);

        let xData: any[] = [];
        let series: any[] = [];

        let yData: number[];
        for (let ys of yNames) {

            yData = [];
            series.push({
                dbfield: ys,
                data: yData,
                type: "line",
                smooth: false,
                symbol: 'none',
                // lineStyle: {
                //     color: '#00ffff'
                // },
            })
        }

        let d0;
        for (let d of list) {
            xData.push(d[xName]);

            d0 = d;
            if (subItem.length > 0) d0 = d[subItem];

            for (let s of series) {                
                s.data.push(d0[s["dbfield"]]);
            }
        }

        //console.log(xData, series);

        let option: EChartsOption = {
            grid: {
                containLabel: true,
                left: 40,
                top: 20, 
                bottom: 20,
                right: 40
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'cross',
                animation: false,
                label: {
                    backgroundColor: '#505765'
                }
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: series
        };

        m_chart.setOption(option);
    }

    defineExpose({
        update_data
    })    

</script>

<template>
    <div :ref="v_chart_id" :id="v_chart_id" style="width:100%;height:100%;"></div>
</template>

<style>
</style>