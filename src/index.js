import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthStateProvider } from './stores/GoogleAuth'
import { YoutubeStateProvider } from './stores/Youtube'

ReactDOM.render(
  <AuthStateProvider>
    <YoutubeStateProvider>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </YoutubeStateProvider>
  </AuthStateProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
