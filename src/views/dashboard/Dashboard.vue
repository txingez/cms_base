<template>
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>
  <div class="my-6">
    <a-row :gutter="[10, 10]">
      <a-col :xs="24" :sm="24" :md="6">
        <card-stats
            statSubtitle="TRAFFIC"
            statTitle="350,897"
            statArrow="up"
            statPercent="3.48"
            statPercentColor="text-emerald-500"
            statDescripiron="Since last month"
            :statIcon="BarChartOutlined"
            statIconColor="bg-red-500"/>
      </a-col>
      <a-col :xs="24" :sm="24" :md="6">
        <card-stats
            statSubtitle="NEW USERS"
            statTitle="2,356"
            statArrow="down"
            statPercent="3.48"
            statPercentColor="text-red-500"
            statDescripiron="Since last week"
            :statIcon="PieChartOutlined"
            statIconColor="bg-orange-500"/>
      </a-col>
      <a-col :xs="24" :sm="24" :md="6">
        <card-stats
            statSubtitle="SALES"
            statTitle="924"
            statArrow="down"
            statPercent="1.10"
            statPercentColor="text-orange-500"
            statDescripiron="Since yesterday"
            :statIcon="TeamOutlined"
            statIconColor="bg-pink-500"
        />
      </a-col>
      <a-col :xs="24" :sm="24" :md="6">
        <card-stats
            statSubtitle="PERFORMANCE"
            statTitle="49,65%"
            statArrow="up"
            statPercent="12"
            statPercentColor="text-emerald-500"
            statDescripiron="Since last month"
            :statIcon="PercentageOutlined"
            statIconColor="bg-emerald-500"
        />
      </a-col>
    </a-row>
  </div>
  <div>
    <a-row :gutter="[50]">
      <a-col :xs="24" :md="16">
        <card-line-chart/>
        <card-page-visits/>
      </a-col>
      <a-col :xs="24" :md="8">
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
