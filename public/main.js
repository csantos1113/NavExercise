"use strict";
// self executing function here
(() => {
	const PRIMARY_UNORDERED_LIST = 'primary-options',
		HAS_CHILDREN = 'has-children',
		SECONDARY_UNORDERED_LIST = 'secondary-options',
		PRIMARY_ANCHOR = 'primary-nav',
		SECONDARY_ANCHOR = 'secondary-nav',
		ACTIVE_CLASS = 'active',
		MENU_SHOWED = 'menu-showed',
		SUBMENU_SHOWED = 'submenu-showed';
	var cacheEl = {
		primarySelected: null,
		navContentStyle: null,
		body: null
	};
	var Util = {
		isMobile() {
			cacheEl.navContentStyle.display === 'block'
		},
		addClass(element, className) {
			element.classList.add(className);
		},
		removeClass(element, className) {
			element.classList.remove(className);
		}
	}

	function loadFn() {
		processElements();
		Nav.load();
	}

	function processElements() {
		function processBody() {
			let body = cacheEl.body;
			body.locked = (className = MENU_SHOWED) => {
				Util.addClass(body, className);
			};
			body.unlocked = (className = MENU_SHOWED) => {
				Util.removeClass(body, className);
			};
			document.getElementById('mask').addEventListener('click', Nav.hideAll);
		}

		function processLogo() {
			document.getElementById('huge-logo').addEventListener('click', Nav.hideAll);
		};

		function processCopyright() {
			let currentYear = new Date().getFullYear();
			document.getElementById('copyright').firstElementChild.innerHTML = currentYear;
		}
		cacheEl.navContentStyle = getComputedStyle(document.getElementsByClassName("nav-content")[0]);
		cacheEl.body = document.body;
		processBody();
		processLogo();
		processCopyright();
	}
	var Nav = {
		load() {
				Nav.get().then(Nav.build).catch(errorMsg => console.error(errorMsg));
			},
		get() {
			return new Promise((resolve, reject) => {
				let xmlhttp = new XMLHttpRequest();
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
		createOption(data, secondary = false) {
			let item = document.createElement('li');
			item.innerHTML = '<a class="' + (secondary ? SECONDARY_ANCHOR : PRIMARY_ANCHOR) + '" href="' + data.url + '">' + data.label + '</a>';
			return item;
		},
		build(items) {
			let itemData,
				item,
				children,
				childrenNumber,
				subMenu,
				navOptions = document.getElementsByClassName(PRIMARY_UNORDERED_LIST)[0];
			for (let i = 0; i < items.length; i++) {
				itemData = items[i];
				children = itemData.items;
				childrenNumber = children.length;
				item = Nav.createOption(itemData);
				if (childrenNumber > 0) {
					subMenu = document.createElement('ul');
					Util.addClass(subMenu, SECONDARY_UNORDERED_LIST);
					for (let j = 0; j < children.length; j++) {
						subMenu.appendChild(Nav.createOption(children[j], true));
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
		hideAll(){
			Nav.hideSubMenu(true);
			cacheEl.body.unlocked();
			cacheEl.body.unlocked(SUBMENU_SHOWED);
		},
		hideSubMenu(removeMask = false){
			if (cacheEl.primarySelected) {
				Util.removeClass(cacheEl.primarySelected, ACTIVE_CLASS);
				delete cacheEl.primarySelected;
			}
			if (removeMask) {
				if (Util.isMobile()) {
					cacheEl.body.locked();
				}
				cacheEl.body.unlocked(SUBMENU_SHOWED);
			}
		},
		activateSubMenu(primaryNav){
			if (!primaryNav)
				return;
			let primaryItem = primaryNav.parentNode,
				hasSubMenu = !!primaryNav.nextSibling,
				normalBehaivor = !hasSubMenu;
			//clicked the same primary nav
			if (cacheEl.primarySelected == primaryItem) {
				Nav.hideSubMenu(true);
				return normalBehaivor;
			}
			Nav.hideSubMenu(normalBehaivor);
			if (hasSubMenu) {
				Util.addClass(primaryItem, ACTIVE_CLASS);
				cacheEl.primarySelected = primaryItem;
				cacheEl.body.locked(SUBMENU_SHOWED);
			} else {
				cacheEl.body.unlocked();
			}
			return normalBehaivor;
		},
		toggleMobileMenu(){
			let body = cacheEl.body,
				classList = body.classList;
			if (classList.contains(MENU_SHOWED) || classList.contains(SUBMENU_SHOWED)) {
				Nav.hideAll();
			} else {
				body.locked();
			}
		}
	};
	var Events = {
		onClickNav(event){
			let el = event.target;
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
		onKeyupNav (event) {
			console.warn('Experimental test');
			let el = event.target;
			event.preventDefault();
			if (event.keyCode == 13) {
				Events.onClickNav(event);
			}
			return false;
		},
		onMenuMobileClick (event){
			event.preventDefault();
			Nav.toggleMobileMenu();
		}
	};

	window.addEventListener('load', loadFn);
})();