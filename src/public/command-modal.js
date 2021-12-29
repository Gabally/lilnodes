class CommandModal {
    constructor(title, question, options) {
        this.action = options.action || function(){};
        this.placeHolder = options.placeHolder || "";
        this.actionText = options.actionText || "OK"; 
        this.question = question;
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
        this.title = this.createElement("h3", {
            text: title
        });
        this.modal.appendChild(this.title);
        this.inputBox = document.createElement("div");
        this.textField = this.createElement("input", {
            style:`
                outline: none;
                border: 0px;
                border-bottom: 1px solid white;
                background: transparent;
                color: white;
                margin: 5px;
                font-size: 15px;
            `,
            attributes: {
                spellcheck: false,
                type: "text",
                placeholder: this.placeHolder
            }
        });
        this.inputBox.textContent = question;
        this.inputBox.appendChild(this.textField);
        this.modal.appendChild(this.inputBox);
        let btnContainer = this.createElement("div", {
            style: `
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
            text: options.actionText,
            classes: ["nav-link", "good"],
            listeners: {
                click: () => {this.action();}
            }
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

    getValue() {
        return this.textField.value;
    }

    clearModal() {
        this.textField.value = "";
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
}