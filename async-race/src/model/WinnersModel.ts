import IWinner from "../interfaces/winner";

class WinnersModel {

  serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  async getWinners(page: number = 1, sort: string = 'id') {
    const winners = await fetch(`${this.serverUrl}/winners?_page=${page}&_limit=10&_sort=${sort}`);
    const [...winnersElements]: IWinner[] = await winners.json();
    const win = winnersElements.map(async element => {
      const car = await fetch(`${this.serverUrl}/garage/${element.id}`);
      const { id, name, color } = await car.json() as { id: number, name: string, color: string };
      element.name = name;
      element.color = color;
      return element
    });

    return { 
      winners: await Promise.all(win),
      countWinners: winners.headers.get('X-Total-Count'),
    };
  }

  async addWinner(id: number, wins: number, time: number) {
    const winner = await fetch(`${this.serverUrl}/winners`, {
      method: 'POST', 
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({id, wins, time}),
    });
    return await winner.json();
  }

  async removeWinner(winnerId: string) {
    const winner = await fetch(`${this.serverUrl}/winners/${winnerId}`, { method: 'DELETE' });
    return await winner.json();
  }

}

export default WinnersModel;
