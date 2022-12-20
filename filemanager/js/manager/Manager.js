import Helper from "./Helper";
import Tab from "./Tab";

class Manager {
    tab = [];
    activeTab = null;
    dom = null;
    root = null;
    panel = [];

    restore() {
        let storage = localStorage.getItem('tab');
        if (storage) {
            return JSON.parse(localStorage.getItem('tab'));
        } else {
            localStorage.setItem('tab', JSON.stringify(['', '']));
            return ['', ''];
        }
    }

    build(path) {
        let left_index = 0,
            right_index = 1,
            left = new Tab({path: path, root: this.root, index: left_index}, this),
            right = new Tab({path: path, root: this.root, index: right_index}, this);
        this.tab.push(left);
        this.dom.append(left.dom);

        this.tab.push(right);
        this.dom.append(right.dom);
    }

    move(e)
    {
        let tab = this.panel[this.activeTab];
        if (tab._active === null) {
            tab.items[0].setActive()
        }

        switch (e.keyCode) {
            case 38:
                if ( tab._active._index === 0 ) {
                    return false;
                }
                tab.items[tab._active._index - 1].setActive();
                return false;
                break;
            case 40:
                if ( (tab.items.length - 1) === tab._active._index ) {
                    return false;
                }
                tab.items[tab._active._index + 1].setActive();
                return false;
                break;
            case 13:
                tab.items[tab._active._index].dom.dispatchEvent(new MouseEvent('dblclick'));
                break;
            case 27:
                if (tab.window) {
                    tab.window._close();
                }
                return false;
                break;
            case 9:
                this.activeTab = 1;
                return false;
                break;
            default:
                console.log(e.keyCode)
                break;
        }
    }

    constructor(container, root) {
        this.dom = document.querySelector(container);
        let paths = this.restore();
        this.activeTab = 0;
        for (const key in paths) {
            let panel = new Tab({path: paths[key], root: root, index: key}, this);
            this.panel.push(panel);
            this.panel[this.activeTab].dom.classList.add('active');
            this.dom.append(panel.dom);
        }
        this.root = root;
        window.addEventListener('keydown', this.move.bind(this));
    }
}

export default Manager;