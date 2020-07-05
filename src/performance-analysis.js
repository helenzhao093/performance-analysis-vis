//import { PerformanceAnalysis } from './PerformanceAnalysis.js';
import { LitElement, html, css } from 'https://unpkg.com/lit-element@2.1.0/lit-element.js?module';
import './Histogram.js';

class PerformanceAnalysis extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      numBins : { type: Number },
      display : { type: Object },  
      minScore : { type: Number },
      maxScore : { type: Number },
      histogramData : { type : Array },
      parsedData: { type : Array }
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content:center;
        align-content:center;
        width:100%
      }
      .histogram-container {
        display:flex;
        padding:1rem;
        border: 2px solid #dddbda;
        width:1200px;
        overflow:auto;
      }
      proba-histogram {
      }
    `
  }

  connectedCallback() {
    super.connectedCallback();
    this.height = 400;
    this.width = 300;
    this.setDefaultSetting();
  }

  setDefaultSetting() {
    this.numBins = 3;
    this.tempBinNum = 3;
    this.display = { TP: true, FP: true, TN: true, FN: true };
    this.minScore = 0;
    this.maxScore = 1; 
  }

  fetchData() {
    this.orginalData = [
      {
        className: "class0",
        data: [
          { bin: 0,
          tp: [{ bin: 0, className: "class0", count: 0, previous_sum: 7}],
          fp: [{ bin: 0, className: "class1", count: 3, previous_sum: 0} , { bin: 0, className: "class2", count: 4, previous_sum: 3}],
          tn: [{ bin: 0, className: "class0", count: 0, previous_sum: 8 }],
          fn: [{ bin: 0, className: "class1", count: 3, previous_sum: 0} , { bin: 0, className: "class2", count: 5, previous_sum: 3}]
          },
          {
          bin: 1,
          tp: [{ bin: 1, className: "class0", count: 10, previous_sum: 5}],
          fp: [{ bin: 1, className: "class1", count: 1, previous_sum: 0} , { bin: 1, className: "class2", count: 4, previous_sum: 1}],
          tn: [{ bin: 1, className: "class0", count: 8, previous_sum: 7}],
          fn: [{ bin: 1, className: "class1", count: 5, previous_sum: 0} , { bin: 1, className: "class2", count: 2, previous_sum: 5}]
          },
          {
          bin: 2,
          tp: [{ bin: 2, className: "class0", count: 5, previous_sum: 5}],
          fp: [{ bin: 2, className: "class1", count: 1, previous_sum: 0} , { bin: 2, className: "class2", count: 4, previous_sum: 1}],
          tn: [{ bin: 2, className: "class0", count: 4, previous_sum: 7}],
          fn: [{ bin: 2, className: "class1", count: 3, previous_sum: 0} , { bin: 2, className: "class2", count: 4, previous_sum: 3}]
          }
        ]
      },
      {
        className: "class1",
        data: [
          { bin: 0,
          tp: [{ bin: 0, className: "class1", count: 6, previous_sum: 7 }],
          fp: [{ bin: 0, className: "class0", count: 3, previous_sum: 0} , { bin: 0, className: "class2", count: 4, previous_sum: 3}],
          tn: [{ bin: 0, className: "class1", count: 5, previous_sum: 8}],
          fn: [{ bin: 0, className: "class0", count: 2, previous_sum: 0} , { bin: 0, className: "class2", count: 6, previous_sum: 2}]
          },
          {
          bin: 1,
          tp: [{ bin: 1, className: "class1", count: 2, previous_sum: 7 }],
          fp: [{ bin: 1, className: "class0", count: 3, previous_sum: 0} , { bin: 1, className: "class2", count: 4, previous_sum: 3}],
          tn: [{ bin: 1, className: "class1", count: 4, previous_sum: 7 }],
          fn: [{ bin: 1, className: "class0", count: 3, previous_sum: 0} , { bin: 1, className: "class2", count: 4, previous_sum: 3}]
          },
          {
          bin: 2,
          tp: [{ bin: 2, className: "class1", count: 1, previous_sum: 9}],
          fp: [{ bin: 2, className: "class0", count: 6, previous_sum: 0} , { bin: 2, className: "class2", count: 3, previous_sum: 6}],
          tn: [{ bin: 2, className: "class1", count: 1, previous_sum: 8}],
          fn: [{ bin: 2, className: "class0", count: 4, previous_sum: 0} , { bin: 2, className: "class2", count: 4, previous_sum: 4}]
          }
        ]
      }
    ]
  }

  set parsedData(data) {
    let numColumns = data[0].length;
    this._parsedData = data.filter(row => row.length === numColumns); // remove extraneous columns

    let header = this.parsedData[0];
    let classNames = [];
    let probaIndexes = new Set(); 
    let classIndexToValueMap = {}; 
    let classValueToIndexMap = {};
    let targetIndex;
    let predictionIndex; 
    let idIndex; 
    let classIndex = 0
    header.forEach((name,index)=> {
      name = name.toLowerCase();
      if (name === 'predicted') {
        predictionIndex = index;
      } else if (name === 'target') {
        targetIndex = index; 
      } else if (name === 'id') {
        idIndex = index; 
      } else {
        classNames.push(name);
        probaIndexes.add(index);
        classIndexToValueMap[classIndex] = name;
        classValueToIndexMap[name] = classIndex;
        classIndex += 1;
      }
    });
      
    // set class name, probability, target, prediction arrays
    this.classNames = classNames;
    this.classIndexToValueMap = classIndexToValueMap;
    this.classValueToIndexMap = classValueToIndexMap;
    this.proba = this.parsedData.slice(1).map(row => row.filter((_, i) => probaIndexes.has(i)));
    this.target = this.parsedData.slice(1).map(row => row[targetIndex]);
    this.prediction = this.parsedData.slice(1).map(row => row[predictionIndex]);
    this.ids = this.parsedData.slice(1).map(row => row[idIndex]);

    this.setDefaultSetting();
  }

  get parsedData() {
    return this._parsedData;
  }

  /*set histogramData(data) {
    this._histogramData = data;
    this.xMax = Math.max(this.calculateMaxCount('tp'), this.calculateMaxCount('tn'));
    console.log(this.xMax);
    this.xScale = d3.scaleLinear()
                    .domain([0, 2*this.xMax])
                    .rangeRound([0, this.width])

    this.yScale = d3.scaleBand()
                    .domain(Array.from(Array(this.numBins).keys()).reverse() )
                    .rangeRound([0, this.height])
                    .padding(0.1)

    this.colorScale = d3.scaleOrdinal()
                        .range(["#00649b", "#bc4577", "#ff7e5a", "#b2bae4", "#a97856", "#a3a6af", "#48322e", "#ad8a85"])
                        .domain(this.classNames)
    
  } */

  get histogramData() {
    let histogramData = this.initializeHistogramData();
    histogramData = this.calculateBinCounts(histogramData);
    return this.calculatePreviousSum(histogramData);
  }

  get colorScale() {
    return d3.scaleOrdinal()
          .range(["#00649b", "#bc4577", "#ff7e5a", "#b2bae4", "#a97856", "#a3a6af", "#48322e", "#ad8a85"])
          .domain(this.classNames);
  }

  get yScale() {
    return d3.scaleBand()
            .domain(Array.from(Array(this.numBins).keys()).reverse() )
            .rangeRound([0, this.height])
            .padding(0.1);
  }

  get xMax() {
    return Math.max(this.calculateMaxCount('tp'), this.calculateMaxCount('tn'));
  }

  get xScale() {
    return d3.scaleLinear()
            .domain([0, 2* this.xMax])
            .rangeRound([0, this.width])
  }

  /*updateHistograms(event) {
    console.log(this.shadowRoot.getElementById("numBins").value);
    this.numBins = parseInt(this.shadowRoot.getElementById("numBins").value);
    this.display = { 
      TP: this.shadowRoot.getElementById("tp").checked,
      FP: this.shadowRoot.getElementById("fp").checked,
      TN: this.shadowRoot.getElementById("tn").checked,
      FN: this.shadowRoot.getElementById("fn").checked,
    }
  }*/

  initializeHistogramData() {
    console.log(this.numBins)
    let binNums = [...Array(this.numBins).keys()];  
    
    let histogramData = this.classNames.map((name, i) => {
      return {classNum: i, className: name, data: []}
    }) 
    
    histogramData.forEach(histogram => {
      // add tp, fp, tn, fn
      binNums.forEach(binNum => {
        histogram.data.push({bin: binNum, tp:[], fp:[], tn:[], fn: []})
      })
      this.classNames.forEach(name => {
          histogram.data.forEach(function(data) {
            data.fn.push({bin: data.bin, className: name, count: 0})
          })
          histogram.data.forEach(function(data) {
            data.fp.push({bin: data.bin, className: name, count: 0})
          })

        if (name === histogram.className){
          histogram.data.forEach(function(data) {
            data.tn.push({bin: data.bin, className: name, count: 0})
          })
          histogram.data.forEach(function(data) {
            data.tp.push({bin: data.bin, className: name, count: 0})
          })
        }
      })
    })
    return histogramData;
  }

  getBinNumber(score) {
    let bin = Math.floor((score - this.minScore)/
    ((this.maxScore - this.minScore)/this.numBins))
    return (bin == this.numBins) ? this.numBins - 1 : bin;
  }

  calculateBinCounts(histogramData) {
    this.proba.forEach((scores, dataIndex) => {
      let predicted = this.prediction[dataIndex]; 
      let target = this.target[dataIndex];
      scores.forEach((score, classIndex) => {
        let binNum = this.getBinNumber(score);
        let currentClass = this.classIndexToValueMap[classIndex];
        if (target == currentClass) {
          if (this.display.TP && predicted == currentClass) { // tp 
            histogramData[classIndex].data[binNum].tp[0].count += 1;
          } else if (this.display.FN) { // fn 
            histogramData[classIndex].data[binNum].fn[this.classValueToIndexMap[predicted]].count += 1;
          }
        } else {
          if (this.display.FP && predicted == currentClass) { // fp 
            histogramData[classIndex].data[binNum].fp[this.classValueToIndexMap[target]].count += 1;
          } else if (this.display.TN) { // tn
            histogramData[classIndex].data[binNum].tn[0].count += 1;
          }
        }
      })
    })
    return histogramData;
  }

  calculatePreviousSum(histogramData) {
    let numClasses = this.classNames.length;
    histogramData.forEach(histogram => {
      histogram.data.forEach(bin => {
        bin.fn[0].previousSum = 0
        bin.fp[0].previousSum = 0
        for (let i = 1; i < numClasses; i++){
          bin['fn'][i].previousSum = bin['fn'][i-1].previousSum + bin['fn'][i-1].count
          bin['fp'][i].previousSum = bin['fp'][i-1].previousSum + bin['fp'][i-1].count
        }
        bin['tn'][0].previousSum = bin['fn'][numClasses-1].previousSum + bin['fn'][numClasses-1].count
        bin['tp'][0].previousSum = bin['fp'][numClasses-1].previousSum + bin['fp'][numClasses-1].count
      })
    })
    return histogramData;
  }

  calculateMaxCount(classification) {
    return d3.max(this.histogramData.map(function(histogram){ // max in each class
      return d3.max(histogram.data.map(function(bin){
        return bin[classification][0].count + bin[classification][0].previousSum
      }))
    }))
  }

  render() {
    //if (this.showHistogram) {
      return html`
        <div class="histogram-container">
        ${this.histogramData.map(
          d => html`
              <proba-histogram
                .data=${d.data}
                .width=${this.width}
                .height=${this.height}
                .xMax=${this.xMax}
                .xScale=${this.xScale}
                .yScale=${this.yScale}
                .colorScale=${this.colorScale}>
              </proba-histogram>
            
          `
        )} 
        </div>
    `;
    /*} else {
      return html`
        <label>Data File</label>
        <input id="dataFile" type="file"></input>
        <button @click=${this.readData}>Generate</button>
      `
    }*/
  }
}

customElements.define('performance-analysis', PerformanceAnalysis);
