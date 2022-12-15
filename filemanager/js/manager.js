const helper = {
    createElement: function (tagName, content = null, attributes = {}, events = {}) {
        let el = document.createElement(tagName);
        if (content) {
            el.innerHTML = content;
        }
        for (const key in attributes) {
            el.setAttribute(key, attributes[key]);
        }
        for (const key in events) {
            el.addEventListener(key, events[key]);
        }
        return el;
    },
    ajax: function (url, data, options) {
        let xhr = new XMLHttpRequest();
        switch (options.method.toUpperCase()) {
            case "GET":
                url += '?' + (new URLSearchParams(data)).toString();
                data = null;
                break;
            case "POST":
                data = JSON.stringify(data);
                break;
        }
        xhr.open(options.method, url, false);
        for (const key in options.headers) {
            xhr.setRequestHeader(key, options.headers[key]);
        }
        try {
            xhr.send(data);
            if (xhr.status !== 200) {
                alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
            } else {
                return JSON.parse(xhr.response);
            }
        } catch (err) { // для отлова ошибок используем конструкцию try...catch вместо onerror
            alert("Запрос не удался");
        }
    }
}

let dragObject = {};

class Item {
    dom = null;
    label = null;
    type = null;
    extension = null;

    open(e)
    {

    }

    setActive()
    {

    }

    constructor(options, parent)
    {
        this.dom = helper.createElement('li', options.label, {
            'data-type': options.type,
            'data-mime': options.mimeType,
            'class': options.type,
        }, {
            click: this.setActive.bind(this),
            dblclick: this.open.bind(this),
        })
        console.log(options, parent);
    }
}

class Tab {
    path = '';
    root = null;
    index = 0;
    items = [];

    dom = helper.createElement(
        'ul',
        null,
        {style: 'width: 50%;', class: 'tab'}
    );

    _modal(item) {
        console.log(item)
        let modal = document.querySelector(".modal"),
            body = modal.querySelector(".modal-body"),
            header = modal.querySelector(".modal-header"),
            content = null;
        if (item.mimeType.match(/text|application\/json/)) {
            content = helper.createElement('textarea', item.content);
        } else if (item.mimeType.match(/image/)) {
            content = helper.createElement('img', null, {src: item.file.replace(this.root, "")});
        }
        body.innerHTML = '';
        body.append(content);
        header.innerHTML = item.file;
        modal.classList.add('active');
    }

    list(e) {
        if (e.currentTarget.getAttribute('data-key') !== '..') {
            this.path += "/" + e.currentTarget.getAttribute('data-key');
        } else {
            let parts = this.path.split('/');
            this.path = parts.slice(0, -1).join('/');
        }
        this.build(this.path)
    }

    open(e) {
        let file = e.currentTarget.getAttribute(['data-key']),
            mimeType = e.currentTarget.getAttribute(['data-mime']),
            response = helper.ajax(
                'php/manager.php',
                {source: `${this.path}/${file}`, action: 'open'},
                {method: "get", headers: {'Content-Type': 'application/json'}}
            );
        if (response.ok) {
            this._modal(response.content);
        }
    }

    setActive(e) {
        console.log(this.dom.querySelector('.active'));
        this.dom.querySelector('.active').classList.remove('active');
        e.currentTarget.classList.add('active');
    }

    constructor(options) {
        this.path = options.path;
        this.root = options.root;
        this.index = options.index;
        this.build(this.path);
    }

    build(path) {
        let storage = JSON.parse(localStorage.getItem('tab')),
            response = helper.ajax(
                'php/manager.php',
                {source: path, action: 'list'},
                {method: "get", headers: {'Content-Type': 'application/json'}}
            );
        storage[this.index] = path;
        localStorage.setItem('tab', JSON.stringify(storage));
        this.dom.innerHTML = '';
        if (path !== '') {
            this.dom.append(
                helper.createElement(
                    'li',
                    '..',
                    {'data-key': '..', class: 'dir active', style: 'padding: .1em .5em;'},
                    {
                        dblclick: this.list.bind(this),
                        click: this.setActive.bind(this)
                    }
                )
            );
        }
        if (response.ok) {
            let dir = response.dir.sort((a, b) => {
                if (a.type[0] < b.type[0]) {
                    return -1;
                }
                if (a.type[0] > b.type[0]) {
                    return 1;
                }
                return 0;
            });
            for (const key in dir) {
                let item = new Item(dir[key], this);
                this.items.push(item);

                this.dom.append(item.dom);
            }
        }
    }
}

class Manager {
    tab = [];
    activeTab = null;
    container = null;
    root = null;

    restore() {
        let storage = localStorage.getItem('tab');
        if (storage) {
            this.tab = JSON.parse(localStorage.getItem('tab'));
        } else {
            localStorage.setItem('tab', JSON.stringify(['', '']));
            this.tab = ['', ''];
        }

        let left_index = 0,
            right_index = 1,
            left = new Tab({path: this.tab[left_index], root: this.root, index: left_index}),
            right = new Tab({path: this.tab[right_index], root: this.root, index: right_index});
        this.tab.push(left);
        this.container.append(left.dom);

        this.tab.push(right);
        this.container.append(right.dom);
    }

    constructor(container, root) {
        this.container = document.querySelector(container);
        this.root = root;
        this.restore();
        document.querySelector('.btn.cancel').addEventListener('click', (e) => {
            e.currentTarget.closest('.modal').classList.remove('active');
        })
        document.querySelector('.shadow').addEventListener('click', (e) => {
            document.querySelector('.modal').classList.remove('active');
        })
        document.querySelector('.btn.save').addEventListener('click', (e) => {
            let response = helper.ajax(
                'php/manager.php',
                {
                    content: document.querySelector('.modal-body textarea').value,
                    filename: document.querySelector('.modal-header').innerHTML,
                    action: 'save'
                },
                {method: "get", headers: {'Content-Type': 'application/json'}}
            );
            if (response.ok) {
                document.querySelector('.modal').classList.remove('active');
            }
        })
    }
}