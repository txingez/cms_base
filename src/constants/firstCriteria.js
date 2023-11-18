export const FirstCriteria = {
    FC1: {
        question: 'Chiến lược kinh doanh của doanh nghiệp có đề cập đến áp dụng KTTH không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {
                answer: 'Có – chỉ đề cập một số khái niệm liên quan (ví dụ: tuần hoàn nhiên liệu, tái sử dụng sản phẩm thải bỏ, tái chế rác thải, dùng nguyên liệu tái sinh, có cam kết mức độ cải thiện sử dụng hiệu quả tài nguyên trong kinh doanh…)',
                point: 2
            },
            C: {answer: 'Có - đề cập rõ ràng về việc áp dụng KTTH và được công bố (website, báo cáo thường niên…)', point: 4}
        }
    },
    FC2: {
        question: 'Doanh nghiệp có đề ra các mục tiêu cụ thể về KTTH trong hoạt động sản xuất, kinh doanh không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Đang tìm hiểu, nghiên cứu để xây dựng', point: 1},
            C: {answer: 'Có - mang tính mục tiêu chung, mang tính định tính', point: 2},
            D: {answer: 'Có - mục tiêu cụ thể, có tính định lượng', point: 3}
        }
    },
    FC3: {
        question: 'Doanh nghiệp có kế hoạch thực hiện KTTH không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Đang xây dựng', point: 2},
            C: {answer: 'Có', point: 4}
        }
    },
    FC4: {
        question: 'Trong vòng 2 năm gần đây, doanh nghiệp có từng bị xử lý hành chính do vi phạm quy định pháp luật trong lĩnh vực môi trường không?',
        answers: {
            A: {answer: 'Có', point: 0},
            B: {answer: 'Không', point: 4}
        }
    },
    FC5: {
        question: 'Doanh nghiệp có thực hiện đánh giá vòng đời sản phẩm (LCA) theo ISO 14040 và ISO 14044 để đánh giá tác động môi trường tổng thể không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 2}
        }
    },
    FC6: {
        question: 'Doanh nghiệp có cử nhân viên tham gia các chương trình đào tạo, khoá học có liên quan về KTTH không?',
        answers: {
            A: {answer: 'Chưa cử nhân viên tham gia khoá học nào', point: 0},
            B: {
                answer: 'Đang có kế hoạch hoặc cử nhân viên tham gia một vài khoá học (<5 khoá/năm)',
                point: 1
            },
            C: {answer: 'Đã cử nhân viên tham gia (từ 5 khoá/năm trở lên)', point: 2}
        }
    },
    FC7: {
        // (cho dấu ? vào câu này và hiện ra như sau: “Cán bộ chuyên trách phải ít nhất tốt nghiệp bậc cử nhân trở lên chuyên ngành môi trường”)
        question: 'Doanh nghiệp có cán bộ chuyên trách về môi trường không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 1}
        }
    }
}
