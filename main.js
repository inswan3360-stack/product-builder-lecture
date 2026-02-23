class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .input-section {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2rem;
                    border-radius: 15px;
                    margin-bottom: 2rem;
                    backdrop-filter: blur(10px);
                }
                .form-group {
                    margin-bottom: 1.5rem;
                    text-align: left;
                }
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                }
                input, select {
                    width: 100%;
                    padding: 0.8rem;
                    border-radius: 8px;
                    border: none;
                    background: rgba(255, 255, 255, 0.9);
                    color: #333;
                    font-size: 1rem;
                }
                .row {
                    display: flex;
                    gap: 1rem;
                }
                .row > div {
                    flex: 1;
                }
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1.5rem;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    color: #f7b733;
                }
                .lotto-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0.8rem;
                    margin: 2rem 0;
                }
                .lotto-ball {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #232526;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.3);
                    transition: transform 0.3s ease;
                }
                .bonus-ball {
                    border: 3px solid #fff;
                }
                .bonus-label {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                    color: #fff;
                }
                .saju-result {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-top: 2rem;
                    text-align: left;
                    line-height: 1.6;
                }
                .saju-title {
                    color: #f7b733;
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                    font-weight: bold;
                    border-bottom: 1px solid rgba(247, 183, 51, 0.3);
                    padding-bottom: 0.5rem;
                }
                .generate-btn {
                    background: linear-gradient(to right, #f7b733, #fc4a1a);
                    color: #fff;
                    border: none;
                    padding: 1rem 2rem;
                    font-size: 1.2rem;
                    font-weight: bold;
                    border-radius: 50px;
                    cursor: pointer;
                    width: 100%;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .generate-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }
            </style>
            <h1>사주 로또 번호 생성기</h1>
            
            <div class="input-section">
                <div class="form-group">
                    <label>생년월일</label>
                    <input type="date" id="birthdate" value="1990-01-01">
                </div>
                <div class="row">
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
                </div>
                <button class="generate-btn">사주 분석 및 번호 생성</button>
            </div>

            <div id="result-area" style="display: none;">
                <div class="saju-result">
                    <div class="saju-title">✨ 당신의 사주 분석 결과</div>
                    <div id="saju-text"></div>
                </div>

                <div class="lotto-container" id="lotto-main"></div>
                <div class="bonus-label">보너스 번호</div>
                <div class="lotto-container" id="lotto-bonus"></div>
            </div>
        `;

        this.resultArea = this.shadowRoot.querySelector('#result-area');
        this.sajuText = this.shadowRoot.querySelector('#saju-text');
        this.lottoMain = this.shadowRoot.querySelector('#lotto-main');
        this.lottoBonus = this.shadowRoot.querySelector('#lotto-bonus');
        this.generateBtn = this.shadowRoot.querySelector('.generate-btn');

        this.generateBtn.addEventListener('click', () => this.analyzeAndGenerate());
    }

    analyzeAndGenerate() {
        const birthdate = this.shadowRoot.querySelector('#birthdate').value;
        const birthtime = this.shadowRoot.querySelector('#birthtime').value;
        const gender = this.shadowRoot.querySelector('#gender').value;

        if (!birthdate) return alert('생년월일을 입력해주세요.');

        const saju = this.calculateSaju(birthdate, birthtime, gender);
        this.sajuText.innerHTML = saju.description;

        const numbers = this.generateSajuNumbers(saju.seed);
        this.displayNumbers(numbers);
        
        this.resultArea.style.display = 'block';
    }

    calculateSaju(date, time, gender) {
        // 간단한 사주 분석 로직 (데모용)
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

        let description = `당신은 <b>${yearGan}${yearJi}년</b>에 태어난 기운을 가지고 있습니다.<br>`;
        description += `오늘의 분석에 따르면 당신에게 행운을 가져다줄 오행은 <b>${luckyElement}</b>입니다.<br>`;
        description += `${gender === 'male' ? '남성' : '여성'}의 기운과 ${hour}시의 기운이 조화를 이루어 `;
        description += `재물운이 상승하는 시기입니다. 이 기운을 담아 번호를 생성했습니다.`;

        return {
            description: description,
            seed: year + month + day + hour + (gender === 'male' ? 1 : 2)
        };
    }

    generateSajuNumbers(seed) {
        // 사주 시드를 이용한 의사 난수 생성
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

        const sortedNumbers = Array.from(numbers);
        const bonus = sortedNumbers.pop();
        return { main: sortedNumbers.sort((a, b) => a - b), bonus };
    }

    displayNumbers(data) {
        this.lottoMain.innerHTML = '';
        this.lottoBonus.innerHTML = '';

        data.main.forEach(num => {
            const ball = this.createBall(num);
            this.lottoMain.appendChild(ball);
        });

        const bonusBall = this.createBall(data.bonus);
        bonusBall.classList.add('bonus-ball');
        this.lottoBonus.appendChild(bonusBall);
    }

    createBall(num) {
        const ball = document.createElement('div');
        ball.classList.add('lotto-ball');
        ball.textContent = num;
        ball.style.backgroundColor = this.getBallColor(num);
        return ball;
    }

    getBallColor(number) {
        if (number <= 10) return "#fbc400"; // 노랑
        if (number <= 20) return "#69c8f2"; // 파랑
        if (number <= 30) return "#ff7272"; // 빨강
        if (number <= 40) return "#aaaaaa"; // 회색
        return "#b0d840"; // 초록
    }
}

customElements.define('lotto-generator', LottoGenerator);
