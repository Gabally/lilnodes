class HttpTestConsole {
    constructor(url) {
        this.obscurator = document.createElement("div");
        this.obscurator.style.display = "block";
        this.obscurator.style.width = "100vw";
        this.obscurator.style.height = "100vh";
        this.obscurator.style.position = "absolute";
        this.obscurator.style.zIndex = "9999";
        this.obscurator.style.top = "0px";
        this.obscurator.style.left = "0px";
        this.obscurator.style.background = "rgba(85, 85, 85, 0.623)";
        this.modal = document.createElement("div");
        this.modal.style.position = "absolute";
        this.modal.style.top = "50%";
        this.modal.style.left = "50%";
        this.modal.style.transform = "translate(-50%,-50%)";
        this.modal.style.zIndex = "99999999";
        this.modal.style.background = "rgba(51, 51, 51, 0.63)";
        this.modal.style.padding = "10px";
        this.modal.style.border = "2px solid black";
        this.modal.style.borderRadius = "5px";
        this.title = document.createElement("h3");
        this.title.innerText = "⚗️ Test Function 🧪";
        this.modal.appendChild(this.title);
        let text = document.createElement("div");
        this.inputBox = document.createElement("div");
        this.textField = document.createElement("textarea");
        this.textField.style.outline = "none";
        this.textField.style.border = "0px";
        this.textField.style.borderBottom = "1px solid white";
        this.textField.style.background = "transparent";
        this.textField.spellcheck = false;
        this.textField.style.color = "white";
        this.textField.style.margin = "5px";
        this.textField.style.fontSize = "15px";
        this.inputBox.appendChild(this.textField);
        this.modal.appendChild(this.inputBox);
        let btnContainer = document.createElement("div");
        btnContainer.style.display = "flex";
        btnContainer.style.justifyContent = "center";
        btnContainer.style.marginTop = "15px"; 
        this.cancelButton = document.createElement("button");
        this.cancelButton.innerText = "❌ Cancel";
        this.cancelButton.addEventListener("click", () => this.close());
        this.cancelButton.classList.add("nav-link");
        this.cancelButton.classList.add("bad");
        btnContainer.appendChild(this.cancelButton);
        this.confirmButton = document.createElement("button");
        this.confirmButton.classList.add("nav-link");
        this.confirmButton.classList.add("good");
        btnContainer.appendChild(this.confirmButton);
        this.modal.appendChild(btnContainer);
    }

    createToast(text) {
        let container = document.createElement("div");
        container.textContent = text;
        container.style.borderRadius = "5px";
        container.style.border = "1px solid black";
        container.style.color = "black";
        container.style.padding = "5px";
        container.style.margin = "5px";
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
}