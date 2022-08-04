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
  
  constructor(root: HTMLElement) {
    this.view = new Garage();
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
  }

  async start() {
    const cars = await this.model.getCars(this.currentPage);
    const allCars = await cars.cars;
    if (cars.carsCount) {
      this.countCars = +cars.carsCount;
      this.countPages = Math.ceil(this.countCars / this.carsOnPage);
    }


    
    this.view.createGarage(this.root, allCars);

    if (this.countPages === this.currentPage) {
      (document.getElementById('next-page') as HTMLButtonElement).disabled = true;
    }

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
          this.view.createCarElement(car);
        };

        if (eventId === 'next-page') {
          this.currentPage++;
          const cars = await this.model.getCars(this.currentPage);
          (document.getElementById('page-number') as HTMLElement).textContent = this.currentPage.toString();
          const allCars = await cars.cars;
          let countCars = 0;

          if (cars.carsCount) {
            countCars = +cars.carsCount;
          };

          if (this.currentPage === 1) {
            (document.getElementById('prev-page') as HTMLButtonElement).disabled = true;
            (document.getElementById('next-page') as HTMLButtonElement).disabled = false;
          } else {
            (document.getElementById('prev-page') as HTMLButtonElement).disabled = false;
            (document.getElementById('next-page') as HTMLButtonElement).disabled = false;
          };

          this.view.updateCars(cars.cars);

          if (this.countPages === this.currentPage) {
            (document.getElementById('next-page') as HTMLButtonElement).disabled = true;
          }
        }

        if (eventId === 'prev-page') {
          this.currentPage--;
          const cars = await this.model.getCars(this.currentPage);
          (document.getElementById('page-number') as HTMLElement).textContent = this.currentPage.toString();
          const allCars = await cars.cars;
          let countCars = 0;

          if (cars.carsCount) {
            countCars = +cars.carsCount;
          };

          if (this.currentPage === 1) {
            (document.getElementById('prev-page') as HTMLButtonElement).disabled = true;
            (document.getElementById('next-page') as HTMLButtonElement).disabled = false;
          } else {
            (document.getElementById('prev-page') as HTMLButtonElement).disabled = false;
            (document.getElementById('next-page') as HTMLButtonElement).disabled = false;
          };

          this.view.updateCars(cars.cars);
        }
      };
    });
  };

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
}

export default App;
