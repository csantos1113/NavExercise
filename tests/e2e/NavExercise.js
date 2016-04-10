var path = require('path'),
 imagesPath = path.join(__dirname, '..', 'reports', 'images'),
	urlToTest = 'http://localhost:3000/',
	urlHashMainLink = '#/work',
	urlHashSecondaryLink = '#/about/leadership',
	selectors = {
		logo: '#huge-logo',
		navContent: '.nav-content',
		menuButton: '#menu-mobile',
		copyright: '#copyright',
		mask: '#mask',
		mainLinkWithoutChildren: '.primary-nav[href="' + urlHashMainLink + '"]',
		mainLinkWithChildren: '.primary-nav[href="#/about"]',
		secondaryLink: '.secondary-nav[href="' + urlHashSecondaryLink + '"]'
	},
	xyPhone = {
		x: 450,
		y: 750
	};

module.exports = {
	/**
	 * Open the url page and start in Mobile dimensions
	 */
	before: function(client) {
		client
			.url(urlToTest)
			.resizeWindow(xyPhone.x, xyPhone.y)
			.waitForElementVisible('body', 10000)
			.assert.title("HUGE NavExercise")
			.pause(350);
	},
	'Phone mode. Initial status': function(client) {
		//take evidence
		client.saveScreenshot(imgPath('mobile-01-init.png'));
		//check!
		checkInitialPhoneStatus(client);
	},
	'Phone mode. Open menu': function(client) {
		//interactions
		client = openMenu(client);
		//take evidence
		client.saveScreenshot(imgPath('mobile-02-menu-open.png'));
		//check!
		client.expect.element(selectors.logo).visible;
		client
			.assert.cssProperty(selectors.menuButton, 'float', 'right', 'Expected menu icon on the right side')
			.getCssProperty(selectors.navContent, 'width', function(result) {
				this.assert.notEqual(result.value, '0px', 'Expected menu to be visible');
			})
			.getCssProperty(selectors.copyright, 'width', function(result) {
				this.assert.notEqual(result.value, '0px', 'Expected copyright to be visible');
			})
			.assert.visible(selectors.mask);
	},
	'Phone mode. Menu opened. Primary navigation link item': function(client) {
		var mainLink = selectors.mainLinkWithoutChildren;
		//interactions
		client.moveToElement(mainLink, 1, 1);
		//take evidence
		client.saveScreenshot(imgPath('mobile-03-main-link-hover.png'));

		//interaction with a main link without children
		client.click(mainLink).pause(500);
		//check!
		//redirect to the correct url?
		client.assert.urlContains(urlHashMainLink);
		//page restored
		checkInitialPhoneStatus(client);
	},
	'Phone mode. Menu opened. Primary navigation menu item': function(client) {
		var selector = selectors.mainLinkWithChildren;
		//interactions
		client = openMenu(client);
		client = openMenuItem(client, selector, 'mobile-04-visible-secondary-nav.png');
		//check!
		client.getCssProperty(selector + '+.secondary-options', 'height', function(result) {
			this.assert.notEqual(result.value, '0px', 'Expected sub-menu to be visible');
		});
		//interaction to close the active menu item
		client.click(selector).pause(500);
		//take evidence
		client.saveScreenshot(imgPath('mobile-05-hidden-secondary-nav.png'));
	},
	'Phone mode. Menu opened. Secondary navigation link item': function(client) {
		//open again the sub-menu
		client = openMenuItem(client, selectors.mainLinkWithChildren);
		//interactions with the secondary link
		var selector = selectors.secondaryLink;
		client.moveToElement(selector, 1, 1);
		//take evidence
		client.saveScreenshot(imgPath('mobile-06-secondary-link-hover.png'));

		//interaction with a main link without children
		client.click(selector).pause(500);
		//check!
		//redirect to the correct url?
		client.assert.urlContains(urlHashSecondaryLink);
		//page restored
		checkInitialPhoneStatus(client);
	},
	'Phone mode. Menu opened. Close menu from X icon': function(client) {
		//interactions
		//open menu
		client = openMenu(client);
		//close menu from the icon
		openMenu(client);
		//check!
		checkInitialPhoneStatus(client);
	},
	'Phone mode. Menu opened. Close menu from HUGE logo': function(client) {
		//interactions
		//open menu
		client = openMenu(client);
		//close menu from HUGE logo
		client.click(selectors.logo).pause(500);
		//check!
		checkInitialPhoneStatus(client);
	},
	'Phone mode. Menu opened. Close menu from mask': function(client) {
		//interactions
		//open menu
		client = openMenu(client);
		//close menu from mask
		client.moveToElement(selectors.mask, xyPhone.x - 1, xyPhone.y / 2)
			.mouseButtonClick(0).pause(500);
		//check!
		checkInitialPhoneStatus(client);
	},
	/**
	 * After all tests, close the browser and stop the robot
	 */
	after: function(client) {
		client
			.closeWindow()
			.end();
	}
};

function imgPath(imageName){
	return path.join(imagesPath, imageName);
}

/**
 * Utility function to validate the initial status of the app on phone dimensions.
 * This check:
 * - hidden logo
 * - visible menu icon
 * - hidden menu nav
 * - hidden mask
 */
function checkInitialPhoneStatus(client) {
	client.expect.element(selectors.logo).not.visible;
	client.expect.element(selectors.menuButton).visible;
	client.assert.cssProperty(selectors.navContent, 'width', '0px', 'Expected menu to not be visible');
	client.expect.element(selectors.mask).not.visible;
	//return the chain
	return client;
}

/**
 * Utility function to click on the menu icon.
 */
function openMenu(client) {
	return client.click(selectors.menuButton).pause(500);
}

/**
 * Utility function to click on a specific menu item to show its sub-menu
 * @param  {Object} client         Browser
 * @param  {String} selector       menu item selector
 * @param  {String} screenshotName name of the screenshot (optional)
 */
function openMenuItem(client, selector, screenshotName) {
	//interactions
	//interaction with a main link with children
	client.click(selector).pause(500);
	if (screenshotName) {
		//take evidence
		client.saveScreenshot(imgPath(screenshotName));
	}
	return client;
}