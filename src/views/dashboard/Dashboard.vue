<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>
    <div class="my-6">
        <a-row :gutter="[10, 10]">
            <a-col :md="6" :sm="24" :xs="24">
                <card-stats
                        :statIcon="BarChartOutlined"
                        statArrow="up"
                        statDescripiron="Since last month"
                        statIconColor="bg-red-500"
                        statPercent="3.48"
                        statPercentColor="text-emerald-500"
                        statSubtitle="TRAFFIC"
                        statTitle="350,897"/>
            </a-col>
            <a-col :md="6" :sm="24" :xs="24">
                <card-stats
                        :statIcon="PieChartOutlined"
                        statArrow="down"
                        statDescripiron="Since last week"
                        statIconColor="bg-orange-500"
                        statPercent="3.48"
                        statPercentColor="text-red-500"
                        statSubtitle="NEW USERS"
                        statTitle="2,356"/>
            </a-col>
            <a-col :md="6" :sm="24" :xs="24">
                <card-stats
                        :statIcon="TeamOutlined"
                        statArrow="down"
                        statDescripiron="Since yesterday"
                        statIconColor="bg-pink-500"
                        statPercent="1.10"
                        statPercentColor="text-orange-500"
                        statSubtitle="SALES"
                        statTitle="924"
                />
            </a-col>
            <a-col :md="6" :sm="24" :xs="24">
                <card-stats
                        :statIcon="PercentageOutlined"
                        statArrow="up"
                        statDescripiron="Since last month"
                        statIconColor="bg-emerald-500"
                        statPercent="12"
                        statPercentColor="text-emerald-500"
                        statSubtitle="PERFORMANCE"
                        statTitle="49,65%"
                />
            </a-col>
        </a-row>
    </div>
    <div>
        <a-row :gutter="[50]">
            <a-col :md="16" :xs="24">
                <card-line-chart/>
                <card-page-visits/>
            </a-col>
            <a-col :md="8" :xs="24">
                <card-bar-chart/>
                <card-social-traffic/>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import CardLineChart from "@/components/cards/CardLineChart.vue";
import CardBarChart from "@/components/cards/CardBarChart.vue";
import CardPageVisits from "@/components/cards/CardPageVisits.vue";
import CardSocialTraffic from "@/components/cards/CardSocialTraffic.vue";
import CardStats from "@/components/cards/CardStats.vue";
import {BarChartOutlined, PercentageOutlined, PieChartOutlined, TeamOutlined} from "@ant-design/icons-vue";
import BreadCrumb from "@/components/breadcrumb/BreadCrumb.vue";

const routes = [
    {name: 'Home', to: '/'},
    {name: 'Bảng điều khiển', to: '/'}
];

console.log("herere")

</script>
