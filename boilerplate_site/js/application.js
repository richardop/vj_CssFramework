
function SlideMenu() {
	
	this.viewport		= '#viewport';
	this.list			= '#panel';
	this.thumb			= '.thumb';
	
	this.next_btn		= '#next_btn';
	this.previous_btn	= '#previous_btn';
	
	this.current_img	= 1;
	this.animate		= true;

	SlideMenu.prototype.fetch_img_num_from_url = function() {
		var uri = window.location.hash.substr(1);
		arr = uri.split('-');
		var id = Number(arr[1]);
		
		if(id) {
			this.animate = false;			// <-- Messy, but necessary until I can figure out why animate() is choosing random numbers
			return id;
		} else {
			this.animate = true;
			return false;
		}
	}
	
	SlideMenu.prototype.identify_current_image = function() {
		
		if(this.fetch_img_num_from_url()) {
			$('li.thumb a.active').removeClass('active');
			$('#file-' + this.fetch_img_num_from_url()).addClass('active');
		}

		for(i = 1; i <= this.num_thumbs; i++) {
			if($(this.list).children('#item-' + i).children('a').hasClass('active')) {
				this.current_img = i;
			}
		}

	}
	
	SlideMenu.prototype.init = function() {
		
		this.num_thumbs 		= $(this.list).children().length;
		this.thumb_width 		= $(this.list).children(0).width();
		this.viewport_width		= $(this.viewport).width();
		this.panel_width 		= this.num_thumbs * this.thumb_width;

		this.identify_current_image();
	
		this.num_thumbs_per_panel	= this.viewport_width / this.thumb_width;
		this.panel_position 		= 0;
		
		this.total_panels = this.get_total_panels();
		this.current_panel = this.get_current_panel();

		var css = { overflow:'hidden' };
		$(this.viewport).css(css);

		$(this.next_btn).removeClass('hide');
		$(this.previous_btn).removeClass('hide');

		$(this.list).width(this.panel_width);
		
		this.move_to_current_panel();
		
	}
	
	SlideMenu.prototype.toggle_buttons = function() {
		if((this.current_panel - 1) > 0) {
			$(this.previous_btn).removeClass('disabled');
			var css = { 'cursor' : 'pointer' };
			$(this.previous_btn).css(css);
		} else {
			$(this.previous_btn).addClass('disabled');
			var css = { 'cursor' : 'default' };
			$(this.previous_btn).css(css);
		}
		if((this.current_panel + 1) <= this.total_panels) {
			$(this.next_btn).removeClass('disabled');
			var css = { 'cursor' : 'pointer' };
			$(this.next_btn).css(css);
		} else {
			$(this.next_btn).addClass('disabled');
			var css = { 'cursor' : 'default' };
			$(this.next_btn).css(css);
		}	
	}
	
	SlideMenu.prototype.get_total_panels = function() {
		var counter = 1;
		var n = this.num_thumbs;
		while(n > this.num_thumbs_per_panel) {
			n -= this.num_thumbs_per_panel;
			counter++;
		}
		return counter;
	}
	
	SlideMenu.prototype.get_current_panel = function() {
		var current_panel = 1;
		var n = this.current_img;
		while(n > this.num_thumbs_per_panel) {
			n -= this.num_thumbs_per_panel;
			current_panel++;
		}
		return current_panel;
	}

	SlideMenu.prototype.move_to_current_panel = function() {
		var target_position = -((this.current_panel - 1) * this.viewport_width);
		if(this.animate) {
			$(this.list).animate({ 
				left: target_position
				}, 500, 'easeOutQuad', function() {
					toggle_buttons();
			});
		} else {
			var css = {'left':target_position};	
			$(this.list).css(css);
			this.animate = true;
		}
	}

	SlideMenu.prototype.next_panel = function() {
		if((this.current_panel + 1) <= this.total_panels) {
			this.current_panel += 1;
			this.move_to_current_panel();
		}
	}
	
	SlideMenu.prototype.previous_panel = function() {
		if((this.current_panel - 1) > 0) {
			this.current_panel -= 1;
			this.move_to_current_panel();
		}
	}
	
}











function TabbedNavigation(num_tabs, tab_handle, content_handle, classname, default_tab) {

	this.num_tabs = num_tabs;				// -> number of tabs on page
	this.tab_handle = tab_handle;			// -> name of tab IDs minus number (e.g. "tab1" would be "tab")
	this.content_handle = content_handle;	// -> name of content box IDs minus number (e.g. "content1" would be "content")
	this.classname = classname;				// -> css class to be applied to open tab
	this.default_tab = default_tab;			// -> which tab is open by default

	TabbedNavigation.prototype.hide_all_content_boxes_except = function(num, fade) {
		var css = { display:'none'}
		for(i = 1; i <= this.num_tabs; i++) {
			$(this.content_handle + i).css(css);
		}	
		if(!fade) {	
			var css = { display:'block'}
			$(this.content_handle + num).css(css);
		} else {
			$(this.content_handle + num).fadeIn(750);
		}
	}


	TabbedNavigation.prototype.set_current_tab_to = function(num) {
		for(i = 1; i <= this.num_tabs; i++) {
			$(this.tab_handle + i).removeClass(this.classname);
		}
		$(this.tab_handle + num).addClass(this.classname);
	}


	TabbedNavigation.prototype.set_tab_to = function(num) {
		this.set_current_tab_to(num);
		this.hide_all_content_boxes_except(num);
	}

	this.set_tab_to(this.default_tab);

}










function CollapsibleNav(categories, use_toggle_icon) {
	
	this.categories = categories;			// <-- Array of course ids
	this.open_class = 'is_currently_open';
	this.use_toggle_icon = use_toggle_icon;
	
	CollapsibleNav.prototype.toggle = function(school_id) {
		
		for(i = 0; i < categories.length; i++) {
			if($(categories[i]).hasClass(this.open_class)) {
				$(categories[i]).removeClass(this.open_class);
				$(categories[i]).slideUp(250, 'easeOutQuad');
				if(this.use_toggle_icon) {
					$(categories[i] + '-toggle-icon').addClass('closed');
					$(categories[i] + '-toggle-icon').removeClass('open');
				}
			} else {
				if(categories[i] == school_id) {
					$(school_id).addClass(this.open_class);
					$(school_id).slideDown(250, 'easeOutQuad');
					if(this.use_toggle_icon) {
						$(categories[i] + '-toggle-icon').addClass('open');
						$(categories[i] + '-toggle-icon').removeClass('closed');
					}
				}
			}
		}
	
	}
	
	for(i = 0; i < categories.length; i++) {
		$(categories[i]).addClass('hide');
		if(this.use_toggle_icon) {
			$(categories[i] + '-toggle-icon').addClass('closed');
			$(categories[i] + '-toggle-icon').removeClass('open');
		}
		
		if($(categories[i]).hasClass(this.open_class)) {
			$(categories[i]).slideDown(250, 'easeOutQuad');
			if(this.use_toggle_icon) {
				$(categories[i] + '-toggle-icon').addClass('open');
				$(categories[i] + '-toggle-icon').removeClass('closed');
			}
		}
	}
	
}






function CollapsibleNavSimple(menu_target) {

	CollapsibleNavSimple.settings = {
		ul_open_class: "is_currently_open",
		li_open_class: "open",
		li_closed_class: "closed",
		li_empty_class: "empty"
	};
	
	
	// Add an onclick event to each list item anchor
	$(menu_target + " > li > a").click(function(){
	
		// If this li doesnt have a nested ul then follow through to the href
		if ($(this).parent().children("ul").length == 0) return;
		
		
	
		CollapsibleNavSimple.clicked_li = $(this).parent().attr("id");
	
		// Loop over list items
		$(menu_target + " > li > ul").each(function() {

			// If the menu is open, close it
			if($(this).hasClass(CollapsibleNavSimple.settings['ul_open_class'])) {
				$(this).removeClass(CollapsibleNavSimple.settings['ul_open_class']);
				
				// Change the class to "closed", unless the class is "empty" then leave it as it is
				if (!$(this).parent().hasClass(CollapsibleNavSimple.settings['li_empty_class'])) {
					$(this).parent().removeClass(CollapsibleNavSimple.settings['li_open_class']);
					$(this).parent().addClass(CollapsibleNavSimple.settings['li_closed_class']);
				}
				$(this).slideUp(250, 'easeOutQuad');
				
			// Else, it isnt open
			} else {
				// Is it the sub menu we need to expand?
				if($(this).parent().attr("id") == CollapsibleNavSimple.clicked_li) {
					// If so, add the open class and then animate the slide down
					$(this).addClass(CollapsibleNavSimple.settings['ul_open_class']);
					
					// Change the class to "open", unless the class is "empty" then leave it as it is
					if (!$(this).parent().hasClass(CollapsibleNavSimple.settings['li_empty_class'])) {
						$(this).parent().removeClass(CollapsibleNavSimple.settings['li_closed_class']);
						$(this).parent().addClass(CollapsibleNavSimple.settings['li_open_class']);
					}
				
					$(this).slideDown(250, 'easeOutQuad');
				}
			}
		});
		
		// Prevent the href kicking in
		return false;
	});
	
	
	
	
	CollapsibleNavSimple.prototype.init = function() {
	
		// Loop over list items
		$(menu_target + " > li > ul").each(function() {
			// Hide all of them
			$(this).addClass('hide');
			
			// Then slide down the open one to demonstrate the sliding
			if ($(this).hasClass(CollapsibleNavSimple.settings['ul_open_class'])) {
				$(this).slideDown(250, 'easeOutQuad');
				$(this).removeClass('hide');
			}
		});
	

	};
	
	// Initialise the state of the menu
	CollapsibleNavSimple.prototype.init();

	
}











function show(id) {
	$(id).show();
}

function hide(id) {
	$(id).hide();
}








function collapse(id) {
	$(id).slideUp(250, 'easeOutQuad');
}

function expand(id) {
	$(id).slideDown(250, 'easeOutQuad');
}









function collapse_and_enable(collapse, enable) {
	$(collapse).slideUp(250, 'easeOutQuad');
	$(enable).removeClass('disabled');
}

function expand_and_disable(expand, disable) {
	$(expand).slideDown(250, 'easeOutQuad');
	$(disable).addClass('disabled');
}






function submit_form(id, submitted_by) {
	var frm = document.forms[id];
	
	// If we passed a submitted_by array then add the elements to the form
	if (submitted_by !== undefined) {

		for(var key in submitted_by){
			ff = document.createElement("INPUT");
			ff.type = "hidden";
			ff.name = key;
			ff.value = submitted_by[key];
			frm.appendChild(ff);
		} 

		// Make the form revalidate so that the new values are passed
		if (frm.normalize) {frm.normalize();}
	}
	
	frm.submit();
}

function reset_form(id) {
	document.forms[id].reset();
}








function convert_btns_to_anchors() {

	$('button.btn').each(function() {

		var id 			= $(this).attr('id');
		
		/** Old method of determining form ID **/
		//var postfix = $(this).attr('id').split('-');
		//var num = postfix.length - 1;
		//postfix = postfix[num];
		//var form_id = id.replace('-' + postfix, '');
		/** End old method of determining form ID **/
		
		var form_id 	= id.replace(/-submit(.)*/, '');
		var classes 	= $(this).attr('class');
		var type 		= $(this).attr('type');
		var name		= $(this).attr('name');
		var value		= $(this).attr('value');
		var content 	= $(this).html();

		
		var str = "<a href=\"#\" ";			// <-- remove green border
		if(type =='submit') {
			str += "onclick=\"submit_form('" + form_id + "', {'" + name + "' : '" + value + "'}); return false;\" ";
		} else if(type =='reset') {
			str += "onclick=\"reset_form('" + form_id + "'); return false;\" ";
		}
		if(classes) str += "class=\"" + classes + "\" ";
		if(id) str += "id=\"" + id + "\" ";
		str += ">" + content + "</a>";
		

		$(this).replaceWith(str);
	});

}








function count_remaining_characters(textarea, counter, limit) {
	if (textarea.value.length > limit) {
		textarea.className = 'textarea over-limit';
		counter.className = 'white-board-post-counter over-limit';
		counter.value = 'No more characters!';
		textarea.value = textarea.value.substring(0, limit - 1);
	} else { 
		textarea.className = 'textarea';
		counter.className = 'white-board-post-counter';
		counter.value = limit - (textarea.value.length) + ' characters remaining';
	}
}






// assert max length in text fields
// adapted from Peter-Paul Koch's version at
// http://www.quirksmode.org

function set_max_length() {
	var x = document.getElementsByTagName('textarea');
	var counter = document.createElement('div');
	counter.className = 'counter';
	for (var i=0;i<x.length;i++) {
		if (x[i].getAttribute('maxlength')) {
			var counterClone = counter.cloneNode(true);
			counterClone.relatedElement = x[i];
			counterClone.innerHTML = '<span>' + x[i].getAttribute('maxlength') + '</span>';
			x[i].parentNode.insertBefore(counterClone, x[i].nextSibling);
			x[i].relatedElement = counterClone.getElementsByTagName('span')[0];

			x[i].onkeyup = x[i].onchange = check_max_length;
			x[i].onkeyup();
		}
	}
}

function check_max_length() {
	var maxLength = this.getAttribute('maxlength');
	var currentLength = this.value.length;
	if (currentLength > maxLength) {
		this.relatedElement.className = 'over-limit';
		this.relatedElement.firstChild.nodeValue = 'Too many characters!';
	 } else {
		this.relatedElement.className = '';
		this.relatedElement.firstChild.nodeValue = maxLength - currentLength + ' characters remaining';
	}
}











$(document).ready(function() {

	$("body").addClass("has-js");
	
	if($.browser.msie) {
		// Change any <button class="btn" to an anchor
		convert_btns_to_anchors();
		
		// Make forms submit when enter is pressed
		$('input').keydown(function(e){
	        if (e.keyCode == 13) {
	            $(this).parents('form').submit();
	            return false;
	        }
	    });
	} else {
		//convert_btns_to_anchors();
	}
});








