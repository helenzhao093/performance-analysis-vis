import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.1.0/lit-element.js?module';

function positiveBar(className, barData, offset, binIndex, xScale, yScale, colorScale) {
    return html`
        <svg>
            <rect class=${className}
                x=${xScale(barData.previousSum) + offset}
                y=${yScale(binIndex)}
                height=${yScale.bandwidth()}
                width=${xScale(barData.count)}
                fill=${colorScale(barData.className)}>
            </rect>
        </svg>
    `
}

function negativeBar(className, barData, offset, binIndex, xScale, yScale, colorScale) {
    return html`
        <svg>
            <rect class=${className}
                x=${ offset - xScale(barData.previousSum) - xScale(barData.count) }
                y=${yScale(binIndex)}
                height=${yScale.bandwidth()}
                width=${xScale(barData.count)}
                fill=${colorScale(barData.className)}>
            </rect>
        </svg>
    `
}

function binTemplate(binData, index, mid, lineStrokeWidth, xScale, yScale, colorScale) {
    return html`
        <svg>
            <g>
                ${binData.fp.map(d => html`
                    ${positiveBar("fp", d, xScale(mid) + lineStrokeWidth/2, index, xScale, yScale, colorScale)}
                    `
                )}
                ${binData.tp.map(d => html`
                    ${positiveBar("tp", d,xScale(mid) + lineStrokeWidth/2, index, xScale, yScale, colorScale)}
                    `
                )}
                ${binData.fn.map(d => html`
                    ${negativeBar("fn", d, xScale(mid) - lineStrokeWidth/2, index, xScale, yScale, colorScale)}
                    `
                )}
                ${binData.tn.map(d => html`
                    ${negativeBar("tn", d, xScale(mid) - lineStrokeWidth/2, index, xScale, yScale, colorScale)}
                    `
                )}
            </g>
        </svg>
    `;
}

class ProbaHistogram extends LitElement {
    static get properties() {
        return {
            data: { type: Array },
            height: { type : Number },
            width: { type: Number },
            lineStrokeWidth: { type: Number },
            xMax: { type: Number },
            xScale: { type: Function },
            yScale: { type: Function },
            colorScale: { type: Function }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.lineStrokeWidth = 2;
    }

    render() {
        return html`
        <svg
            class='histogram'
            height=${this.height}
            width=${this.width}>

            <line x1=${this.xScale(this.xMax)} x2=${this.xScale(this.xMax)} y2=${this.height} 
                style="stroke:black;stroke-width:${this.lineStrokeWidth};stroke-opacity:0.5"> 
            </line>

            ${this.data.map( 
                (d, index) => html`
                    ${binTemplate(d, index, this.xMax, this.lineStrokeWidth, this.xScale, this.yScale, this.colorScale)}
                `
            )}
            
        </svg>
        `;
    }
}

customElements.define('proba-histogram', ProbaHistogram);

