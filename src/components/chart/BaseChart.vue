<template>
  <bar-chart v-bind="dataChart" />
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { BarChart } from "@opd/g2plot-vue";
export default defineComponent({
  name: "BaseChart",
  components: { BarChart },
  props: {
    label: { type: Array, default: [] },
    result: { type: Array, default: [] },
    height: {
      type: Number,
      default: 400,
    },
    maxValue: {
      default: 0,
      type: Number,
    },
  },
  setup(props) {
    const dataChart = computed(() => ({
      height: props.height,
      autoFit: true,
      xField: "value",
      yField: "type",
      smooth: true,
      meta: {
        value: {
          // max: props.maxValue + 3,
        },
      },
      data: props.result,
      seriesField: "type",
      legend: {
        position: "top-left",
      },
      colorField: "type", // or seriesField in some cases
    }));
    const colorChart = ref([""]);

    return { dataChart, colorChart };
  },
});
</script>

<style lang="scss" scoped></style>
