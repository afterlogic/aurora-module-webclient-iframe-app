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
function CMainView()
{
	CAbstractScreenView.call(this, '%ModuleName%');
	
	/**
	 * Text for displaying in browser title.
	 */
	this.browserTitle = ko.observable(TextUtils.i18n('%MODULENAME%/HEADING_BROWSER_TAB'));
	
	this.sAuthToken = Settings.AuthMode === Enums.IframeAppAuthMode.NoAuthentication ? '' : $.cookie('AuthToken');
	this.iTokenMode = Settings.TokenMode;
	
	var 
		sFrameUrl = Settings.Url || '',
		aFrameUrlParts = sFrameUrl.split('?'),
		aUrlParams = aFrameUrlParts[1] ? aFrameUrlParts[1].split('&') : []
	;
	
	if (this.sAuthToken !== '' && Settings.TokenMode === Enums.IframeAppTokenMode.GETRequest)
	{
		aUrlParams.push('aurora_auth_token=' + this.sAuthToken);
	}
	
	this.sFrameUrl = aFrameUrlParts[0] + (aUrlParams.length > 0 ? '?' + aUrlParams.join('&') : '');
	
	this.elForm = ko.observable(null);
	this.sIframeName = '%ModuleName%' + 'iframe';
	this.bIframeLoaded = false;
	
	App.broadcastEvent('%ModuleName%::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

_.extendOwn(CMainView.prototype, CAbstractScreenView.prototype);

CMainView.prototype.ViewTemplate = '%ModuleName%_MainView';
CMainView.prototype.ViewConstructorName = 'CMainView';

CMainView.prototype.onShow = function ()
{
	var 
		Routing = require('%PathToCoreWebclientModule%/js/Routing.js'),
		sAppHash = Settings.AppName !== '' ?  TextUtils.getUrlFriendlyName(Settings.AppName) : Settings.HashModuleName
	;
	
	if (Settings.AuthMode === Enums.IframeAppAuthMode.CustomCredentialsSetByUser && !(Settings.Login !== '' && Settings.HasPassword))
	{
		Routing.setHash(['settings', sAppHash]);
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_EMPTY_LOGIN_RASSWORD', {'APPNAME': Settings.AppName}));
	}
	
	if (!this.bIframeLoaded && this.elForm() && this.elForm()[0])
	{
		this.elForm().submit();
		this.bIframeLoaded = true;
	}
};

module.exports = new CMainView();
