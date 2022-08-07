import Garage from '../view/Garage';
import GarageModel from '../model/GarageModel';
import Winners from '../view/Winners';
import WinnersModel from '../model/WinnersModel';
import ICar from '../interfaces/car';

const enum buttonsClasses {
  buttonSelect = 'button-select',
  buttonRemove = 'button-remove',
  buttonStart = 'button-start',
  buttonStop = 'button-stop',
}

class App {
  garageView: Garage;
  garageModel: GarageModel;
  winnersView: Winners;
  winnersModel: WinnersModel;
  root: HTMLElement;
  selectedCarId: string;
  selectedCarName: string;
  selectedCarColor: string;
  animationId: number;
  currentPage: number;
  countCars: number;
  countPages: number;
  carsOnPage: number;
  winnersCount: number;
  randomCarsNames: string[];
  randomCarsModels: string[];
  
  constructor(root: HTMLElement) {
    this.garageView = new Garage(root);
    this.garageModel = new GarageModel('http://127.0.0.1:3000');
    this.winnersView = new Winners(root);
    this.winnersModel = new WinnersModel('http://127.0.0.1:3000');
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
    this.winnersCount = 0;
  }

  async start() {
    this.garageView.createGarage();
    this.updateGarage();

    const cars = <HTMLElement>document.querySelector('.cars');

    cars.addEventListener('click', async (event) => {
      if (event.target instanceof HTMLElement) {
        const classElement = event.target.className;
        const carId = (<HTMLElement>event.target.closest('.car-wrapper')).dataset.carId;
        if (carId) {
          if (classElement === buttonsClasses.buttonSelect) {
            const car = await this.garageModel.getCar(carId);
            this.selectedCarId = carId;
            this.selectedCarName = car.name;
            this.selectedCarColor = car.color;
            (<HTMLInputElement>document.getElementById('car-update-name')).value = car.name;
            (<HTMLInputElement>document.getElementById('car-update-color')).value = car.color;
          };
          if (classElement ===  buttonsClasses.buttonRemove) {
            await this.garageModel.removeCar(carId);
            await this.winnersModel.removeWinner(carId);
            const element = event.target.closest('.car-wrapper');
            if (element) {
              element.remove();
            }
            this.updateGarage();
          };
          if (classElement === buttonsClasses.buttonStart) {
            this.singleCarRace(carId);
          };
          if (classElement === buttonsClasses.buttonStop) {
            this.stopRace(carId, this.animationId);
          };
        }
      };
    });

    const updateButton = <HTMLButtonElement>document.getElementById('update-car');
    updateButton.addEventListener('click', async () => {
      const newCarName = <HTMLInputElement>document.getElementById('car-update-name');
      const newCarColor = <HTMLInputElement>document.getElementById('car-update-color');
      await this.garageModel.updateCar(this.selectedCarId, newCarName.value, newCarColor.value);
      const currentCar = <HTMLElement>document.getElementById(`car-${this.selectedCarId}`);
      currentCar.setAttribute('fill', newCarColor.value);
      (document.getElementById(`car-name-${this.selectedCarId}`) as HTMLElement).innerHTML = newCarName.value;
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
      const car: ICar = await this.garageModel.addCar(carName, carColor);
      this.updateGarage();
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
      pagination.addEventListener('click', (event) => {
        if (event.target instanceof HTMLButtonElement) {
          const eventId = event.target.id;
          if (eventId === 'next-page') {
            this.currentPage++;
            (<HTMLElement>document.getElementById('page-number')).textContent = this.currentPage.toString();
            this.updateGarage();
          } else if (eventId === 'prev-page') {
            this.currentPage--;
            (<HTMLElement>document.getElementById('page-number')).textContent = this.currentPage.toString();
            this.updateGarage();
          };
        };
      });
    };

    const winnersPage = <HTMLButtonElement>document.getElementById('winners-page');
    winnersPage.addEventListener('click', async () => {
      const currentPageContent = <HTMLElement>document.querySelector('.content');
      currentPageContent.remove();
      await this.updateWinners();
      this.winnersView.createWinnersPage(this.winnersCount);
      winnersPage.disabled = true;
      garagePage.disabled = false;
    });

    const garagePage = <HTMLButtonElement>document.getElementById('garage-page');
    garagePage.addEventListener('click', () => {
      const currentPageContent = <HTMLElement>document.querySelector('#root');
      currentPageContent.innerHTML = '';
      this.start();
      //this.garageView.createGarage();
      winnersPage.disabled = false;
      garagePage.disabled = true;
    });

    garagePage.disabled = true;
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
    
    start = await this.garageModel.start(carId);

    let begin: number;
    const finish: number = flag.getBoundingClientRect().x;
    const step: number = flag.getBoundingClientRect().x / start.distance;
    let done = false;
      
    const animation = async () => {
        if (!begin) begin = 0;

        if (begin < finish) {
          begin += 10;
          //begin = Math.ceil(begin + (step * start.velocity)) + 2;
          car.style.transform = `translateX(${begin}px)`;
        } else {
          done = true;
          buttonStart.disabled = false;
          buttonStop.disabled = true;
          const buttonResetRace = <HTMLButtonElement>document.getElementById('reset-cars');
          buttonResetRace.disabled = false;
          const buttonRace = <HTMLButtonElement>document.getElementById('race');
          buttonRace.disabled = false;
          this.winnersModel.addWinner(+carId, 1, +(start.distance / start.velocity / 1000).toFixed(4));
        }
        if (!done) {
          animationId = requestAnimationFrame(animation);
          this.animationId = animationId;
        }
    }
    animationId = requestAnimationFrame(animation);
    const drive = await this.garageModel.drive(carId);
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
    const stop = await this.garageModel.stop(carId);
  }

  async generateRandomCars(carsCount: number = 100) {
    for (let i = 0; i < carsCount; i++) {
      const carName = this.randomCarsNames[Math.floor(Math.random() * 10)];
      const carModel = this.randomCarsModels[Math.floor(Math.random() * 10)];
      const carColor = '#' + Math.floor(Math.random()* 16777215).toString(16);
      this.garageModel.addCar(carName + ' ' + carModel, carColor);
    };
    const cars = await this.getCars();
    this.garageView.createCars(cars);
    this.checkAvailablePagination(this.currentPage, this.countPages);
  }

  updateCountCars(countCars: string) {
    this.countCars = +countCars;
    (document.getElementById('cars-count') as HTMLElement).textContent = countCars;
  }

  async updateCountPages() {
    this.countPages = Math.ceil(this.countCars / this.carsOnPage);
  }

  async getCars() {
    const { cars, countCars } = await this.garageModel.getCars(this.currentPage);
    if (countCars) {
      this.updateCountCars(countCars);
      this.updateCountPages();
    }
    return cars;
  }

  async getWinners() {
    const { winners, countWinners } = await this.winnersModel.getWinners(1);
    if (countWinners) {
      this.winnersCount = +countWinners;
    }
    return winners;
  }

  async updateGarage() {
    const cars = await this.getCars();
    this.garageView.createCars(cars);
    this.checkAvailablePagination(this.currentPage, this.countPages);
  }

  async updateWinners() {
    const winners = await this.getWinners();
    this.winnersView.createWinners(winners);
  }
}

export default App;
