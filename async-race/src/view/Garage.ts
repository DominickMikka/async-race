import ICar from '../interfaces/car';

class Garage {
  carsWrapper: HTMLElement;
  bodyPage: HTMLElement;
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.carsWrapper = document.createElement('div');
    this.carsWrapper.classList.add('cars');
    this.bodyPage = document.createElement('div');
    this.bodyPage.classList.add('content');
    this.root = root;
  }

  createGarage(): void {
    this.bodyPage.innerHTML = '';
    this.root.insertAdjacentHTML('afterbegin', this.createMenu());
    this.bodyPage.insertAdjacentHTML('afterbegin', 
      this.createControls() + 
      this.createGarageLabel() + 
      this.createPageLabel(1)
    );
    this.bodyPage.append(this.carsWrapper);
    this.bodyPage.insertAdjacentHTML('beforeend', this.createPagination());
    this.root.append(this.bodyPage);
  }

  createMenu() {
    return `
      <div class='top-menu'>
        <button id='garage-page'>To garage</button>
        <button id='winners-page'>To winners</button>
      </div>
    `;
  }

  createControls() {
    return `
      <div class='controls'>
        <label><input type='text' id='new-car-name' placeholder='Car name'> <input type='color' id='new-car-color' /> <button id='create-car'>Create</button></label>
        <label><input type='text' placeholder='Select car' id='car-update-name'> <input type='color' id='car-update-color' /> <button id='update-car'>Update</button></label>
        <button id='race'>Race</button> <button id='reset-cars' disabled>Reset</button> <button id='generate-cars'>Generate cars</button>
      </div>
    `;
  }

  createGarageLabel() {
    return `
      <div class='garage-label'>
        Count cars in the garage: <strong id='cars-count'></strong>
      </div>
    `;
  }

  createPageLabel(page: number) {
    return `
      <div class='page-label'>
        Current page is: <strong id='page-number'>${page}</strong>
      </div>`;
  }

  createPagination() {
    return `
      <div class='pagination'>
        <button id='prev-page' disabled>Prev page</button>
        <button id='next-page'>Next page</button>
      </div>`;
  }

  createCars(cars: ICar[]) {
    this.carsWrapper.innerHTML = '';
    cars.forEach((car: ICar) => {
      this.createCarElement(car);
    });
  }

  createCarElement(car: ICar, carsWrapper: HTMLElement = this.carsWrapper) {
    
    const carTemplate = `
      <div class='car-wrapper' id='wrapper-${car.id}' data-car-id='${car.id}'>
        <button class='button-select' id='select-${car.id}'>Select</button> 
        <button class='button-remove' id='remove-${car.id}'>Remove</button>
        <button class='button-start' id='start-${car.id}'>Start</button> 
        <button class='button-stop' id='stop-${car.id}' disabled>Stop</button>
        <div class='car-name' id='car-name-${car.id}'>${car.name}</div>
        
        <svg id='car-${car.id}' class='car-item' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50px" viewBox="0 0 550 450" style="enable-background:new 0 0 564.188 564.188;" fill="${car.color}" xml:space="preserve"><path d="M45.422,339.428h-4.781h-24.48h-4.208C5.365,339.428,0,344.792,0,351.381v23.896c0,6.599,5.365,11.963,11.953,11.963h4.15 h29.319c6.588,0,11.953-5.364,11.953-11.953v-19.125v-4.781C57.375,344.792,52.01,339.428,45.422,339.428z"/><path d="M500.894,387.24c-2.295-3.424-3.644-7.535-3.644-11.953v-19.125v-4.781c0-11.857,9.658-21.516,21.516-21.516h26.297 v-9.562c0-3.662,0.373-7.459-0.555-10.959c-1.635-6.158-3.882-12.039-6.933-17.633c-6.053-11.083-14.649-20.693-24.509-28.525 c-10.069-7.994-21.42-14.219-33.191-19.325c-5.881-2.554-11.896-4.743-17.91-6.952c-3.175-1.167-6.475-2.047-9.792-2.764 c-1.664-0.363-3.328-0.679-5.011-0.938c-0.698-0.104-4.093-0.076-4.466-0.545l-92.632-107.301c0,0-208.797-20.617-282.725,64.557 c-14.927,17.193-25.389,33.956-32.876,50.231c-12.116-8.28-25.991-30.236-25.991-30.236L0.45,228.254l22.778,43.165 c-6.56,22.519-7.315,41.673-7.191,58.446h29.386c11.857,0,21.516,9.658,21.516,21.516v23.896c0,4.428-1.348,8.539-3.644,11.953 h33.211c4.819,30.467,31.126,53.789,62.95,53.789c31.824,0,58.13-23.322,62.95-53.789h19.689h88.73 c4.819,30.467,31.126,53.789,62.95,53.789s58.13-23.322,62.95-53.789h19.908C484.398,387.24,492.172,387.24,500.894,387.24z M76.5,219.41c0,0,38.25-48.1,143.438-61.43v85.823H76.5V219.41z M159.455,414.876c-17.308,0-31.729-11.733-36.137-27.636 c-0.889-3.213-1.521-6.531-1.521-10.021c0-20.799,16.859-37.657,37.657-37.657s37.657,16.858,37.657,37.657 c0,3.49-0.631,6.809-1.521,10.021C191.183,403.143,176.753,414.876,159.455,414.876z M513.688,275.742 c0.02,0.02,0.029,0.029,0.048,0.048c15.281,16.313,20.646,31.508,21.707,34.941h-42.018h-5.345 C488.729,291.95,494.936,283.64,513.688,275.742z M248.625,155.886c76.5-6.79,84.867-3.863,84.867-3.863l49.008,56.428 l-11.656,35.353H248.625V155.886z M393.774,414.876c-17.309,0-31.729-11.733-36.137-27.636c-0.89-3.213-1.521-6.531-1.521-10.021 c0-20.799,16.858-37.657,37.657-37.657c20.798,0,37.657,16.858,37.657,37.657c0,3.49-0.632,6.809-1.521,10.021 C425.503,403.143,411.072,414.876,393.774,414.876z"/> <path d="M547.453,339.428h-2.391h-26.297c-6.589,0-11.953,5.364-11.953,11.953v23.896c0,6.589,5.364,11.953,11.953,11.953h26.297 h7.172c6.589,0,11.953-5.364,11.953-11.953v-19.115C564.188,346.925,556.69,339.428,547.453,339.428z"/></svg>

        <svg id="finish-${car.id}" width="50px" style="position: absolute; right: 78px; bottom: -5px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve"> <polyline style="fill:none;stroke:#000000;stroke-width:2;stroke-miterlimit:10;" points="6,28 6,5 26,5 26,19 6,19 "/> <rect x="22" y="5" width="4" height="4"/> <rect x="19" y="15" width="3" height="4"/> <rect x="19" y="9" width="3" height="3"/> <rect x="13" y="15" width="3" height="4"/> <rect x="13" y="9" width="3" height="3"/> <rect x="6" y="15" width="4" height="4"/> <rect x="6" y="9" width="4" height="3"/> <rect x="22" y="12" width="4" height="3"/> <rect x="16" y="12" width="3" height="3"/> <rect x="10" y="12" width="3" height="3"/> <rect x="16" y="5" width="3" height="4"/> <rect x="10" y="5" width="3" height="4"/></svg>
      </div>
    `;
    carsWrapper.insertAdjacentHTML('beforeend', carTemplate);
  }
}

export default Garage;
