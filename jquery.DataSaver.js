/*
 * jQuery DataSaver plugin 0.0.2 
 * 
 * Author: Seleznev Alexander (ABSENT) 
 * Email: absenteg@gmail.com 
 * Website: http://whoisabsent.ru 
 *  
 * Licensed under the MIT license. 
 * http://www.opensource.org/licenses/mit-license.php 
 */

(function($){
	
	var pluginName = "DataSaver";
	var methods = {
		init : function(options) { 
			var settings = $.extend({ 
				timeout: 0, 
				events: "change"
			}, options);
			
			return this.each(function(i, element){
				load(this);

				if (typeof settings.events !== "undefined" && settings.events.length > 0) {
					settings.events = settings.events.split(',').join(' ');
					$(this).on(settings.events, function(e) {
						save(this);
					});
				}

				if (typeof settings.timeout === "number" && settings.timeout > 0) {
					setInterval(function() {
						save(this);
					}, settings.timeout);
				}
			});
		},

		//Load data from localStorage
		load : function() { 
			return this.each(function(i, element){
				load(this);
			});
		},

		//Save data in localStorage
		save : function() { 
			return this.each(function(i, element){
				save(this);
			});
		},

		//Remove data in localStorage
		remove : function() { 
			return this.each(function(i, element){
				remove(this);
			});
		}
	};
	
	$.fn.DataSaver = function(method) {
		if (typeof(Storage)=== "undefined") {
			$.error("Your browser doesn't support web storage.");
		}

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method "' +  method + '" does not exist on ' + pluginName + '.');
		}
	};
	

	function save(element) {
		var key = getKey(element);
		var val;

		switch (element.tagName) {
			case "INPUT":
				var type = $(element).attr("type").toUpperCase();
				switch (type) {
					case "CHECKBOX":
						val = $(element).prop('checked');
					break;

					case "RADIO":
						val = $(element).val(); //keys for all radio[name] should match
					break;

					default:
						val = $(element).val();
					break;
				}
			break;

			case "SELECT":
				val = $(element).val();
			break;

			case "TEXTAREA":
				val = $(element).val();
			break;
		}

		if (typeof val !== "undefined") {
			localStorage[key] = val;
		}
	}

	function load(element) {
		var key = getKey(element);
		var val = localStorage[key];

		if (val != null) {
			switch (element.tagName) {
				case "INPUT":
					var type = $(element).attr("type").toUpperCase();
					switch (type) {
						case "CHECKBOX":
							$(element).prop('checked', (val === "true"));
						break;

						case "RADIO":
							$("input[type=radio][name="+element.name+"]" + "[value=" + val + "]").prop('checked', true);
						break;

						default:
							$(element).val(val);
						break;
					}
				break;

				case "SELECT":
					val = val.split(','); //for multiple select
					$(element).val(val);
				break;

				case "TEXTAREA":
					$(element).val(val);
				break;
			}
		}
	}

	function remove(element) {
		var key = getKey(element);
		localStorage.removeItem(key);
	}


	//Generate or return storageKey for element
	function getKey(element) {
		var key = element.storageKey;
		if (typeof key === "undefined") {
			var url = {
				host: window.location.host,
				pathname: window.location.pathname
			};

			var node = {
				tagName: element.tagName, 
				name: element.name
			}
			if ($(element).is(":input")) {
				element.type = element.type;
			}
			if (!$(element).is(":radio")) {
				element.id = element.id;
				element.className = element.className;
			}

			key = [pluginName, JSON.stringify(url), JSON.stringify(node)].join(".");
			element.storageKey = key;
		}

		return key;
	}
	
})(jQuery);