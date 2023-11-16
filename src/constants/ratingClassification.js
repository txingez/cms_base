export const RatingClassification = {
    ESG: {
        C: {
            suggest: `<div style="font-weight: bolder">Doanh nghiệp thiếu hầu hết các yếu tố cơ bản về kinh doanh bền vững theo khung ESG.</div>
                  <div>Doanh nghiệp không đạt tiêu chuẩn nhận hỗ trợ của CP Doanh nghiệp đủ điều kiện tiếp cận các hỗ trợ chính sách theo Quyết định số 167/QĐ-TTg ngày 8/2/2022 về Chương trình hỗ trợ doanh nghiệp khu vực tư nhân kinh doanh bền vững giai đoạn 2022 -2025.</div>
                  <div>Doanh nghiệp cần lên kế hoạch và áp dụng càng sớm càng tốt các thực hành được nêu cụ thể tại từng câu hỏi, tập trung trước vào những câu hỏi trả lời đang được 0 điểm và không đòi hỏi nhiều nguồn lực để thực hiện.</div>`
        },
        B: {
            suggest: `<div style="font-weight: bolder">Doanh nghiệp đã thực hành tương đối các yếu tố cơ bản về kinh doanh bền vững theo khung ESG.</div>
                  <div>Doanh nghiệp có tiềm năng đạt tiêu chuẩn nhận hỗ trợ của CP Doanh nghiệp đủ điều kiện tiếp cận các hỗ trợ chính sách theo Quyết định số 167/QĐ-TTg ngày 8/2/2022 về Chương trình hỗ trợ doanh nghiệp khu vực tư nhân kinh doanh bền vững giai đoạn 2022 -2025.</div>
                  <div>Doanh nghiệp có thể bắt đầu áp dụng các thực hành mà ở câu hỏi tương ứng doanh nghiệp đang có câu trả lời ở mức 0 điểm hoặc chưa đạt mức điểm tối đa và tiếp tục cải thiện để đạt mức điểm cao hơn.</div>`
        },
        A: {
            suggest: `<div style="font-weight: bolder">Doanh nghiệp đã thực hành tốt các yếu tố cơ bản về kinh doanh bền vững theo khung ESG.</div>
                  <div>Doanh nghiệp có tiềm năng đạt tiêu chuẩn nhận hỗ trợ của CP Doanh nghiệp đủ điều kiện tiếp cận các hỗ trợ chính sách theo Quyết định số 167/QĐ-TTg ngày 8/2/2022 về Chương trình hỗ trợ doanh nghiệp khu vực tư nhân kinh doanh bền vững giai đoạn 2022 - 2025.</div>
                  <div> Doanh nghiệp tiếp tục thực hiện đầy đủ theo khung này và có thể cân nhắc áp dụng ở mức cao hơn theo các khung tham chiếu phổ biến khác như CSI, GRI, TCFD, v.v.</div>`
        }
    },

    NEC: {
        C: {
            suggest: `<div style="font-weight: bolder">Doanh nghiệp chưa có tầm nhìn và kế hoạch áp dụng nguyên tắc KTTH.</div>
                  <div>Doanh nghiệp không đạt tiêu chuẩn nhận hỗ trợ của CP Doanh nghiệp đủ điều kiện tiếp cận các hỗ trợ chính sách theo Quyết định số 167/QĐ-TTg ngày 8/2/2022 về Chương trình hỗ trợ doanh nghiệp khu vực tư nhân kinh doanh bền vững giai đoạn 2022 -2025.</div>		
                  <div>Để cải thiện, doanh nghiệp cần điều chỉnh mô hình kinh doanh, quy trình sản xuất, lồng ghép nhiều thực hành áp dụng nguyên tắc tuần hoàn hơn.</div>
                  <div>Doanh nghiệp nên tham gia các chương trình tư vấn đổi mới sáng tạo để nâng cao năng lực.</div>
                  <div>Doanh nghiệp cũng cần lên kế hoạch và áp dụng càng sớm càng tốt các thực hành được nêu cụ thể tại từng câu hỏi, tập trung trước vào những câu hỏi trả lời đang được 0 điểm và không đòi hỏi nhiều nguồn lực để thực hiện.</div>`
        },
        B: {
            suggest: `<div style="font-weight: bolder">Doanh nghiệp đã áp dụng tuần hoàn trong một số công đoạn và đã có kế hoạch chuyển đổi sang mô hình kinh tế tuần hoàn.</div>
                  <div>Doanh nghiệp có tiềm năng đạt tiêu chuẩn nhận hỗ trợ của CP Doanh nghiệp đủ điều kiện tiếp cận các hỗ trợ chính sách theo Quyết định số 167/QĐ-TTg ngày 8/2/2022 về Chương trình hỗ trợ doanh nghiệp khu vực tư nhân kinh doanh bền vững giai đoạn 2022 -2025</div>
                  <div>Doanh nghiệp có thể liên kết với các doanh nghiệp khác trong chuỗi cung ứng, chuỗi dịch vụ để cùng phối hợp chuyển dịch áp dụng nguyên tắc tuần hoàn.</div>
                  <div>Doanh nghiệp có thể tiếp cận với một số chương trình, dự án của Chính phủ và các tổ chức quốc tế để nhận được các hỗ trợ và tư vấn kỹ thuật để đẩy mạnh áp dụng và thí điểm các thực hành tuần hoàn trong doanh nghiệp, cũng như bước đầu tiếp cận với các gói cho vay để thí điểm và hiện đại hóa quy trình sản xuất áp dụng tuần hoàn chuyên sâu.</div>`
        },
        A: {
            suggest: `<div style="font-weight: bolder">Doanh nghiệp đã áp dụng nguyên tắc tuần hoàn trong nhiều công đoạn trong suốt chuỗi giá trị. Doanh nghiệp có chiến lược và kế hoạch rõ ràng nhằm chuyển đổi sang mô hình kinh doanh tuần hoàn.</div>
                  <div>Doanh nghiệp có tiềm năng tạo ra tác động tích cực đối với xu hướng chuyển dịch tuần hoàn trong toàn bộ chuỗi giá trị mà doanh nghiệp tham gia.</div>
                  <div>Doanh nghiệp có tiềm năng đạt tiêu chuẩn nhận hỗ trợ của CP Doanh nghiệp đủ điều kiện tiếp cận các hỗ trợ chính sách theo Quyết định số 167/QĐ-TTg ngày 8/2/2022 về Chương trình hỗ trợ doanh nghiệp khu vực tư nhân kinh doanh bền vững giai đoạn 2022 -2025.</div>
                  <div>Doanh nghiệp có thể cân nhắc đăng ký các chứng chỉ quốc tế về tuần hoàn (Cradle-2-Cradle certificate) để nâng cao thương hiệu, tăng khả năng tiếp cận với các nguồn tài chính xanh, các gói hỗ trợ quốc tế về tuần hoàn, đổi mới sáng tạo.</div>`
        }
    }
}
