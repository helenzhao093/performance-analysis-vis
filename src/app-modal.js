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

    cancel() {
        this.showModal = false;
    }

    handleApply() {
        this.dispatchEvent(new CustomEvent("modal-apply"));
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
                    <button @click=${this.cancel}>Cancel</button>
                    <button @click=${this.handleApply}>Okay</button>
                </footer>
            </div>
        </div>
      `
    }
}

customElements.define('app-modal', AppModal);