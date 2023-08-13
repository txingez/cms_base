<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-10 rounded bg-slate-700">
    <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h6 class="uppercase text-slate-100 mb-1 text-xs font-semibold">
            Overview
          </h6>
          <h2 class="text-white text-xl font-semibold">
            Sales value
          </h2>
        </div>
      </div>
    </div>
    <div class="p-4 flex-auto">
      <!-- Chart -->
      <div class="h-72">
        <canvas id="chart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import {onMounted} from "vue";

onMounted(() => {
  const config = {
    type: "line",
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
          lineTension: 0.4,
          backgroundColor: "#4c51bf",
          borderColor: "#4c51bf",
          data: [65, 78, 66, 44, 56, 67, 75],
          fill: false,
        },
        {
          label: new Date().getFullYear() - 1,
          fill: false,
          lineTension: 0.4,
          backgroundColor: "#fff",
          borderColor: "#fff",
          data: [40, 68, 86, 74, 56, 60, 87],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: {
          ticks: {
            color: "rgba(255,255,255,.7)",
          },
          display: true,
          grid: {
            display: false,
            borderDash: [2],
            borderDashOffset: [2],
            color: "rgba(33, 37, 41, 0.3)",
            drawTicks: false,
            tickColor: "rgba(0, 0, 0, 0)",
            tickBorderDash: [2],
            tickBorderDashOffset: [2],
          }
        },
        yAxes: {
          ticks: {
            color: "rgba(255,255,255,.7)",
          },
          display: true,
          grid: {
            borderDash: [3],
            borderDashOffset: [3],
            color: "rgba(255, 255, 255, .15)",
            drawBorder: false,
            tickBorderDash: [2],
            tickBorderDashOffset: [2],
            tickColor: "rgba(33, 37, 41, 0)",
          },
        }
      },
      plugins: {
        title: {
          display: false,
          text: "Sales Charts",
          color: "white",
        },
        legend: {
          labels: {
            color: "#fff",
          },
          align: "end",
          position: "bottom",
        },
        tooltip: {
          mode: "nearest",
          intersect: false,
        }
      }
    }
  };

  const ctx = document.getElementById("chart").getContext("2d");
  window.myLine = new Chart(ctx, config);
})
</script>
