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

    errorCheck(bins, probaScores, formIds) {
        let valid = this.toggleErrorClass(bins < 0 || bins > 20, "form-bins");
        for (let i = 0; i < probaScores.length; i++) {
            valid = valid && this.toggleErrorClass(probaScores[i] < 0 || probaScores[i] > 1, formIds[i]);
        }
        return valid;
    }

    updateSettings() {
        let numBins = parseInt(this.shadowRoot.getElementById("numBins").value);
        let display = { 
            TP: { 
                show: this.shadowRoot.getElementById("tp").checked, 
                range:  this.shadowRoot.getElementById("tp-range").value
            },
            FP: { show: this.shadowRoot.getElementById("fp").checked },
            TN: { 
                show: this.shadowRoot.getElementById("tn").checked,
                range:  this.shadowRoot.getElementById("tn-range").value
            },
            FN: { show: this.shadowRoot.getElementById("fn").checked }
        }
        let minScore = parseFloat(this.shadowRoot.getElementById("minScore").value);
        let maxScore = parseFloat(this.shadowRoot.getElementById("maxScore").value);

        // add error check 
        if(this.errorCheck(numBins, 
            [minScore, maxScore, display.TP.range, display.TN.range], 
            ["form-min-score", "form-max-score", "form-TP", "form-TN"])) {
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
        <app-modal .showModal=${this.showModal} @modal-apply=${this.updateSettings}>
            <span slot="header-content">Settings</span>
            <div slot="modal-body-content" class="form-element" id="form-bins">
                <label>Number of Bins: </label>
                <input id="numBins" type="text" .value=${this.numBins}></input>
            </div>
            <div slot="modal-body-content" class="form-element" id="form-classification-display">
                <label>Classification: </label>
                
                <input type="checkbox" id="fp" name="fp" ?checked=${this.display.FP.show}></input>
                <label for="tp">FP</label>
                
                <input type="checkbox" id="fn" name="fn" ?checked=${this.display.FN.show}></input>
                <label for="tp">FN</label>
            </div>
            <div slot="modal-body-content" class="form-element" id="form-TP">
                <input type="checkbox" id="tp" name="tp" ?checked=${this.display.TP.show}></input>
                <label for="tp">TP</label>
                <label>Max Score</label>
                <input type="text" id="tp-range" .value=${this.display.TP.range}></input>
            </div>
            <div slot="modal-body-content" class="form-element" id="form-TN">
                <input type="checkbox" id="tn" name="tn" ?checked=${this.display.TN}></input>
                <label for="tp">TN</label>
                <label>Min Score</label>
                <input type="text" id="tn-range" .value=${this.display.TN.range}></input>
            </div>
            <div slot="modal-body-content" class="form-element" id="form-min-score">
                <label>Minimum Score: </label>
                <input id="minScore" type="text" .value=${this.minScore}></input>
            </div>
            <div slot="modal-body-content" class="form-element" id="form-max-score">
                <label>Maximum Score: </label>
                <input id="maxScore" type="text" .value=${this.maxScore}></input>
            </div>
        </app-modal>
        `
    }
}

customElements.define("app-settings", AppSettings);