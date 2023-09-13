export const ThirdCriteria = {
    TC1: {
        question: 'Doanh nghiệp sử dụng bao nhiêu % năng lượng là năng lượng tái tạo trong hoạt động giao hàng?',
        answers: {
            A: {answer: 'Dưới 25%', point: 0},
            B: {answer: 'Trong khoảng 25% - 49%', point: 1},
            C: {answer: 'Trong khoảng 50% -74%', point: 2},
            D: {answer: 'Từ 75% trở lên', point: 3}
        }
    },
    TC2: {
        question: 'Trong năm ngay trước năm đánh giá, doanh nghiệp đã tái chế/tái sử dụng bao nhiêu % các vật liệu tiêu hao, công cụ để phục vụ vận chuyển và giao hàng?',
        answers: {
            A: {answer: 'Dưới 25%', point: 0},
            B: {answer: 'Trong khoảng 25% - 49%', point: 1},
            C: {answer: 'Trong khoảng 50% -74%', point: 2},
            D: {answer: 'Từ 75% trở lên', point: 3}
        }
    },
    TC3: {
        question: 'Doanh nghiệp có cung cấp/hỗ trợ dịch vụ sửa hoặc bảo trì sản phẩm sau khi bán hàng không? ',
        answers: {
            A: {
                answer: 'Không,không có dịch vụ bảo trì sản phẩm/dịch vụ vì chúng vốn có tuổi thọ ngắn (sản phẩm tiêu dùng nhanh, dùng một lần)',
                point: 0
            },
            B: {
                answer: 'Có, doanh nghiệp cung cấp dịch vụ bảo trì sản phẩm trong suốt thời gian bảo hành',
                point: 1
            },
            C: {
                answer: 'Có, doanh nghiệp có cung cấp dịch vụ bảo trì sản phẩm trong toàn bộ vòng đời sản phẩm',
                point: 2
            }
        }
    },
    TC4: {
        question: 'Doanh nghiệp có cung cấp thông tin chi tiết về sản phẩm/bao bì trên nhãn mác sản phẩm theo quy định tại Nghị định 111/2021/NĐ-CP  và Nghị định 43/2017/NĐ-CP không?',
        answers: {
            A: {answer: 'Có', point: 0},
            B: {answer: 'Không', point: 1}
        }
    },
    TC5: {
        question: 'Doanh nghiệp có kế hoạch để tái chế sản phẩm được thu hồi sau khi khách hàng sử dụng không?',
        answers: {
            A: {answer: 'Có', point: 1},
            B: {answer: 'Không', point: 0}
        }
    },
    TC6: {
        question: 'Doanh nghiệp có giải pháp để khách hàng tiếp tục tái sử dụng sản phẩm đó sau được doanh nghiệp tái chế không?',
        answers: {
            A: {answer: 'Có', point: 2},
            B: {answer: 'Không', point: 0}
        }
    },
    TC7: {
        question: 'Doanh nghiệp có hệ thống quản lý thu hồi hoặc thu gom sản phẩm hoặc phần thải bỏ của sản phẩm để tái chế không?',
        answers: {
            A: {answer: 'Có', point: 4},
            B: {answer: 'Không', point: 0}
        }
    },
    TC8: {
        question: 'Doanh nghiệp có số liệu thống kê theo dõi tỷ lệ tái chế sản phẩm của mình không? ',
        answers: {
            A: {answer: 'Có', point: 1},
            B: {answer: 'Không', point: 0}
        }
    },
    TC9: {
        question: 'Doanh nghiệp có công bố các hướng dẫn tái chế sản phẩm hoặc phần thải bỏ của sản phẩm sau khi sử dụng không?',
        answers: {
            A: {answer: 'Có', point: 2},
            B: {answer: 'Không', point: 0}
        }
    },
    TC10: {
        question: 'Trong năm ngay trước năm đánh giá, doanh nghiệp thu hồi bao nhiêu % sản phẩm và bao bì (để tái chế, tái sử dụng, sửa chữa, tái sản xuất, bán lại để tái chế, trực tiếp xử lý bằng biện pháp sinh học như hẩm ủ khí sinh học hoặc làm phân bón vi sinh compost...)?',
        answers: {
            A: {answer: 'Dưới 10%', point: 0},
            B: {answer: 'Trong khoảng 10% - 30%', point: 1},
            C: {answer: 'Trong khoảng 30%-50%', point: 2},
            D: {answer: 'Từ 50% trở lên', point: 3}
        }
    },
    TC11: {
        question: 'Đối với các thành phần của sản phẩm sau sử dụng được đem đi tái chế, doanh nghiệp có đánh giá rủi ro sức khoẻ và môi trường của các vật liệu tái chế không?',
        answers: {
            A: {answer: 'Có', point: 2},
            B: {answer: 'Không', point: 0}
        }
    },
    TC12: {
        question: 'Sản phẩm và bao bì sản phẩm có chứa vi nhựa hoặc nhựa không tự phân hủy không?',
        answers: {
            A: {answer: 'Có', point: 0},
            B: {answer: 'Không', point: 2}
        }
    },
    TC13: {
        question: 'Doanh nghiệp có biện pháp ngăn ngừa hạt vi nhựa hoặc nhựa không tự phân hủy khi bị thải bỏ ra môi trường không?',
        answers: {
            A: {answer: 'Không', point: 0},
            B: {answer: 'Có, doanh nghiệp đang xây dựng biện pháp', point: 2},
            C: {answer: 'Có, doanh nghiệp có biện pháp được công bố', point: 4}
        }
    }
}
