import Helper from "./Helper";
import Item from "./Item";

class Tab {
    path = '';
    root = null;
    index = 0;
    items = [];
    current = null;
    window = null;
    _header = null;
    _list = null;
    _parent = null;
    _active = null;

    dom = Helper.createElement(
        'div',
        null,
        {style: 'width: 50%; max-height: 90vh;', class: 'tab'}
    );

    constructor(options, parent) {
        this.path = options.path;
        this.root = options.root;
        this.index = options.index;
        this._header = options.path;
        this._parent = parent;
        this.build(this.path);
    }

    build(path) {
        let storage = JSON.parse(localStorage.getItem('tab')),
            response = Helper.ajax(
                'php/manager.php',
                {source: path, action: 'list'},
                {method: "get", headers: {'Content-Type': 'application/json'}}
            );
        storage[this.index] = path;
        localStorage.setItem('tab', JSON.stringify(storage));

        this.dom.innerHTML = '';
        this._list = Helper.createElement('ul', null, null, {click: this.setActive.bind(this)});
        this._header = Helper.createElement('span', `${this.path}/`, {class: "tab-header"});
        this.dom.append(this._header);
        this.dom.append(this._list);
        this.dom.setAttribute('data-index', this.index);
        this.items = [];
        if (response.ok) {
            console.log(response.dir);
            let i = 0;
            let dir = response.dir.sort((a, b) => {
                if (a.type[0] < b.type[0]) {
                    return -1;
                }
                if (a.type[0] > b.type[0]) {
                    return 1;
                }
                return 0;
            });
            if (path !== '') {
                let item = new Item({label: '..', type: 'dir', mimeType: 'previous'}, this);
                this.items.push(item)
                item._index = i;
                this._list.append(item.dom);
                i++;
            }
            for (const key in dir) {
                let item = new Item(dir[key], this);
                this.items.push(item);
                item._index = i;
                if (dir[key].label === this.current) {
                    item.dom.classList.add('active');
                    item.setActive();
                }
                this._list.append(item.dom);
                i++;
            }
            if (this.current === null) {
                this._active = this.items[0];
            }
        }
    }

    setActive()
    {
        this._parent.activeTab = this.index;
        console.log(this._parent.activeTab);
        this._parent.panel[this._parent.activeTab].dom.classList.remove('active');
    }
}

export default Tab;