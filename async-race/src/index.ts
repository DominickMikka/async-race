import './style.scss';
import App from './controller/App';

const root = <HTMLElement>document.getElementById('root');
const app: App = new App(root);
app.start();


console.log(`
135/190

Basic structure:
	(+5) There should be two views on the site: "Garage" and "Winners".
	(+5) "Garage" view should contain its name, page number, and the full amount of items in the database (how many car user has in his garage).
	(+5) "Winners" view should contain its name, page number, and the full amount of items in the database (how many records the winners table contains).
"Garage" view:
	(+15) User should be able to create, update, delete a car, and see the list of the cars. Car has only two attributes: "name" and "color". For "delete"-operation car should be deleted from "garage" table as well as from "winners".
	(+10) User should be able to select any color from an RGB-Palete like here and see the picture of the car colored with the color selected and car's name.
	(+5) Near the car's picture should be buttons to update its attributes or delete it.
	(+10) There should be pagination on the "Garage" view (7 cars per one page).
	(+10) There should be a button to create random cars (100 cars per click). Name should be assembled from two random parts, for example "Tesla" + "Model S", or "Ford" + "Mustang" (At least 10 different names for each part). Color should be also generated randomly.
Car animation:
	(+5) Near the car's picture should be buttons for starting / stoping the car engine.
	(+20) User clicks to the engine start button -> UI is waiting for car's velocity answer -> animate the car and makes another request to drive. In case api returned 500 error car animation should be stopped.
	(+5) User clicks to the engine stop button -> UI is waiting for answer for stopping engine -> car returned to it's initial place.
	(+5) Start engine button should be disabled in case car is already in driving mode. As well as stop engine button should be disabled when car is on it's initial place.
	(+15) Car animation should work fine on any screen (smallest screen size is 500px).
Race animation:
	(+10) There should be a button to start race. After user clicks this button all the cars on the current page start driving.
	(+10) There should be a button to reset race. After user clicks this button all the cars return to it's initial places.
"Winners" view:
	(+5) After some car wins it should be displayed at the "Winners view" table.
	(+5) Table should include the next culumns: "№", "Image of the car", "Name of the car", "Wins number", "Best time in seconds" (names of the columns can differ). If the same car wins more than once the number of wins should be incremented while best time should be saved only if it's better than the stored one.


(-10) Minor bag (implemented functionality works, but after some manipulations it behavior changes, like button does not become enabled after changing some state, but there are not any errors in the browser's console).
`)