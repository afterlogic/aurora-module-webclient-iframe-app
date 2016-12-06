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
			label: TextUtils.i18n('%MODULENAME%/LABEL_NO_AUTH'),
			value: Enums.IframeAppAuthMode.NoAuthentication
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_AURORA_CREDS'),
			value: Enums.IframeAppAuthMode.AuroraUserCredentials
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_CUSTOM_CREDS_BY_USER'),
			value: Enums.IframeAppAuthMode.CustomCredentialsSetByUser
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_CUSTOM_CREDS_BY_ADMIN'),
			value: Enums.IframeAppAuthMode.CustomCredentialsSetByAdmin
		}
	];
	
	this.tokenModeOptions = [
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_COOKIE'),
			value: 0
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_GET'),
			value: 1
		},
		{
			label: TextUtils.i18n('%MODULENAME%/LABEL_POST'),
			value: 2
		}
	];

	/* Editable fields */
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
		this.authMode(),
		this.tokenMode(),
		this.url()
	];
};

CAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.authMode(Settings.AuthMode);
	this.tokenMode(Settings.TokenMode);
	this.url(Settings.Url);
};

CAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
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
	Settings.updateAdmin(oParameters.AuthMode, oParameters.Url);
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
