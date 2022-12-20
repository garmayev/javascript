class Helper {
    static createElement (tagName, content = null, attributes = {}, events = {}) {
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
    }
    static ajax (url, data, options) {
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

export default Helper;