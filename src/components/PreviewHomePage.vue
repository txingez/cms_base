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
             @cancel="close">
        <div v-if="previewerStore.previewerState.homePageContent.introduction !== ''">
            <DividerWithName label="GIỚI THIỆU"/>
            <div class="mb-10" v-html="previewerStore.previewerState.homePageContent.introduction"/>
        </div>

        <div class="bg-[#46c585] p-2"
             v-if="previewerStore.previewerState.homePageContent.titleMission !== '' || previewerStore.previewerState.homePageContent.missions?.filter(m => m.content !== '').length !== 0">
            <DividerWithName label="mục tiêu"/>
            <div class=" space-y-5 mb-10">
                <div class="flex gap-5 xl:flex-row flex-col">
                    <div class="md:text-2xl xl:text-3xl text-2xl font-bold md:basis-1/2">
                        {{ previewerStore.previewerState.homePageContent.titleMission }}
                    </div>
                    <div class="md:basis-1/2 basis-full">
                        <div class="flex gap-5 flex-col">
                            <div class="flex gap-5 items-center"
                                 v-for="mission in previewerStore.previewerState.homePageContent.missions">
                                <div class="basis-[5%] w-[25px] h-[30px] rounded-[5px] bg-emerald-700 text-base text-white font-medium flex justify-center items-center">
                                    <font-awesome-icon icon="fa-solid fa-building"/>
                                </div>
                                <div class="text-lg basis-[95%]">
                                    {{ mission.content }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="previewerStore.previewerState.descriptionEvaluate !== '' && previewerStore.previewerState.homePageContent.evaluateSlides.filter(s => s.title !== '' && s.image.length !== 0).length !== 0">
            <DividerWithName label="CÔNG CỤ ĐÁNH GIÁ KINH DOANH BỀN VỮNG"/>
            <div class=" space-y-10 mb-10">
                <div class="grid md:grid-cols-2 grid-cols-1 xl:gap-20 gap-5 items-center">
                    <div class="text-justify"
                         v-if="previewerStore.previewerState.descriptionEvaluate !== ''">
                        {{ previewerStore.previewerState.homePageContent.descriptionEvaluate }}
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
                                        {{ slide.title }}
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

        <!--        <div class="bg-[#46c585]">-->
        <!--            <DividerWithName label="tin tức và sự kiện"/>-->
        <!--            <div class=" space-y-5 mb-10">-->
        <!--                <div class="flex gap-5 md:flex-row flex-col">-->
        <!--                    <a-card v-for="news in newsArray"-->
        <!--                            class="basis-1/3"-->
        <!--                            data-aos="fade-down"-->
        <!--                            data-aos-easing="ease-in-out"-->
        <!--                            data-aos-duration="500">-->
        <!--                        <template #cover>-->
        <!--                            <a class="overflow-hidden rounded-t-[10px] opacity-[0.85] hover:opacity-100 transition-all"-->
        <!--                               :href="news.href" target="_blank">-->
        <!--                                <img class="lg:h-[200px] md:h-[150px] h-[200px] w-full hover:scale-110 transition-all"-->
        <!--                                     :src="news.thumbnail"-->
        <!--                                     loading="lazy"-->
        <!--                                     :alt="news.thumbnail">-->
        <!--                            </a>-->
        <!--                        </template>-->
        <!--                        <div class="space-y-2">-->
        <!--                            <a :href="news.href" target="_blank"-->
        <!--                               class="font-bold line-clamp-2 text-ellipsis text-base">-->
        <!--                                {{ news.title }}-->
        <!--                            </a>-->
        <!--                            <div class="text-[14px] line-clamp-4 text-ellipsis text-justify">{{-->
        <!--                                news.description-->
        <!--                                }}-->
        <!--                            </div>-->
        <!--                        </div>-->
        <!--                    </a-card>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--        </div>-->
    </a-modal>
</template>

<style scoped>
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
