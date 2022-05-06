class WcRelogio extends HTMLElement {
  static observedAttributes = ['tipo']

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = `
      :host {
        display: inline-block;
      }
    `
    this.shadowRoot.append(style)

    this.content = document.createElement('div')
    this.shadowRoot.append(this.content)
  }

  connectedCallback() {
    this.exibeRelogio()
    this.interval = setInterval(() => {
      this.exibeRelogio()
    }, 500)
  }

  disconnectedCallback() {
    clearInterval(this.interval)
  }

  attributeChangedCallback() {
    this.exibeRelogio()
  }

  exibeRelogio() {
    const analogico = this.getAttribute('tipo') === 'analogico'
    if (analogico) {
      this.exibeRelogioAnalogico()
    } else {
      this.exibeRelogioDigital()
    }
  }

  exibeRelogioDigital() {
    const date = new Date()
    this.content.textContent = formataHora(date)
  }

  exibeRelogioAnalogico() {
    const date = new Date()
    const sec = date.getSeconds()
    const min = date.getMinutes() + sec / 60
    const h = (date.getHours() % 12) + min / 60

    this.content.innerHTML = `
      <svg width="100" height="100">
      <g transform="translate(50, 50)">
        <circle cx="0" cy="0" r="45" fill="none" stroke="black" stroke-width="2" />
        <g stroke="black" stroke-width="2">
          ${geraMarcacoes()}
        </g>
        <g transform="rotate(${(h / 12) * 360})">
          <path d="M 0 0 v -35" stroke="black" stroke-width="3" />
        </g>
        <circle cx="0" cy="0" r="4"/>
        <g transform="rotate(${(min / 60) * 360})">
          <path d="M 0 0 v -40" stroke="black" stroke-width="2" />
        </g>
        <g transform="rotate(${(sec / 60) * 360})">
          <path d="M 0 0 v -40" stroke="red" stroke-width="2" />
        </g>
        <circle cx="0" cy="0" r="2" fill="red"/>
      </g>
      </svg>
    `
  }
}

function geraMarcacoes() {
  let marcacoes = ''
  for (let i = 0; i < 12; i++) {
    marcacoes += `<path transform="rotate(${i * 30})" d="M 0 -42 V -45" />`
  }
  return marcacoes
}

function formataHora(date) {
  return date.toLocaleTimeString()
}

customElements.define('wc-relogio', WcRelogio)
