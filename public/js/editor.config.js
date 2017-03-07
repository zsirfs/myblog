/**
 * Created by zhenglfsir on 2017/1/2.
 */
editor_config = {
    menus: [
        'source',
        '|',     // '|' 是菜单组的分割线
        'bold',
        'underline',
        'italic',
        'fontsize',
        'fontfamily',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'link',
        'emotion',
        'table',
        '|',
        'img',
        'insertcode',
        'fullscreen'
    ],
    mapAk: 'xDsiAaEvLGYm0WqNMDtz6D6t',
    emotions: {
        "default": {
            title: '默认',
            data: '/js/emotions.data'
        }
    },
    uploadInit: function() {

        const editor = this,
            btnId = editor.customUploadBtnId,
            containerId = editor.customUploadContainerId;

        let uploader = Qiniu.uploader({
            runtimes: 'html5, html4, flash',
            browser_button: btnId,
            
        });


    }
};