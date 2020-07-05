import { css } from 'lit-element';

export const modalStyles = css`
    .modal {
        position: fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
    }
    .open-modal {
        display:block;
        background:rgba(107, 105, 105, 0.75);
    }
    .close-modal {
        display: none;
    }
    .modal-container {
        display:flex;
        flex-direction:column;
        justify-content:center;
        height:100%;
        margin: 0 auto;
        width: 400px;
        border-radius: .25rem;
    }
    .modal-content {
        display:flex;
        flex-wrap:wrap;
        background:#fff;
        border:1px solid #dddbda;
        padding:0.5rem;
    }
    .modal-header {
        position: relative;
        border-top-right-radius: .25rem;
        border-top-left-radius: .25rem;
        border: 1px solid #dddbda;
        padding: 0.5rem;
        text-align: center;
        background: #fff;
    }
    .modal-footer {
        border: 1px solid #dddbda;
        border-bottom-right-radius: .25rem;
        border-bottom-left-radius: .25rem;
        text-align: right;
        padding: 0.5rem;
        background-color: #f3f2f2;
    }
`;