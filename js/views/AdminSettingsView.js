'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
* @constructor
*/
function CAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.authModeOptions = [
		{
			label: TextUtils.i18n('%MODULENAME%/OPTION_NO_AUTH'),
			value: Enums.IframeAppAuthMode.NoAuthentication
		},
		{
			label: TextUtils.i18n('%MODULENAME%/OPTION_AURORA_CREDS'),
			value: Enums.IframeAppAuthMode.AuroraUserCredentials
		},
		{
			label: TextUtils.i18n('%MODULENAME%/OPTION_CUSTOM_CREDS_BY_USER'),
			value: Enums.IframeAppAuthMode.CustomCredentialsSetByUser
		},
		{
			label: TextUtils.i18n('%MODULENAME%/OPTION_CUSTOM_CREDS_BY_ADMIN'),
			value: Enums.IframeAppAuthMode.CustomCredentialsSetByAdmin
		}
	];
	
	this.tokenModeOptions = [
		{
			label: TextUtils.i18n('%MODULENAME%/OPTION_COOKIE_ONLY'),
			value: Enums.IframeAppTokenMode.CookieOnly
		},
		{
			label: TextUtils.i18n('%MODULENAME%/OPTION_GET_REQUEST'),
			value: Enums.IframeAppTokenMode.GETRequest
		},
		{
			label: TextUtils.i18n('%MODULENAME%/OPTION_POST_REQUEST'),
			value: Enums.IframeAppTokenMode.POSTRequest
		}
	];

	/* Editable fields */
	this.appName = ko.observable(Settings.AppName);
	this.authMode = ko.observable(Settings.AuthMode);
	this.tokenMode = ko.observable(Settings.TokenMode);
	this.url = ko.observable(Settings.Url);
	/*-- Editable fields */
}

_.extendOwn(CAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_AdminSettingsView';

CAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.appName(),
		this.authMode(),
		this.tokenMode(),
		this.url()
	];
};

CAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.appName(Settings.AppName);
	this.authMode(Settings.AuthMode);
	this.tokenMode(Settings.TokenMode);
	this.url(Settings.Url);
};

CAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'AppName': this.appName(),
		'AuthMode': this.authMode(),
		'TokenMode': this.tokenMode(),
		'Url': this.url()
	};
};

/**
 * Applies saved values to the Settings object.
 * 
 * @param {Object} oParameters Parameters which were saved on the server side.
 */
CAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	Settings.updateAdmin(oParameters.AppName, oParameters.AuthMode, oParameters.TokenMode, oParameters.Url);
};

/**
 * Sets access level for the view via entity type and entity identificator.
 * This view is visible only for empty entity type.
 * 
 * @param {string} sEntityType Current entity type.
 * @param {number} iEntityId Indentificator of current intity.
 */
CAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === '');
};

module.exports = new CAdminSettingsView();
