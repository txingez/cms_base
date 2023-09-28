import {uploadImage} from "../services/uploadFile";
import { Quill } from '@vueup/vue-quill'

export const ToolbarEditor = (quillRef) => {
    const sizeStyle = Quill.import('attributors/style/size')
    sizeStyle.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '32px', '36px', '40px', '48px']
    Quill.register(sizeStyle, true)
    return {
        container: [
            [{'font': []}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'color': []}, {'background': []}],
            [{'align': null}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
            [{ 'size': ['Font Size', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '32px', '36px', '48px'] }],
            ['link', 'image', 'video']
        ],
        handlers: {
            'image': () => {
                let fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');
                fileInput.setAttribute('multiple', 'multiple');
                fileInput.setAttribute('accept', 'image/*');
                fileInput.addEventListener('change', () => {
                    if (fileInput.files !== null) {
                        for (let i = 0; i < fileInput.files.length; i++) {
                            uploadImage(fileInput.files[i]).then((res) => {
                                const range = quillRef.value.getQuill().getSelection();
                                quillRef.value.getQuill().insertEmbed(range.index, 'image', res.data.data.file_url);
                            });
                        }
                        fileInput.value = '';
                    }
                });
                fileInput.click();
            }
        }
    }
};
