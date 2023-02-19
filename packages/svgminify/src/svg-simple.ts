import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import {optimize} from 'svgo'


// https://github.com/dr-js/imagemin-min/blob/20e2820da6dbfcded4ec75770df3f73e14760afe/source/battery/svgo.js#L7
const OPTION_DEFAULT = { // same default as `imagemin-svgo`
  isCommonPatch: true,
  floatPrecision: 2, // customize plugin option for `cleanupNumericValues`
  plugins: [
    'preset-default',
    'removeScriptElement' // enable builtin plugin not included in default preset
  ]
}

@customElement('svg-simple')
export class SvgSimple extends LitElement {

  @property()
  text = `<svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title>file_type_nix</title><path d="M13,11.115,6.183,23.76,4.59,20.87l1.839-3.387-3.651-.01L2,16.029l.8-1.477,5.2.018,1.868-3.447Z" style="fill:#7ebae4;fill-rule:evenodd"/><path d="M13.527,21.223h13.64l-1.541,2.922-3.658-.011,1.817,3.389-.779,1.449-1.593,0-2.584-4.825-3.722-.008Z" style="fill:#7ebae4;fill-rule:evenodd"/><path d="M21.467,15.682,14.647,3.037l3.134-.032L19.6,6.4l1.834-3.379h1.557L23.786,4.5,21.174,9.307l1.854,3.455Z" style="fill:#7ebae4;fill-rule:evenodd"/><path d="M10.542,16.324l6.821,12.645L14.229,29l-1.821-3.4-1.834,3.38H9.016l-.8-1.476L10.831,22.7,8.976,19.243Z" style="fill:#5277c3;fill-rule:evenodd"/><path d="M18.464,10.751H4.823L6.365,7.829l3.658.011L8.207,4.451,8.986,3l1.592,0,2.584,4.825,3.722.008Z" style="fill:#5277c3;fill-rule:evenodd"/><path d="M19,20.888,25.817,8.244l1.593,2.89L25.571,14.52l3.651.01L30,15.979l-.8,1.477-5.2-.018-1.868,3.447Z" style="fill:#5277c3;fill-rule:evenodd"/></svg>`

  @property()
  optimizedText = `<svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path xmlns="http://www.w3.org/2000/svg" d="M13 11.12 6.18 23.76 4.6 20.87l1.84-3.39H2.78L2 16.02l.8-1.48 5.2.02 1.87-3.45ZM13.53 21.22h13.64l-1.54 2.93-3.66-.02 1.82 3.4-.78 1.44h-1.6l-2.58-4.82-3.72-.01ZM21.47 15.68 14.65 3.04 17.78 3 19.6 6.4l1.83-3.38H23l.8 1.48-2.62 4.8 1.86 3.46Z" style="fill:#7ebae4;fill-rule:evenodd"/><path xmlns="http://www.w3.org/2000/svg" d="m10.54 16.32 6.82 12.65-3.13.03-1.82-3.4-1.84 3.38H9.02l-.8-1.48 2.61-4.8-1.85-3.46ZM18.46 10.75H4.82l1.54-2.92 3.66.01-1.81-3.39L8.99 3h1.59l2.58 4.83h3.72ZM19 20.89l6.82-12.65 1.59 2.9-1.84 3.38 3.65.01.78 1.45-.8 1.48-5.2-.02-1.87 3.44Z" style="fill:#5277c3;fill-rule:evenodd"/></svg>`

  @property()
  actionText = 'no data in clipboard'

  parser = new DOMParser()

  constructor(){
    super()
    document.addEventListener('paste', this.handlePaste)
  }

  handlePaste = async () => {
    const text = await navigator.clipboard.readText()
    try{
      const svgF = this.parser.parseFromString(text,'image/svg+xml')
      if(svgF.childNodes[0].nodeName === 'svg'){
        this.optimizedText = optimize(text,OPTION_DEFAULT as any).data
        this.text = text
        this.actionText = 'optimizedSVG without <svg> has been wirtten to clipboard'
        const svgOptimezed = this.parser.parseFromString(this.optimizedText,'image/svg+xml')
        navigator.clipboard.writeText(svgOptimezed.documentElement.innerHTML)
      }else{
        this.actionText = 'data pasted is not svg'
    }
    }catch(e){
      this.actionText = 'data pasted is not svg'
    }
  }

  save = () => {
    const oldSize = new Blob([this.text]).size
    const newSize = new Blob([this.optimizedText]).size
    return (oldSize-newSize)/oldSize
  }

  // https://stackoverflow.com/questions/60391454/litelement-render-problem-using-svg-strings-to-construct-nested-svgs
  render() {
    const svgOriginnal = this.parser.parseFromString(this.text,'image/svg+xml')
    const svgOptimezed = this.parser.parseFromString(this.optimizedText,'image/svg+xml')

    const svgOriginalSVG = svgOriginnal.documentElement.innerHTML
    const svgOptimizedSVG = svgOptimezed.documentElement.innerHTML

    return html`
    <div id="text-container">
    <div>
      <textarea rows="20" cols="70" readonly disabled style="resize: none;" >${svgOriginalSVG}</textarea>
    </div>
    <div>
      <textarea rows="20" cols="70" readonly disabled style="resize: none;" >${svgOptimizedSVG}</textarea>
    </div>
    </div>
    <h1>${this.actionText}</h1>
    <div class="save-percent">
      saved: ${this.save()*100}%
    </div>
    <div id='svg-container'>
    <div class="per-svg">
    <span>before</span>
    <svg height="50vh" width="50%" viewBox="${svgOriginnal.documentElement.getAttribute('viewBox')}" xmlns="http://www.w3.org/2000/svg">
      ${unsafeSVG(svgOriginalSVG)}
    </svg>
    </div>
    <div class="per-svg">
    <span>after</span>
    <svg height="50vh" width="50%" viewBox="${svgOptimezed.documentElement.getAttribute('viewBox')}" xmlns="http://www.w3.org/2000/svg">
      ${unsafeSVG(svgOptimizedSVG)}
    </svg>
    </div>
    </div>
    `
  }


  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    #text-container {
      display: flex;
    }

    #svg-container {
      display: flex;
    }

    .save-percent {
      font-size: 30px;
      color: #0000ff66;
    }

    .per-svg {
      display: flex;
      flex: 1;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'svg-simple': SvgSimple
  }
}
