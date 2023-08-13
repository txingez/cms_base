<template>
  <div
      class="relative flex flex-col min-w-0 break-words bg-white w-full mb-10 rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-slate-400 mb-1 text-xs font-semibold">
            Performance
          </h6>
          <h2 class="text-blueGray-700 text-xl font-semibold">
            Total orders
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <div class="relative h-72">
        <canvas id="bar-chart"></canvas>
      </div>
    </div>
  </div>
</template>
<script setup>
import Chart from "chart.js/auto";
import {onMounted} from "vue";

onMounted(() => {
  const config = {
    type: "bar",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
      ],
      datasets: [
        {
          label: new Date().getFullYear(),
          backgroundColor: "#ed64a6",
          borderColor: "#ed64a6",
          data: [30, 78, 56, 34, 100, 45, 13],
          fill: false,
          barThickness: 8,
        },
        {
          label: new Date().getFullYear() - 1,
          fill: false,
          backgroundColor: "#4c51bf",
          borderColor: "#4c51bf",
          data: [27, 68, 86, 74, 10, 4, 87],
          barThickness: 8,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      tooltip: {
        mode: "nearest",
        intersect: false,
      },

      scales: {
        xAxes: {
          display: false,
          grid: {
            borderDash: [2],
            borderDashOffset: [2],
            color: "rgba(33, 37, 41, 0.3)",
            tickColor: "rgba(33, 37, 41, 0.3)",
            tickBorderDash: [2],
            tickBorderDashOffset: [2]
          },
        },
        yAxes: {
          display: true,
          grid: {
            borderDash: [2],
            drawBorder: false,
            borderDashOffset: [2],
            color: "rgba(33, 37, 41, 0.2)",
            tickColor: "rgba(33, 37, 41, 0.15)",
            tickBorderDash: [2],
            tickBorderDashOffset: [2]
          }
        }
      },

      plugins: {
        legend: {
          labels: {
            color: "rgba(0,0,0,.4)",
          },
          align: "end",
          position: "bottom",
        }
      }
    },
  };

  const ctx = document.getElementById("bar-chart").getContext("2d");
  window.myBar = new Chart(ctx, config);
})

</script>
