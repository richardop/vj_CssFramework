/*
	Videojuicer Management Panel Core JS
	This file contains the standard presentational and interactive JS for the Management Panel.
	
	Dependencies: jQuery 1.3, jQuery Easing
*/

// Document Boot
// ==============================================================================

$(document).ready(function() {

	// Cosmetic - Add .has-js to the <body> so that Markup can be styled for when the user has or doesnt have JS
		$("body").addClass("has-js");
	
	// Cosmetic - Add the correct wrapper to links that require it.
		$(".btn, nav > a").wrapInner("<span></span>").append("<i></i>");
		
	// Cosmetic - Move the tooltip class to the parent element for wrapping DL items.
		$(".tool-tip-container").closest("dd").addClass("has-msg");
	// Cosmetic - If the fields within a DT/DD pair are in an error state, pass the error class
	// around to stabilise the display.
		$(".error:input").closest("dd").addClass("has-error");
	
	// Interactivity - Allow tooltip icons to toggle the display of the element they reference.
		$(".tool-tip-icon").click(function() {
			$this = $(this);
			t = $($this.attr("href"));
						
			if($this.hasClass('active')) {
				t.fadeOut('fast');
				$this.removeClass('active');
			} else {	
				remove_all_tooltips();			
				$this.addClass('active');
				t.fadeIn('fast');
			};
			return false;
		})
		
	// Cosmetic - add wrapper elements to help boxes that don't have them.
	$("div.help:not(div:has(.help-content))").wrapInner("<div class=\"help-content\"></div>");
	$("div.help:not(div:has(.help-top))").prepend('<span class="help-top"><span class="help-R"></span></span>');
	$("div.help:not(div:has(.help-bottom))").append('<span class="help-bottom"><span class="help-R"></span></span>');
	
	// Interactivity - Register selection event on all select-all checkboxes. These
	// checkboxes will toggle all other checkboxes within the same fieldset as themselves.
		$("input.select-all").bind("change", function() {
			$this = $(this);
			checked = $this.is(":checked");
			$("input", $this.closest("fieldset")).each(function() {
				this.checked = checked;
			});
		});
		
	// Interactivity - Confirmation dialogues get appended to destructive links.	
	$(".dangerous").click(function(event) {
		code = (new String(Math.random())).substr(2,4);
		msg = "This action cannot be undone. Please enter the code "+code+" to confirm your decision, or press 'Cancel' if you do not wish to continue.";
		return (prompt(msg)==code);
	});
	$(".destructive").click(function(event) {
		msg = $(this).attr("data-confirmation-msg") || "This action cannot be undone. Please confirm that you wish to continue.";
		return confirm(msg);
	});
	
	// Interactivity - The markup contains nested lists that act like dropdown menus.
	// This makes them work good. The interactivity causes the click on the root
	// link to pop the menu open, and a click on either the button or one of the nested
	// links to close it again.
		$(".btn-select-parent a").bind("click", function() {
			$this = $(this);
			$this.closest(".btn-select-parent").toggleClass("open");
			$this.closest(".btn-select-parent").toggleClass("closed");
			return false;
		})		
	
	// Interactivity - Make active all nav-tab arrays.
		$("ul.nav-tabbed a").make_nav_tab();
		$("ul.nav-tabbed a:first").activate_nav_tab();
		
	
	// Interactivity - Hide All Tooltips whenever an input, textarea or select focuses
		$('textarea, input, select').focus(function() {
			remove_all_tooltips();
		});
		
	// Interactivity - Any link with .dismisser as the class will hide the element it
	// references in the href attribute.
		$("a.dismisser").click(function() {
			$($(this).attr("href")).fadeOut("slow");
			return false;
		});
	
	// Make necessary corrections for IE
	// Buttons need inline syles applied to the span and i elements to make them appear correctly	
		if($.browser.msie) {		
			style_buttons_for_ie();
			
		} else {		
			// Do Nothing!	
		}	
});

// Tiny Extensions to jQuery (major extensions should get their own files)
// ==============================================================================

// Used on a link within a nav-tab controller bar to give it all the right interactivity.
$.fn.make_nav_tab = function(options) {
	return this.each(function() { $link = $(this);
		$link.click(function() {
			$(this).activate_nav_tab();
			return false;
		})
	});
}
// Used on a tab bar nav-tab to activate it and display the content it relates to.
$.fn.activate_nav_tab = function(options) {
	return this.each(function() { $link = $(this); $ul = $link.closest("ul"); $li = $link.closest("li");
		// Mark all containing LIs in the controller as inactive
		$("li", $ul).removeClass("active");
		// Mark this link's containing LI as active
		$li.addClass("active");
		// Hide all content blocks owned by this controller block
		$(".tabbed-content[data-group="+$ul.attr("data-controls")+"]").collapse();
		// Show the specific content block we're activating
		$($link.attr("href")).expand();
	});
}

// Animate the closing of all matched elements. 
// Used to keep animation settings consistent.
$.fn.collapse = function(options) {
	this.slideUp(250, 'easeOutQuad');
}
// Animate the opening of all matched elements. 
// Used to keep animation settings consistent.
$.fn.expand = function(options) {
	this.slideDown(250, 'easeOutQuad');
}


//	Tabbed Navigation
//	FOR: Switching between different tabs on the page
// ==============================================================================

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

// Tooltips
// FOR: Showing & Hiding the relevant tooltips when the user clicks tooltip icon

function remove_all_tooltips() {
	$('.tool-tip-msg').fadeOut('fast');
	$('.tool-tip-icon').removeClass('active');
};

// Expandable Fieldset
// FOR: Allowing the user to expand or contract a fieldset
function close_expandable_fieldsets()	{
	$('fieldset.expandable').addClass('closed');
};

function trigger_fieldset(id)	{
	if(id)	{
		var fieldset = id + '-parent'
		if ($(fieldset).hasClass('closed'))	{	
			close_expandable_fieldsets();
			$(fieldset).removeClass('closed').addClass('open');
		} else	{
			close_expandable_fieldsets();
		};
	};
};

// Submit forms
// FOR: Fake Submitting forms 
/*
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
	return false;
}

function reset_form(id) {
	document.forms[id].reset();
	return false;
}
*/

// Convert Buttons
// FOR: Convert button.btn to a.btn in ie6



function highlight_links(id)	{
	
	$('tr').removeClass('highlight');	
	for(var i = 0; i<id.length; i++) {
		//alert(id[i]);		
		$(id[i]).addClass('highlight');
	};	
};

var verbose_output = true;
function trace(text) {
	if(verbose_output) console.log(text);
}


// Style Buttons in ie
// FOR:  adding inline styles to buttons to make them work in IE 6 + 7 (but not 8, ie8 is fine)

function style_buttons_for_ie()	{
	
	$('button.btn').each(function() {
		
	// i X Positioning
		var spanW 		= $(this).children('span').width();
		var iW			= $(this).children('i').width();
		var XPos		= spanW+iW;
		var XPosNum		= '-' + XPos + 'px';

		
	// i Y Positioning		
		var iH			= $(this).children('i').height();
		var iYPos		= '-' + iH + 'px'
		
	// Button Width
		var bW			= spanW+iW + 'px'		
		
		if (Object.prototype.toString.call(self.JSON) === "[object JSON]"){ 
			// IE8: Dont fix anything			
		}		
		
		else if (typeof document.body.style.maxHeight === "undefined") {		
			// ie6: Add inline styles			
			$(this).each(function()	{
				$(this).children('i').css({'position' : 'relative', 'right' : XPosNum, 'top' : iYPos});
				$(this).css({'height' : iH, 'width' : bW, 'overflow' : 'hidden'});
			})	

		} else {
			// ie7 (same fix as ie6 fix)
			
			$(this).each(function()	{
				$(this).children('i').css({'position' : 'relative', 'right' : XPosNum, 'top' : iYPos});
				$(this).css({'height' : iH, 'width' : bW, 'overflow' : 'hidden'})
			})

		}
	
	});

};
