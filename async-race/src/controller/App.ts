import Garage from '../view/Garage';
import Model from '../model/Model';
import ICar from '../interfaces/car';

class App {
  view: Garage;
  model: Model;
  root: HTMLElement;
  
  constructor(root: HTMLElement) {
    this.view = new Garage();
    this.model = new Model('http://127.0.0.1:3000');
    this.root = root;
  }

  async start() {
    const cars = await this.model.getCars();
    this.root.append(this.view.createGarage(cars));
    const startButtons = document.querySelectorAll('.button-start');

    startButtons.forEach(e => {
      e.addEventListener('click', async (e) => {
        const carId = (e.target as HTMLElement).id.slice(6);
        const start = await this.model.start(carId);
        console.log(start);
        const drive = await this.model.drive(carId);

        if (drive.success) {
          console.log(drive.success + ' SUCESS');
        } else {
          console.log(drive.success + ' FALSE');
        }
        
      });
    });

    console.log(startButtons);
  }
}

export default App;
