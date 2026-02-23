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
                    --wood: #4caf50; --fire: #f44336; --earth: #ff9800; --metal: #9e9e9e; --water: #2196f3;
                    
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
                }

                h1 {
                    font-size: 2.2rem;
                    margin: 0;
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 800;
                }

                .input-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .form-group { display: flex; flex-direction: column; gap: 8px; }
                label { font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
                input, select {
                    padding: 12px 16px;
                    border-radius: 12px;
                    border: 2px solid var(--input-border);
                    background: var(--input-bg);
                    color: var(--text-color);
                    font-size: 1rem;
                }

                .generate-btn {
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white; border: none; padding: 18px; font-size: 1.2rem;
                    font-weight: 700; border-radius: 16px; cursor: pointer; width: 100%;
                    transition: all 0.2s;
                }

                .generate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(252, 74, 26, 0.3); }

                .saju-table {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    margin: 25px 0;
                }

                .saju-cell {
                    background: var(--input-bg);
                    padding: 15px 5px;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid var(--input-border);
                }

                .cell-label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; }
                .cell-char { font-size: 1.8rem; font-weight: 900; margin: 5px 0; }

                .analysis-card {
                    background: var(--input-bg);
                    padding: 24px;
                    border-radius: 20px;
                    margin-bottom: 30px;
                    line-height: 1.7;
                    border-left: 5px solid var(--primary-color);
                    text-align: left;
                }

                .lotto-set {
                    background: var(--input-bg);
                    padding: 25px;
                    border-radius: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .lotto-row { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
                .lotto-ball {
                    width: 52px; height: 52px; border-radius: 50%;
                    display: flex; justify-content: center; align-items: center;
                    font-size: 1.3rem; font-weight: 800; color: white;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                }

                .wood-bg { color: var(--wood); } .fire-bg { color: var(--fire); }
                .earth-bg { color: var(--earth); } .metal-bg { color: var(--metal); }
                .water-bg { color: var(--water); }

                .actions { display: flex; gap: 15px; margin-top: 30px; }
                .secondary-btn {
                    background: var(--input-bg); color: var(--text-color); border: 2px solid var(--input-border);
                    padding: 14px; border-radius: 12px; font-weight: 600; cursor: pointer; flex: 1;
                }

                @media (max-width: 600px) {
                    .saju-table { gap: 5px; }
                    .cell-char { font-size: 1.4rem; }
                }
            </style>
            
            <div class="container">
                <div class="header">
                    <h1>명리(命理) 로또</h1>
                    <button class="toggle-btn" id="theme-toggle">${this.currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
                </div>

                <div class="input-grid">
                    <div class="form-group"><label>생년월일</label><input type="date" id="birthdate" value="1990-01-01"></div>
                    <div class="form-group"><label>태어난 시간</label><input type="time" id="birthtime" value="12:00"></div>
                    <div class="form-group"><label>성별</label><select id="gender"><option value="male">남성</option><option value="female">여성</option></select></div>
                    <div class="form-group"><label>생성 개수</label><select id="set-count"><option value="1">1세트</option><option value="3">3세트</option><option value="5" selected>5세트</option></select></div>
                </div>
                
                <button class="generate-btn" id="main-generate">운세 분석 및 번호 추출</button>

                <div id="result-area" style="display: none;" class="result-section">
                    <div class="analysis-card">
                        <div style="font-weight:800; color:var(--primary-color); font-size:1.2rem; margin-bottom:15px;">☯️ 사주팔자(四柱八字) 분석</div>
                        <div class="saju-table" id="saju-table"></div>
                        <div id="saju-text"></div>
                    </div>

                    <div id="lotto-sets-container"></div>
                    <div class="actions"><button class="secondary-btn" id="regenerate-btn">기운 재조합 번호 생성</button></div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.updateBodyBackground();
    }

    setupEventListeners() {
        this.resultArea = this.shadowRoot.querySelector('#result-area');
        this.sajuText = this.shadowRoot.querySelector('#saju-text');
        this.sajuTable = this.shadowRoot.querySelector('#saju-table');
        this.setsContainer = this.shadowRoot.querySelector('#lotto-sets-container');
        this.generateBtn = this.shadowRoot.querySelector('#main-generate');
        this.regenerateBtn = this.shadowRoot.querySelector('#regenerate-btn');
        this.shadowRoot.querySelector('#theme-toggle').addEventListener('click', () => this.toggleTheme());

        this.generateBtn.addEventListener('click', () => this.handleGenerate(true));
        this.regenerateBtn.addEventListener('click', () => this.handleGenerate(false));
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.currentTheme);
        this.render();
    }

    updateBodyBackground() {
        document.body.style.backgroundColor = this.currentTheme === 'dark' ? '#1a1c1d' : '#f8f9fa';
    }

    handleGenerate(isNewAnalysis) {
        const date = this.shadowRoot.querySelector('#birthdate').value;
        const time = this.shadowRoot.querySelector('#birthtime').value;
        const gender = this.shadowRoot.querySelector('#gender').value;
        const setCount = parseInt(this.shadowRoot.querySelector('#set-count').value);

        if (!date) return alert('생년월일을 선택해주세요.');

        if (isNewAnalysis || !this.lastSaju) {
            this.lastSaju = this.calculateDetailedSaju(date, time, gender);
            this.renderSajuTable(this.lastSaju.palja);
            this.sajuText.innerHTML = this.lastSaju.analysis;
        }

        this.displayMultipleSets(this.lastSaju.seed, setCount);
        this.resultArea.style.display = 'block';
        setTimeout(() => this.resultArea.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    calculateDetailedSaju(dateStr, timeStr, gender) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = parseInt(timeStr.split(':')[0]);

        const stems = ["갑(甲)", "을(을)", "병(丙)", "정(丁)", "무(戊)", "기(己)", "경(庚)", "신(辛)", "임(壬)", "계(癸)"];
        const branches = ["자(子)", "축(丑)", "인(寅)", "묘(卯)", "진(辰)", "사(巳)", "오(午)", "미(未)", "신(申)", "유(酉)", "술(戌)", "해(亥)"];
        const elements = ["목", "화", "토", "금", "수"];
        
        const getGanji = (val) => ({ stem: stems[val % 10], branch: branches[val % 12], elem: elements[val % 5] });

        const yearG = getGanji(year - 4);
        const monthG = getGanji(year * 12 + month + 2);
        const dayG = getGanji(Math.floor(date.getTime() / (1000*60*60*24)) + 23);
        const hourG = getGanji(dayG.stem === stems[0] ? hour : hour + 5);

        const palja = [
            { label: '시주(時)', stem: hourG.stem, branch: hourG.branch },
            { label: '일주(日)', stem: dayG.stem, branch: dayG.branch },
            { label: '월주(月)', stem: monthG.stem, branch: monthG.branch },
            { label: '연주(年)', stem: yearG.stem, branch: yearG.branch }
        ];

        let analysis = `귀하의 명조는 <b>${dayG.stem}</b> 일간을 중심으로 형성되어 있습니다. `;
        analysis += `사주에 <b>${yearG.elem}</b>의 기운이 강하게 작용하여 운세의 흐름이 돋보입니다.<br><br>`;
        analysis += `추출된 번호들은 귀하의 명리학적 기운을 보강하도록 조합되었습니다.`;

        // Seed must be integer
        const seed = Math.floor(year + month + day + hour + (gender === 'male' ? 7 : 3));
        return { palja, analysis, seed };
    }

    renderSajuTable(palja) {
        this.sajuTable.innerHTML = palja.map(p => `
            <div class="saju-cell">
                <div class="cell-label">${p.label}</div>
                <div class="cell-char ${this.getElemClass(p.stem)}">${p.stem[2]}</div>
                <div class="cell-char ${this.getElemClass(p.branch)}">${p.branch[2]}</div>
            </div>
        `).join('');
    }

    getElemClass(char) {
        if ("갑을인묘".includes(char[2])) return "wood-bg";
        if ("병정사오".includes(char[2])) return "fire-bg";
        if ("무기진술축미".includes(char[2])) return "earth-bg";
        if ("경신신유".includes(char[2])) return "metal-bg";
        return "water-bg";
    }

    displayMultipleSets(baseSeed, count) {
        this.setsContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            // Using a unique but predictable seed for each set
            const seed = Math.floor(baseSeed + (i * 777) + (Math.random() * 1000000));
            const data = this.generateLottoNumbers(seed);
            this.renderSet(data, i + 1);
        }
    }

    generateLottoNumbers(seed) {
        const numbers = new Set();
        let s = Math.abs(Math.floor(seed)) || 1;
        
        // Improved LCG (Linear Congruential Generator) to ensure integers
        const next = () => {
            s = (s * 16807) % 2147483647;
            return s;
        };

        while (numbers.size < 7) {
            const num = (next() % 45) + 1;
            numbers.add(Math.floor(num));
        }

        const arr = Array.from(numbers);
        const bonus = arr.pop();
        return { main: arr.sort((a, b) => a - b), bonus };
    }

    renderSet(data, index) {
        const div = document.createElement('div');
        div.classList.add('lotto-set');
        div.innerHTML = `
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:15px;">운맞이 제 ${index}수</div>
            <div class="lotto-row">
                ${data.main.map(n => `<div class="lotto-ball" style="background:${this.getBallColor(n)}">${n}</div>`).join('')}
                <div style="font-size:1.5rem; color:var(--text-muted)">+</div>
                <div class="lotto-ball" style="background:${this.getBallColor(data.bonus)}; border:3px solid var(--accent-color)">${data.bonus}</div>
            </div>
        `;
        this.setsContainer.appendChild(div);
    }

    getBallColor(n) {
        if (n <= 10) return "#fbc400"; if (n <= 20) return "#69c8f2";
        if (n <= 30) return "#ff7272"; if (n <= 40) return "#aaaaaa";
        return "#b0d840";
    }
}
customElements.define('lotto-generator', LottoGenerator);
