# Huge Navigation Exercise. By César Santos

## Install & test the solution

###Requirements
* Node.js and npm (You get both when you [install Node.js](https://docs.npmjs.com/getting-started/installing-node)).

###Install
* Download the zip file or the master copy of [GitHub](https://github.com/santospro/NavExercise).
* Extract the zip file.
* Move to the exercise directory:
```
$ cd NavExercise
```
* Run the command:
```
$ npm i && npm start
```

###Run
* In your Google Chrome navigate to [http://localhost:3000](http://localhost:3000)

####Disclaimer
This exercise was build to work only on **Google Chrome** using the ECMAScript 2015 Language Specification (ES2015).

*I recommend see [this link](https://babeljs.io/docs/learn-es2015/) if you are not familiarized with ES2015.*

##Content

###Javascript

The code present on ```main.js``` file is composted by the following elements:

* **Constants**: properties that never change during the execution.
* **Util**: a singleton object with utilitarian functions that are used in several places in the code.
* **Nav**: a singleton object with all nav functionality.
* **Events**: a singleton object with the events listeners.

###Styles

When you started the server, the ```styles/main.css``` file is generated automatically using the sass preprocessor.

The following are the files using to generate the css:

* ```sass/_vars.scss``` hosts the variables for measurements, typography and colors. These vars are using for the following scripts.
* ```sass/_header.scss``` has the styles applied to the components of the navigation bar.
* ```sass/_body.scss``` has the style applied to the body components.
* ```sass/main.scss``` is the main point to generate the css, importing all scss files and fonts.css file.

**_sass/_header.scss_** and **_sass/_body.scss_** are using some transitions to improve the user experience.

**_Both files_** are using two media-queries to support the different device dimensions expressed on the requirements. But **_sass/_header.scss_** has two more media-queries to fix a broken navigation bar that appears when the windows width is closing to the limits expressed on the requirements.

###E2E tests

It's important to have some automated tests to ensure the proper functioning of the application during the time and during the futures changes.

You need to run the following command to start the automated test:

```
$ npm test
```

####Results

* the robot will open a Google Chrome instance and executes each test.
* on the line command you'll see each test case and the check list results.
* the robot will take some screenshots as evidence, saving its on the ```tests/reports/images/``` folder.

####Prerequisites
* the server needs to be running ```npm start```
* the selenium standalone server needs to be running:
	* enables autostart selenium action (selenium.start_process) on the ```nightwatch.json``` file.
	* or start it manually:
	```
	$ cd ./tests/bin/
	$ java -jar ./selenium-server-standalone-2.53.0.jar
	```
* If your computer is not a Mac:
	* you need to download the correct chromedriver form [here](http://chromedriver.storage.googleapis.com/index.html?path=2.21/).
	* unzip the file into the folder ```./tests/bin/```
	* change the selenium.cli_args.webdriver.chrome.driver on the ```nightwatch.json``` file to use the correct driver.

## Overview

This exercise will have the candidate build a responsive site navigation driven by an AJAX request.

Here are the guidelines for this exercise

* No frameworks or libraries (e.g. jQuery, Angular, React).
* Chrome compliance is all that's required, all functions and features available in Chrome are in play.
* Nav must be responsive.
* Code must run after the following command, please ensure your code runs as you expect it to from a fresh checkout with these commands before submission.

```
$ npm i && npm start
```

Nice to haves:

* Adherence to accessibility standards
* Documentation
* Unit and/or E2E tests

At a high level the navigation will have two main states

* <768px: Mobile. Hamburger icon will display in the top-left of the page. Clicking the hamburger will cause a card to slide in and overlay the content from the left. The card will contain nav and sub-nav items defined in the JSONP response
* \>= 768px: Desktop. The nav will display as a horizontal nav. Top level nav items will display sub-nav items when clicked. No hamburger will be shown.

## Version
0.1.0

## Files

* Mockup - Illustrator file describing how the nav should behave
* server.js - node.js server that will host the site and provie the api to construct the nav

## API

* GET /api/nav.json - returns a JSON response representing the items in the nav.

## Get Started

###Requirements
* <a href="http://www.adobe.com/products/illustrator.html">Adobe Illustrator</a>
* Node.js and npm (You get both when you <a href="https://docs.npmjs.com/getting-started/installing-node">install Node.js</a>.)

###Install the exercise locally
```
git clone git@github.com:hugeinc/NavExercise.git
cd NavExercise
npm install
npm start
```

## Design Specifications

### Typography

* **Primary Navigation** 21/48 HUGE Avant Garde Bold
* **Secondary Navigation** 16/48 Galaxie Copernicus Book
* **Headline (Desktop)** 120/132 HUGE Avant Garde Bold
* **Body Copy (Desktop)** 24/36 Galaxie Copernicus Book
* **Headline (Mobile)** 44/48 HUGE Avant Garde Bold
* **Body Copy (Mobile)** 14/24 Galaxie Copernicus Book
* **Copyright (Mobile)** 12/16 Helvetica Neue Regular

### Color

* **Magenta** #ec008c
* **Light Gray** #eee
* **Translucent Black** rgba(0, 0, 0, 0.5)

### Measurements

Measurements are specified in pixels. Dimensions are fluid unless specified.

### Interactions

#### Desktop

* On hover, Primary Navigation reverses color (white/magenta).
* On click, if item contains a URL, Primary Navigation navigates to a new page.
* On click, if item contains other items, Secondary Navigation appears (see Desktop, Secondary Navigation).
* Menu appears containing Secondary Navigation.
* Translucent mask appears over content, behind menu.
* On hover in, Secondary Navigation changes color (magenta/light gray).
* On click, Secondary navigates to a new page.
* On click outside of menu, menu and mask are hidden.

#### Mobile

* When a user clicks the open navigation icon (“hamburger”), the navigation should “push” from left to right.
* The HUGE logo and navigation toggle slide left to right.
* The open navigation icon should change to the close navigation icon (“x”).
* Translucent mask appears over content, right of navigation.
* The Primary Navigation should include link items and menu items.
* When a user hovers a Primary Navigation item, it should change color (magenta/light gray).
* When a user clicks a Primary Navigation link item, the browser should navigate to a new page.
* When a user clicks a Primary Navigation menu item, the Secondary Navigation should “push” down, the chevron should rotate * 180°.
* When a user hovers a Secondary Navigation item, it should change color (magenta/light gray).
* When a user clicks a Secondary Navigation item, browser should navigate to a new page.
* When a user clicks outside of the navigation, the navigation should close.
* When the navigation closes:
  * the menu should “pull” from right to left
  * the logo and toggle button should “slide” from right to left
  * the close icon should change to the open icon
  * the mask should be hidden
