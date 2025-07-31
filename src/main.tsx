import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

const container = document.getElementById('root');
if (!container) throw new Error("Unable to find root element");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
