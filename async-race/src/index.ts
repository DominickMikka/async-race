import './style.scss';
import App from './controller/App';

const root = <HTMLElement>document.getElementById('root');
const app: App = new App(root);
app.start();
