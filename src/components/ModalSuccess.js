import {Modal} from "ant-design-vue";

export const ModalSuccess = (title, callback) => {
    Modal.success({
        title: title,
        centered: true,
        okButtonProps: {
            class: 'bg-[#2563eb]'
        },
        onOk: callback
    })
}