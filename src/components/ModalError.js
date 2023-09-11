import {Modal} from "ant-design-vue";

export const ModalError = (title, content) => {
    Modal.error({
        title: title,
        content: content,
        centered: true,
        okButtonProps: {
            class: 'bg-[#2563eb]'
        }
    })
}