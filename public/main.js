/**
 * Application logic.
 * This builds and controls the navigation bar options.
 * @author Cesar A Santos R (rasec_1113@hotmail.com)
 */

// self executing function here
(function() {
	//Constants used on the web page
	var URL_NAV_API = './api/nav.json',
		PRIMARY_UNORDERED_LIST = 'primary-options',
		HAS_CHILDREN = 'has-children',
		SECONDARY_UNORDERED_LIST = 'secondary-options',
		PRIMARY_ANCHOR = 'primary-nav',
		SECONDARY_ANCHOR = 'secondary-nav',
		ACTIVE_CLASS = 'active',
		MENU_SHOWED = 'menu-showed',
		SUBMENU_SHOWED = 'submenu-showed';
	//store of some elements and data that will be used on the process.
	var cacheEl = {
		primarySelected: null,
		navContentStyle: null,
		body: null
	};
	/**
	 * Singleton with utilitarian functions
	 * @type {Object}
	 */
	var Util = {
		/**
		 * Identifies whether it's a Phone
		 * @return {Boolean} true if phone, false otherwise
		 */
		isMobile: function() {
			return cacheEl.navContentStyle.display === 'block';
		},
		/**
		 * Add a css class to a specific element.
		 * 
		 * @param {Object} element   Element to add the class
		 * @param {String} className class to add
		 */
		addClass: function(element, className) {
			element.classList.add(className);
		},
		/**
		 * Remove a css class from a specific element.
		 * 
		 * @param {Object} element   Element to remove the class
		 * @param {String} className class to remove
		 */
		removeClass: function(element, className) {
			element.classList.remove(className);
		}
	};
	/**
	 * Singleton with the nav functionality
	 * @type {Object}
	 */
	var Nav = {
		/**
		 * Request the nav options from the server and build options on the navigation bar.
		 * Catch any error and show it on the console.
		 */
		load: function() {
			Nav.get().then(Nav.build).catch(function(errorMsg) {
				console.error(errorMsg);
			});
		},
		/**
		 * Request the nav options from the server and return a promise.
		 * When the server responds, it will resolve the promise with the items data.
		 * If something wrong happened, it will reject the promise with the error message.
		 * @return {Promise}
		 */
		get: function() {
			return new Promise(function(resolve, reject) {
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open("GET", URL_NAV_API);
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == XMLHttpRequest.DONE) {
						if (xmlhttp.status == 200) {
							resolve(JSON.parse(xmlhttp.responseText).items);
						} else {
							reject('Error: ' + xmlhttp.statusText);
						}
					}
				}
				xmlhttp.send();
			});
		},
		/**
		 * Build the options on the navigation bar by the items data received on the parameter.
		 * 
		 * @param  {Array} items Items data
		 */
		build: function(items) {
			var itemData,
				item,
				children,
				childrenNumber,
				subMenu,
				navOptions = document.getElementsByClassName(PRIMARY_UNORDERED_LIST)[0];
			items = Array.isArray(items) ? items : [];
			for (var i = 0; i < items.length; i++) {
				itemData = items[i];
				children = itemData.items;
				childrenNumber = children.length;
				item = Nav.createOption(itemData.url, itemData.label);
				if (childrenNumber > 0) {
					subMenu = document.createElement('ul');
					Util.addClass(subMenu, SECONDARY_UNORDERED_LIST);
					for (var j = 0; j < children.length; j++) {
						subMenu.appendChild(Nav.createOption(children[j].url, children[j].label, SECONDARY_ANCHOR));
					}
					item.appendChild(subMenu);
					Util.addClass(item, HAS_CHILDREN);
				}
				navOptions.appendChild(item);
			}
			navOptions.addEventListener('click', Events.onClickNav);
			document.getElementById('menu-mobile').addEventListener('click', Events.onMenuMobileClick);
		},
		/**
		 * Create a new list item (li) element for the specific data received on the parameters.
		 * This li element represents a main link or a secondary link on the navigation bar
		 * 
		 * @param  {String} url       Url to the anchor
		 * @param  {String} label     Option name
		 * @param  {String} className Class to the option
		 * @return {Object}           li element
		 */
		createOption: function(url, label, className) {
			var item = document.createElement('li');
			className = className || PRIMARY_ANCHOR;
			item.innerHTML = '<a class="' + className + '" href="' + url + '" title="' + label + '">' + label + '</a>';
			return item;
		},
		/**
		 * Hide all possible panels showed:
		 * - sub-menu bar (Desktop)
		 * - menu bar (Mobile)
		 */
		hideAll: function() {
			Nav.hideSubMenu(true);
			cacheEl.body.unlocked();
		},
		/**
		 * Remove the active class to the last main link selected and remove
		 * the mask to unlock the body.
		 * 
		 * @param  {Boolean} removeMask remove or not remove the mask
		 */
		hideSubMenu: function(removeMask) {
			removeMask = !!removeMask;
			if (cacheEl.primarySelected) {
				Util.removeClass(cacheEl.primarySelected, ACTIVE_CLASS);
				delete cacheEl.primarySelected;
			}
			if (removeMask) {
				//If the device is a phone, we maintain the mask 
				//because the menu bar is still displayed.
				if (Util.isMobile()) {
					cacheEl.body.locked();
				}
				cacheEl.body.unlocked(SUBMENU_SHOWED);
			}
		},
		/**
		 * If the element is the same last main link selected, we hide the sub-menu and finish the action.
		 * If the element is different and has a sub-menu, we show the sub-menu.
		 * Otherwise we unlock the body.
		 * 
		 * @param  {Object} primaryNav Main link selected
		 * @return {Boolean}           true if the anchor can redirect the page, false otherwise
		 */
		activateSubMenu: function(primaryNav) {
			if (!primaryNav)
				return;
			var primaryItem = primaryNav.parentNode,
				hasSubMenu = !!primaryNav.nextSibling,
				normalBehavior = !hasSubMenu;
			//clicked the same main-link
			if (cacheEl.primarySelected == primaryItem) {
				Nav.hideSubMenu(true);
				return normalBehavior;
			}
			//hide the last sub-menu
			Nav.hideSubMenu(normalBehavior);
			//If the new main link has sub-menu
			if (hasSubMenu) {
				//show it
				Util.addClass(primaryItem, ACTIVE_CLASS);
				cacheEl.primarySelected = primaryItem;
				cacheEl.body.locked(SUBMENU_SHOWED);
			} else {
				//otherwise, unlock the body
				cacheEl.body.unlocked();
			}
			return normalBehavior;
		},
		/**
		 * Toggle (show/hide) the mobile menu.
		 */
		toggleMobileMenu: function() {
			var body = cacheEl.body,
				classList = body.classList;
			if (classList.contains(MENU_SHOWED) || classList.contains(SUBMENU_SHOWED)) {
				Nav.hideAll();
			} else {
				body.locked();
			}
		}
	};
	/**
	 * Singleton with event listeners
	 * @type {Object}
	 */
	var Events = {
		/**
		 * Manage the click event on any element on the navigation bar.
		 * - Identify if the element is a main link and try to show its sub-menu
		 * - Any other link, close the sub-menu and redirect to the option
		 * 
		 * @param  {Object} event Event object fired by click action
		 */
		onClickNav:function(event) {
				var el = event.target;
				if (el.tagName == 'A') {
					if (el.classList.contains(PRIMARY_ANCHOR)) {
						if (!Nav.activateSubMenu(el)) {
							event.preventDefault();
						}
					} else {
						//Any other link: hide all
						Nav.hideAll();
					}
				}
			},
			/**
			 * Manage the click event on the menu icon "hamburger".
			 * Toggle (show/hide) the mobile menu.
			 * 
			 * @param  {Object} event Event object fired by click action
			 */
			onMenuMobileClick:function(event) {
				event.preventDefault();
				Nav.toggleMobileMenu();
			}
	};
	//When the DOMContent is loaded, do the logic
	document.addEventListener('DOMContentLoaded', loadFn);

	/**
	 * Access point to make the navigation bar.
	 */
	function loadFn() {
		processElements();
		Nav.load();
	}

	/**
	 * Make changes on some page elements to improve the interactions:
	 * - locked and unlocked functions to body element
	 * - listener the clicks on the logo
	 * - set the current year to the copyright
	 */
	function processElements() {
		/**
		 * Add locked and unlocked functions to body element (functions to show/hide the mask)
		 * Listener to click event on the mask to hide menu & sub-menu
		 */
		function processBody() {
			var body = cacheEl.body;
			body.locked = function(className) {
				Util.addClass(body, className || MENU_SHOWED);
			};
			body.unlocked = function(className) {
				Util.removeClass(body, className || MENU_SHOWED);
			};
			document.getElementById('mask').addEventListener('click', Nav.hideAll);
		}
		/**
		 * Listener to click event on the logo to hide menu & sub-menu
		 */
		function processLogo() {
			document.getElementById('huge-logo').addEventListener('click', Nav.hideAll);
		};
		/**
		 * set the current year to the copyright
		 */
		function processCopyright() {
			var currentYear = new Date().getFullYear();
			document.getElementById('copyright').firstElementChild.innerHTML = currentYear;
		}
		//store some elements and data to use later
		cacheEl.navContentStyle = getComputedStyle(document.getElementsByClassName("nav-content")[0]);
		cacheEl.body = document.body;
		//Make the changes
		processBody();
		processLogo();
		processCopyright();
	}
})();