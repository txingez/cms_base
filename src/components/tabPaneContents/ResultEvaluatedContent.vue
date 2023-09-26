<script setup>
import Chart from 'chart.js/auto'
import {computed, watch} from "vue";
import {RatingClassification} from "../../constants/ratingClassification";
import {ENUM} from "../../constants/enum";

const props = defineProps({
    formId: String,
    dataSource: Array,
    totalPoint: String,
    rate: String
})

const config = computed(() => {
    switch (props.formId) {
        case ENUM.FORM_ID.ESG:
            return {
                columns: [
                    {
                        title: '',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: 'Tổng điểm trên thang điểm 100',
                        dataIndex: 'point',
                        key: 'point',
                        align: 'right'
                    },
                    {
                        title: 'Phân bố tỷ trọng theo ngành',
                        dataIndex: 'distribution',
                        key: 'distribution',
                        align: 'right'
                    }
                ],
                dataSource: props.dataSource,
                summaryPoint: props.totalPoint,
                rateInfo: props.rate,
                showConclude: true,
                summaryTableConfig: {title: 2, value: 1}
            }
        case ENUM.FORM_ID.NEC:
            return {
                columns: [
                    {
                        title: '',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: 'Điểm tối đa',
                        dataIndex: 'max',
                        key: 'max',
                        align: 'right'
                    },
                    {
                        title: 'Điểm trên thang điểm 100',
                        dataIndex: 'point',
                        key: 'point',
                        align: 'right'
                    },
                    {
                        title: 'Điểm tự đánh giá',
                        dataIndex: 'sum',
                        key: 'sum',
                        align: 'right'
                    }
                ],
                dataSource: props.dataSource,
                summaryPoint: props.totalPoint,
                rateInfo: props.rate,
                showConclude: false,
                summaryTableConfig: {title: 3, value: 1}
            }
    }
})

watch(props, (p) => {
    const configChart = (() => {
        switch (p.formId) {
            case ENUM.FORM_ID.ESG:
                return {
                    chartLabels: ['E-Môi trường', 'S-Xã hội', 'G-Quản trị'],
                    chartData: props.dataSource.map(d => d.point),
                    chartTitle: 'ĐÁNH GIÁ THỰC HÀNH ESG'
                }
            case ENUM.FORM_ID.NEC:
                return {
                    chartLabels: ['Nhóm tiêu chí 1', 'Nhóm tiêu chí 2', 'Nhóm tiêu chí 3'],
                    chartData: props.dataSource.map(d => d.sum),
                    chartTitle: 'ĐÁNH GIÁ MỨC ĐỘ ÁP DỤNG NGUYÊN TẮC KINH TẾ TUẦN HOÀN CỦA DOANH NGHIỆP TẠI VIỆT NAM'
                }
        }
    })()
    const ctx = document.getElementById('chart')
    new Chart(ctx, {
            type: 'radar',
            data: {
                labels: configChart.chartLabels,
                datasets: [
                    {
                        label: 'Điểm đánh giá',
                        data: configChart.chartData,
                        fill: true,
                        borderColor: 'rgb(160, 210, 109)',
                        backgroundColor: 'rgba(160, 210, 109, 0.1)',
                        pointBackgroundColor: '#A0D26D',
                        pointBorderColor: '#FFF',
                        pointHoverBackgroundColor: '#FFF',
                        pointHoverBorderColor: 'rgb(160, 210, 109)',
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: configChart.chartTitle
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: false
                        },
                        suggestedMin: 0,
                        suggestedMax: 45,
                        ticks: {
                            stepSize: 5
                        },
                        alignToPixels: true,
                        grid: {
                            circular: true
                        }
                    }
                }
            }
        }
    )
})

</script>

<template>
    <div>
        <a-table :bordered="true" :columns="config.columns" :data-source="config.dataSource" :pagination="false">
            <template #headerCell="{title, column}" class="bg-green-400">
                <div class="text-center md:text-xl text-sm">{{ title }}</div>
            </template>
            <template #bodyCell="{column, text}">
                <template v-if="column.key === 'name'">
                    <div class="font-bold md:text-xl text-sm">{{ text }}</div>
                </template>
                <template v-else-if="column.key === 'distribution'">
                    <div class="md:text-xl text-sm">{{ `${text.toString().replace('.', ',')}%` }}</div>
                </template>
                <template v-else>
                    <div class="md:text-xl text-sm">{{ text.toString().replace('.', ',') }}</div>
                </template>
            </template>
            <template #summary>
                <a-table-summary-row class="bg-[#FAFAFA]">
                    <a-table-summary-cell :col-span="config.summaryTableConfig.title"
                                          class="font-bold md:text-xl text-sm">
                        Tổng điểm
                    </a-table-summary-cell>
                    <a-table-summary-cell :col-span="config.summaryTableConfig.value"
                                          class="text-right font-bold md:text-xl text-sm">
                        {{ config.summaryPoint.toString().replace('.', ',') }}
                    </a-table-summary-cell>
                </a-table-summary-row>
                <a-table-summary-row class="bg-[#FAFAFA]">
                    <a-table-summary-cell :col-span="config.summaryTableConfig.title"
                                          class="font-bold md:text-xl text-sm">
                        Xếp hạng
                    </a-table-summary-cell>
                    <a-table-summary-cell :col-span="config.summaryTableConfig.value"
                                          class="text-right font-bold md:text-xl text-sm">
                        {{ config.rateInfo }}
                    </a-table-summary-cell>
                </a-table-summary-row>
                <a-table-summary-row v-if="config.showConclude" class="bg-[#FAFAFA]">
                    <a-table-summary-cell :col-span="2" class="font-bold md:text-xl text-sm">
                        Doanh nghiệp có tiềm năng đạt tiêu chuẩn nhận
                        hỗ trợ của CP Doanh nghiệp đủ điều kiện tiếp cận các hỗ trợ chính sách theo Quyết định số
                        167/QĐ-TTg ngày 8/2/2022 về Chương trình hỗ trợ doanh nghiệp khu vực tư nhân kinh doanh bền vững
                        giai đoạn 2022 -2025 hay không?
                    </a-table-summary-cell>
                    <a-table-summary-cell class="text-right font-bold md:text-xl text-sm">
                        {{ config.summaryPoint < 50 ? 'Không đạt' : 'Đạt' }}
                    </a-table-summary-cell>
                </a-table-summary-row>
            </template>
        </a-table>

        <div class="flex xl:flex-row flex-col-reverse justify-between items-center">
            <div class="flex gap-5 flex-col py-5 xl:basis-1/2">
                <div class="font-bold text-xl">Đề xuất cho doanh nghiệp</div>
                <div v-html="RatingClassification[formId][config.rateInfo].suggest"/>
            </div>
            <div class="xl:basis-1/2 xl:w-1/2 xl:h-1/2 md:w-2/3 md:h-2/3 w-full h-full flex justify-end">
                <canvas id="chart"></canvas>
            </div>
        </div>
    </div>
</template>
