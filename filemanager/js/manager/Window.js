import Helper from "./Helper";

class Window {
    _id = null;
    _target = null;
    _content = null;
    _parent = null;
    _editable = false;
    _textarea = null;
    _object = null;
    _image = null;
    _shadow = Helper.createElement('div', null, {class: 'shadow'}, {click: this._close.bind(this)});

    dom = Helper.createElement('div', null, {class: 'window'});

    _save(content) {
        let response = Helper.ajax(
            'php/manager.php',
            {content: content, filename: this._content.file, action: 'save'},
            {method: "get", headers: {'Content-Type': 'application/json'}}
        );
    }

    _close(e) {
        if (this._editable) {
            let isBoss = confirm("Сохранить изменения?");
            if (isBoss) {
                this._save.call(this, this.dom.querySelector('textarea').value);
            }
        }
        this.dom.remove();
        this._shadow.remove();
    }

    constructor(header, content, footer, parent = null) {
        this._content = content;
        this._parent = parent;
        if (document.querySelector(".window") === null) {
            let headerContainer = Helper.createElement('div', null, {class: 'header'}),
                bodyContainer = Helper.createElement('div', null, {class: 'body', 'data-mime': this._content.mimeType, 'data-filename': this._content.file}),
                footerContainer = Helper.createElement('div', footer, {class: 'footer'}),
                closeBtn = Helper.createElement('span', null, {
                    style: 'float: right',
                    class: 'fas fa-times btn'
                }, {
                    click: this._close.bind(this)
                }),
                headerContent = Helper.createElement('span', header, {style: 'float: left', class: 'header-content'});
            headerContainer.append(headerContent);
            headerContainer.append(closeBtn);
            this.dom.append(headerContainer);

            this.dom.append(bodyContainer);
            console.log(content);

            switch (this._content.mimeType) {
                case "text/html":
                case "text/x-php":
                case "text/plain":
                    this._textarea = Helper.createElement('textarea', this._content.content, null, {change: function (e) {this._editable = true;}.bind(this)});
                    bodyContainer.append(this._textarea)
                    break;
                case "image/png":
                case "image/jpg":
                case "image/jpeg":
                case "image/webp":
                    // `<img src="${header}" style="object-fit: cover; max-width: 100%; max-height: 100%; margin: 0 auto;">`
                    bodyContainer.append(Helper.createElement('img', null, {src: header}));
                    break;
                case "image/svg":
                    bodyContainer.append(Helper.createElement('object', Helper.createElement('img', null, {src: header}), {type: "image/svg+xml", data: header}));
                    break;
            }

            this.dom.append(footerContainer);
            document.body.append(this.dom);
            document.body.append(this._shadow);
            this.dom.classList.add('active');
        }
    }
}

export default Window;