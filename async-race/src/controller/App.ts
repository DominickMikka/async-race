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
  
  constructor(root: HTMLElement) {
    this.view = new Garage();
    this.model = new Model('http://127.0.0.1:3000');
    this.root = root;
    this.selectedCarId = '';
    this.selectedCarName = '';
    this.selectedCarColor = '';
  }

  async start() {
    const cars = await this.model.getCars();
    this.view.createGarage(this.root, cars);

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

        if (eventId.startsWith('update')) {
          const car = await this.model.updateCar(this.selectedCarId, (document.getElementById('car-update-name') as HTMLInputElement).value, (document.getElementById('car-update-color') as HTMLInputElement).value);
          (document.getElementById(`car-${this.selectedCarId}`) as HTMLElement).setAttribute('fill', (document.getElementById('car-update-color') as HTMLInputElement).value);
          (document.getElementById(`car-name-${this.selectedCarId}`) as HTMLElement).innerHTML = (document.getElementById('car-update-name') as HTMLInputElement).value;
          console.log(car);
        };

        if (eventId.startsWith('start')) {
          const carId = eventId.slice(6);
          this.singleCarRace(carId);
        };

        if (eventId.startsWith('stop')) {
          const carId = eventId.slice(5);
          this.singleCarRace(carId, true);
        };

        if (eventId.startsWith('create-car')) {
          const carName = (document.getElementById('new-car-name') as HTMLInputElement).value;
          const carColor = (document.getElementById('new-car-color') as HTMLInputElement).value;
          const car: ICar = await this.model.addCar(carName, carColor);
          this.root.insertAdjacentHTML('beforeend', this.view.createCarElement(car));
        };
      };
    });
  }

  async singleCarRace(e: string, stoped?: boolean) {
    const carId = e;
    //(e.target as HTMLButtonElement).disabled = true;
    const car = document.querySelector(`#car-${carId}`) as HTMLElement;
    const flag = document.querySelector(`#finish-${carId}`) as HTMLElement;
    let start: { distance: number; velocity: number; };

    let animationId = 0;

    start = await this.model.start(carId);

    let begin: number;
    const finish: number = (flag as HTMLElement).getBoundingClientRect().x;
    const step: number = (flag as HTMLElement).getBoundingClientRect().x / start.distance;
    let done = false;
      
    const animation = () => {
  
        if (!begin) {
          begin = 0;
        }
  
        if (begin < finish) {
          begin = Math.ceil(begin + (step * start.velocity)) + 2;
          car.style.transform = `translateX(${begin}px)`;
        } else {
          done = true;
        }
  
        if (!done) {
          animationId = requestAnimationFrame(animation);
        }
        
      }
      animationId = requestAnimationFrame(animation);

      const drive = await this.model.drive(carId);

      if (!drive) {
        cancelAnimationFrame(animationId);
        //(e.target as HTMLButtonElement).disabled = false;
      }
  }
}

export default App;
