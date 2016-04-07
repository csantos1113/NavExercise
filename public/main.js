"use strict";
// self executing function here
(function() {
	const PRIMARY_UNORDERED_LIST = 'primary-options',
		HAS_CHILDREN = 'has-children',
		SECONDARY_UNORDERED_LIST = 'secondary-options',
		PRIMARY_ANCHOR = 'primary-nav',
		SECONDARY_ANCHOR = 'secondary-nav',
		HIDE_CLASS = 'hide',
		ACTIVE_CLASS = 'active',
		MENU_SHOWED = 'menu-showed';
	var cacheElements = {
		primarySelected: null,
		navHeader: null,
		mask: null,
		isMobile: false
	};

	function addClass() {
		var element = Array.prototype.shift.call(arguments, 1);
		element.classList.add(...arguments);
	}

	function removeClass() {
		var element = Array.prototype.shift.call(arguments, 1);
		element.classList.remove(...arguments);
	}

	function loadFn() {
		saveElementsCached();
		processMask();
		processLogo();
		Nav.load();
	}

	function saveElementsCached() {
		cacheElements.navHeader = document.getElementsByClassName("nav-header")[0];
		cacheElements.mask = document.getElementById('mask');
	}

	function processMask() {
		let mask = cacheElements.mask;
		mask.show = function() {
			removeClass(this, HIDE_CLASS);
			addClass(document.body, 'locked');
		};
		mask.hide = function() {
			addClass(this, HIDE_CLASS);
			removeClass(document.body, 'locked');
		};
		mask.addEventListener('click', Nav.hideMenu);
	}

	function processLogo() {
		document.getElementById('huge-logo').addEventListener('click', Nav.hideMenu);
	};
	var Nav = {
		load: () => {
			Nav.get().then(Nav.build.bind(Nav)).catch(errorMsg => {
				console.error(errorMsg);
			});
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
					addClass(subMenu, SECONDARY_UNORDERED_LIST);
					for (var j = 0; j < children.length; j++) {
						subMenu.appendChild(this.createOption(children[j], true));
					}
					item.appendChild(subMenu);
					addClass(item, HAS_CHILDREN);
				}
				navOptions.appendChild(item);
			}
			navOptions.addEventListener('click', Events.onClickNav);
			document.getElementById('menu-mobile').addEventListener('click', Events.onMenuMobileClick);
		},
		hideMenu: function(removeMask) {
			if (cacheElements.primarySelected) {
				removeClass(cacheElements.primarySelected, ACTIVE_CLASS);
				delete cacheElements.primarySelected;
				if (removeMask) {
					cacheElements.mask.hide();
				}
			}
			if (removeMask) {
				removeClass(cacheElements.navHeader, MENU_SHOWED);
			}
		},
		activateMenu: function(primaryNav) {
			let primaryItem = primaryNav.parentNode,
				hasSubMenu = !!primaryNav.nextSibling,
				normalBehaivor = !hasSubMenu;
			//clicked the same primary nav
			if (cacheElements.primarySelected == primaryItem) {
				this.hideMenu(true);
				return normalBehaivor;
			}
			this.hideMenu(normalBehaivor);
			if (hasSubMenu) {
				addClass(primaryItem, ACTIVE_CLASS);
				cacheElements.primarySelected = primaryItem;
				cacheElements.mask.show();
			}
			return normalBehaivor;
		},
		toggleMobileMenu: function() {
			let classList = cacheElements.navHeader.classList,
				className = MENU_SHOWED;
			if (classList.contains(className)) {
				this.hideMenu(true);
			} else {
				cacheElements.mask.show();
				classList.toggle(MENU_SHOWED);
			}
		}
	};
	var Events = {
		onClickNav: function(event) {
			var el = event.target;
			if (el.tagName == 'A') {
				if (el.classList.contains(PRIMARY_ANCHOR)) {
					if (!Nav.activateMenu(el)) {
						event.preventDefault();
					}
				} else {
					Nav.hideMenu(true);
				}
			}
		},
		onMenuMobileClick: function(event) {
			event.preventDefault();
			Nav.toggleMobileMenu();
		}
	};

	window.addEventListener('load', loadFn);
})();