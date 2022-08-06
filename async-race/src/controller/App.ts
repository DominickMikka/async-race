import Garage from '../view/Garage';
import Model from '../model/Model';
import ICar from '../interfaces/car';

class App {
  view: Garage;
  model: Model;
  root: HTMLElement;
  selectedCarId: string;
  selectedCarName: string;
  selectedCarColor: string;
  animationId: number;
  currentPage: number;
  countCars: number;
  countPages: number;
  carsOnPage: number;
  randomCarsNames: string[];
  randomCarsModels: string[];
  
  constructor(root: HTMLElement) {
    this.view = new Garage(root);
    this.model = new Model('http://127.0.0.1:3000');
    this.root = root;
    this.selectedCarId = '';
    this.selectedCarName = '';
    this.selectedCarColor = '';
    this.animationId = 0;
    this.currentPage = 1;
    this.countCars = 0;
    this.countPages = 1;
    this.carsOnPage = 7;
    this.randomCarsNames = ['Tesla', 'Audi', 'BMW', 'Opel', 'Renault', 'Lada', 'Ferrari', 'Volkswagen', 'Mazda', 'Suzuki'];
    this.randomCarsModels = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'];
  }

  async start() {
    this.view.createGarage();
    this.updateApp();

    const cars = <HTMLElement>document.querySelector('.cars');

    cars.addEventListener('click', async (event) => {
      if (event.target instanceof HTMLElement) {
        const classElement = event.target.className;
        const carId = (<HTMLElement>event.target.closest('.car-wrapper')).dataset.carId;
        if (carId) {
          if (classElement === 'button-select') {
            const car = await this.model.getCar(carId);
            this.selectedCarId = carId;
            this.selectedCarName = car.name;
            this.selectedCarColor = car.color;
            (document.getElementById('car-update-name') as HTMLInputElement).value = car.name;
            (document.getElementById('car-update-color') as HTMLInputElement).value = car.color;
          };
          if (classElement === 'button-remove') {
            await this.model.removeCar(carId);
            const element = event.target.closest('.car-wrapper');
            element?.remove();
            this.updateApp();
          };
          if (classElement === 'button-start') {
            this.singleCarRace(carId);
          };
          if (classElement === 'button-stop') {
            this.stopRace(carId, this.animationId);
          };
        }
      };
    });

    const updateButton = <HTMLButtonElement>document.getElementById('update-car');
    updateButton.addEventListener('click', async () => {
      const car = await this.model.updateCar(this.selectedCarId, (document.getElementById('car-update-name') as HTMLInputElement).value, (document.getElementById('car-update-color') as HTMLInputElement).value);
      (document.getElementById(`car-${this.selectedCarId}`) as HTMLElement).setAttribute('fill', (document.getElementById('car-update-color') as HTMLInputElement).value);
      (document.getElementById(`car-name-${this.selectedCarId}`) as HTMLElement).innerHTML = (document.getElementById('car-update-name') as HTMLInputElement).value;
    });

    const raceButton = <HTMLButtonElement>document.getElementById('race');
    raceButton.addEventListener('click', () => {
      raceButton.disabled = true;
      const buttonsStart = document.querySelectorAll('.button-start');
      buttonsStart.forEach(e => (e as HTMLElement).click());
    });

    const addCar = <HTMLButtonElement>document.getElementById('create-car');
    addCar.addEventListener('click', async () => {
      const carName = (document.getElementById('new-car-name') as HTMLInputElement).value;
      const carColor = (document.getElementById('new-car-color') as HTMLInputElement).value;
      const car: ICar = await this.model.addCar(carName, carColor);
      this.updateApp();
    });

    const generateCars = <HTMLButtonElement>document.getElementById('generate-cars');
    generateCars.addEventListener('click', () => {
      this.generateRandomCars();
    });

    const resetCars = <HTMLButtonElement>document.getElementById('reset-cars');
    resetCars.addEventListener('click', () => {
      const cars: NodeListOf<HTMLElement> = document.querySelectorAll('.car-item');
      cars.forEach(element => element.style.transform = `translateX(0px)`);
      const buttonResetRace = <HTMLButtonElement>document.getElementById('reset-cars');
      buttonResetRace.disabled = true;
    });    

    const pagination = document.querySelector('.pagination');

    if (pagination) {
      pagination.addEventListener('click', async (event) => {
        if (event.target instanceof HTMLButtonElement) {
          const eventId = event.target.id;
          if (eventId === 'next-page') {
            this.currentPage++;
            (<HTMLElement>document.getElementById('page-number')).textContent = this.currentPage.toString();
            this.updateApp();
          } else if (eventId === 'prev-page') {
            this.currentPage--;
            (<HTMLElement>document.getElementById('page-number')).textContent = this.currentPage.toString();
            this.updateApp();
          };
        };
      });
    };

  };

  checkAvailablePagination(currentPage: number, countPages: number) {
    const prevPageButton = <HTMLButtonElement>document.getElementById('prev-page');
    const nextPageButton = <HTMLButtonElement>document.getElementById('next-page');
    if (countPages === 1 || !this.countCars) {
      prevPageButton.disabled = true;
      nextPageButton.disabled = true;
    } else if (countPages > 1 && currentPage === 1) {
      prevPageButton.disabled = true;
      nextPageButton.disabled = false;
    } else if (currentPage === countPages) {
      prevPageButton.disabled = false;
      nextPageButton.disabled = true;
    } else if (currentPage !== countPages) {
      prevPageButton.disabled = false;
      nextPageButton.disabled = false;
    }
  }

  async singleCarRace(e: string) {
    const carId = e;
    const buttonStart = <HTMLButtonElement>document.getElementById(`start-${carId}`);
    buttonStart.disabled = true;
    const buttonStop = <HTMLButtonElement>document.getElementById(`stop-${carId}`);
    buttonStop.disabled = false;
    let start: { distance: number; velocity: number; };
    let animationId: number;

    const car = <HTMLElement>document.getElementById(`car-${carId}`);
    const flag = <HTMLElement>document.getElementById(`finish-${carId}`);
    
    start = await this.model.start(carId);

    let begin: number;
    const finish: number = flag.getBoundingClientRect().x;
    const step: number = flag.getBoundingClientRect().x / start.distance;
    let done = false;
      
    const animation = async () => {
        if (!begin) begin = 0;

        if (begin < finish) {
          begin = Math.ceil(begin + (step * start.velocity)) + 2;
          car.style.transform = `translateX(${begin}px)`;
        } else {
          done = true;
          buttonStart.disabled = false;
          buttonStop.disabled = true;
          const buttonResetRace = <HTMLButtonElement>document.getElementById('reset-cars');
          buttonResetRace.disabled = false;
          const buttonRace = <HTMLButtonElement>document.getElementById('go-race');
          buttonRace.disabled = false;
        }
        if (!done) {
          animationId = requestAnimationFrame(animation);
          this.animationId = animationId;
        }
    }
    animationId = requestAnimationFrame(animation);
    const drive = await this.model.drive(carId);
    if (!drive) {
      cancelAnimationFrame(animationId);
      buttonStart.disabled = false;
    };
  }

  async stopRace(carId: string, animationId: number) {
    const car = <HTMLElement>document.getElementById(`car-${carId}`);
    car.style.transform = `translateX(0px)`;
    const buttonStart = <HTMLButtonElement>document.getElementById(`start-${carId}`);
    buttonStart.disabled = false;
    const buttonStop = <HTMLButtonElement>document.getElementById(`stop-${carId}`);
    buttonStop.disabled = true;
    cancelAnimationFrame(animationId);
    const stop = await this.model.stop(carId);
  }

  async generateRandomCars(carsCount: number = 100) {
    for (let i = 0; i < carsCount; i++) {
      const carName = this.randomCarsNames[Math.floor(Math.random() * 10)];
      const carModel = this.randomCarsModels[Math.floor(Math.random() * 10)];
      const carColor = '#' + Math.floor(Math.random()* 16777215).toString(16);
      this.model.addCar(carName + ' ' + carModel, carColor);
    };

    const cars = await this.getCars();
    this.view.createCars(cars);
    this.checkAvailablePagination(this.currentPage, this.countPages);
  }

  async updateCountCars(countCars: string) {
    this.countCars = +countCars;
    (document.getElementById('cars-count') as HTMLElement).textContent = countCars;
  }

  async updateCountPages() {
    this.countPages = Math.ceil(this.countCars / this.carsOnPage);
  }

  async getCars() {
    const { cars, countCars } = await this.model.getCars(this.currentPage);
    if (countCars) {
      this.updateCountCars(countCars);
      this.updateCountPages();
    }
    return cars;
  }

  async updateApp() {
    const cars = await this.getCars();
    this.view.createCars(cars);
    this.checkAvailablePagination(this.currentPage, this.countPages);
  }
}

export default App;
