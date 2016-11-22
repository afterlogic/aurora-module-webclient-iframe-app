'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	
	CAbstractScreenView = require('%PathToCoreWebclientModule%/js/views/CAbstractScreenView.js')
;

/**
 * View that is used as screen of the module. Inherits from CAbstractScreenView that has showing and hiding methods.
 * 
 * @constructor
 */
function CIframeAppView()
{
	CAbstractScreenView.call(this, '%ModuleName%');
	
	/**
	 * Text for displaying in browser title.
	 */
	this.browserTitle = ko.observable(TextUtils.i18n('%MODULENAME%/HEADING_BROWSER_TAB'));
	
	App.broadcastEvent('%ModuleName%::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CIframeAppView.prototype, CAbstractScreenView.prototype);

CIframeAppView.prototype.ViewTemplate = '%ModuleName%_MainView';
CIframeAppView.prototype.ViewConstructorName = 'CIframeAppView';

module.exports = new CIframeAppView();
