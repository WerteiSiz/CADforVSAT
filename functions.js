  // Константы
  const R3 = 6378; // радиус Земли в км
  const H = 35810; // высота спутника в км

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
      return (degrees(Math.atan(drop2)) + 180);
  }

  function dalnost(gradys_d, gradys_sh, tochka) {
      const sl_pdk = 1 + ((R3 / (R3 + H)) ** 2) - 2 * (R3 / (R3 + H)) * Math.cos(radians(gradys_sh));
      const koren = Math.sqrt(sl_pdk);
      const d = R3 * (koren / (R3 / (R3 + H)));
      return d;
  }

  function poteri(chastota, d) {
      const lenth = (3 * Math.pow(10, 8)) / (chastota * Math.pow(10, 9));
      const drop4 = Math.log10((4 * Math.PI * d * 1000) / lenth);
      return (20 * drop4);
  }

  function radians(degrees) {
      return degrees * (Math.PI / 180);
  }

  function degrees(radians) {
      return radians * (180 / Math.PI);
  }

  function calculate() {
      const gradys_d = parseFloat(document.getElementById('long').value);
      const gradys_sh = parseFloat(document.getElementById('lat').value);
      const tochka = parseFloat(document.getElementById('satellite').value);
      const chastota = parseFloat(document.getElementById('frequency').value);
      const diametr = parseFloat(document.getElementById('diameter').value);

      // Вычисления
      const angle_of_elevation = ygol_mesta(gradys_d, gradys_sh, tochka);
      const azimuth = Azimut(gradys_d, gradys_sh, tochka);
      const distance = dalnost(gradys_d, gradys_sh, tochka);
      const signal_loss = poteri(chastota, distance).toFixed(3);
      const wavelength = (3 * Math.pow(10, 8) / (chastota * Math.pow(10, 9))).toFixed(3);
      // Форматирование результата
      const resultText = `
          <h2>Результаты:</h2>
          <p>Угол места: ${angle_of_elevation.toFixed(2)}°</p>
          <p>Азимут: ${azimuth.toFixed(2)}°</p>
          <p>Наклонная дальность: ${distance.toFixed(2)} км</p>
          <p>Потери сигнала: ${signal_loss} дБ</p>
          <p>Длина волны: ${wavelength} м</p>
      `;

      document.getElementById("result").innerHTML = resultText;
      document.getElementById("result").style.display = "block";

      document.getElementById("thanks").innerText = "Спасибо за использование нашего калькулятора!";
      document.getElementById("thanks").style.display = "block";
  }