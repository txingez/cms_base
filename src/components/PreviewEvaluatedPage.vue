<script setup>
import {close} from "../utils/previewerUtils";
import {previewer} from "../stores/previewer"
import {DownloadOutlined} from "@ant-design/icons-vue"

const previewerStore = previewer()
</script>

<template>
    <a-modal :footer="null"
             :open="previewerStore.previewerState.isPreview"
             title="BỐ CỤC TRANG CÔNG CỤ ĐÁNH GIÁ"
             width="100%"
             class="top-0 max-w-full"
             wrap-class-name="full-modal"
             @cancel="close">
        <div class="md:px-10 lg:px-[100px] px-5 py-10 flex md:gap-10 gap-5 flex-col">
            <div v-html="previewerStore.previewerState.evaluatedPageContent.introduction"/>

            <div class="grid grid-cols-4 gap-10">
                <div class="lg:col-span-2 col-span-4 border rounded-[10px] max-h-[340px]"
                     data-aos="fade-down"
                     data-aos-easing="ease-in-out"
                     data-aos-duration="500">
                    <img class="rounded-[10px] w-full h-full"
                         loading="lazy"
                         :src="previewerStore.previewerState.evaluatedPageContent.esg.image[0]?.url"
                         alt="business7">
                </div>
                <div class="flex flex-col gap-3 lg:col-span-2 col-span-4 justify-center"
                     data-aos="fade-up"
                     data-aos-easing="ease-in-out"
                     data-aos-duration="500">
                    <div class="md:text-xl xl:text-2xl text-xl font-bold">
                        {{ previewerStore.previewerState.evaluatedPageContent.esg.title }}
                    </div>
                    <div class="flex gap-2.5 xl:flex-row flex-col">
                        <a-button class="min-h-[50px] md:text-base xl:text-lg">
                            {{ previewerStore.previewerState.evaluatedPageContent.esg.labelBtn }}
                        </a-button>
                        <a-button class="min-h-[50px] md:text-base xl:text-lg bg-blue-500"
                                  type="primary">
                            <a class="flex items-center justify-center gap-2 w-full h-full">
                                <DownloadOutlined/>
                                <span>Tài liệu giới thiệu và hướng dẫn</span>
                            </a>
                        </a-button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-4 gap-10">
                <div class="lg:col-span-2 col-span-4 lg:order-last border rounded-[10px] max-h-[340px]"
                     data-aos="fade-left"
                     data-aos-easing="ease-in-out"
                     data-aos-duration="500">
                    <img class="rounded-[10px] w-full h-full"
                         loading="lazy"
                         :src="previewerStore.previewerState.evaluatedPageContent.nec.image[0]?.url"
                         alt="manufacture_evaluate">
                </div>
                <div class="flex flex-col gap-3 lg:col-span-2 col-span-4 justify-center"
                     data-aos="fade-right"
                     data-aos-easing="ease-in-out"
                     data-aos-duration="500">
                    <div class="md:text-xl xl:text-2xl text-xl font-bold">
                        {{ previewerStore.previewerState.evaluatedPageContent.nec.title }}
                    </div>
                    <div class="flex gap-2.5 xl:flex-row flex-col">
                        <a-button class="min-h-[50px] md:text-base xl:text-lg">
                            {{ previewerStore.previewerState.evaluatedPageContent.nec.labelBtn }}
                        </a-button>
                        <a-button class="min-h-[50px] md:text-base xl:text-lg bg-blue-500"
                                  type="primary">
                            <a class="flex items-center justify-center gap-2">
                                <DownloadOutlined/>
                                <span>Tài liệu giới thiệu và hướng dẫn</span>
                            </a>
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>
