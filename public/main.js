"use strict";
// self executing function here
(function() {
	const PRIMARY_UNORDERED_LIST = 'primary-options',
		HAS_CHILDREN = 'has-children',
		SECONDARY_UNORDERED_LIST = 'secondary-options',
		PRIMARY_ANCHOR = 'primary-nav',
		SECONDARY_ANCHOR = 'secondary-nav',
		ACTIVE_CLASS = 'active',
		MENU_SHOWED = 'menu-showed',
		SUBMENU_SHOWED = 'submenu-showed';
	var cacheElements = {
		primarySelected: null,
		navContent: null,
		body: null
	};
	var Util = {
		isMobile: () => cacheElements.navContentStyle.display === 'block',
		addClass: (...args) => {
			var element = Array.prototype.shift.call(args, 1);
			element.classList.add(args);
		},
		removeClass: (...args) => {
			var element = Array.prototype.shift.call(args, 1);
			element.classList.remove(args);
		}
	}

	function loadFn() {
		saveElementsCached();
		processBody();
		processLogo();
		processCopyright();
		Nav.load();
	}

	function saveElementsCached() {
		cacheElements.navContentStyle = getComputedStyle(document.getElementsByClassName("nav-content")[0]);
	}

	function processBody() {
		let body = cacheElements.body = document.body;
		body.locked = function(className = MENU_SHOWED) {
			Util.addClass(body, className);
		};
		body.unlocked = function(className = MENU_SHOWED) {
			Util.removeClass(body, className);
		};
		document.getElementById('mask').addEventListener('click', Nav.hideAll);
	}

	function processLogo() {
		document.getElementById('huge-logo').addEventListener('click', Nav.hideAll);
	};

	function processCopyright() {
		var currentYear = new Date().getFullYear();
		document.getElementById('copyright').firstElementChild.innerHTML = currentYear;
	}
	var Nav = {
		load: () => {
			Nav.get().then(Nav.build.bind(Nav)).catch(errorMsg => console.error(errorMsg));
		},
		get: () => {
			return new Promise((resolve, reject) => {
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open("GET", './api/nav.json');
				xmlhttp.onreadystatechange = () => {
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
		createOption: function(data, secondary) {
			var item = document.createElement('li');
			item.innerHTML = '<a class="' + (secondary ? SECONDARY_ANCHOR : PRIMARY_ANCHOR) + '" href="' + data.url + '">' + data.label + '</a>';
			return item;
		},
		build: function(iarItems) {
			var itemData,
				item,
				children,
				childrenNumber,
				subMenu,
				navOptions = document.getElementsByClassName(PRIMARY_UNORDERED_LIST)[0];
			for (var i = 0; i < iarItems.length; i++) {
				itemData = iarItems[i];
				children = itemData.items;
				childrenNumber = children.length;
				item = this.createOption(itemData);
				if (childrenNumber > 0) {
					subMenu = document.createElement('ul');
					Util.addClass(subMenu, SECONDARY_UNORDERED_LIST);
					for (var j = 0; j < children.length; j++) {
						subMenu.appendChild(this.createOption(children[j], true));
					}
					item.appendChild(subMenu);
					Util.addClass(item, HAS_CHILDREN);
				}
				navOptions.appendChild(item);
			}
			navOptions.addEventListener('click', Events.onClickNav);
			navOptions.addEventListener('keyup', Events.onKeyupNav.bind(Events));
			document.getElementById('menu-mobile').addEventListener('click', Events.onMenuMobileClick);
		},
		hideAll: function() {
			Nav.hideSubMenu(true);
			cacheElements.body.unlocked();
			cacheElements.body.unlocked(SUBMENU_SHOWED);
		},
		hideSubMenu: function(removeMask) {
			if (cacheElements.primarySelected) {
				Util.removeClass(cacheElements.primarySelected, ACTIVE_CLASS);
				delete cacheElements.primarySelected;
			}
			if (removeMask) {
				if (Util.isMobile()) {
					cacheElements.body.locked();
				}
				cacheElements.body.unlocked(SUBMENU_SHOWED);
			}
		},
		activateSubMenu: function(primaryNav) {
			let primaryItem = primaryNav.parentNode,
				hasSubMenu = !!primaryNav.nextSibling,
				normalBehaivor = !hasSubMenu;
			//clicked the same primary nav
			if (cacheElements.primarySelected == primaryItem) {
				this.hideSubMenu(true);
				return normalBehaivor;
			}
			this.hideSubMenu(normalBehaivor);
			if (hasSubMenu) {
				Util.addClass(primaryItem, ACTIVE_CLASS);
				cacheElements.primarySelected = primaryItem;
				cacheElements.body.locked(SUBMENU_SHOWED);
			}
			return normalBehaivor;
		},
		toggleMobileMenu: function() {
			let classList = cacheElements.body.classList;
			if (classList.contains(MENU_SHOWED) || classList.contains(SUBMENU_SHOWED)) {
				this.hideAll();
			} else {
				cacheElements.body.locked();
			}
		}
	};
	var Events = {
		onClickNav: function(event) {
			var el = event.target;
			if (el.tagName == 'A') {
				if (el.classList.contains(PRIMARY_ANCHOR)) {
					if (!Nav.activateSubMenu(el)) {
						event.preventDefault();
					}
				} else {
					//Cualquier otro link que se toque, se debe ocultar todo
					Nav.hideAll();
				}
			}
		},
		onKeyupNav: function(event) {
			console.warn('Experimental test');
			var el = event.target;
			event.preventDefault();
			if (event.keyCode == 13) {
				this.onClickNav(event);
			}
			return false;
		},
		onMenuMobileClick: function(event) {
			event.preventDefault();
			Nav.toggleMobileMenu();
		}
	};

	window.addEventListener('load', loadFn);
})();