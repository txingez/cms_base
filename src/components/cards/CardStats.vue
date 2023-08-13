<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0">
    <div class="flex-auto p-4">
      <div class="flex flex-wrap">
        <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
          <h5 class="text-slate-400 uppercase font-bold text-xs">
            {{ statSubtitle }}
          </h5>
          <span class="font-semibold text-xl text-slate-700">
            {{ statTitle }}
          </span>
        </div>
        <div class="relative w-auto pl-4 flex-initial">
          <div
              class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full"
              :class="[statIconColor]">
            <component :is="statIcon"/>
          </div>
        </div>
      </div>
      <p class="text-sm text-slate-400 mt-4">
        <span class="mr-2" :class="[statPercentColor]">
          <arrow-up-outlined v-if="statArrow === 'up'"/>
          <arrow-down-outlined v-else-if="statArrow === 'down'"/>
          {{ statPercent }}%
        </span>
        <span class="whitespace-nowrap">{{ statDescription }}</span>
      </p>
    </div>
  </div>
</template>
<script setup>
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons-vue";

defineProps({
  statSubtitle: {
    type: String,
    default: "Traffic"
  },
  statTitle: {
    type: String,
    default: "350,897",
  },
  statArrow: {
    default: "up",
    validator: function (value) {
      // The value must match one of these strings
      return ["up", "down"].indexOf(value) !== -1;
    },
  },
  statPercent: {
    type: String,
    default: "3.48",
  },
  statPercentColor: {
    type: String,
    default: "text-emerald-500",
  },
  statDescription: {
    type: String,
    default: "Since last month",
  },
  statIcon: {
    default: "BarChartOutlined",
  },
  statIconColor: {
    type: String,
    default: "bg-red-500",
  },
});
</script>
