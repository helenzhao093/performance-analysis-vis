import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.1.0/lit-element.js?module';
import { modalStyles } from './modal-styles.js';

class AppModal extends LitElement {
    static get properties() { return { 
        showModal: { type: Boolean }
    }}

    static get styles() {
        return modalStyles;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    get modalClass() {
        return (this.showModal) ? "modal open-modal" : "modal close-modal";
    }

    toggleModal() {
        this.showModal = !this.showModal;
    }

    render() {
        return html`
        <div class="${this.modalClass}">
            <div class="modal-container">
                <header class="modal-header">
                    <slot name="header-content"></slot>
                </header>
                <div class="modal-content">
                    <slot name="modal-body-content">None</slot>
                </div>
                <footer class="modal-footer">
                    <slot name="footer-content"></slot>
                </footer>
            </div>
        </div>
      `
    }
}

customElements.define('app-modal', AppModal);