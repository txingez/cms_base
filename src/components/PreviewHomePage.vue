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
        <div v-if="previewerStore.previewerState.homePageContent.introduction !== ''" class="px-5">
            <DividerWithName label="GIỚI THIỆU"/>
            <div class="mb-10" v-html="previewerStore.previewerState.homePageContent.introduction"/>
        </div>

        <div class="bg-[#46c585]"
             v-if="previewerStore.previewerState.homePageContent.titleMission !== '' || previewerStore.previewerState.homePageContent.missions?.filter(m => m.content !== '').length !== 0">
            <div class="flex min-h-[800px] xl:flex-row flex-col xl:gap-10 gap-5">
                <div class="flex gap-5 flex-col basis-1/2 pl-5">
                    <DividerWithName label="mục tiêu"/>
                    <div class="space-y-14">
                        <div class="text-2xl font-bold">
                            <div>{{ previewerStore.previewerState.homePageContent.titleMission }}</div>
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
                                <div class="md:text-xl text-base text-stone-800">{{ mission.content }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="basis-1/2">
                    <img src="https://lh3.googleusercontent.com/pw/AIL4fc96QJ-o5znFN8yP41V0vHSi6fjRuu0kejymzIPIw0FO8g-D70NfLfmJgbHXl1s4q9KIcVWR4Q0b-VRqPwikZFSQDbim1zs_B_iU0gl2hUwRXOAIBeLYV60uAI5UUfs-Fqdixt2MI-GfMv0lzWNVcjDj=w1060-h1060-s-no?authuser=0"
                         class="h-full w-full"
                         alt="mission_block_image">
                </div>
            </div>
        </div>

        <div v-if="previewerStore.previewerState.descriptionEvaluate !== '' && previewerStore.previewerState.homePageContent.evaluateSlides.filter(s => s.title !== '' && s.image.length !== 0).length !== 0"
             class="px-5">
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
