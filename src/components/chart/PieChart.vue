<template>
  <pie-chart v-bind="config" :data="data" />
</template>

<script>
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { PieChart } from "@opd/g2plot-vue";
import { G2 } from "@antv/g2plot";
G2.registerTheme("custom-theme", {
  colors10: [
    "#025DF4",
    "#DB6BCF",
    "#2498D1",
    "#BBBDE6",
    "#4045B2",
    "#21A97A",
    "#FF745A",
    "#007E99",
    "#FFA8A8",
    "#2391FF",
  ],
  colors20: [
    "#025DF4",
    "#DB6BCF",
    "#2498D1",
    "#BBBDE6",
    "#4045B2",
    "#21A97A",
    "#FF745A",
    "#007E99",
    "#FFA8A8",
    "#2391FF",
    "#FFC328",
    "#A0DC2C",
    "#946DFF",
    "#626681",
    "#EB4185",
    "#CD8150",
    "#36BCCB",
    "#327039",
    "#803488",
    "#83BC99",
  ],
});

export default defineComponent({
  name: "PieChartVue",
  components: { PieChart },
  props: {
    result: {
      default: [],
      type: Array,
    },
  },
  setup(props) {
    const data = ref([]);
    watch(
      props,
      (n) => {
        data.value = n.result;
      },
      { deep: true, immediate: true }
    );

    const config = {
      appendPadding: 10,
      data,
      angleField: "value",
      colorField: "type",
      radius: 1,
      innerRadius: 0.6,
      label: {
        type: "inner",
        offset: "-50%",
        content: "{value}",
        style: {
          textAlign: "center",
          fontSize: 14,
        },
      },
      interactions: [{ type: "element-selected" }, { type: "element-active" }],
      statistic: {
        title: false,
        content: {
          style: {
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          content: "TOI",
        },
      },
    };
    return { data, config };
  },
});
</script>

<style lang="scss" scoped></style>
