import {Modal} from "ant-design-vue";

export const ModalInfo = (title, content, callback) => {
    Modal.info({
        title: title,
        content: content,
        centered: true,
        okButtonProps: {
            class: 'bg-[#2563eb]'
        },
        okText: "Đóng",
        onOk: callback
    })
}