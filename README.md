# Sinistar Technical Test

=======
# Dependencies
This project uses Node.js version `20.16.0`.
All other dependencies will be installed locally in the next step.
You will also need a working google maps API key. This can be obtained [here](https://developers.google.com/maps/documentation/javascript/get-api-key)

## Installation
After installing an appropriate version of Node.js, and cloning into the repositoty, simply run:
`npm i`

## API key
After obtaining an API KEY, assign it the environment variable `REACT_APP_GOOGLE_MAPS_API_KEY`. This can be done by having a `.env` file at the root of the project with contents:
`REACT_APP_GOOGLE_MAPS_API_KEY=<key_value>`

## Running
If the above steps are completed, running `npm start` will runn the development server on `localhost:3000`.

## Features
Weight selection is done by clicking on the slider at the top right of the screen.

User home is inputted by the search bar at the top left. Doing this adds a red marker to the map, and zooms to its vicinity.

Available homes are visible on the map as yellow markers. They are also listed in the dropdown below the header.

If you click on a home on that table, the map will zoom onto its corresponding marker.

Hovering your mouse over one of the yellow markers will reveal the owner name and address of the corresponding home.

## Sorting algorithm
The available candidate homes are sorted using a basic implementation of the quicksort algorithm.

## Host scoring
The hosts are scored using a weighted sum of their 4 criteria scores. The weights are assigned by the user input. 
The criteria scores are normalized on a scale from 0 to 1. This is done so that they could be weighted fairly according to the inputted weights.

The response and flexibility scores are already normalized in this way. They could therefore be used as-is.

The review score spans 0 to 5. We can therefore normalize it simply by dividing it by 5.

For computing a distance score I chose to score them linearly on a line of best fit. This was done by finding the farthest distance among the hosts, and assigning it a score of 0; and finding the closest distance, and assigning it a score of 1. I then obtained the line passing through both these points as a slope-intercept pair, which in turn was used to compute the score of all remaining homes. 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
