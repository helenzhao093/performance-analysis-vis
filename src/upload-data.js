import { LitElement, html } from 'https://unpkg.com/lit-element@2.1.0/lit-element.js?module';
import "./app-modal";

class UploadData extends LitElement {
    static get properties() { return { 
        showModal: { type: Boolean }
    }}

    connectedCallback() {
        super.connectedCallback();
        this.showModal = true;
    }

    async readFile(file) {
        return new Promise((resolve, reject) => {
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (e) {
                    let results = e.target.result;
                    let parsedData = results.split('\n').map(l => l.split(','));
                    resolve(parsedData);
                }
                reader.onerror = function (e) {
                    console.log(e);
                    reject();
                }
            } else {
                reject();
            }
        })
    }
    
    async readData() {
        let datafile = this.shadowRoot.getElementById('dataFile').files[0];
        let response = await this.readFile(datafile);
     
        this.dispatchEvent(new CustomEvent("uploaded", {
            detail : { data: response },
            bubbles: true,
        }));
    }

    render() {
        return html`
            <app-modal .showModal=${this.showModal}>
                <span slot="header-content">Upload Data</span>
                <div slot="modal-body-content">
                    <label>Data File</label>
                    <input id="dataFile" type="file"></input>
                </div>
                <button slot="footer-content" @click=${this.readData}>Generate</button>
            </app-modal>
      `
    }
}

customElements.define('upload-data', UploadData);