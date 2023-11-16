export const SecondCriteria = {
    SC1: {
        question: 'Doanh nghiệp có đề ra mục tiêu định lượng về tỷ lệ thành phần của sản phẩm có thể được tái chế/tái sử dụng không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 2}
        }
    },
    SC2: {
        question: 'Các sản phẩm/dịch vụ của doanh nghiệp có được thiết kế theo hướng tuần hoàn không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 1}
        }
    },
    SC3: {
        question: 'Thành phần trong các sản phẩm/dịch vụ của doanh nghiệp có chứa hóa chất thuộc danh mục chất bị cấm không?',
        answers: {
            A: {answer: 'Có', point: 0},
            B: {answer: 'Không', point: 2}
        }
    },
    SC4: {
        question: 'Sản phẩm và/hoặc bao bì sản phẩm của doanh nghiệp có chứa các hóa chất độc hại theo phân loại tại Nghị định số 82/2022/NĐ-CP không?',
        answers: {
            A: {answer: 'Có, sản phẩm có thể chứa một số hóa chất độc hại dưới ngưỡng cho phép trong Tiêu chuẩn/Quy chuẩn quốc gia nhưng doanh nghiệp chưa có biện pháp phòng ngừa việc hoá chất đó có thể rò rỉ ra môi trường.', point: 0},
            B: {
                answer: 'Có, sản phẩm có thể chứa một số hóa chất độc hại dưới mức cho phép theo Tiêu chuẩn/Quy chuẩn quốc gia và doanh nghiệp đã có biện pháp phòng ngừa việc hoá chất đó có thể rò rỉ ra môi trường.',
                point: 2
            },
            C: {
                answer: 'Không',
                point: 4
            }
        }
    },
    SC5: {
        question: 'Sản phẩm của doanh nghiệp có được thiết kế theo hướng tối ưu hóa công năng để đảm bảo sản phẩm có tính đa dụng, đa năng không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 1}
        }
    },
    SC6: {
        question: 'Sản phẩm của doanh nghiệp có được thiết kế theo hướng kéo dài tuổi đời sử dụng và có thể được sử dụng nhiều lần không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 1}
        }
    },
    SC7: {
        question: 'Sản phẩm của doanh nghiệp có được thiết kế theo hướng dễ tháo rời, dễ tái chế/tái sử dụng không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 1}
        }
    },
    SC8: {
        question: 'Sản phẩm của doanh nghiệp có được thiết kế theo hướng tối ưu hóa hiệu suất sử dụng hoặc tiêu thụ năng lượng (ví dụ có biến tần, công nghệ ánh sáng lạnh…) không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 1}
        }
    },


    SC9: {
        question: 'Doanh nghiệp có thực hành mua sắm xanh không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {
                answer: 'Có, doanh nghiệp lựa chọn các nhà cung ứng có các chứng chỉ/chuẩn mực/công bố về phát triển bền vững nói chung (ví dụ công bố ESG)',
                point: 1
            },
            C: {
                answer: 'Có, doanh nghiệp đã đưa ra các chỉ tiêu cụ thể liên quan đến áp dụng KTTH cho bộ phận mua sắm để yêu cầu nhà cung ứng phải đáp ứng, tuân thủ',
                point: 2
            }
        }
    },
    SC10: {
        question: 'Doanh nghiệp có lựa chọn các nguyên vật liệu có khả năng tái chế/tái sử dụng được không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 2}
        }
    },
    SC11: {
        question: 'Tỷ trọng vật liệu (tính theo khối lượng) cấu thành sản phẩm có thể tái chế',
        answers: {
            A: {answer: 'Dưới 25%', point: 0},
            B: {answer: '25% - dưới 50%', point: 2},
            C: {answer: '50% - dưới 75%', point: 4},
            D: {answer: '75% trở lên', point: 6}
        }
    },
    SC12: {
        question: 'Tỷ trọng vật liệu (tính theo khối lượng) cấu thành sản phẩm có thể tái sử dụng',
        answers: {
            A: {answer: 'Dưới 25%', point: 0},
            B: {answer: '25% - dưới 50%', point: 2},
            C: {answer: '50% - dưới 75%', point: 4},
            D: {answer: '75% trở lên', point: 6}
        }
    },
    SC13: {
        question: 'Tỷ trọng thành phần bao bì từ các nguồn vật liệu tái chế hoặc tái sử dụng',
        answers: {
            A: {answer: 'Dưới 25%', point: 0},
            B: {answer: '25% - dưới 50%', point: 1},
            C: {answer: '50% - dưới 75%', point: 2},
            D: {answer: '75% trở lên', point: 3}
        }
    },
    SC14: {
        question: 'Sản phẩm có sử dụng các nguyên liệu hiếm không?',
        answers: {
            A: {answer: 'Có', point: 0},
            B: {answer: 'Không', point: 2}
        }
    },

    SC15: {
        question: 'Trong năm ngay trước năm đánh giá, tỷ trọng (theo khối lượng) vật liệu bị thất thoát trong quá trình sản xuất là bao nhiêu?',
        answers: {
            A: {answer: '50% trở lên', point: 0},
            B: {answer: '30% - dưới 50%', point: 1},
            C: {answer: '10% - dưới 30%', point: 2},
            D: {answer: 'Dưới 10%', point: 3}
        }
    },
    SC16: {
        question: 'Doanh nghiệp có tái sử dụng nước thải sau khi xử lý không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 2}
        }
    },
    SC17: {
        question: 'Trong năm ngay trước năm đánh giá, tỷ lệ tái sử dụng nước thải của doanh nghiệp là bao nhiêu?',
        answers: {
            A: {answer: 'Dưới 10%', point: 0},
            B: {answer: '10% - dưới 30%', point: 2},
            C: {answer: '30% - dưới 50%', point: 4},
            D: {answer: '50% trở lên', point: 6}
        }
    },
    SC18: {
        question: 'Doanh nghiệp có hệ thống quản lý năng lượng không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có', point: 2}
        }
    },
    SC19: {
        question: 'Trong năm ngay trước năm đánh giá, doanh nghiệp đã sử dụng bao nhiêu % năng lượng từ năng lượng tái trong sản xuất ra sản phẩm/dịch vụ?',
        answers: {
            A: {answer: 'Dưới 25%', point: 0},
            B: {answer: '25% - dưới 50%', point: 1},
            C: {answer: '50% - dưới 75%', point: 2},
            D: {answer: '75% trở lên', point: 3}
        }
    }
}
