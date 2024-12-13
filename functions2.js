// Константы
const R3 = 6378; // радиус Земли в км
const H = 35.810; // высота спутника в км 

function radians(degrees) {
    return degrees * (Math.PI / 180);
}

function degrees(radians) {
    return radians * (180 / Math.PI);
}

function ygol_mesta(gradys_d, gradys_sh, tochka) {
    const delta_y = gradys_d - tochka;
    const cos_delta_y = Math.cos(radians(delta_y));
    const cosinusFi = Math.cos(radians(gradys_sh));
    const cosinustri = cosinusFi * cos_delta_y;
    const y0 = R3 / (R3 + H);
    const c = cosinustri - y0;
    const e = Math.sqrt(1 - (cosinustri * cosinustri));
    const drop = c / e;
    return degrees(Math.atan(drop));
}

function Azimut(gradys_d, gradys_sh, tochka) {
    const tangens_delta_y = Math.tan(radians(gradys_d - tochka));
    const sinus_fi = Math.sin(radians(gradys_sh));
    const drop2 = tangens_delta_y / sinus_fi;
    return (degrees(Math.atan(drop2)) + 180) % 360; // Обеспечиваем диапазон [0, 360)
}

function dalnost(gradys_d, gradys_sh, tochka) {
    const sl_pdk = 1 + ((R3 / (R3 + H)) ** 2) - 2 * (R3 / (R3 + H)) * Math.cos(radians(gradys_sh));
    const koren = Math.sqrt(sl_pdk);
    const d = R3 * (koren / (R3 / (R3 + H)));
    return d;
}

function poteri(chastota, d) {
    const length = (3 * Math.pow(10, 8)) / (chastota * Math.pow(10, 9));
    const drop4 = Math.log10((4 * Math.PI * d * 1000) / length);
    return (20 * drop4);
}

function factorG(chastota, k, diametr) {
    let length = (3 * Math.pow(10, 8) / (chastota * Math.pow(10, 9)));
    let drop5 = Math.pow((Math.PI * diametr) / length, 2);
    let G = 10 * Math.log10(k * drop5);
    return G;
}

function atmosphere(chastota, gradys_d, gradys_sh, tochka, T, p, P) {
    let h0 = 6 * 1000; // км в метры
    let h3 = 0.02;
    let l1 = (5.98 / Math.sin(radians(ygol_mesta(gradys_d, gradys_sh, tochka))));
    let delta1 = (0.0126 / Math.pow(T, 0.75));
    let delta2 = (0.035 / Math.pow(T, 0.75));
    let deltas = 0.0153 * (1 + 0.0046 * p) / Math.pow(T, 0.5);
    let drop6 = 1 / Math.pow(chastota - 183.3, 2);
    let drop7 = 1 / Math.pow(chastota - 323.8, 2);
    let drop8 = 3 / (Math.pow(chastota - 22.3, 2) + 3);
    let hh20 = drop6 + drop7 + 2.2 + drop8;
    let l2 = ((hh20 - h3) / Math.sin(radians(ygol_mesta(gradys_d, gradys_sh, tochka))));
    let drooop = hh20 - h3;
    let drop9 = Math.pow(chastota, 2) / Math.pow(T, 2);
    let drop10 = P * delta2;
    let drop11 = Math.pow(2 - (chastota / 30), 2);
    let drop12 = (drop10 / drop11 + Math.pow(drop10, 2));
    let drop13 = P * delta1;
    let drop14 = Math.pow(chastota, 2) / 900;
    let drop15 = (drop13 / (Math.pow(drop13, 2) + drop14));
    let drop16 = Math.pow(2 + (chastota / 30), 2);
    let drop17 = (drop10 / (drop16 + Math.pow(drop10, 2)));
    let l0 = 0.321 * P * drop9 * (drop12 + drop15 + drop17);
    let drop18 = P * deltas / (Math.pow(-0.741 + (chastota / 30), 2) + Math.pow(deltas * P, 2));
    let drop19 = P * deltas / (Math.pow(0.741 + (chastota / 30), 2) + Math.pow(deltas * P, 2));
    let drop20 = 644 / T;
    let drop21 = ((5.72 * p * Math.pow(chastota, 2) * Math.exp(drop20)) / Math.pow(T, 2.5));
    let drop22 = (P * deltas * p) / T;
    let lh20 = (drop18 + 0.0163 * Math.pow(chastota, 2) * drop22 + drop19) * drop21;
    let latmosphere = ((l0 * l1) + (lh20 * l2));
    return latmosphere;
}

function calculate() {
    const gradys_d = parseFloat(document.getElementById('long1').value);
    const gradys_sh = parseFloat(document.getElementById('lat1').value);
    const tochka = parseFloat(document.getElementById('satellite1').value);
    const chastota = parseFloat(document.getElementById('frequency1').value);
    const diametr = parseFloat(document.getElementById('diameter1').value);
    const k = parseFloat(document.getElementById('coefficient1').value);
    const T = parseFloat(document.getElementById('temperature1').value);
    const p = parseFloat(document.getElementById('air1').value);
    const P = parseFloat(document.getElementById('pressure1').value);
    
    // Вычисления
    const angle_of_elevation = ygol_mesta(gradys_d, gradys_sh, tochka);
    const azimuth = Azimut(gradys_d, gradys_sh, tochka);
    const distance = dalnost(gradys_d, gradys_sh, tochka);
    const signal_loss = poteri(chastota, distance).toFixed(3);
    const wavelength = (3 * Math.pow(10, 8) / (chastota * Math.pow(10, 9))).toFixed(3);
    const atmos = atmosphere(chastota, gradys_d, gradys_sh, tochka, T, p, P).toFixed(3);
    const gain = factorG(chastota, diametr, k).toFixed(3);
    
    // Форматирование результата
    const resultText = `
        <h2>Результаты энергетического расчета ИЗС-ЗС:</h2>
        <p>Длина волны: ${wavelength} м</p>
        <p>Потери сигнала в свободном пространстве: ${signal_loss} дБ</p>
        <p>Потери энергии сигнала в атмосфере: ${atmos} дБ</p>
        <p>Коэффициент усиления: ${gain} дБ</p>
    `;

    document.getElementById("result").innerHTML = resultText;
    document.getElementById("result").style.display = "block";

    document.getElementById("thanks").innerText = "Спасибо за использование нашего калькулятора!";
    document.getElementById("thanks").style.display = "block";
}