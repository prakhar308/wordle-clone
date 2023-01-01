import { createRoot } from 'react-dom/client';
import Wordle from './Wordle.js';

let root = createRoot(document.getElementById('root')); 
root.render(<Wordle />);