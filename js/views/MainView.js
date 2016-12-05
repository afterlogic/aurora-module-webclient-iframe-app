'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	$ = require('jquery'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	
	CAbstractScreenView = require('%PathToCoreWebclientModule%/js/views/CAbstractScreenView.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
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
	
	this.sFrameUrl = Settings.Url || '';
	this.sAuthToken = Settings.AuthMode === Enums.IframeAppAuthMode.NoAuthentication ? '' : $.cookie('AuthToken');
	this.bIframeLoaded = false;
}

_.extendOwn(CIframeAppView.prototype, CAbstractScreenView.prototype);

CIframeAppView.prototype.ViewTemplate = '%ModuleName%_MainView';
CIframeAppView.prototype.ViewConstructorName = 'CIframeAppView';

CIframeAppView.prototype.onShow = function ()
{
	var Routing = require('%PathToCoreWebclientModule%/js/Routing.js');
	
	if (Settings.AuthMode === Enums.IframeAppAuthMode.CustomCredentialsSetByUser && !(Settings.Login !== '' && Settings.HasPassword))
	{
		Routing.setHash(['settings', 'iframe-app']);
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_EMPTY_LOGIN_RASSWORD'), {'APPNAME': 'Iframe'});
	}
	
	if (!this.bIframeLoaded)
	{
		$("#IframeApp").submit();
		this.bIframeLoaded = true;
	}
};

module.exports = new CIframeAppView();
