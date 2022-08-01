import './style.scss';
import App from './controller/App';

const root = document.getElementById('root') as HTMLElement;
const app: App = new App(root);
app.start();
