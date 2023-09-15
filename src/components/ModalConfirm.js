import {Modal} from "ant-design-vue";

export const ModalConfirm = (title, content, callback) => {
    Modal.confirm({
        title: title,
        content: content,
        centered: true,
        okButtonProps: {
            class: 'bg-[#2563eb]'
        },
        onOk: callback
    })
}