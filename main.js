class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --bg-color: ${this.currentTheme === 'dark' ? '#1a1c1d' : '#f8f9fa'};
                    --card-bg: ${this.currentTheme === 'dark' ? '#2d2f31' : '#ffffff'};
                    --text-color: ${this.currentTheme === 'dark' ? '#e9ecef' : '#212529'};
                    --text-muted: ${this.currentTheme === 'dark' ? '#adb5bd' : '#6c757d'};
                    --input-bg: ${this.currentTheme === 'dark' ? '#3e4144' : '#ffffff'};
                    --input-border: ${this.currentTheme === 'dark' ? '#495057' : '#dee2e6'};
                    --primary-color: #f7b733;
                    --secondary-color: #fc4a1a;
                    --accent-color: #4dabf7;
                    
                    display: block;
                    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    color: var(--text-color);
                }

                .container {
                    background: var(--card-bg);
                    border-radius: 24px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                }

                .theme-toggle .toggle-btn {
                    background: var(--input-bg);
                    border: 1px solid var(--input-border);
                    color: var(--text-color);
                    padding: 8px 16px;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }

                h1 {
                    font-size: 2rem;
                    margin: 0;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 800;
                }

                .input-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                label {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                input, select {
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 2px solid var(--input-border);
                    background: var(--input-bg);
                    color: var(--text-color);
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }

                input:focus, select:focus {
                    outline: none;
                    border-color: var(--primary-color);
                }

                .generate-btn {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    border: none;
                    padding: 16px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    border-radius: 16px;
                    cursor: pointer;
                    width: 100%;
                    transition: transform 0.2s, box-shadow 0.2s;
                    margin-top: 10px;
                }

                .generate-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(252, 74, 26, 0.3);
                }

                .result-section {
                    margin-top: 40px;
                    padding-top: 40px;
                    border-top: 1px solid var(--input-border);
                }

                .saju-card {
                    background: var(--input-bg);
                    padding: 24px;
                    border-radius: 20px;
                    margin-bottom: 30px;
                    line-height: 1.6;
                    border-left: 4px solid var(--primary-color);
                }

                .saju-title {
                    font-weight: 800;
                    color: var(--primary-color);
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .lotto-set {
                    background: var(--input-bg);
                    padding: 20px;
                    border-radius: 20px;
                    margin-bottom: 20px;
                    position: relative;
                }

                .set-label {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .lotto-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .lotto-ball {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }

                .plus-sign {
                    font-size: 1.5rem;
                    font-weight: 300;
                    color: var(--text-muted);
                }

                .bonus-ball {
                    border: 3px solid var(--accent-color);
                }

                .actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                }

                .secondary-btn {
                    background: var(--input-bg);
                    color: var(--text-color);
                    border: 2px solid var(--input-border);
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    flex: 1;
                    transition: all 0.2s;
                }

                .secondary-btn:hover {
                    background: var(--input-border);
                }

                @media (max-width: 600px) {
                    .container { padding: 24px; }
                    .lotto-ball { width: 40px; height: 40px; font-size: 1rem; }
                    h1 { font-size: 1.5rem; }
                }
            </style>
            
            <div class="container">
                <div class="header">
                    <h1>Saju Lotto</h1>
                    <div class="theme-toggle">
                        <button class="toggle-btn" id="theme-toggle">
                            ${this.currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                        </button>
                    </div>
                </div>

                <div class="input-grid">
                    <div class="form-group">
                        <label>생년월일</label>
                        <input type="date" id="birthdate" value="1990-01-01">
                    </div>
                    <div class="form-group">
                        <label>태어난 시간</label>
                        <input type="time" id="birthtime" value="12:00">
                    </div>
                    <div class="form-group">
                        <label>성별</label>
                        <select id="gender">
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>생성 개수</label>
                        <select id="set-count">
                            <option value="1">1개 세트</option>
                            <option value="2">2개 세트</option>
                            <option value="3">3개 세트</option>
                            <option value="4">4개 세트</option>
                            <option value="5" selected>5개 세트</option>
                        </select>
                    </div>
                </div>
                
                <button class="generate-btn" id="main-generate">분석 및 번호 생성</button>

                <div id="result-area" style="display: none;" class="result-section">
                    <div class="saju-card">
                        <div class="saju-title">✨ 사주 분석 결과</div>
                        <div id="saju-text"></div>
                    </div>

                    <div id="lotto-sets-container"></div>

                    <div class="actions">
                        <button class="secondary-btn" id="regenerate-btn">번호만 다시 생성</button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.updateBodyBackground();
    }

    setupEventListeners() {
        this.resultArea = this.shadowRoot.querySelector('#result-area');
        this.sajuText = this.shadowRoot.querySelector('#saju-text');
        this.setsContainer = this.shadowRoot.querySelector('#lotto-sets-container');
        this.generateBtn = this.shadowRoot.querySelector('#main-generate');
        this.regenerateBtn = this.shadowRoot.querySelector('#regenerate-btn');
        this.themeToggle = this.shadowRoot.querySelector('#theme-toggle');

        this.generateBtn.addEventListener('click', () => this.handleGenerate(true));
        this.regenerateBtn.addEventListener('click', () => this.handleGenerate(false));
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.currentTheme);
        this.render();
    }

    updateBodyBackground() {
        document.body.style.backgroundColor = this.currentTheme === 'dark' ? '#1a1c1d' : '#f8f9fa';
        document.body.style.transition = 'background-color 0.3s ease';
    }

    handleGenerate(isNewAnalysis) {
        const birthdate = this.shadowRoot.querySelector('#birthdate').value;
        const birthtime = this.shadowRoot.querySelector('#birthtime').value;
        const gender = this.shadowRoot.querySelector('#gender').value;
        const setCount = parseInt(this.shadowRoot.querySelector('#set-count').value);

        if (!birthdate) return alert('생년월일을 입력해주세요.');

        if (isNewAnalysis || !this.lastSaju) {
            this.lastSaju = this.calculateSaju(birthdate, birthtime, gender);
            this.sajuText.innerHTML = this.lastSaju.description;
        }

        this.displayMultipleSets(this.lastSaju.seed, setCount);
        this.resultArea.style.display = 'block';
        
        // 결과 영역으로 스크롤
        setTimeout(() => {
            this.resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    calculateSaju(date, time, gender) {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const hour = parseInt(time.split(':')[0]);

        const gan = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
        const ji = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
        
        const yearGan = gan[(year - 4) % 10];
        const yearJi = ji[(year - 4) % 12];
        const elements = ["목(木)", "화(火)", "토(土)", "금(金)", "수(水)"];
        const luckyElement = elements[(year + month + day + hour) % 5];

        let description = `당신은 <b>${yearGan}${yearJi}년</b>에 태어난 기운을 가지고 있습니다. `;
        description += `당신에게 행운을 가져다줄 오행은 <b>${luckyElement}</b>이며, `;
        description += `${hour}시의 기운이 조화를 이루어 재물운이 상승하는 흐름입니다.`;

        return {
            description,
            seed: year + month + day + hour + (gender === 'male' ? 1 : 2) + Date.now()
        };
    }

    displayMultipleSets(baseSeed, count) {
        this.setsContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const seed = baseSeed + (i * 1000) + Math.random() * 1000;
            const numbers = this.generateLottoNumbers(seed);
            this.renderSet(numbers, i + 1);
        }
    }

    generateLottoNumbers(seed) {
        const numbers = new Set();
        let currentSeed = seed;
        const nextRand = () => {
            currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
            return currentSeed;
        };

        while (numbers.size < 7) {
            const num = (nextRand() % 45) + 1;
            numbers.add(num);
        }

        const arr = Array.from(numbers);
        const bonus = arr.pop();
        return { main: arr.sort((a, b) => a - b), bonus };
    }

    renderSet(data, index) {
        const setDiv = document.createElement('div');
        setDiv.classList.add('lotto-set');
        
        let ballsHtml = data.main.map(num => 
            `<div class="lotto-ball" style="background-color: ${this.getBallColor(num)}">${num}</div>`
        ).join('');

        setDiv.innerHTML = `
            <div class="set-label">Game ${index}</div>
            <div class="lotto-row">
                ${ballsHtml}
                <div class="plus-sign">+</div>
                <div class="lotto-ball bonus-ball" style="background-color: ${this.getBallColor(data.bonus)}">${data.bonus}</div>
            </div>
        `;
        this.setsContainer.appendChild(setDiv);
    }

    getBallColor(number) {
        if (number <= 10) return "#fbc400";
        if (number <= 20) return "#69c8f2";
        if (number <= 30) return "#ff7272";
        if (number <= 40) return "#aaaaaa";
        return "#b0d840";
    }
}

customElements.define('lotto-generator', LottoGenerator);
