export const EnvironmentQuestions = {
    E1: {
        question: 'Doanh nghiệp có chính sách quản lý, giám sát và đánh giá tác động môi trường và công bố ra bên ngoài không? (ví dụ trên website của doanh nghiệp)',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - chính sách được xây dựng theo các quy định và tiêu chuẩn Việt Nam', point: 1},
            C: {answer: 'Có - chính sách được xây dựng theo các quy định và tiêu chuẩn Việt Nam và được công bố ra bên ngoài', point: 2},
            D: {answer: 'Có - chính sách được xây dựng theo các quy định, tiêu chuẩn Việt Nam và chuẩn mực quốc tế', point: 2},
            E: {answer: 'Có - chính sách được xây dựng theo các quy định, tiêu chuẩn Việt Nam và chuẩn mực quốc tế và được công bố ra bên ngoài', point: 3}
        }
    },
    E2: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có bị xử phạt vi phạm liên quan tới môi trường không?',
        answers: {
            A: {answer: 'Có', point: 0},
            B: {answer: 'Không', point: 1}
        }
    },
    E3: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có thực hiện báo cáo và công bố thông tin về công tác quản lý môi trường không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {
                answer: 'Có - thực hiện báo cáo và công bố thông tin theo quy định pháp luật hoặc yêu cầu của các bên liên quan',
                point: 1
            },
            C: {answer: 'Có - tự nguyện thực hiện báo cáo và công bố thông tin', point: 2},
            D: {answer: 'Không áp dụng do loại hình kinh doanh không yêu cầu', point: 'N/A'}
        }
    },
    E4: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có thực hiện kiểm toán các báo cáo môi trường không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - tự thực hiện', point: 1},
            C: {answer: 'Có - do đơn vị tư vấn/ kiểm toán độc lập thực hiện', point: 2},
            D: {answer: 'Không áp dụng do loại hình kinh doanh không yêu cầu', point: 'N/A'}
        }
    },
    E5: {
        question: 'Doanh nghiệp có nhân sự phụ trách về vấn đề môi trường không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - kiêm nhiệm', point: 1},
            C: {answer: 'Có - chuyên trách', point: 2}
        }
    },
    E6: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có tập huấn nội bộ chính sách môi trường của doanh nghiệp không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - dưới 50% người lao động tham gia tập huấn', point: 1},
            C: {answer: 'Có - bằng hoặc trên 50% người lao động tham gia tập huấn', point: 2}
        }
    },
    E7: {
        question: 'Doanh nghiệp có tiêu chí/ tiêu chuẩn môi trường cho nhà cung ứng không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có – nhưng chỉ áp dụng với một số nhà cung ứng cấp 1', point: 1},
            C: {answer: 'Có - áp dụng cho tất cả nhà cung ứng cấp 1', point: 2}
        }
    },
    E8: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có tái chế, tái sử dụng nguyên vật liệu đầu vào dư thừa hoặc nguyên vật liệu phế thải từ quá trình sản xuất không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 1},
            C: {answer: 'Không áp dụng do hoạt động của doanh nghiệp không tạo ra nguyên vật liệu dư thừa, nguyên vật liệu phế thải', point: 'N/A'}
        }
    },
    E9: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có theo dõi và thống kê năng lượng tiêu thụ, năng lượng tái tạo không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - thống kê tổng năng lượng tiêu thụ', point: 1},
            C: {answer: 'Có - thống kê và đo lường năng lượng tiêu thụ và năng lượng tái tạo', point: 2}
        }
    },
    E10: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có theo dõi và thống kê lượng nước đầu vào (nước mặt, nước sâu), nước tuần hoàn và nước tái sử dụng không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {
                answer: 'Có - thống kê lượng nước đầu vào, nhưng không thống kê lượng nước tuần hoàn và tái sử dụng',
                point: 1
            },
            C: {
                answer: 'Có - thống kê và đo lường lượng nước đầu vào, nước tuần hoàn và nước tái sử dụng',
                point: 2
            }
        }
    },
    E11: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có đánh giá và giám sát các hoạt động của doanh nghiệp mà có tác động đáng kể đến đa dạng sinh học không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - theo pháp luật Việt Nam', point: 1},
            C: {answer: 'Có - theo pháp luật Việt Nam và chuẩn mực quốc tế', point: 2},
            D: {
                answer: 'Không áp dụng do hoạt động của doanh nghiệp không ảnh hưởng đến đa dạng sinh học',
                point: 'N/A'
            }
        }
    },
    E12: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có báo cáo chi tiết về lượng khí phát thải nhà kính không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - báo cáo và công bố nhưng không chi tiết theo loại khí và nguồn phát thải', point: 1},
            C: {answer: 'Có - báo cáo và công bố chi tiết theo loại khí và nguồn phát thải', point: 2}
        }
    },
    E13: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có báo cáo chi tiết về lượng nước thải không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - báo cáo và công bố nhưng không chi tiết theo loại nước thải và nguồn  thải', point: 1},
            C: {answer: 'Có - báo cáo và công bố chi tiết theo loại nước thải và nguồn thải', point: 2},
            D: {answer: 'Không áp dụng do không có nước thải', point: 'N/A'}
        }
    },
    E14: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có báo cáo đầy đủ về lượng chất thải, bao gồm chất thải nguy hại, chất thải không nguy hại, và phương pháp xử lý chất thải không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - báo cáo không đầy đủ các thông tin', point: 1},
            C: {answer: 'Có - báo cáo đầy đủ các thông tin', point: 2},
            D: {answer: 'Không áp dụng do không có chất thải', point: 'N/A'}
        }
    },
    E15: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có báo cáo đầy đủ việc vận chuyển chất thải nguy hại, bao gồm cách thức vận chuyển, loại chất thải nguy hại và tổng trọng lượng được vận chuyển theo từng địa điểm phát sinh không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có - báo cáo không đầy đủ các thông tin', point: 1},
            C: {answer: 'Có - báo cáo đầy đủ các thông tin', point: 2},
            D: {answer: 'Không áp dụng do không phát thải chất thải nguy hại', point: 'N/A'}
        }
    },
    E16: {
        question: 'Trong 12 tháng gần nhất, doanh nghiệp có theo dõi và báo cáo về tỷ trọng các loại nguyên vật liệu có thể tái chế trong cơ cấu sản phẩm không? (bao gồm cả nguyên liệu đóng gói trong quá trình phân phối)',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 1},
            C: {answer: 'Không áp dụng do không sử dụng nguyên vật liệu', point: 'N/A'}
        }
    }
}
