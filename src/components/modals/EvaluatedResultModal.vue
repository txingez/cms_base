<script setup>
import {resultModalStore} from "../../stores/resultModalStore";
import {computed, ref} from "vue";
import OrganizationProfileContent from "../tabPaneContents/OrganizationProfileContent.vue";
import EvaluatedQuestionsContent from "../tabPaneContents/EvaluatedQuestionsContent.vue";
import {EnvironmentQuestions} from "../../constants/environmentQuestions";
import {SocialQuestions} from "../../constants/socialQuestions";
import {GovernanceQuestions} from "../../constants/governanceQuestions";
import ResultEvaluatedContent from "../tabPaneContents/ResultEvaluatedContent.vue";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

const html3Pdf = ref()
const resultModal = resultModalStore()
const resultData = computed(() => resultModal.data)
const resultEvaluatedDataSource = computed(() => {
    return [
        {
            name: 'E - Môi trường',
            point: resultData.value.result.environment.point,
            distribution: resultData.value.result.environment.distribution
        },
        {
            name: 'S - Xã hội',
            point: resultData.value.result.social.point,
            distribution: resultData.value.result.social.distribution
        },
        {
            name: 'G - Quản trị',
            point: resultData.value.result.governance.point,
            distribution: resultData.value.result.governance.distribution
        }
    ]
})

const activeTab = ref(1)

const exportHTMLToPDF = async () => {
    // const pages = document.getElementById('test1')
    // console.log(pages)
    // const opt = {
    //     margin: [30, 0, 30, 0],
    //     filename: 'myfile.pdf',
    //     image: {type: 'jpeg', quality: 0.98},
    //     html2canvas: {
    //         scale: 2,
    //         bottom: 20
    //     },
    //     pagebreak: {mode: ['avoid-all', 'css', 'legacy']},
    //     jsPDF: {unit: 'px', format: 'a4', orientation: 'portrait'}
    // };
    // const a = html2pdf().set(opt).from(pages)
    // console.log(a)
    //     a.toPdf().save()
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16 // or "smart", default is 16
    })
    const elements = document.getElementsByClassName("abc")
    await createPdf({doc, elements})

    doc.save(`result.pdf`)
}

const createPdf = async ({doc, elements}) => {
    let top = 20;
    const padding = 30;
    for (let i = 0; i < elements.length; i++) {
        const el = elements.item(i);
        console.log(el)
        console.log(1111111)
        const imgData = await htmlToImage.toPng(el);

        console.log(222222222)
        let elHeight = el.offsetHeight;
        let elWidth = el.offsetWidth;

        const pageWidth = doc.internal.pageSize.getWidth();

        if (elWidth > pageWidth) {
            const ratio = pageWidth / elWidth;
            //resize chart width and height proportionally
            elHeight = elHeight * ratio - padding;
            elWidth = elWidth * ratio - padding;
        }

        const pageHeight = doc.internal.pageSize.getHeight();
        //if chart do not fit to the page height
        if (top + elHeight > pageHeight) {
            doc.addPage(); // add new page
            top = 20; // reset height counter
        }

        console.log(33333333)
        doc.addImage(imgData, "PNG", padding - 15, top, elWidth, elHeight, `image${i}`, 'FAST');
        console.log(444444444)
        top += elHeight;
    }
}

</script>

<template>
    <a-modal v-model:open="resultModal.isShow"
             class="top-[50px]"
             width="100%"
             title="Thông tin kết quả đánh giá"
             :destroyOnClose="true">
        <div class="flex flex-col gap-5">
            <div class="test">
                <OrganizationProfileContent :profile-data="resultData.organizationProfile" class="abc"/>
                <EvaluatedQuestionsContent
                        :result-data="resultData.answers.filter(a => a.key.startsWith('E'))"
                        :questions="EnvironmentQuestions" class="abc"/>
                <EvaluatedQuestionsContent
                        :result-data="resultData.answers.filter(a => a.key.startsWith('S'))"
                        :questions="SocialQuestions" class="abc"/>
                <EvaluatedQuestionsContent
                        :result-data="resultData.answers.filter(a => a.key.startsWith('G'))"
                        :questions="GovernanceQuestions" class="abc"/>
                <ResultEvaluatedContent :data-source="resultEvaluatedDataSource"
                                        :total-point="resultData.result.total"
                                        :rate="resultData.result.rate" class="abc"/>
            </div>
            <!--            <a-tabs v-model:active-key="activeTab" class="h-full">-->
            <!--                <a-tab-pane :key="1" tab="Thông tin doanh nghiệp">-->
            <!--                    <OrganizationProfileContent :profile-data="resultData.organizationProfile" id="test1"/>-->
            <!--                </a-tab-pane>-->
            <!--                <a-tab-pane :key="2" tab="E - Môi trường">-->
            <!--                    <EvaluatedQuestionsContent-->
            <!--                            :result-data="resultData.answers.filter(a => a.key.startsWith('E'))"-->
            <!--                            :questions="EnvironmentQuestions" class="test"/>-->
            <!--                </a-tab-pane>-->
            <!--                <a-tab-pane :key="3" tab="S - Xã hội">-->
            <!--                    <EvaluatedQuestionsContent-->
            <!--                            :result-data="resultData.answers.filter(a => a.key.startsWith('S'))"-->
            <!--                            :questions="SocialQuestions" class="test"/>-->
            <!--                </a-tab-pane>-->
            <!--                <a-tab-pane :key="4" tab="G - Quản trị">-->
            <!--                    <EvaluatedQuestionsContent-->
            <!--                            :result-data="resultData.answers.filter(a => a.key.startsWith('G'))"-->
            <!--                            :questions="GovernanceQuestions" class="test"/>-->
            <!--                </a-tab-pane>-->
            <!--                <a-tab-pane :key="5" tab="Tổng điểm ESG">-->
            <!--                    <ResultEvaluatedContent :data-source="resultEvaluatedDataSource"-->
            <!--                                            :total-point="resultData.result.total"-->
            <!--                                            :rate="resultData.result.rate"/>-->
            <!--                </a-tab-pane>-->
            <!--            </a-tabs>-->
            <a-button @click.prevent="exportHTMLToPDF">Genenrate</a-button>
        </div>
    </a-modal>
</template>
