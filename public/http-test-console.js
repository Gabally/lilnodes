class HttpTestConsole {
    constructor(url) {
        this.url = url;
        this.headers = {};
        this.obscurator = this.createElement("div", {
            style: `
            display: block;
            width: 100vw;
            height: 100vh;
            position: absolute;
            z-index: 9999;
            top: 0px;
            left: 0px;
            background: rgba(85, 85, 85, 0.623);
            `
        });
        this.modal = this.createElement("div", {
            style: `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 99999999;
            background: rgba(51, 51, 51, 0.63);
            padding: 10px;
            border: 2px solid black;
            border-radius: 5px;
            width: 45vw;
            `
        }); 
        this.modal.appendChild(this.createElement("h3", {
            text: "⚗️ Test Function 🧪"
        }));
        this.modal.appendChild(this.createTextNode("Method:"));
        this.method = this.createElement("select", {
            style:`
            outline: none;
            margin: 10px;
            font-size: 16px;
            ` 
        });
        ["GET", "POST", "PUT", "PATCH", "DELETE"].forEach(method => {
            this.method.appendChild(this.createElement("option", {
                text: method,
                attributes: {
                    value: method
                }
            }));
        });
        this.modal.appendChild(this.method);
        this.inputBox = document.createElement("div");
        this.modal.appendChild(this.createTextNode("Body:"));
        this.textField = this.createElement("textarea", {
            style:`
                outline: none;
                border: 0px;
                border-bottom: 1px solid white;
                background: transparent;
                color: white;
                margin: 5px;
                font-size: 15px;
                width: 100%;
                height: 100%;
            `,
            attributes: {
                spellcheck: false
            }
        });
        this.inputBox.appendChild(this.textField);
        this.modal.appendChild(this.inputBox);
        this.modal.appendChild(this.createTextNode("Headers:"));
        let addHeaderContainer = this.createElement("div", {
            style:`
            display: flex;
            `
        });
        this.addHeaderButton = this.createElement("button", {
            text: "➕",
            classes: ["nav-link", "good"],
            style:`
            margin: 5px;
            `
        });
        addHeaderContainer.appendChild(this.addHeaderButton);
        this.headerNameInput = this.createElement("input", {
            attributes: {
                type: "text",
                placeholder: "Name",
                spellcheck: false
            },
            style:`
            outline: none;
            border: 0px;
            border-bottom: 1px solid white;
            background: transparent;
            color: white;
            margin: 5px;
            font-size: 15px;
            `
        });
        addHeaderContainer.appendChild(this.headerNameInput);
        this.headerValueInput = this.createElement("input", {
            attributes: {
                type: "text",
                placeholder: "Value",
                spellcheck: false
            },
            style:`
            outline: none;
            border: 0px;
            border-bottom: 1px solid white;
            background: transparent;
            color: white;
            margin: 5px;
            font-size: 15px;
            `
        });
        addHeaderContainer.appendChild(this.headerValueInput);
        this.modal.appendChild(addHeaderContainer);
        this.headerList = this.createElement("div", {});
        this.modal.appendChild(this.headerList);
        this.modal.appendChild(this.createTextNode("Query Parameters:"));
        let addQueryParamContainer = this.createElement("div", {
            style:`
            display: flex;
            `
        });
        this.addQueryButton = this.createElement("button", {
            text: "➕",
            classes: ["nav-link", "good"],
            style:`
            margin: 5px;
            `
        });
        addQueryParamContainer.appendChild(this.addQueryButton);
        this.queryNameInput = this.createElement("input", {
            attributes: {
                type: "text",
                placeholder: "Name",
                spellcheck: false
            },
            style:`
            outline: none;
            border: 0px;
            border-bottom: 1px solid white;
            background: transparent;
            color: white;
            margin: 5px;
            font-size: 15px;
            `
        });
        addQueryParamContainer.appendChild(this.queryNameInput);
        this.queryValueInput = this.createElement("input", {
            attributes: {
                type: "text",
                placeholder: "Value",
                spellcheck: false
            },
            style:`
            outline: none;
            border: 0px;
            border-bottom: 1px solid white;
            background: transparent;
            color: white;
            margin: 5px;
            font-size: 15px;
            `
        });
        addQueryParamContainer.appendChild(this.queryValueInput);
        this.modal.appendChild(addQueryParamContainer);
        this.modal.appendChild(this.createTextNode("Response:"));
        this.responseType = this.createElement("select");
        ["text/json", "html"].forEach(type => {
            this.responseType.appendChild(this.createElement("option", {
                text: type,
                attributes: {
                    value: type
                }
            }));
        });
        this.modal.appendChild(this.responseType);
        let btnContainer = this.createElement("div", {
            style:`
                display: flex;
                justify-content: center;
                margin-top: 15px; 
            `
        });
        this.cancelButton = this.createElement("button", {
            text: "❌ Cancel",
            classes: ["nav-link", "bad"],
            listeners: {
                click: () => {this.close();}
            }
        });
        btnContainer.appendChild(this.cancelButton);
        this.confirmButton = this.createElement("button", {
            classes: ["nav-link", "good"],
            text: "📡 Send"
        });
        btnContainer.appendChild(this.confirmButton);
        this.modal.appendChild(btnContainer);
    }

    createToast(text) {
        let container = this.createElement("div", {
            text: text,
            style: `
            borderRadius: 5px;
            border: 1px solid black;
            color: black;
            padding: 5px;
            margin: 5px;
            `
        });
        setTimeout(() => container.remove(), 5000);
        return container;
    }

    showInfo(text) {
        let container = this.createToast(text);
        container.style.background = "rgba(105, 230, 105, 0.877)";
        this.modal.appendChild(container);
    }

    showError(text) {
        let container = this.createToast(text);
        container.style.background = "rgba(235, 102, 102, 0.726)";
        this.modal.appendChild(container);
    }

    close() {
        this.obscurator.remove();
        this.modal.remove();
        document.body.style.overflowY = "visible";
        document.body.style.overflowX = "visible";
    }

    disableButtons() {
        this.confirmButton.disabled = true;
        this.cancelButton.disabled = true;
        this.confirmButton.classList.add("disabled");
        this.cancelButton.classList.add("disabled"); 
    }

    enableButtons() {
        this.confirmButton.disabled = false;
        this.cancelButton.disabled = false;
        this.confirmButton.classList.remove("disabled");
        this.cancelButton.classList.remove("disabled"); 
    }

    show() {
        document.body.style.overflowY = "hidden";
        document.body.style.overflowX = "hidden";
        document.body.appendChild(this.obscurator);
        document.body.appendChild(this.modal);
    }

    createElement(element, options={}) {
        let el = document.createElement(element);
        el.innerText = options.text || "";
        (options.classes || []).forEach(c => el.classList.add(c));
        el.setAttribute("style", options.style || "");
        for (const event in options.listeners || {}) {
            el.addEventListener(event, options.listeners[event]);
        }
        for (const attr in options.attributes || {}) {
            el.setAttribute(attr, options.attributes[attr]);
        }
        return el;
    }

    createTextNode(text) {
        let el = document.createElement("div");
        el.innerText = text;
        return el;
    }

    addHeader(name, value) {
        this.headers[name] = value;
        for (const h in this.headers) {
            
        }
    }
}