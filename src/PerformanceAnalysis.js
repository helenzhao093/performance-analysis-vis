import { LitElement, html, css } from 'lit-element';

import './Histogram.js';

export class PerformanceAnalysis extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      numBins : { type: Number },
      display : { type: Object },  
      minScore : { type: Number },
      maxScore : { type: Number },
      showHistogram: { type: Boolean },
      histogramData : { type : Array }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('connected');
    this.showHistogram = false;
    this.numBins = 1;
    this.height = 400;
    this.width = 300;
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

  initializeHistogramData() {
    let histogramData = this.proba[0].map((d, i) => {
      return {classNum: i, className: "class" + i, data: []}
    })
    this.classNames = this.proba[0].map((_, i) => { return 'class' + i } )
    let binNums = [...Array(this.numBins).keys()];  
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
        if (target === classIndex) {
          if (this.display.TP && predicted === target) { // tp 
            histogramData[classIndex].data[binNum].tp[0].count += 1;
          } else if (this.display.FN) { // fn 
            histogramData[classIndex].data[binNum].fn[predicted].count += 1;
          }
        } else {
          if (this.display.FP && predicted === classIndex) { // fp 
            histogramData[classIndex].data[binNum].fp[target].count += 1;
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
    /*return Math.max(...this.histogramData.map(histogram => {
      return Math.max(...histogram.data.map(bin => {
        return bin[classification][0].count + bin[classification][0].previousSum
      }))
    }))*/
    return d3.max(this.histogramData.map(function(histogram){ // max in each class
      return d3.max(histogram.data.map(function(bin){
        return bin[classification][0].count + bin[classification][0].previousSum
      }))
    }))
  }

  getGraphFunctions() {    
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
  }

  constructHistogramData() {
    let histogramData = this.initializeHistogramData();
    histogramData = this.calculateBinCounts(histogramData);
    histogramData = this.calculatePreviousSum(histogramData);
    this.histogramData = [...histogramData];
    console.log(this.histogramData);
  }

  async readFile(file) {
    return new Promise((resolve, reject) => {
      let parsedData = []
      if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (e) {
          let results = e.target.result;
          
          results.split('\n').forEach(l => {
            let parsed = JSON.parse('[' + l + ']');
            if (parsed && parsed.length > 0) {
              parsedData.push(parsed);
            }
          })
          console.log(parsedData);
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

  async readData(event) {
    let targetFile = this.shadowRoot.getElementById('targetFile').files[0];
    this.target = await this.readFile(targetFile)
    this.target = this.target.map(d => d[0]);

    let predictionFile = this.shadowRoot.getElementById('predictionFile').files[0];
    this.prediction = await this.readFile(predictionFile);
    this.prediction = this.prediction.map(d => d[0]);

    let probaFile = this.shadowRoot.getElementById('probaFile').files[0];
    this.proba = await this.readFile(probaFile);

    this.constructHistogramData();
    this.getGraphFunctions();
    this.showHistogram = true;
  }

  render() {
    if (this.showHistogram) {
      console.log(this.histogramData)
      return html`
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
    `;
    } else {
      return html`
        <label>Target</label>
        <input id="targetFile" type="file"></input>
        <label>Prediction</label>
        <input id="predictionFile" type="file"></input>
        <label>Probability Scores</label>
        <input id="probaFile" type="file"></input>
        <button @click=${this.readData}>Generate</button>
      `
    }
    
    
    /**/
  }
}
