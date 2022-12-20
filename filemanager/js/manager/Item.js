import Helper from "./Helper";
import Window from "./Window";

class Item {
    dom = null;
    label = null;
    type = null;
    parent = null;
    mime = null;
    extension = null;
    _index = null;

    _list(e) {
        let dom = this.dom,
            parent = this.parent;
        if (dom.getAttribute('data-key') !== '..') {
            parent.path += "/" + dom.getAttribute('data-key');
            parent.current = null;
            parent.build(parent.path)
        } else {
            let parts = parent.path.split('/');
            parent.current = parts.pop();
            parent._active = this;
            parent.path = parts.join('/');
            parent.build(parent.path);
        }
    }

    _previous(e) {
        let parent = this.parent,
            parts = parent.path.split('/');
        parent.path = parts.slice(0, -1).join('/');
        parent.current = parts.slice(parts.length - 1, parts.length) ?? null;
        parent.build(parent.path)
    }

    _run(e) {
        let response = Helper.ajax(
            'php/manager.php',
            {source: `${this.parent.path}/${e.currentTarget.innerHTML}`, action: 'open'},
            {method: "get", headers: {'Content-Type': 'application/json'}}
        );
        this.parent.window = new Window(`${this.parent.path}/${this.label}`, response.content, '', this);
    }

    setActive() {
        if (this.parent.dom.querySelector('.active')) {
            this.parent.dom.querySelector('.active').classList.remove('active');
        }
        this.parent._active = this;
        this.parent.setActive();
        this.dom.classList.add('active');
    }

    constructor(options, parent) {
        let events = {
            click: this.setActive.bind(this),
        };
        switch (options.type) {
            case "dir":
                events.dblclick = this._list.bind(this);
                break;
            case "file":
                events.dblclick = this._run.bind(this);
                break;
            case "previous":
                events.dblclick = this._previous.bind(this);
                break;
        }
        this.label = options.label;
        this.type = options.type;
        this.mime = options.mimeType;
        this.parent = parent;
        this.dom = Helper.createElement('li', options.label, {
            'data-key': options.label,
            'data-type': options.type,
            'data-mime': options.mimeType,
            'class': options.type,
        }, events);
        if (this.parent.current && this.parent.current[0] === options.label) {
            this.dom.classList.add('active');
        }
    }
}

export default Item;