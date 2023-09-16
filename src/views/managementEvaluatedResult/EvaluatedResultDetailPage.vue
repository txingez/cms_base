<script setup>
import {computed, onMounted} from "vue";
import OrganizationProfileContent from "../../components/tabPaneContents/OrganizationProfileContent.vue";
import {EnvironmentQuestions} from "../../constants/environmentQuestions";
import {SocialQuestions} from "../../constants/socialQuestions";
import {GovernanceQuestions} from "../../constants/governanceQuestions";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import TitlePage from "../../components/TitlePage.vue";
import {useRouter} from "vue-router";
import DividerWithTitle from "../../components/DividerWithTitle.vue";
import {FirstCriteria} from "../../constants/firstCriteria";
import {SecondCriteria} from "../../constants/secondCriteria";
import {ThirdCriteria} from "../../constants/thirdCriteria";
import {ENUM} from "../../constants/enum";
import {reactive} from "@vue/reactivity";
import {getFormDataById} from "../../services/evaluatedResult";
import {Buffer} from "buffer";
import EvaluatedQuestionsContent from "../../components/tabPaneContents/EvaluatedQuestionsContent.vue";
import ResultEvaluatedContent from "../../components/tabPaneContents/ResultEvaluatedContent.vue";

const router = useRouter()

const routes = computed(() => [
    {name: 'Home', to: '/'},
    {name: 'Quản lý kết quả đánh giá', to: '/evaluated_result'},
    {name: 'Kết quả đánh giá', to: `/result_detail/${router.currentRoute.value.params.id}`}
]);

const dataInfo = reactive({
    id: 0,
    formId: ENUM.FORM_ID.ESG,
    profile: {},
    firstPart: {
        questions: [],
        answers: []
    },
    secondPart: {
        questions: [],
        answers: []
    },
    thirdPart: {
        questions: [],
        answers: []
    },
    result: [],
    rate: 'A',
    totalPoint: '0'
})

onMounted(() => {
    const id = router.currentRoute.value.params.id
    getFormDataById(id).then((response) => {
        const responseData = response.data
        dataInfo.id = responseData.id
        dataInfo.formId = responseData.form_id

        const formData = JSON.parse(Buffer.from(responseData.data.split('.')[1], 'base64').toString());
        dataInfo.profile = formData.data.organizationProfile
        const resultHandled = resultAndQaA(responseData.form_id, formData.data.result, formData.data.answers)
        dataInfo.firstPart = resultHandled.firstPart
        dataInfo.secondPart = resultHandled.secondPart
        dataInfo.thirdPart = resultHandled.thirdPart
        dataInfo.result = resultHandled.result
        dataInfo.rate = resultHandled.rate
        dataInfo.totalPoint = resultHandled.total
    }).catch((err) => {
        console.log(err)
    })
})

const resultAndQaA = (formId, result, answers) => {
    switch (formId) {
        case ENUM.FORM_ID.ESG:
            return {
                firstPart: {
                    answers: answers.filter(a => a.question.startsWith('E')),
                    questions: EnvironmentQuestions,
                },
                secondPart: {
                    answers: answers.filter(a => a.question.startsWith('S')),
                    questions: SocialQuestions
                },
                thirdPart: {
                    answers: answers.filter(a => a.question.startsWith('G')),
                    questions: GovernanceQuestions
                },
                result: [
                    {
                        name: 'E - Môi trường',
                        point: result.environment.point,
                        distribution: result.environment.distribution
                    },
                    {
                        name: 'S - Xã hội',
                        point: result.social.point,
                        distribution: result.social.distribution
                    },
                    {
                        name: 'G - Quản trị',
                        point: result.governance.point,
                        distribution: result.governance.distribution
                    }
                ],
                total: result.total,
                rate: result.rate
            }

        case ENUM.FORM_ID.NEC:
            return {
                firstPart: {
                    answers: answers.filter(a => a.question.startsWith('FC')),
                    questions: FirstCriteria
                },
                secondPart: {
                    answers: answers.filter(a => a.question.startsWith('SC')),
                    questions: SecondCriteria
                },
                thirdPart: {
                    answers: answers.filter(a => a.question.startsWith('TC')),
                    questions: ThirdCriteria
                },
                result: [
                    {
                        name: 'Nhóm tiêu chí 1: Tầm nhìn và chiến lược của doanh nghiệp',
                        point: result.first_criteria.point,
                        max: result.first_criteria.max,
                        sum: result.first_criteria.sum
                    },
                    {
                        name: 'Nhóm tiêu chí 2: Áp dụng nguyên tắc tuần hoàn trong công đoạn sản xuất và tiền sản xuất',
                        point: result.second_criteria.point,
                        max: result.second_criteria.max,
                        sum: result.second_criteria.sum
                    },
                    {
                        name: 'Nhóm tiêu chí 3: Áp dụng nguyên tắc tuần hoàn trong công đoạn sau bán hàng',
                        point: result.third_criteria.point,
                        max: result.third_criteria.max,
                        sum: result.third_criteria.sum
                    }
                ],
                total: result.total,
                rate: result.rate
            }
        default:
            return {
                firstPart: {answers: [], questions: []},
                secondPart: {answers: [], questions: []},
                thirdPart: {answers: [], questions: []},
                result: [
                    {name: '', point: 100, max: 100, sum: 100},
                    {name: '', point: 100, max: 100, sum: 100}, ,
                    {name: '', point: 100, max: 100, sum: 100},
                ],
                total: 100,
                rate: 'A'
            }
    }
}

const exportHTMLToPDF = async () => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16 // or "smart", default is 16
    })
    const elements = document.getElementsByClassName("print")
    await createPdf({doc, elements})

    doc.save(`ket_qua_danh_gia.pdf`)
}

const createPdf = async ({doc, elements}) => {
    let top = 20;
    const padding = 30;
    for (let i = 0; i < elements.length; i++) {
        const el = elements.item(i);
        const imgData = await htmlToImage.toPng(el);

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

        doc.addImage(imgData, "PNG", padding - 15, top, elWidth, elHeight, `image${i}`, 'FAST');
        top += elHeight;
    }
}

</script>

<template>
    <div class="mb-5">
        <BreadCrumb :routes="routes"/>
    </div>
    <TitlePage label="Chi tiết kết quả đánh giá"/>

    <div class="flex flex-col gap-5 border rounded-[5px] p-5 bg-white">
        <div class="space-y-5">
            <div class="print">
                <DividerWithTitle label="Hồ sơ doanh nghiệp/tổ chức" place="center"/>
                <OrganizationProfileContent :organization-profile="dataInfo.profile"
                                            :form-id="dataInfo.formId"/>
            </div>

            <div class="print">
                <DividerWithTitle label="Đáp án lựa chọn" place="center"/>
                <EvaluatedQuestionsContent
                    :result-data="dataInfo.firstPart.answers"
                    :questions="dataInfo.firstPart.questions"/>
                <EvaluatedQuestionsContent
                    :result-data="dataInfo.secondPart.answers"
                    :questions="dataInfo.secondPart.questions"/>
                <EvaluatedQuestionsContent
                    :result-data="dataInfo.thirdPart.answers"
                    :questions="dataInfo.thirdPart.questions"/>
            </div>

            <div class="print">
                <DividerWithTitle label="Kết quả cuối cùng" place="center"/>
                <ResultEvaluatedContent :form-id="dataInfo.formId"
                                        :data-source="dataInfo.result"
                                        :total-point="dataInfo.totalPoint"
                                        :rate="dataInfo.rate"/>
            </div>
        </div>
        <div class="text-right">
            <a-button type="primary" class="bg-blue-500" @click.prevent="exportHTMLToPDF">Xuất file</a-button>
        </div>
    </div>
</template>
