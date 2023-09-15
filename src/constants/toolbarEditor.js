import {uploadImage} from "../services/uploadFile";

export const ToolbarEditor = (quillRef) => {
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
