class Model {

  serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  async getCars() {
    const cars = await fetch(`${this.serverUrl}/garage`);
    return await cars.json();
  }

  async start(carId: string) {
    const response = await fetch(`${this.serverUrl}/engine?id=${carId}&status=started`, {method: 'PATCH'});
    const { velocity, distance } = await response.json();
    return { velocity, distance };
  }

  async drive(carId: string) {
    const status = await fetch(`${this.serverUrl}/engine?id=${carId}&status=drive`, {method: 'PATCH'});

    try {
      return await status.json();
    } catch(e) {
      if (e instanceof TypeError) {
        throw new Error(e.message);
      }
    }
  }
}

export default Model;
