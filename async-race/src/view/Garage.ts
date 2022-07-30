import ICar from '../interfaces/car';
import Model from '../model/Model';
import App from '../controller/App';

class Garage {

  constructor() {}

  createGarage(cars: ICar[]) {
    const dom: HTMLElement = document.createElement('div');
    dom.innerHTML = this.createMenu() + this.createControls();
    cars.forEach((car: ICar) => {
      dom.insertAdjacentHTML('beforeend', this.createCarElement(car));
    });
    return dom;
  }

  createMenu() {
    return `
      <div class='top-menu'>
        <button>To garage</button>
        <button>To winners</button>
      </div>
    `;
  }

  createControls() {
    return `
      <div class='controls'>
        <label><input type='text'> <input type='color' /> <button>Create</button></label>
        <label><input type='text'> <input type='color' /> <button>Update</button></label>
        <button>Race</button> <button>Reset</button>
      </div>
    `;
  }

  createCarElement(car: ICar) {
    return `
      <div class='car-wrapper'>
        <button>Select</button> <button>Remove</button>
        <button class='button-start' id='start-${car.id}'>Start</button> <button>Stop</button>
        <div class='car-name'>${car.name}</div>
        <svg id='car-${car.id}' version="1.0" xmlns="http://www.w3.org/2000/svg" width="50px" viewBox="0 0 1280.000000 806.000000" preserveAspectRatio="xMidYMid meet" style="transform: scale(-1,1)"> <g transform="translate(0.000000,806.000000) scale(0.100000,-0.100000)" fill="${car.color}" stroke="none"> <path d="M6736 8049 c-1092 -74 -2057 -470 -2916 -1198 -188 -159 -476 -443 -656 -646 -119 -133 -241 -282 -414 -503 -296 -377 -501 -556 -734 -641 -47 -16 -187 -53 -313 -81 -340 -75 -481 -121 -698 -224 -229 -110 -368 -208 -517 -364 -245 -258 -394 -613 -452 -1082 -37 -298 -47 -701 -20 -878 61 -413 316 -750 723 -954 l95 -48 181 0 c100 0 184 2 187 5 3 3 2 26 -3 50 -22 118 -30 309 -20 448 25 314 83 530 216 802 115 237 242 411 431 595 330 320 725 516 1184 587 158 24 473 24 625 0 650 -106 1178 -456 1521 -1010 240 -386 352 -889 299 -1332 -8 -66 -15 -126 -15 -132 0 -10 257 -13 1250 -13 688 0 1250 1 1250 3 0 1 -7 52 -15 112 -17 128 -19 351 -5 480 65 580 362 1110 823 1467 644 498 1517 587 2252 229 655 -319 1099 -938 1191 -1661 13 -107 15 -174 10 -325 -4 -104 -9 -208 -13 -230 l-6 -40 54 46 c30 25 88 85 130 132 326 367 480 883 429 1432 -29 304 -122 576 -277 809 -74 111 -222 271 -308 332 -53 37 -55 41 -51 77 16 141 -54 476 -180 861 -75 230 -102 295 -198 481 -208 406 -517 826 -979 1333 -181 199 -320 298 -635 456 -711 356 -1636 569 -2722 626 -221 11 -528 11 -704 -1z m169 -832 c205 -58 380 -204 470 -391 67 -141 68 -150 72 -586 5 -424 -7 -720 -32 -840 -31 -150 -103 -259 -195 -299 l-49 -21 -1563 2 -1563 3 -57 23 c-62 25 -150 98 -174 144 -29 56 -36 130 -19 210 30 143 125 307 309 532 602 735 1130 1102 1737 1207 196 33 265 37 644 35 303 -2 370 -5 420 -19z m2100 -101 c179 -44 442 -134 543 -185 179 -90 400 -262 543 -422 316 -355 548 -820 550 -1104 1 -97 -12 -149 -50 -202 -39 -53 -80 -82 -153 -104 -57 -18 -110 -19 -986 -19 -911 0 -926 0 -968 20 -51 25 -88 77 -117 162 -21 62 -21 79 -25 757 -3 738 2 888 38 983 28 75 81 124 147 134 26 4 57 11 68 15 11 5 76 7 145 5 98 -4 155 -12 265 -40z"/> <path d="M3148 3579 c-704 -68 -1305 -547 -1528 -1217 -64 -193 -81 -291 -87 -512 -9 -326 39 -556 172 -836 226 -471 668 -831 1176 -958 917 -230 1850 283 2144 1179 98 296 116 613 54 919 -180 893 -1021 1513 -1931 1425z m402 -969 c41 -12 113 -41 160 -65 168 -88 288 -211 370 -380 59 -123 80 -200 87 -330 23 -423 -282 -803 -704 -876 -38 -7 -117 -10 -187 -7 -105 4 -135 10 -223 40 -223 76 -383 215 -488 423 -65 130 -87 222 -88 375 -2 220 60 387 207 564 109 129 312 244 488 276 89 15 292 5 378 -20z"/> <path d="M9880 3580 c-948 -99 -1656 -911 -1617 -1855 42 -994 874 -1763 1862 -1722 383 16 740 147 1040 381 108 86 275 261 357 376 375 530 432 1228 148 1815 -254 525 -756 898 -1330 990 -120 19 -349 26 -460 15z m316 -951 c276 -48 513 -230 629 -483 59 -127 78 -228 72 -386 -3 -102 -10 -152 -27 -205 -53 -166 -156 -319 -282 -420 -78 -62 -221 -135 -313 -161 -90 -25 -293 -30 -388 -10 -332 68 -595 333 -662 665 -23 110 -16 295 14 395 92 308 341 539 651 601 81 16 227 18 306 4z"/> </g> </svg>

        <svg width="50px" style="position: absolute; right: 78px; bottom: -5px;" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"> <polyline style="fill:none;stroke:#000000;stroke-width:2;stroke-miterlimit:10;" points="6,28 6,5 26,5 26,19 6,19 "/> <rect x="22" y="5" width="4" height="4"/> <rect x="19" y="15" width="3" height="4"/> <rect x="19" y="9" width="3" height="3"/> <rect x="13" y="15" width="3" height="4"/> <rect x="13" y="9" width="3" height="3"/> <rect x="6" y="15" width="4" height="4"/> <rect x="6" y="9" width="4" height="3"/> <rect x="22" y="12" width="4" height="3"/> <rect x="16" y="12" width="3" height="3"/> <rect x="10" y="12" width="3" height="3"/> <rect x="16" y="5" width="3" height="4"/> <rect x="10" y="5" width="3" height="4"/></svg>
      </div>
    `;
  }
}

export default Garage;
