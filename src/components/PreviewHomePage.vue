<script setup>
import DividerWithName from "./DividerWithName.vue";
import {close} from "../utils/previewerUtils";
import {previewer} from "../stores/previewer"

const previewerStore = previewer()
</script>

<template>
    <a-modal :footer="null"
             :open="previewerStore.previewerState.isPreview"
             title="BỐ CỤC TRANG CHỦ"
             width="100%"
             class="top-0 max-w-full"
             wrap-class-name="full-modal"
             @cancel="close">
        <a-carousel arrows class="h-full"
                    v-if="previewerStore.previewerState.homePageContent.banner?.filter(b => b.title !== '' && b.image.length !== 0).length !== 0">
            <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px">
                    <font-awesome-icon icon="fa-solid fa-chevron-left"/>
                </div>
            </template>
            <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                    <font-awesome-icon icon="fa-solid fa-chevron-right"/>
                </div>
            </template>
            <div v-for="banner in previewerStore.previewerState.homePageContent.banner" class="relative h-full">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            flex flex-col lg:gap-5 md:gap-2.5 gap-2 w-full h-full justify-end items-start lg:p-14 md:p-8 p-5">
                    <div class="p-1.5 break-after-auto font-bold whitespace-pre-wrap text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500 w-full"
                         :class="banner.placeTitle === 'center' ? 'text-center lg:-translate-y-1/3 xl:-translate-y-[150%] xl:text-8xl lg:text-7xl md:text-5xl text-4xl' : 'md:text-5xl lg:text-6xl xl:text-7xl text-2xl'">
                        <!-- {{ banner.title }} -->
                        <div v-html="banner.title"/>
                    </div>
                    <div class="xl:text-2xl lg:text-lg md:text-base text-xs italic xl:pr-72 lg:pr-32 md:pr-28 pr-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">
                        <!-- {{ banner.description }} -->
                        <div v-html="banner.description"/>
                    </div>
                    <div style="border-image: linear-gradient(45deg, #60a5fa, #22c55e) 1"
                         class="md:px-6 px-3 md:py-2 lg:py-3 md:text-base xl:text-2xl md:min-h-[50px] min-h-[30px] flex justify-center items-center border rounded border-image hover:bg-gradient-to-r hover:from-blue-400 hover:to-green-500 hover:cursor-pointer
                     text-transparent bg-gradient-to-r bg-clip-text from-blue-400 to-green-500 hover:bg-clip-padding hover:text-white"
                         :class="banner.labelBtn ? '' : 'invisible'">
                        {{ banner.labelBtn }}
                    </div>
                </div>
                <div class="h-full">
                    <img class="w-full h-full"
                         loading="lazy"
                         :src="banner.image[0]?.url"
                         alt="carousel">
                </div>
            </div>
        </a-carousel>

        <div v-if="previewerStore.previewerState.homePageContent.introduction !== ''" class="px-5">
            <DividerWithName label="GIỚI THIỆU"/>
            <!-- <div class="mb-10" v-html="previewerStore.previewerState.homePageContent.introduction"/> -->
            <div class="mb-10" v-html="previewerStore.previewerState.homePageContent.introduction"/>
        </div>

        <div class="bg-[#46c585]"
             v-if="previewerStore.previewerState.homePageContent.titleMission !== '' || previewerStore.previewerState.homePageContent.missions?.filter(m => m.content !== '').length !== 0">
            <div class="flex min-h-[800px] xl:flex-row flex-col xl:gap-10 gap-5">
                <div class="flex gap-5 flex-col basis-1/2 pl-5">
                    <DividerWithName label="mục tiêu"/>
                    <div class="space-y-14">
                        <div class="text-2xl font-bold">
                            <!-- <div>{{ previewerStore.previewerState.homePageContent.titleMission }}</div> -->
                            <div v-html="previewerStore.previewerState.homePageContent.titleMission"/>
                        </div>
                        <div class="flex gap-5 flex-wrap">
                            <div v-for="mission in previewerStore.previewerState.homePageContent.missions"
                                 class="md:basis-[48%] flex gap-2 flex-col"
                                 data-aos="flip-left"
                                 data-aos-easing="ease-in-out"
                                 data-aos-duration="500">
                                <div>
                                    <img :src="mission.icon"
                                         class="md:w-[100px] w-[70px] md:h-[100px] h-[70px] relative left-[-7px]"
                                         alt="icon">
                                </div>
                                <!-- <div class="md:text-xl text-base text-stone-800">{{ mission.content }}</div> -->
                                <div v-html="mission.content"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="basis-1/2">
                    <img :src="previewerStore.previewerState.homePageContent.imageMission[0]?.url"
                         class="h-full w-full"
                         alt="mission_block_image">
                </div>
            </div>
        </div>

        <div v-if="previewerStore.previewerState.descriptionEvaluate !== '' && previewerStore.previewerState.homePageContent.evaluateSlides.filter(s => s.title !== '' && s.image.length !== 0).length !== 0"
             class="px-5">
            <DividerWithName label="CÔNG CỤ ĐÁNH GIÁ KINH DOANH BỀN VỮNG"/>
            <div class=" space-y-10 mb-10">
                <div class="grid md:grid-cols-2 grid-cols-1 xl:gap-20 gap-5">
                    <div class="text-justify"
                         v-if="previewerStore.previewerState.descriptionEvaluate !== ''">
                        <!-- {{ previewerStore.previewerState.homePageContent.descriptionEvaluate }} -->
                        <div v-html="previewerStore.previewerState.homePageContent.descriptionEvaluate"/>
                    </div>
                    <div class="rounded-[10px]"
                         v-if="previewerStore.previewerState.homePageContent.evaluateSlides.filter(s => s.title !== '' && s.image.length !== 0).length !== 0">
                        <a-carousel class="carousel-container rounded-[10px]" id="overview" arrows>
                            <template #prevArrow>
                                <div class="custom-slick-arrow" style="left: 10px">
                                    <font-awesome-icon icon="fa-solid fa-chevron-left"/>
                                </div>
                            </template>
                            <template #nextArrow>
                                <div class="custom-slick-arrow" style="right: 10px">
                                    <font-awesome-icon icon="fa-solid fa-chevron-right"/>
                                </div>
                            </template>
                            <div v-for="slide in previewerStore.previewerState.homePageContent.evaluateSlides.filter(s => s.title !== '' && s.image.length !== 0)"
                                 class="relative overview-block h-full w-full text-black rounded-[10px]">
                                <div class="w-full rounded-[10px]">
                                    <img :src="slide.image[0].url"
                                         class="object-cover h-full w-full rounded-[10px]"
                                         loading="lazy"
                                         :alt="slide.image[0].url">
                                </div>

                                <div class="rounded-[10px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full bg-[rgba(0,0,0,0.4)] flex flex-col gap-5 justify-center items-center">
                                    <div class="text-white slide-name xl:text-2xl lg:text-xl text-lg text-center">
                                        <!-- {{ slide.title }} -->
                                        <div v-html="slide.title"/>
                                    </div>
                                    <a-button class="text-white h-fit min-h-[50px] md:text-base xl:text-lg">
                                        Đánh giá ngay
                                    </a-button>
                                </div>
                            </div>
                        </a-carousel>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<style scoped>
:deep(.slick-slide) {
    height: calc(100vh - 152px);
}

:deep(.slick-slide>div) {
    height: 100%;
}

@media screen and (max-width: 430px) {
    :deep(.slick-slide) {
        height: 300px;
    }
}

@media screen and (min-width: 431px) and (max-width: 768px) {
    :deep(.slick-slide) {
        height: 400px;
    }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
    :deep(.slick-slide) {
        height: 600px;
    }
}

:deep(.slick-arrow.custom-slick-arrow) {
    width: 30px;
    height: 30px;
    font-size: 30px;
    color: #fff;
    transition: ease all 0.3s;
    z-index: 1;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
    display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
    color: #fff;
    opacity: 0.5;
}

:deep(.slick-slide h3) {
    color: #fff;
}

:deep(.carousel-container .slick-slide) {
    height: 250px;
    width: 100%;
    border-radius: 10px;
}

:deep(.carousel-container .slick-slide div) {
    height: 100%;
    border-radius: 10px;
}

:deep(.carousel-container .slick-slide .overview-block) {
    display: flex !important;
}

:deep(.ant-carousel .slick-dots li button) {
    background: #94a3b8;
}

:deep(.carousel-container .slick-arrow.custom-slick-arrow) {
    width: 15px;
    height: 15px;
    font-size: 15px;
    color: #e5e7eb;
    transition: ease all 0.3s;
    opacity: 0.7;
    z-index: 1;
}

:deep(.carousel-container .slick-arrow.custom-slick-arrow:before) {
    display: none;
}

:deep(.carousel-container .slick-arrow.custom-slick-arrow:hover) {
    color: #e5e7eb;
    opacity: 0.5;
}

.slide-name {
    height: fit-content !important;
}
</style>
