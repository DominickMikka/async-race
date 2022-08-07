class GarageModel {

  serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  async getCars(page: number) {
    const cars = await fetch(`${this.serverUrl}/garage?_page=${page}&_limit=7`);
    return { 
      cars: await cars.json(), 
      countCars: cars.headers.get('X-Total-Count'),
    };
  }

  async addCar(name: string, color: string) {
    const car = await fetch(`${this.serverUrl}/garage`, {
      method: 'POST', 
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, color}),
    });
    return await car.json();
  }

  async getCar(carId: string) {
    const car = await fetch(`${this.serverUrl}/garage/${carId}`);
    return await car.json();
  }

  async updateCar(carId: string, name: string, color: string) {
    const car = await fetch(`${this.serverUrl}/garage/${carId}`, {
      method: 'PUT', 
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, color}),
    });
    return await car.json();
  }

  async removeCar(carId: string) {
    const car = await fetch(`${this.serverUrl}/garage/${carId}`, { method: 'DELETE' });
    return await car.json();
  }

  async start(carId: string) {
    const response = await fetch(`${this.serverUrl}/engine?id=${carId}&status=started`, { method: 'PATCH' });
    const { velocity, distance } = await response.json();
    return { velocity, distance };
  }

  async stop(carId: string) {
    const response = await fetch(`${this.serverUrl}/engine?id=${carId}&status=stopped`, { method: 'PATCH' });
    return response.json();
  }

  async drive(carId: string) {
    const status = await fetch(`${this.serverUrl}/engine?id=${carId}&status=drive`, { method: 'PATCH' });
    try {
      return await status.json();
    } catch(e) {
      if (e instanceof TypeError) {
        throw new Error(e.message);
      }
    }
  }
}

export default GarageModel;
