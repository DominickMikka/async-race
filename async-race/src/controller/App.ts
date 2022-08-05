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

    const cars = await this.getCars();
    this.view.createCars(cars);
    this.checkAvailablePagination(this.currentPage, this.countPages);

    document.addEventListener('click', async (event) => {

      if (event.target instanceof HTMLElement) {
        const eventId = event.target.id;

        if (eventId.startsWith('select')) {
          const carId = eventId.slice(7);
          const car = await this.model.getCar(carId);
          this.selectedCarId = carId;
          this.selectedCarName = car.name;
          this.selectedCarColor = car.color;
          (document.getElementById('car-update-name') as HTMLInputElement).value = car.name;
          (document.getElementById('car-update-color') as HTMLInputElement).value = car.color;
        };

        if (eventId.startsWith('remove')) {
          
          const carId = eventId.slice(7);
          await this.model.removeCar(carId);
          const element = document.getElementById(`wrapper-${carId}`);
          element?.remove();

          const cars = await this.getCars();
          this.view.createCars(cars);
          this.checkAvailablePagination(this.currentPage, this.countPages);
        };

        if (eventId.startsWith('update')) {
          const car = await this.model.updateCar(this.selectedCarId, (document.getElementById('car-update-name') as HTMLInputElement).value, (document.getElementById('car-update-color') as HTMLInputElement).value);
          (document.getElementById(`car-${this.selectedCarId}`) as HTMLElement).setAttribute('fill', (document.getElementById('car-update-color') as HTMLInputElement).value);
          (document.getElementById(`car-name-${this.selectedCarId}`) as HTMLElement).innerHTML = (document.getElementById('car-update-name') as HTMLInputElement).value;
        };

        if (eventId.startsWith('go-race')) {
          const buttonsStart = document.querySelectorAll('.button-start');
          buttonsStart.forEach(e => (e as HTMLElement).click());
        };

        if (eventId.startsWith('start')) {
          const carId = eventId.slice(6);
          this.singleCarRace(carId);
        };

        if (eventId.startsWith('stop')) {
          const carId = eventId.slice(5);
          this.stopRace(carId, this.animationId);
        };

        if (eventId.startsWith('create-car')) {
          const carName = (document.getElementById('new-car-name') as HTMLInputElement).value;
          const carColor = (document.getElementById('new-car-color') as HTMLInputElement).value;
          const car: ICar = await this.model.addCar(carName, carColor);
          const cars = await this.getCars();
          this.view.createCars(cars);
          this.checkAvailablePagination(this.currentPage, this.countPages);
        };

        if (eventId === 'generate-cars') {
          this.generateRandomCars();
        }
      };
    });

    const pagination = document.querySelector('.pagination');

    if (pagination) {
      pagination.addEventListener('click', async (event) => {
        if (event.target instanceof HTMLElement) {
          const eventId = event.target.id;

          if (eventId === 'next-page') {
            this.currentPage++;
            (document.getElementById('page-number') as HTMLElement).textContent = this.currentPage.toString();
  
            const cars = await this.getCars();
            this.view.createCars(cars);
  
            this.checkAvailablePagination(this.currentPage, this.countPages);
          }
  
          if (eventId === 'prev-page') {
            this.currentPage--;
            (document.getElementById('page-number') as HTMLElement).textContent = this.currentPage.toString();
  
            const cars = await this.getCars();
            this.view.createCars(cars);
  
            this.checkAvailablePagination(this.currentPage, this.countPages);
          }

        }
        
      });
    }

  };

  checkAvailablePagination(currentPage: number, countPages: number) {
    if (countPages === 1) {
      (document.getElementById('prev-page') as HTMLButtonElement).disabled = true;
      (document.getElementById('next-page') as HTMLButtonElement).disabled = true;
    } else
    if (countPages > 1 && currentPage === 1) {
      (document.getElementById('prev-page') as HTMLButtonElement).disabled = true;
      (document.getElementById('next-page') as HTMLButtonElement).disabled = false;
    } else
    if (currentPage === countPages) {
      (document.getElementById('prev-page') as HTMLButtonElement).disabled = false;
      (document.getElementById('next-page') as HTMLButtonElement).disabled = true;
    } else
    if (currentPage !== countPages) {
      (document.getElementById('prev-page') as HTMLButtonElement).disabled = false;
      (document.getElementById('next-page') as HTMLButtonElement).disabled = false;
    } else {

    }
  }

  async singleCarRace(e: string) {
    const carId = e;
    (document.getElementById(`start-${carId}`) as HTMLButtonElement).disabled = true;
    (document.getElementById(`stop-${carId}`) as HTMLButtonElement).disabled = false;
    let start: { distance: number; velocity: number; };
    let animationId: number;

    const car = document.querySelector(`#car-${carId}`) as HTMLElement;
    const flag = document.querySelector(`#finish-${carId}`) as HTMLElement;
    
    start = await this.model.start(carId);

    let begin: number;
    const finish: number = (flag as HTMLElement).getBoundingClientRect().x;
    const step: number = (flag as HTMLElement).getBoundingClientRect().x / start.distance;
    let done = false;
      
    const animation = async () => {
  
        if (!begin) {
          begin = 0;
        }
  
        if (begin < finish) {
          begin = Math.ceil(begin + (step * start.velocity)) + 2;
          car.style.transform = `translateX(${begin}px)`;
        } else {
          done = true;
          (document.getElementById(`start-${carId}`) as HTMLButtonElement).disabled = false;
          (document.getElementById(`stop-${carId}`) as HTMLButtonElement).disabled = true;
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
        (document.getElementById(`start-${carId}`) as HTMLButtonElement).disabled = false;
        (document.getElementById(`stop-${carId}`) as HTMLButtonElement).disabled = true;
      }
  }

  async stopRace(carId: string, animationId: number) {
    (document.getElementById(`start-${carId}`) as HTMLButtonElement).disabled = false;
    (document.getElementById(`stop-${carId}`) as HTMLButtonElement).disabled = true;
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

  updateCountPages() {
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
}

export default App;
