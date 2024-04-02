<script setup>

import TitlePage from "../../components/TitlePage.vue";
import BreadCrumb from "../../components/breadcrumb/BreadCrumb.vue";
import { onMounted, ref } from "vue";
import { numberWithComma } from "../../utils/formatNumber";
import { getFormData } from "../../services/activity";
import { handleResponse } from "../../services/commonService";
import { Buffer } from "buffer";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { ENUM } from "../../constants/enum";
import * as XLSX from "xlsx";
import { showToast } from "../../utils/showToast";
import { EnvironmentQuestions } from "../../constants/environmentQuestions";
import { FirstCriteria } from "../../constants/firstCriteria";
import { SecondCriteria } from "../../constants/secondCriteria";
import { SocialQuestions } from "../../constants/socialQuestions";
import { ThirdCriteria } from "../../constants/thirdCriteria";
import { GovernanceQuestions } from "../../constants/governanceQuestions";

const router = useRouter()

const routes = [
  {name: 'Home', to: '/'},
  {name: 'Quản lý kết quả đánh giá', to: '/evaluated_result'}
];

const columns = [
  {title: 'STT', dataIndex: 'number', key: 'number', width: 60},
  {title: 'Họ và tên người đánh giá', key: 'fullNameEvaluated', dataIndex: ['organizationProfile', 'fullName']},
  {title: 'Ngày thực hiện đánh giá', dataIndex: ['organizationProfile', 'evaluatedDate'], key: 'evaluatedDate'},
  {title: 'Tên doanh nghiệp/tổ chức', key: 'companyName', dataIndex: ['organizationProfile', 'companyName']},
  {title: 'Mã số thuế', key: 'taxCode', dataIndex: ['organizationProfile', 'taxCode'], width: 120},
  {title: 'Loại hình đăng ký', key: 'registrationType', dataIndex: ['organizationProfile', 'registrationType']},
  {title: 'Loại hình Doanh nghiệp', key: 'businessType', dataIndex: ['organizationProfile', 'businessModel']},
  {title: 'Công cụ đánh giá', key: 'formId', dataIndex: 'formId'},
  {title: 'Tổng điểm', key: 'totalPoint', dataIndex: ['result', 'total'], width: 110},
  {title: 'Xếp hạng', key: 'rate', dataIndex: ['result', 'rate'], width: 100},
  {title: 'Xem', key: 'view', width: 70}
];

const tableData = ref([])
const total = ref(1);
const current = ref(1);
const pageSizeState = ref(10);
const exportLoading = ref(false);

onMounted(() => {
  handleTableChange(1)
});

const onShowSizeChange = (currentPage, size) => {
  current.value = currentPage;
  pageSizeState.value = size;
};

const handleTableChange = page => {
  getTableData({
    targetPage: page,
    pageSize: pageSizeState.value
  });
};

const getTableData = async (options) => {
  const {targetPage, pageSize} = options;
  const body = {
    limit: pageSize,
    offset: (targetPage - 1) * pageSize
  }

  getFormData(body)
      .then((response) => {
        const responseData = handleResponse(response.status, response.data);
        tableData.value = responseData.data.results.map((r, index) => {
          const formData = JSON.parse(Buffer.from(r.data.split('.')[1], 'base64').toString());
          return {
            ...formData.data,
            key: r.id,
            formId: r.form_id,
            number: (options.targetPage - 1) * pageSizeState.value + index + 1
          }
        });

        total.value = responseData.data.total;
        current.value = responseData.data.page;
      }).catch(error => {
    console.log(error)
    handleResponse(error.response.status, error.response.data);
    console.log('Lấy thông tin thất bại,', error);
  })
}

const showResult = data => {
  router.push(`/result_detail/${data.key}`)
}

const handleTime = (time, format) => {
  return dayjs(time).format(format)
}

const mappingToolkit = formId => {
  switch (formId) {
    case ENUM.FORM_ID.ESG:
      return ENUM.FORM_ID.ESG;
    case ENUM.FORM_ID.NEC:
      return 'CE'
  }
}

const exportFile = () => {
  exportLoading.value = true;
  getFormData({limit: 9999, offset: 0})
      .then(response => {
        const responseData = handleResponse(response.status, response.data);
        const {esgArr, ceArr} = responseData.data.results.reduce((acc, obj) => {
          const formData = JSON.parse(Buffer.from(obj.data.split('.')[1], 'base64').toString());
          if (obj.form_id === ENUM.FORM_ID.ESG) {
            const data = {
              STT: acc.esgArr.length + 1,
              'Công cụ đánh giá': 'ESG',
              'B15. Thời gian đánh giá': handleTime(formData.data.organizationProfile.evaluatedDate, 'DD-MM-YYYY HH:mm:ss'),
              'B1. Tên doanh nghiệp': formData.data.organizationProfile.companyName,
              'B2. Mã số doanh nghiệp': formData.data.organizationProfile.taxCode,
              'A1. Tổng điểm': formData.data.result.total,
              'A2. Xếp hạng': formData.data.result.rate,
              'A3. Tổng điểm Môi trường (E)': formData.data.result.environment.point,
              'A4. Tổng điểm Xã hội (S)': formData.data.result.social.point,
              'A5. Tổng điểm Quản trị (G)': formData.data.result.governance.point,
              'B3. Năm thành lập': formData.data.organizationProfile.foundedYear,
              'B4. Địa chỉ đăng ký kinh doanh (Đầy đủ)': formData.data.organizationProfile.addressCompany,
              'B5. Trụ sở chính (Tỉnh/thành)': formData.data.organizationProfile.firstManufactureFactory,
              'B6. Tên các tỉnh/thành phố có cơ sở sản xuất, kinh doanh của doanh nghiệp khác với địa chỉ đăng ký kinh doanh (nếu có)': '',
              'B7. Loại hình đăng ký kinh doanh': formData.data.organizationProfile.businessModel !== 'OTHER' ? formData.data.organizationProfile.businessModel : '',
              'B7a. Loại hình đăng ký kinh doanh khác (nếu có)': formData.data.organizationProfile.businessModel === 'OTHER' ? formData.data.organizationProfile.businessModelOtherInput : '',
              'B8.1a. Tổng số nhân viên toàn thời gian': formData.data.organizationProfile.fullTimeEmployees,
              'B8.1b. Số lượng nhân viên nữ toàn thời gian': formData.data.organizationProfile.femaleFullTimeEmployees,
              'B8.2a. Tổng số nhân viên bán thời gian': formData.data.organizationProfile.partTimeEmployees,
              'B8.2b. Số lượng nhân viên nữ bán thời gian': formData.data.organizationProfile.femalePartTimeEmployees,
              'B8.3a. Tổng số nhân viên thời vụ': formData.data.organizationProfile.seasonalEmployees,
              'B8.3b. Số lượng nhân viên nữ thời vụ': formData.data.organizationProfile.femaleSeasonalEmployees,
              'B8.4a. Tổng số cán bộ cấp quản lý (từ cấp trưởng phòng/ trưởng bộ phận trở lên)': formData.data.organizationProfile.numberManagers,
              'B8.4b. Số lượng nữ cán bộ cấp quản lý (từ cấp trưởng phòng/ trưởng bộ phận trở lên)': formData.data.organizationProfile.numberFemaleManagers,
              'B8.5. Tổng số lao động vị thành niên (nếu có)': formData.data.organizationProfile.equalFifteenAndUnderEighteenEmployees,
              'B9.1. Doanh nghiệp có phải là doanh nghiệp do phụ nữ làm chủ không?': formData.data.organizationProfile.b6Value,
              'B9.2. Doanh nghiệp có phải là doanh nghiệp do phụ nữ trực tiếp điều hành không?': formData.data.organizationProfile.b7Value,
              'B11. Nhóm ngành kinh doanh (Sản xuất/Phi sản xuất)': formData.data.organizationProfile.businessModel !== 'OTHER' ? formData.data.organizationProfile.businessModel : formData.data.organizationProfile.businessModelOtherInput,
              'B12. Năm doanh nghiệp bắt đầu triển khai áp dụng ESG (nếu đã triển khai)': formData.data.organizationProfile.startedESGYear ? handleTime(formData.data.organizationProfile.startedESGYear, 'YYYY') : '',
              'B13. Website doanh nghiệp': formData.data.organizationProfile.websiteCompany,
              'B14.1. Lãnh đạo DN - Họ và tên': formData.data.organizationProfile.fullNameManager,
              'B14.2. Lãnh đạo DN - Vị trí công tác': formData.data.organizationProfile.workPlaceManager,
              'B14.3. Lãnh đạo DN - Email': formData.data.organizationProfile.emailManager,
              'B14.4. Lãnh đạo DN - SĐT': formData.data.organizationProfile.phoneNumberManager,
              'B16.1. Người thực hiện đánh giá - Họ và tên': formData.data.organizationProfile.fullName,
              'B16.2. Người thực hiện đánh giá - Vị trí công tác': formData.data.organizationProfile.workPlace,
              'B16.3. Người thực hiện đánh giá - Email': formData.data.organizationProfile.email,
              'B16.4. Người thực hiện đánh giá - SĐT': formData.data.organizationProfile.phoneNumber,
              'E1. Doanh nghiệp có chính sách quản lý, giám sát và đánh giá tác động môi trường và công bố ra bên ngoài không? (ví dụ trên website của doanh nghiệp)': EnvironmentQuestions[formData.data.answers[0].question].answers[formData.data.answers[0].answer].answer,
              'E2. Trong 12 tháng gần nhất, doanh nghiệp có bị xử phạt vi phạm liên quan tới môi trường không?': EnvironmentQuestions[formData.data.answers[1].question].answers[formData.data.answers[1].answer].answer,
              'E3. Trong 12 tháng gần nhất, doanh nghiệp có thực hiện báo cáo và công bố thông tin về công tác quản lý môi trường không?': EnvironmentQuestions[formData.data.answers[2].question].answers[formData.data.answers[2].answer].answer,
              'E4. Trong 12 tháng gần nhất, doanh nghiệp có thực hiện kiểm toán các báo cáo môi trường không?': EnvironmentQuestions[formData.data.answers[3].question].answers[formData.data.answers[3].answer].answer,
              'E5. Doanh nghiệp có nhân sự phụ trách về vấn đề môi trường không?': EnvironmentQuestions[formData.data.answers[4].question].answers[formData.data.answers[4].answer].answer,
              'E6. Trong 12 tháng gần nhất, doanh nghiệp có tập huấn nội bộ chính sách môi trường của doanh nghiệp không?': EnvironmentQuestions[formData.data.answers[5].question].answers[formData.data.answers[5].answer].answer,
              'E7. Doanh nghiệp có tiêu chí/ tiêu chuẩn môi trường cho nhà cung ứng không?': EnvironmentQuestions[formData.data.answers[6].question].answers[formData.data.answers[6].answer].answer,
              'E8. Trong 12 tháng gần nhất, doanh nghiệp có tái chế, tái sử dụng nguyên vật liệu đầu vào dư thừa hoặc nguyên vật liệu phế thải từ quá trình sản xuất không?': EnvironmentQuestions[formData.data.answers[7].question].answers[formData.data.answers[7].answer].answer,
              'E9. Trong 12 tháng gần nhất, doanh nghiệp có theo dõi và thống kê năng lượng tiêu thụ, năng lượng tái tạo không?': EnvironmentQuestions[formData.data.answers[8].question].answers[formData.data.answers[8].answer].answer,
              'E10. Trong 12 tháng gần nhất, doanh nghiệp có theo dõi và thống kê lượng nước đầu vào (nước mặt, nước sâu), nước tuần hoàn và nước tái sử dụng không?': EnvironmentQuestions[formData.data.answers[9].question].answers[formData.data.answers[9].answer].answer,
              'E11. Trong 12 tháng gần nhất, doanh nghiệp có đánh giá và giám sát các hoạt động của doanh nghiệp mà có tác động đáng kể đến đa dạng sinh học không?': EnvironmentQuestions[formData.data.answers[10].question].answers[formData.data.answers[10].answer].answer,
              'E12. Trong 12 tháng gần nhất, doanh nghiệp có báo cáo chi tiết về lượng khí phát thải nhà kính không?': EnvironmentQuestions[formData.data.answers[11].question].answers[formData.data.answers[11].answer].answer,
              'E13. Trong 12 tháng gần nhất, doanh nghiệp có báo cáo chi tiết về lượng nước thải không?': EnvironmentQuestions[formData.data.answers[12].question].answers[formData.data.answers[12].answer].answer,
              'E14. Trong 12 tháng gần nhất, doanh nghiệp có báo cáo đầy đủ về lượng chất thải, bao gồm chất thải nguy hại, chất thải không nguy hại, và phương pháp xử lý chất thải không?': EnvironmentQuestions[formData.data.answers[13].question].answers[formData.data.answers[13].answer].answer,
              'E15. Trong 12 tháng gần nhất, doanh nghiệp có báo cáo đầy đủ việc vận chuyển chất thải nguy hại, bao gồm cách thức vận chuyển, loại chất thải nguy hại và tổng trọng lượng được vận chuyển theo từng địa điểm phát sinh không?': EnvironmentQuestions[formData.data.answers[14].question].answers[formData.data.answers[14].answer].answer,
              'E16. Trong 12 tháng gần nhất, doanh nghiệp có theo dõi và báo cáo về tỷ trọng các loại nguyên vật liệu có thể tái chế trong cơ cấu sản phẩm không? (bao gồm cả nguyên liệu đóng gói trong quá trình phân phối)': EnvironmentQuestions[formData.data.answers[15].question].answers[formData.data.answers[15].answer].answer,
              'S1. Doanh nghiệp có ký kết đầy đủ hợp đồng lao động với tất cả người lao động theo quy định của pháp luật không?': SocialQuestions[formData.data.answers[16].question].answers[formData.data.answers[16].answer].answer,
              'S2. Doanh nghiệp có xây dựng quy chế trả lương cho người lao động và chi trả mức lương tối thiểu theo quy định của pháp luật không?': SocialQuestions[formData.data.answers[17].question].answers[formData.data.answers[17].answer].answer,
              'S3. Trong 12 tháng gần nhất, doanh nghiệp có lập báo cáo thống kê đầy đủ tỷ lệ người lao động toàn thời gian thôi việc và tỷ lệ người lao động toàn thời gian được thuê mới không?': SocialQuestions[formData.data.answers[18].question].answers[formData.data.answers[18].answer].answer,
              'S4. Trong 12 tháng gần nhất, doanh nghiệp có thực hiện đầy đủ các chế độ phúc lợi cho người lao động toàn thời gian không?': SocialQuestions[formData.data.answers[19].question].answers[formData.data.answers[19].answer].answer,
              'S5. Doanh nghiệp có lập báo cáo thống kê đầy đủ tỷ lệ người lao động toàn thời gian nghỉ thai sản, quay trở lại làm việc và giữ được việc sau 12 tháng không?': SocialQuestions[formData.data.answers[20].question].answers[formData.data.answers[20].answer].answer,
              'S6. Trong 12 tháng gần nhất, doanh nghiệp có tuân thủ thời gian làm việc theo luật lao động bao gồm cả trả lương làm thêm giờ, làm ca đêm và làm việc vào ngày lễ, ngày nghỉ chính thức cho người lao động không?': SocialQuestions[formData.data.answers[21].question].answers[formData.data.answers[21].answer].answer,
              'S7. Trong 12 tháng gần nhất, doanh nghiệp có thông báo cho người lao động về những thay đổi trong hoạt động của doanh nghiệp theo như thoả thuận giữa doanh nghiệp và người lao động không?': SocialQuestions[formData.data.answers[22].question].answers[formData.data.answers[22].answer].answer,
              'S8. Doanh nghiệp có nhân sự phụ trách về các vấn đề an toàn và sức khoẻ nghề nghiệp không?': SocialQuestions[formData.data.answers[23].question].answers[formData.data.answers[23].answer].answer,
              'S9. Trong 12 tháng gần nhất, doanh nghiệp có xảy ra tai nạn lao động không?': SocialQuestions[formData.data.answers[24].question].answers[formData.data.answers[24].answer].answer,
              'S10. Trong 12 tháng gần nhất, doanh nghiệp có báo cáo chi tiết về tỷ lệ người lao động có nguy cơ cao mắc các bệnh nghề nghiệp không?': SocialQuestions[formData.data.answers[25].question].answers[formData.data.answers[25].answer].answer,
              'S11. Trong 12 tháng gần nhất, doanh nghiệp có trao đổi chính thức với Công đoàn hoặc các bên liên quan về các vấn đề sức khỏe và an toàn cho người lao động không?': SocialQuestions[formData.data.answers[26].question].answers[formData.data.answers[26].answer].answer,
              'S12. Trong 12 tháng gần nhất, doanh nghiệp có tập huấn cho người lao động về các chính sách của doanh nghiệp về an toàn và sức khoẻ không?': SocialQuestions[formData.data.answers[27].question].answers[formData.data.answers[27].answer].answer,
              'S13. Doanh nghiệp có tập huấn nâng cao trình độ chuyên môn cho người lao động không?': SocialQuestions[formData.data.answers[28].question].answers[formData.data.answers[28].answer].answer,
              'S14. Trong 12 tháng gần nhất, doanh nghiệp có đánh giá hiệu quả công việc và phát triển nghề nghiệp của người lao động không?': SocialQuestions[formData.data.answers[29].question].answers[formData.data.answers[29].answer].answer,
              'S15. Trong 12 tháng gần nhất, doanh nghiệp có lập báo cáo thống kê chi tiết sự đa dạng của toàn bộ người lao động trong doanh nghiệp và trong đội ngũ quản lý (trong Hội đồng Quản trị hoặc Ban Giám đốc) theo giới tính, theo nhóm tuổi (dưới 30 tuổi, 30-50 tuổi, trên 50 tuổi), theo nhóm dân tộc (thiểu số), nhóm dễ bị tổn thương không?': SocialQuestions[formData.data.answers[30].question].answers[formData.data.answers[30].answer].answer,
              'S16. Trong 12 tháng gần nhất, doanh nghiệp có lập báo cáo thống kê chi tiết về tỷ lệ tổng thu nhập của người lao động nữ so với người lao động nam giới theo từng cách thức phân loại (theo chức vụ, theo bộ phận phòng ban, theo phạm vi công việc, theo vị trí cơ sở sản xuất kinh doanh) không?': SocialQuestions[formData.data.answers[31].question].answers[formData.data.answers[31].answer].answer,
              'S17. Trong 12 tháng gần nhất, doanh nghiệp có xảy ra vụ việc phân biệt đối xử nào không?': SocialQuestions[formData.data.answers[32].question].answers[formData.data.answers[32].answer].answer,
              'S18. Trong 12 tháng gần nhất, những vụ việc phân biệt đối xử được báo cáo có được phân loại không?': SocialQuestions[formData.data.answers[33].question].answers[formData.data.answers[33].answer].answer,
              'S19. Doanh nghiệp có cơ chế tố giác và bảo vệ danh tính và sự an toàn của người tố giác về các vấn đề phân biệt đối xử, bất bình đẳng, quấy rối tình dục không?': SocialQuestions[formData.data.answers[34].question].answers[formData.data.answers[34].answer].answer,
              'S20. Doanh nghiệp có chính sách khuyến khích sự tham gia của nhóm yếu thế vào chuỗi giá trị của doanh nghiệp không?': SocialQuestions[formData.data.answers[35].question].answers[formData.data.answers[35].answer].answer,
              'S21. Doanh nghiệp có thúc đẩy người lao động tham gia công đoàn, các tổ chức đoàn thể khác và các hoạt động thương lượng tập thể hợp pháp không?': SocialQuestions[formData.data.answers[36].question].answers[formData.data.answers[36].answer].answer,
              'S22. Trong 12 tháng gần nhất, doanh nghiệp có sử dụng lao động từ đủ 13 đến dưới 15 tuổi làm các loại việc không thuộc danh mục cho phép (được quy định tại Phụ lục II, Thông tư 09/2020/TT-BLĐTBXH) không?': SocialQuestions[formData.data.answers[37].question].answers[formData.data.answers[37].answer].answer,
              'S23. Trong 12 tháng gần nhất, doanh nghiệp có sử dụng lao động từ đủ 15 đến dưới 18 tuổi làm các loại công việc trong danh mục cấm (được quy định tại Điều 147 Bộ Luật Lao động) không?': SocialQuestions[formData.data.answers[38].question].answers[formData.data.answers[38].answer].answer,
              'S24. Trong 12 tháng gần nhất, doanh nghiệp có sử dụng lao động cưỡng bức hay bắt buộc không?': SocialQuestions[formData.data.answers[39].question].answers[formData.data.answers[39].answer].answer,
              'S25. Trong 12 tháng gần nhất, doanh nghiệp có đào tạo cho người lao động về quyền lợi khi làm việc tại doanh nghiệp và các quyền dân sự cơ bản khác theo quy định pháp luật không?': SocialQuestions[formData.data.answers[40].question].answers[formData.data.answers[40].answer].answer,
              'S26. Trong 12 tháng gần nhất, doanh nghiệp có tổ chức các hoạt động gắn kết với cộng đồng địa phương, có sự tham gia của cộng đồng địa phương hay tác động tích cực đến cộng đồng địa phương không?': SocialQuestions[formData.data.answers[41].question].answers[formData.data.answers[41].answer].answer,
              'S27. Doanh nghiệp có tiêu chí/ tiêu chuẩn xã hội cho nhà cung cấp không?': SocialQuestions[formData.data.answers[42].question].answers[formData.data.answers[42].answer].answer,
              'S28. Doanh nghiệp có quy trình đánh giá nhằm đảm bảo sản phẩm, dịch vụ an toàn cho khách hàng không?': SocialQuestions[formData.data.answers[43].question].answers[formData.data.answers[43].answer].answer,
              'S29. Trong 12 tháng gần nhất, doanh nghiệp có các vụ việc vi phạm các quy định về an toàn của sản phẩm với sức khỏe của người sử dụng không?': SocialQuestions[formData.data.answers[44].question].answers[formData.data.answers[44].answer].answer,
              'S30. Doanh nghiệp có thông báo đầy đủ và đúng thông tin sản phẩm, dịch vụ đến khách hàng không?': SocialQuestions[formData.data.answers[45].question].answers[formData.data.answers[45].answer].answer,
              'S31. Trong 12 tháng gần nhất, doanh nghiệp có bị khiếu nại liên quan đến vi phạm bảo mật thông tin khách hàng không?': SocialQuestions[formData.data.answers[46].question].answers[formData.data.answers[46].answer].answer,
              'G1. Doanh nghiệp có chính sách phát triển bền vững rõ ràng và cam kết thực hiện các chính sách và hoạt động hướng đến phát triển bền vững không?': GovernanceQuestions[formData.data.answers[47].question].answers[formData.data.answers[47].answer].answer,
              'G2. Cơ cấu Hội đồng quản trị hoặc Hội đồng thành viên hoặc Ban giám đốc có đa dạng về kiến thức và kinh nghiệm về pháp luật, tài chính, lĩnh vực hoạt động kinh doanh của doanh nghiệp không?': GovernanceQuestions[formData.data.answers[48].question].answers[formData.data.answers[48].answer].answer,
              'G3. Cơ cấu Hội đồng quản trị hoặc Hội đồng thành viên hoặc Ban Giám đốc có đa dạng về giới không?': GovernanceQuestions[formData.data.answers[49].question].answers[formData.data.answers[49].answer].answer,
              'G4. Trong 12 tháng gần nhất, Hội đồng quản trị hoặc Hội đồng thành viên hoặc Ban Giám đốc có ban hành quy trình theo dõi, đánh giá công tác quản trị doanh nghiệp và việc tuân thủ pháp luật về quản trị doanh nghiệp không?': GovernanceQuestions[formData.data.answers[50].question].answers[formData.data.answers[50].answer].answer,
              'G5. Doanh nghiệp có chính sách giới hạn về số năm đương nhiệm của thành viên Hội đồng quản trị hoặc Hội đồng thành viên hoặc Ban Giám đốc không?': GovernanceQuestions[formData.data.answers[51].question].answers[formData.data.answers[51].answer].answer,
              'G6. Trong 12 tháng gần nhất, doanh nghiệp có thiết lập các tiêu chí lựa chọn công ty kiểm toán độc lập, có thực hiện đánh giá chất lượng công việc của kiểm toán độc lập, và có thiết lập quy trình để theo dõi việc thực hiện các khuyến nghị mà kiểm toán độc lập đưa ra không?': GovernanceQuestions[formData.data.answers[52].question].answers[formData.data.answers[52].answer].answer,
              'G7. Doanh nghiệp có ban hành và công bố Bộ quy tắc ứng xử/Đạo đức không?': GovernanceQuestions[formData.data.answers[53].question].answers[formData.data.answers[53].answer].answer,
              'G8. Doanh nghiệp có cá nhân, thành viên của ban điều hành chịu trách nhiệm tiếp nhận ý kiến từ các bên liên quan không?': GovernanceQuestions[formData.data.answers[54].question].answers[formData.data.answers[54].answer].answer,
              'G9. Doanh nghiệp có cơ chế tiếp nhận tố giác, khiếu nại, góp ý và giải quyết tố giác, khiếu nại, ý kiến từ các bên liên quan về các hoạt động của doanh nghiệp không?': GovernanceQuestions[formData.data.answers[55].question].answers[formData.data.answers[55].answer].answer,
              'G10. Trong 12 tháng gần nhất, doanh nghiệp có xây dựng và công bố Báo cáo đánh giá liên quan đến trách nhiệm về môi trường, xã hội và tình hình tài chính không?': GovernanceQuestions[formData.data.answers[56].question].answers[formData.data.answers[56].answer].answer,
              'G11. Trong 12 tháng gần nhất, doanh nghiệp có thường xuyên cập nhật các nội dung trên website doanh nghiệp và bảo đảm mọi thông tin được cập nhật đều bằng cả tiếng Việt và tiếng Anh không?': GovernanceQuestions[formData.data.answers[57].question].answers[formData.data.answers[57].answer].answer,
              'G12. Trong 12 tháng gần nhất, tiền lương của người điều hành hoạt động kinh doanh (Giám đốc, Tổng giám đốc, v.v) có được thể hiện thành mục riêng trong Báo cáo tài chính hàng năm của doanh nghiệp và được công khai hoặc báo cáo Đại hội đồng cổ đông, hoặc Ban giám đốc tại cuộc họp thường niên không?': GovernanceQuestions[formData.data.answers[58].question].answers[formData.data.answers[58].answer].answer,
              'G13. Báo cáo thường niên có quy chế rõ ràng về lương, thưởng, các khoản thu nhập khác, quỹ phúc lợi và chi phí mà doanh nghiệp chi trả, thanh toán cho từng thành viên trong Hội đồng quản trị hoặc Hội đồng thành viên hoặc Ban Giám đốc không?': GovernanceQuestions[formData.data.answers[59].question].answers[formData.data.answers[59].answer].answer,
              'G14. Báo cáo thường niên có công bố phát biểu, tuyên bố khẳng định sự tuân thủ đầy đủ của doanh nghiệp với các quy tắc quản trị doanh nghiệp và trong trường hợp có việc không tuân thủ, báo cáo có nêu rõ và giải thích lý do cho mỗi vấn đề đó không?': GovernanceQuestions[formData.data.answers[60].question].answers[formData.data.answers[60].answer].answer,
              'G15. Doanh nghiệp có thành lập ít nhất một trong các tiểu ban sau: tiểu ban chính sách phát triển, tiểu ban nhân sự, tiểu ban lương thưởng hay các đơn vị tương đương không?': GovernanceQuestions[formData.data.answers[61].question].answers[formData.data.answers[61].answer].answer,
              'G16. Trong 12 tháng gần nhất, các tiểu ban trực thuộc Hội đồng quản trị có phải do Thành viên độc lập làm trưởng ban không?': GovernanceQuestions[formData.data.answers[62].question].answers[formData.data.answers[62].answer].answer,
              'G17. Doanh nghiệp có đảm bảo tối thiểu 20% tổng số thành viên của Hội đồng quản trị là thành viên độc lập không?': GovernanceQuestions[formData.data.answers[63].question].answers[formData.data.answers[63].answer].answer,
              'G18. Trong 12 tháng gần nhất, báo cáo đánh giá về hoạt động của Hội đồng quản trị có phải do thành viên độc lập đánh giá không?': GovernanceQuestions[formData.data.answers[64].question].answers[formData.data.answers[64].answer].answer,
              'G19. Doanh nghiệp có thành lập bộ phận Kiểm toán nội bộ không?': GovernanceQuestions[formData.data.answers[65].question].answers[formData.data.answers[65].answer].answer,
              'G20. Trong trường hợp doanh nghiệp bắt buộc phải có Kiểm toán nội bộ theo pháp luật Việt Nam, danh sách các ứng viên kiểm toán có được công bố công khai không?': GovernanceQuestions[formData.data.answers[66].question].answers[formData.data.answers[66].answer].answer,
              'G21. Trong trường hợp doanh nghiệp bắt buộc phải có Ban Kiểm soát theo pháp luật Việt Nam, doanh nghiệp có thành lập Ban Kiểm soát không?': GovernanceQuestions[formData.data.answers[67].question].answers[formData.data.answers[67].answer].answer,
              'G22. Trong năm qua, chủ tịch Ủy ban kiểm toán (hoặc Ban Kiểm toán nội bộ) có phải là Thành viên độc lập Hội đồng quản trị không?': GovernanceQuestions[formData.data.answers[68].question].answers[formData.data.answers[68].answer].answer,
              'G23. Doanh nghiệp có thành lập Ủy ban Quản lý rủi ro không?': GovernanceQuestions[formData.data.answers[69].question].answers[formData.data.answers[69].answer].answer,
              'G24. Chủ tịch Ủy ban Quản lý rủi ro có phải là thành viên độc lập Hội đồng quản trị không?': GovernanceQuestions[formData.data.answers[70].question].answers[formData.data.answers[70].answer].answer,
              'G25. Doanh nghiệp có bộ phận chịu trách nhiệm giám sát truyền thông ra bên ngoài và lưu trữ thông tin theo quy định của pháp luật không?': GovernanceQuestions[formData.data.answers[71].question].answers[formData.data.answers[71].answer].answer,
              'G26. Trong 12 tháng gần nhất, doanh nghiệp có công bố tính độc lập của thành viên Hội đồng quản trị không?': GovernanceQuestions[formData.data.answers[72].question].answers[formData.data.answers[72].answer].answer,
              'G27. Trong 12 tháng gần nhất, doanh nghiệp có ứng dụng công nghệ thông tin để cổ đông có thể tham dự và phát biểu ý kiến tại cuộc họp Đại hội đồng cổ đông một cách thuận lợi nhất, bao gồm hướng dẫn cổ đông biểu quyết thông qua họp Đại hội đồng cổ đông trực tuyến, bỏ phiếu điện tử hoặc hình thức điện tử khác?': GovernanceQuestions[formData.data.answers[73].question].answers[formData.data.answers[73].answer].answer,
              'G28. Trong 12 tháng gần nhất, tài liệu họp Đại Hội Đồng Cổ Đông có cung cấp thông tin về các ứng viên Hội đồng quản trị và Ban Kiểm Soát (nếu có) tối thiểu 10 ngày trước ngày khai mạc đại hội không?': GovernanceQuestions[formData.data.answers[74].question].answers[formData.data.answers[74].answer].answer,
              'G29. Trong thư mời tham dự Đại Hội Đồng Cổ Đông, cổ đông có được hướng dẫn để đóng góp ý kiến trong thời gian trước ngày tham dự đại hội về các vấn đề thảo luận trong chương trình nghị sự của Đại Hội Đồng Cổ Đông không?': GovernanceQuestions[formData.data.answers[75].question].answers[formData.data.answers[75].answer].answer,
              'G30. Trong 12 tháng gần nhất, doanh nghiệp có công bố và sử dụng tài liệu họp, biên bản họp, nghị quyết Đại Hội Đồng Cổ Đông bằng tiếng Việt và tiếng Anh không?': GovernanceQuestions[formData.data.answers[76].question].answers[formData.data.answers[76].answer].answer,
              'G31. Trong trường hợp doanh nghiệp bắt buộc phải có Kiểm toán độc lập theo pháp luật Việt Nam, doanh nghiệp có công bố đã bổ nhiệm một bên độc lập (kiểm tra, giám sát viên) là Kiểm toán độc lập không?': GovernanceQuestions[formData.data.answers[77].question].answers[formData.data.answers[77].answer].answer,
              'G32. Doanh nghiệp có xây dựng và công bố chính sách liên quan đến việc khiếu nại của cổ đông không?': GovernanceQuestions[formData.data.answers[78].question].answers[formData.data.answers[78].answer].answer,
              'G33. Trong 12 tháng gần nhất, Đại hội đồng cổ đông có thông qua thù lao hoặc lương thưởng, chi phí, các khoản lợi ích do doanh nghiệp thanh toán cho từng thành viên Hội đồng quản trị không?': GovernanceQuestions[formData.data.answers[79].question].answers[formData.data.answers[79].answer].answer,
              'G34. Doanh nghiệp có thực hiện chi trả cổ tức đầy đủ trong thời hạn 06 tháng, kể từ ngày kết thúc họp Đại hội đồng cổ đông thường niên không?': GovernanceQuestions[formData.data.answers[80].question].answers[formData.data.answers[80].answer].answer,
            }
            acc.esgArr.push(data)
          } else {
            console.log(acc)
            const data = {
              STT: acc.ceArr.length + 1,
              'Công cụ đánh giá': 'CE',
              'B15. Thời gian đánh giá': handleTime(formData.data.organizationProfile.evaluatedDate, 'DD-MM-YYYY HH:mm:ss'),
              'B1. Tên doanh nghiệp': formData.data.organizationProfile.companyName,
              'B2. Mã số doanh nghiệp': formData.data.organizationProfile.taxCode,
              'A1. Tổng điểm': formData.data.result.total,
              'A2. Xếp hạng': formData.data.result.rate,
              'A3. Tổng điểm Nhóm TC 1 (Tầm nhìn và chiến lược)': formData.data.result.first_criteria.point,
              'A4. Tổng điểm Nhóm TC 2 (Trong sản xuất và tiền sản xuất)': formData.data.result.second_criteria.point,
              'A5. Tổng điểm Nhóm TC 3 (Sau bán hàng)': formData.data.result.third_criteria.point,
              'B3. Năm thành lập': formData.data.organizationProfile.foundedYear,
              'B4. Địa chỉ đăng ký kinh doanh (Đầy đủ)': formData.data.organizationProfile.addressCompany,
              'B5. Trụ sở chính (Tỉnh/thành)': formData.data.organizationProfile.firstManufactureFactory,
              'B6. Tên các tỉnh/thành phố có cơ sở sản xuất, kinh doanh của doanh nghiệp khác với địa chỉ đăng ký kinh doanh (nếu có)': '',
              'B7. Loại hình đăng ký kinh doanh': formData.data.organizationProfile.businessModel !== 'OTHER' ? formData.data.organizationProfile.businessModel : '',
              'B7a. Loại hình đăng ký kinh doanh khác (nếu có)': formData.data.organizationProfile.businessModel === 'OTHER' ? formData.data.organizationProfile.businessModelOtherInput : '',
              'B8.1a. Tổng số nhân viên toàn thời gian': formData.data.organizationProfile.fullTimeEmployees,
              'B8.1b. Số lượng nhân viên nữ toàn thời gian': formData.data.organizationProfile.femaleFullTimeEmployees,
              'B8.2a. Tổng số nhân viên bán thời gian': formData.data.organizationProfile.partTimeEmployees,
              'B8.2b. Số lượng nhân viên nữ bán thời gian': formData.data.organizationProfile.femalePartTimeEmployees,
              'B8.3a. Tổng số nhân viên thời vụ': formData.data.organizationProfile.seasonalEmployees,
              'B8.3b. Số lượng nhân viên nữ thời vụ': formData.data.organizationProfile.femaleSeasonalEmployees,
              'B8.4a. Tổng số cán bộ cấp quản lý (từ cấp trưởng phòng/ trưởng bộ phận trở lên)': formData.data.organizationProfile.numberManagers,
              'B8.4b. Số lượng nữ cán bộ cấp quản lý (từ cấp trưởng phòng/ trưởng bộ phận trở lên)': formData.data.organizationProfile.numberFemaleManagers,
              'B8.5. Tổng số lao động vị thành niên (nếu có)': formData.data.organizationProfile.equalFifteenAndUnderEighteenEmployees,
              'B9.1. Doanh nghiệp có phải là doanh nghiệp do phụ nữ làm chủ không?': formData.data.organizationProfile.b6Value,
              'B9.2. Doanh nghiệp có phải là doanh nghiệp do phụ nữ trực tiếp điều hành không?': formData.data.organizationProfile.b7Value,
              'B11. Nhóm ngành kinh doanh (Sản xuất/Phi sản xuất)': formData.data.organizationProfile.businessModel !== 'OTHER' ? formData.data.organizationProfile.businessModel : formData.data.organizationProfile.businessModelOtherInput,
              'B12. Năm doanh nghiệp bắt đầu triển khai nguyên tắc KTTH (nếu đã triển khai)': formData.data.organizationProfile.startedESGYear ? handleTime(formData.data.organizationProfile.startedESGYear, 'YYYY') : '',
              'B13. Website doanh nghiệp': formData.data.organizationProfile.websiteCompany,
              'B14.1. Lãnh đạo DN - Họ và tên': formData.data.organizationProfile.fullNameManager,
              'B14.2. Lãnh đạo DN - Vị trí công tác': formData.data.organizationProfile.workPlaceManager,
              'B14.3. Lãnh đạo DN - Email': formData.data.organizationProfile.emailManager,
              'B14.4. Lãnh đạo DN - SĐT': formData.data.organizationProfile.phoneNumberManager,
              'B16.1. Người thực hiện đánh giá - Họ và tên': formData.data.organizationProfile.fullName,
              'B16.2. Người thực hiện đánh giá - Vị trí công tác': formData.data.organizationProfile.workPlace,
              'B16.3. Người thực hiện đánh giá - Email': formData.data.organizationProfile.email,
              'B16.4. Người thực hiện đánh giá - SĐT': formData.data.organizationProfile.phoneNumber,
              'FC1. Chiến lược kinh doanh của doanh nghiệp có đề cập đến áp dụng KTTH không?': FirstCriteria[formData.data.answers[0].question].answers[formData.data.answers[0].answer].answer,
              'FC2. Doanh nghiệp có đề ra các mục tiêu cụ thể về KTTH trong hoạt động sản xuất, kinh doanh không?': FirstCriteria[formData.data.answers[1].question].answers[formData.data.answers[1].answer].answer,
              'FC3. Doanh nghiệp có kế hoạch thực hiện KTTH không?': FirstCriteria[formData.data.answers[2].question].answers[formData.data.answers[2].answer].answer,
              'FC4. Trong vòng 2 năm gần đây, doanh nghiệp có từng bị xử lý hành chính do vi phạm quy định pháp luật trong lĩnh vực môi trường không?': FirstCriteria[formData.data.answers[3].question].answers[formData.data.answers[3].answer].answer,
              'FC5. Doanh nghiệp có thực hiện đánh giá vòng đời sản phẩm (LCA) theo ISO 14040 và ISO 14044 để đánh giá tác động môi trường tổng thể không?': FirstCriteria[formData.data.answers[4].question].answers[formData.data.answers[4].answer].answer,
              'FC6. Doanh nghiệp có cử nhân viên tham gia các chương trình đào tạo, khoá học có liên quan về KTTH không?': FirstCriteria[formData.data.answers[5].question].answers[formData.data.answers[5].answer].answer,
              'FC7. Doanh nghiệp có cán bộ chuyên trách về môi trường không?': FirstCriteria[formData.data.answers[6].question].answers[formData.data.answers[6].answer].answer,
              'SC1. Doanh nghiệp có đề ra mục tiêu định lượng về tỷ lệ thành phần của sản phẩm có thể được tái chế/tái sử dụng không?': SecondCriteria[formData.data.answers[7].question].answers[formData.data.answers[7].answer].answer,
              'SC2. Các sản phẩm/dịch vụ của doanh nghiệp có được thiết kế theo hướng tuần hoàn không?': SecondCriteria[formData.data.answers[8].question].answers[formData.data.answers[8].answer].answer,
              'SC3. Thành phần trong các sản phẩm/dịch vụ của doanh nghiệp có chứa hóa chất thuộc danh mục chất bị cấm không?': SecondCriteria[formData.data.answers[9].question].answers[formData.data.answers[9].answer].answer,
              'SC4. Sản phẩm và/hoặc bao bì sản phẩm của doanh nghiệp có chứa các hóa chất độc hại theo phân loại tại Nghị định số 82/2022/NĐ-CP không?': SecondCriteria[formData.data.answers[10].question].answers[formData.data.answers[10].answer].answer,
              'SC5. Sản phẩm của doanh nghiệp có được thiết kế theo hướng tối ưu hóa công năng để đảm bảo sản phẩm có tính đa dụng, đa năng không?': SecondCriteria[formData.data.answers[11].question].answers[formData.data.answers[11].answer].answer,
              'SC6. Sản phẩm của doanh nghiệp có được thiết kế theo hướng kéo dài tuổi đời sử dụng và có thể được sử dụng nhiều lần không?': SecondCriteria[formData.data.answers[12].question].answers[formData.data.answers[12].answer].answer,
              'SC7. Sản phẩm của doanh nghiệp có được thiết kế theo hướng dễ tháo rời, dễ tái chế/tái sử dụng không?': SecondCriteria[formData.data.answers[13].question].answers[formData.data.answers[13].answer].answer,
              'SC8. Sản phẩm của doanh nghiệp có được thiết kế theo hướng tối ưu hóa hiệu suất sử dụng hoặc tiêu thụ năng lượng (ví dụ có biến tần, công nghệ ánh sáng lạnh…) không?': SecondCriteria[formData.data.answers[14].question].answers[formData.data.answers[14].answer].answer,
              'SC9. Doanh nghiệp có thực hành mua sắm xanh không?': SecondCriteria[formData.data.answers[15].question].answers[formData.data.answers[15].answer].answer,
              'SC10. Doanh nghiệp có lựa chọn các nguyên vật liệu có khả năng tái chế/tái sử dụng được không?': SecondCriteria[formData.data.answers[16].question].answers[formData.data.answers[16].answer].answer,
              'SC11. Tỷ trọng vật liệu (tính theo khối lượng) cấu thành sản phẩm có thể tái chế': SecondCriteria[formData.data.answers[17].question].answers[formData.data.answers[17].answer].answer,
              'SC12. Tỷ trọng vật liệu (tính theo khối lượng) cấu thành sản phẩm có thể tái sử dụng': SecondCriteria[formData.data.answers[18].question].answers[formData.data.answers[18].answer].answer,
              'SC13. Tỷ trọng thành phần bao bì từ các nguồn vật liệu tái chế hoặc tái sử dụng': SecondCriteria[formData.data.answers[19].question].answers[formData.data.answers[19].answer].answer,
              'SC14. Sản phẩm có sử dụng các nguyên liệu hiếm không?': SecondCriteria[formData.data.answers[20].question].answers[formData.data.answers[20].answer].answer,
              'SC15. Trong năm ngay trước năm đánh giá, tỷ trọng (theo khối lượng) vật liệu bị thất thoát trong quá trình sản xuất là bao nhiêu?': SecondCriteria[formData.data.answers[21].question].answers[formData.data.answers[21].answer].answer,
              'SC16. Doanh nghiệp có tái sử dụng nước thải sau khi xử lý không?': SecondCriteria[formData.data.answers[22].question].answers[formData.data.answers[22].answer].answer,
              'SC17. Trong năm ngay trước năm đánh giá, tỷ lệ tái sử dụng nước thải của doanh nghiệp là bao nhiêu?': SecondCriteria[formData.data.answers[23].question].answers[formData.data.answers[23].answer].answer,
              'SC18. Doanh nghiệp có hệ thống quản lý năng lượng không?': SecondCriteria[formData.data.answers[24].question].answers[formData.data.answers[24].answer].answer,
              'SC19. Trong năm ngay trước năm đánh giá, doanh nghiệp đã sử dụng bao nhiêu % năng lượng là năng lượng tái tạo cho hoạt động sản xuất': SecondCriteria[formData.data.answers[25].question].answers[formData.data.answers[25].answer].answer,
              'TC1. Trong năm ngay trước năm đánh giá, doanh nghiệp sử dụng bao nhiêu % năng lượng là năng lượng tái tạo trong hoạt động giao hàng?': ThirdCriteria[formData.data.answers[26].question].answers[formData.data.answers[26].answer].answer,
              'TC2. Trong năm ngay trước năm đánh giá, doanh nghiệp đã tái chế/tái sử dụng bao nhiêu % các vật liệu tiêu hao, công cụ để phục vụ vận chuyển và giao hàng?': ThirdCriteria[formData.data.answers[27].question].answers[formData.data.answers[27].answer].answer,
              'TC3. Doanh nghiệp có cung cấp/hỗ trợ dịch vụ sửa hoặc bảo trì sản phẩm sau khi bán hàng không?': ThirdCriteria[formData.data.answers[28].question].answers[formData.data.answers[28].answer].answer,
              'TC4. Doanh nghiệp có cung cấp thông tin chi tiết về sản phẩm/bao bì trên nhãn mác sản phẩm theo quy định tại Nghị định 111/2021/NĐ-CP  và Nghị định 43/2017/NĐ-CP không?': ThirdCriteria[formData.data.answers[29].question].answers[formData.data.answers[29].answer].answer,
              'TC5. Doanh nghiệp có kế hoạch tái chế sản phẩm được thu hồi sau khi khách hàng sử dụng không?': ThirdCriteria[formData.data.answers[30].question].answers[formData.data.answers[30].answer].answer,
              'TC6. Doanh nghiệp có giải pháp để khách hàng tiếp tục tái sử dụng sản phẩm đó sau khi được doanh nghiệp tái chế không?': ThirdCriteria[formData.data.answers[31].question].answers[formData.data.answers[31].answer].answer,
              'TC7. Doanh nghiệp có hệ thống quản lý thu hồi hoặc thu gom sản phẩm hoặc phần thải bỏ của sản phẩm để tái chế không?': ThirdCriteria[formData.data.answers[32].question].answers[formData.data.answers[32].answer].answer,
              'TC8. Doanh nghiệp có số liệu thống kê theo dõi tỷ lệ tái chế sản phẩm của mình không?': ThirdCriteria[formData.data.answers[33].question].answers[formData.data.answers[33].answer].answer,
              'TC9. Doanh nghiệp có công bố các hướng dẫn tái chế sản phẩm hoặc phần thải bỏ của sản phẩm sau khi sử dụng không?': ThirdCriteria[formData.data.answers[34].question].answers[formData.data.answers[34].answer].answer,
              'TC10. Trong năm ngay trước năm đánh giá, doanh nghiệp thu hồi bao nhiêu % sản phẩm và bao bì (để tái chế, tái sử dụng, sửa chữa, tái sản xuất, bán lại để tái chế, trực tiếp xử lý bằng biện pháp sinh học như hầm ủ khí sinh học hoặc làm phân bón vi sinh compost...)?': ThirdCriteria[formData.data.answers[35].question].answers[formData.data.answers[35].answer].answer,
              'TC11. Đối với các thành phần của sản phẩm sau sử dụng được đem đi tái chế, doanh nghiệp có đánh giá rủi ro sức khoẻ và môi trường của các vật liệu tái chế không?': ThirdCriteria[formData.data.answers[36].question].answers[formData.data.answers[36].answer].answer,
              'TC12. Sản phẩm và bao bì sản phẩm có chứa vi nhựa hoặc nhựa không tự phân hủy không?': ThirdCriteria[formData.data.answers[37].question].answers[formData.data.answers[37].answer].answer,
              'TC13. Doanh nghiệp có biện pháp ngăn ngừa hạt vi nhựa hoặc nhựa không tự phân hủy khi bị thải bỏ ra môi trường không?': ThirdCriteria[formData.data.answers[38].question].answers[formData.data.answers[38].answer].answer,
            }
            acc.ceArr.push(data)
          }
          return acc;
        }, {esgArr: [], ceArr: []})

        const worksheetESG = XLSX.utils.json_to_sheet(esgArr);
        const worksheetCE = XLSX.utils.json_to_sheet(ceArr);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheetESG, "ESG result sheet");
        XLSX.utils.book_append_sheet(workbook, worksheetCE, "CE result sheet");
        XLSX.writeFile(workbook, "Evaluated_Results.xlsx", {compression: true});
      })
      .catch(err => {
        console.log(err)
        showToast('error', 'Trích xuất dữ liệu thất bại')
      })
      .finally(() => exportLoading.value = false)
}
</script>

<template>
  <div class="mb-5">
    <BreadCrumb :routes="routes"/>
  </div>
  <TitlePage label="Quản lý kết quả đánh giá"/>

  <a-button @click="exportFile" :loading="exportLoading">
    Xuất Excel
  </a-button>

  <div class="mt-5">
    <a-table :columns="columns"
             :data-source="tableData"
             :pagination="false"
             :scroll="{ x: 1500, y: 1000 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'view'">
          <div class="hover:cursor-pointer text-blue-500"
               @click.prevent="showResult(record)">
            <font-awesome-icon icon="fa-solid fa-eye"/>
          </div>
        </template>
        <template v-else-if="column.key === 'evaluatedDate'">
          <span>{{ handleTime(record.organizationProfile.evaluatedDate, 'DD-MM-YYYY HH:mm:ss') }}</span>
        </template>
        <template v-else-if="column.key === 'formId'">
          <span>{{ mappingToolkit(record.formId) }}</span>
        </template>
      </template>
    </a-table>
    <div class="flex justify-end mt-2.5">
      <a-pagination v-model:current="current" v-model:pageSize="pageSizeState" :pageSizeOptions="['10', '20']"
                    :show-total="t => `Total ${numberWithComma(t)} items`" :total="total" show-size-changer
                    @change="handleTableChange" @showSizeChange="onShowSizeChange"/>
    </div>
  </div>
</template>
