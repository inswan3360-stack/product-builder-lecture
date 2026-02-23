class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    text-align: center;
                }
                h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    color: var(--light-color);
                }
                .lotto-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 1rem;
                    margin: 2rem 0;
                }
                .lotto-ball {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 2rem;
                    font-weight: bold;
                    color: var(--dark-color);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.3);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .lotto-ball:hover {
                    transform: scale(1.1);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.3), inset 0 -8px 16px rgba(0,0,0,0.4);
                }
                .generate-btn {
                    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                    color: var(--dark-color);
                    border: none;
                    padding: 1rem 2rem;
                    font-size: 1.2rem;
                    font-weight: bold;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .generate-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }
                .generate-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
            </style>
            <h1>Lotto Number Generator</h1>
            <div class="lotto-container"></div>
            <button class="generate-btn">Generate Numbers</button>
        `;

        this.lottoContainer = this.shadowRoot.querySelector('.lotto-container');
        this.generateBtn = this.shadowRoot.querySelector('.generate-btn');

        this.generateBtn.addEventListener('click', () => this.updateNumbers());

        this.updateNumbers();
    }

    updateNumbers() {
        const numbers = this.generateNumbers();
        this.displayNumbers(numbers);
    }

    generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers);
    }

    displayNumbers(numbers) {
        this.lottoContainer.innerHTML = '';
        for (const number of numbers) {
            const ball = document.createElement('div');
            ball.classList.add('lotto-ball');
            ball.textContent = number;
            ball.style.backgroundColor = this.getColor(number);
            this.lottoContainer.appendChild(ball);
        }
    }

    getColor(number) {
        if (number <= 10) return '#f9e79f';
        if (number <= 20) return '#a9cce3';
        if (number <= 30) return '#f5b7b1';
        if (number <= 40) return '#d2b4de';
        return '#a3e4d7';
    }
}

customElements.define('lotto-generator', LottoGenerator);
