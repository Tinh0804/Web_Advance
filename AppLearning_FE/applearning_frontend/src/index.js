import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import reportWebVitals from './reportWebVitals';
import './styles/global.scss';
import "./styles/themes/dark.scss";
import "./styles/themes/light.scss";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider> 
      <ThemeProvider> 
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();

