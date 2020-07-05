import { LitElement, html, css} from "lit-element";
//import { router, outlet, navigator } from "lit-element-router";
import './performance-analysis.js';
import './upload-data.js';
import './app-settings.js'

//@router @navigator @outlet 
class App extends LitElement {
    static get properties() {
        return { 
            showHistogram: { type: Boolean },
            numBins : { type: Number },
            display : { type: Object },  
            minScore : { type: Number },
            maxScore : { type: Number },
        };
    }

    static get styles() {
        return css`
            * {
                font-family: sans-serif;
                line-height: 1.75;
            }
            .nav-bar {
                display:flex;
                justify-content: space-between;
                overflow: hidden;
                background-color: #333;
                color:#fff;
                position: fixed;
                top: 0;
                left:0;
                width: 100%;
                height: 30px;
                padding:10px;
            }
            .main {
                margin-top:50px;
            }
        `
    }

    connectedCallback() {
        super.connectedCallback();
        this.setDefaultSetting();
    }

    setDefaultSetting() {
        this.numBins = 3;
        this.display = { TP: true, FP: true, TN: true, FN: true };
        this.minScore = 0;
        this.maxScore = 1; 
    }

    handleUpload(event) {
        this.parsedData = event.detail.data;
        this.showHistogram = true;
    }

    updateSettings(event) {
        this.numBins = event.detail.numBins;
        this.display = event.detail.display;
        this.minScore = event.detail.minScore;
        this.maxScore = event.detail.maxScore;
    }

    toggleSettingsModal(event) {
        console.log(event);
        let settings = this.shadowRoot.getElementById("settings");
        settings.toggleModal();
    }

    render() {
        return html`
        <div class='nav-bar'>
            <span>Stacks</span>
            <div style="padding-right:20px;">
                <a @click=${this.toggleUpload}>Upload</a>
                <a @click=${this.toggleSettingsModal}>Settings</a>
            </div>
        </div>

        <app-settings id="settings" @update-settings=${this.updateSettings}
                        .numBins=${this.numBins} .display=${this.display} .maxScore=${this.maxScore} .minScore=${this.minScore}></app-settings>
        <div class="main">
            ${this.showHistogram ?
                html`
                    <performance-analysis .parsedData=${this.parsedData}
                        .numBins=${this.numBins} .display=${this.display} .maxScore=${this.maxScore} .minScore=${this.minScore}>
                    </performance-analysis>` :

                html`
                    <upload-data @uploaded="${this.handleUpload}"></upload-data>
                `
            }
        </div>
        
        `
    }
}

customElements.define("my-app", App);