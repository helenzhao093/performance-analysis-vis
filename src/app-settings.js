import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.1.0/lit-element.js?module';

class AppSettings extends LitElement {
    static get properties() {
        return {
            showModal : { type: Boolean },
            numBins : { type: Number },
            display : { type: Object },
            minScore : { type: Number },
            maxScore : { type: Number }
        }
    }

    static get styles() {
        return css`
            .form-element {
                width: 100%;
                background: #f5f5f5;
                margin: .25rem;
                padding: .25rem;
            }
            .error {
                background:#c23934;
            }
        `
    }

    connectedCallback() {
        super.connectedCallback();
        this.showModal = false;
    }

    toggleModal() {
        this.showModal = !this.showModal;
    }

    cancel() {
        this.showModal = false;
    }

    toggleErrorClass(errorCondition, elementId) {
        if (errorCondition) {
            this.shadowRoot.getElementById(elementId).classList.add("error");
            return false;
        } else {
            this.shadowRoot.getElementById(elementId).classList.remove("error");
            return true;
        }
    }

    errorCheck(bins, minScore, maxScore) {
        let valid = true; 
        valid = valid && this.toggleErrorClass(bins < 0 || bins > 20, "form-bins");
        valid = valid && this.toggleErrorClass(minScore < 0 || minScore > 1, "form-min-score");
        valid = valid && this.toggleErrorClass(maxScore < 0 || maxScore > 1, "form-max-score");
        return valid;
    }

    updateSettings() {
        let numBins = parseInt(this.shadowRoot.getElementById("numBins").value);
        let display = { 
            TP: this.shadowRoot.getElementById("tp").checked,
            FP: this.shadowRoot.getElementById("fp").checked,
            TN: this.shadowRoot.getElementById("tn").checked,
            FN: this.shadowRoot.getElementById("fn").checked,
        }
        let minScore = parseFloat(this.shadowRoot.getElementById("minScore").value);
        let maxScore = parseFloat(this.shadowRoot.getElementById("maxScore").value);

        // add error check 
        if(this.errorCheck(numBins, minScore, maxScore)) {
            this.dispatchEvent(new CustomEvent("update-settings", {
                detail : {
                    numBins: numBins,
                    display: display,
                    minScore: minScore,
                    maxScore: maxScore
                }
            }));
            this.showModal = false;
        }
    }

    render() {
        return html`
        <app-modal .showModal=${this.showModal}>
            <span slot="header-content">Settings</span>
            <div slot="modal-body-content">
                <div class="form-element" id="form-bins">
                    <label>Number of Bins: </label>
                    <input id="numBins" type="text" .value=${this.numBins}></input>
                </div>
                <div class="form-element" id="form-classification-display">
                    <label>Classification: </label>
                    <input type="checkbox" id="tp" name="tp" ?checked=${this.display.TP}></input>
                    <label for="tp">TP</label>
                    <input type="checkbox" id="fp" name="fp" ?checked=${this.display.FP}></input>
                    <label for="tp">FP</label>
                    <input type="checkbox" id="tn" name="tn" ?checked=${this.display.TN}></input>
                    <label for="tp">TN</label>
                    <input type="checkbox" id="fn" name="fn" ?checked=${this.display.FN}></input>
                    <label for="tp">FN</label>
                </div>
                <div class="form-element" id="form-min-score">
                    <label>Minimum Score: </label>
                    <input id="minScore" type="text" .value=${this.minScore}></input>
                </div>
                <div class="form-element" id="form-max-score">
                    <label>Maximum Score: </label>
                    <input id="maxScore" type="text" .value=${this.maxScore}></input>
                </div>
            </div>
            <div slot="footer-content">
                <button @click=${this.cancel}>Cancel</button>
                <button @click=${this.updateSettings}>Apply</button>
            </div>
        </app-modal>
        `
    }
}

customElements.define("app-settings", AppSettings);