class HttpTestConsole {
    constructor(url, code, pkg) {
        this.code = code;
        this.package = pkg;
        this.url = url;
        this.headers = {};
        this.queryParams = {};
        this.textFieldStyle = `
            outline: none;
            border: 0px;
            border-bottom: 1px solid white;
            background: transparent;
            color: white;
            margin: 5px;
            font-size: 15px;
        `;
        this.listStyle = `
            outline: none;
            margin: 10px;
            font-size: 16px;
            color: #bab8b8;
            background: transparent;
            border: 0px;
            border-bottom: 2px solid grey;
        `;
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
            `
        }); 
        this.modal.appendChild(this.createElement("h3", {
            text: "⚗️ Test Function 🧪"
        }));
        this.modal.appendChild(this.createTextNode("Method:"));
        this.method = this.createElement("select", {
            style: this.listStyle 
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
        this.bodyInput = this.createElement("textarea", {
            style:`
                ${this.textFieldStyle}
                width: 100%;
                height: 100%;
                resize: none;
            `,
            attributes: {
                spellcheck: false
            }
        });
        this.inputBox.appendChild(this.bodyInput);
        this.modal.appendChild(this.inputBox);
        this.modal.appendChild(this.createTextNode("Headers:"));
        this.addHeaderContainer = this.createElement("div", {
            style:`
            display: flex;
            `
        });
        this.addHeaderButton = this.createElement("button", {
            text: "➕",
            classes: ["nav-link", "good"],
            style:`
            margin: 5px;
            `,
            listeners: {
                click: () => {
                    if (this.headerNameInput.value && this.headerValueInput.value) {
                        this.addHeader(this.headerNameInput.value, this.headerValueInput.value);
                    }
                }
            }
        });
        this.addHeaderContainer.appendChild(this.addHeaderButton);
        this.headerNameInput = this.createElement("input", {
            attributes: {
                type: "text",
                placeholder: "Name",
                spellcheck: false
            },
            style: this.textFieldStyle
        });
        this.addHeaderContainer.appendChild(this.headerNameInput);
        this.headerValueInput = this.createElement("input", {
            attributes: {
                type: "text",
                placeholder: "Value",
                spellcheck: false
            },
            style: this.textFieldStyle
        });
        this.addHeaderContainer.appendChild(this.headerValueInput);
        this.modal.appendChild(this.addHeaderContainer);
        this.headerList = this.createElement("div", {
            style:`
            margin: 10px;
            `
        });
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
            `,
            listeners: {
                click: () => {
                    if (this.queryNameInput.value && this.queryValueInput.value) {
                        this.addQueryParam(this.queryNameInput.value, this.queryValueInput.value);
                        this.queryNameInput.value = "";
                        this.queryValueInput.value = "";
                    }
                }
            }
        });
        addQueryParamContainer.appendChild(this.addQueryButton);
        this.queryNameInput = this.createElement("input", {
            attributes: {
                type: "text",
                placeholder: "Name",
                spellcheck: false
            },
            style: this.textFieldStyle
        });
        addQueryParamContainer.appendChild(this.queryNameInput);
        this.queryValueInput = this.createElement("input", {
            attributes: {
                type: "text",
                placeholder: "Value",
                spellcheck: false
            },
            style: this.textFieldStyle
        });
        addQueryParamContainer.appendChild(this.queryValueInput);
        this.modal.appendChild(addQueryParamContainer);
        this.queryParamsList = this.createElement("div", {
            style:`
            margin: 10px;
            `
        });
        this.modal.appendChild(this.queryParamsList);
        this.modal.appendChild(this.createTextNode("Response Display Type:"));
        this.responseType = this.createElement("select", {
            style: this.listStyle,
            listeners: {
                change: () => {
                    this.responseContainer.innerHTML = "";
                    if (this.responseType.value === "text/json") {
                        this.responseContainer.appendChild(this.textDisplay);
                    } else {
                        this.responseContainer.appendChild(this.htmlRenderer);
                    }
                }
            }
        });
        ["text/json", "html"].forEach(type => {
            this.responseType.appendChild(this.createElement("option", {
                text: type,
                attributes: {
                    value: type
                }
            }));
        });
        this.modal.appendChild(this.responseType);
        this.responseContainer = this.createElement("div", {
            style:`
            margin: 10px;
            `
        });
        this.textDisplay = this.createElement("textarea", {
            style:`
            color: green;
            background: black;
            font-size: 16px;
            width: 100%;
            height: 30vh;
            border-radius: 3px;
            overflow-y: scroll;
            padding: 3px;
            resize: none;
            `,
            attributes: {
                readonly: true
            }
        });
        this.htmlRenderer = this.createElement("iframe", {
            style:`
            width: 100%;
            height: 30vh;
            border-radius: 3px;
            background: white;
            resize: none;
            `
        });
        this.responseContainer.appendChild(this.textDisplay);
        this.modal.appendChild(this.responseContainer);
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
            text: "📡 Send",
            listeners: {
                click: async () => {
                    this.confirmButton.enabled = false;
                    let resp = await fetch(`${this.url}?${this.serializeToQueryString()}`, {
                        method: this.method.value,
                        body: this.bodyInput.value || undefined,
                        headers: this.headers
                    });
                    let text = await resp.text();
                    try {
                        let parsed = JSON.parse(text);
                        this.textDisplay.value = JSON.stringify(parsed, null, 4);
                    } catch(err) {
                        console.error(err);
                        this.textDisplay.value = text;
                    }
                    this.htmlRenderer.src = `data:text/html;base64,${Base64.encode(text)}`;
                }
            }
        });
        btnContainer.appendChild(this.confirmButton);
        this.modal.appendChild(btnContainer);
    }

    serializeToQueryString() {
        let str = [];
        this.queryParams["node"] = JSON.stringify([this.code, JSON.stringify(JSON.parse(this.package))]);
        for (const p in this.queryParams)
          if (this.queryParams.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(this.queryParams[p]));
          }
        return str.join("&");
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
        this.renderHeaders();
    }

    renderHeaders() {
        this.headerList.innerHTML = "";
        if (Object.keys(this.headers).length == 0) {
            return;
        }
        let baseContainer = this.createElement("div", {
            style:`
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 3px;
            border-top: 1px solid grey;
            border-bottom: 1px solid grey;
            `
        });
        let header = baseContainer.cloneNode();
        header.appendChild(this.createTextNode("Name"));
        header.appendChild(this.createTextNode("Value"));
        header.appendChild(this.createTextNode(" "));
        this.headerList.appendChild(header);
        for (const h in this.headers) {
            //this.addHeaderContainer
            let container = baseContainer.cloneNode();
            let txt = this.createElement("div", {
                style: `
                margin: 3px;
                ` 
            });
            let Hname = txt.cloneNode();
            Hname.textContent = h;
            container.appendChild(Hname);
            let Hvalue = txt.cloneNode();
            Hvalue.textContent = this.headers[h];
            container.appendChild(Hvalue);
            container.appendChild(this.createElement("button", {
                classes: ["nav-link", "bad"],
                text: "❌",
                listeners: {
                    click: () => { delete this.headers[h]; this.renderHeaders(); }
                }
            }));
            this.headerList.appendChild(container);
        }
    }

    addQueryParam(name, value) {
        this.queryParams[name] = value;
        this.renderQueryParams();
    }

    renderQueryParams() {
        this.queryParamsList.innerHTML = "";
        if (Object.keys(this.queryParams).length == 0) {
            return;
        }
        let baseContainer = this.createElement("div", {
            style:`
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 3px;
            border-top: 1px solid grey;
            border-bottom: 1px solid grey;
            `
        });
        let header = baseContainer.cloneNode();
        header.appendChild(this.createTextNode("Name"));
        header.appendChild(this.createTextNode("Value"));
        header.appendChild(this.createTextNode(" "));
        this.queryParamsList.appendChild(header);
        for (const h in this.queryParams) {
            if (h !== "node") {
                let container = baseContainer.cloneNode();
                let txt = this.createElement("div", {
                    style: `
                    margin: 3px;
                    ` 
                });
                let Hname = txt.cloneNode();
                Hname.textContent = h;
                container.appendChild(Hname);
                let Hvalue = txt.cloneNode();
                Hvalue.textContent = this.queryParams[h];
                container.appendChild(Hvalue);
                container.appendChild(this.createElement("button", {
                    classes: ["nav-link", "bad"],
                    text: "❌",
                    listeners: {
                        click: () => { delete this.queryParams[h]; this.renderQueryParams(); }
                    }
                }));
                this.queryParamsList.appendChild(container);   
            }
        }
    }
}