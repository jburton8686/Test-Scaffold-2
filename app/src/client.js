// Enable HMR
if (module.hot) module.hot.accept()

// Using Webpack's DefinePlugin we can use global constants such as devMode to have some code (e.g. logging) stay in our codebase but be stripped out during production builds
if (DEVMODE) console.log('Dev mode active')

// Webpack entrypoint for styles
import './styles/index'

// This code demonstrates the code splitting/chunking ability of Webpack
// The example module will only be loaded over the network upon us triggering the require code below
const exampleEl = document.querySelector('.js-example')
const exampleTriggerEl = document.querySelector('.js-example-trigger')

if (exampleEl && exampleTriggerEl) {
  exampleTriggerEl.addEventListener('submit', event => {
    event.preventDefault()

    import('./modules/example-lazy').then(func => func.default(exampleEl))
  })
}

// This module demonstrates basic React integration
import reactExample from './modules/example-react'
reactExample()
