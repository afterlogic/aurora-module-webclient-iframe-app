'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * Inherits from CAbstractSettingsFormView that has methods for showing and hiding settings tab,
 * updating settings values on the server, checking if there was changins on the settings page.
 * 
 * @constructor
 */
function CIframeAppSettingsFormView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.sAppName = Settings.AppName || TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB');
	this.login = ko.observable(Settings.Login);
	this.pass = ko.observable(Settings.HasPassword ? '******' : '');
}

_.extendOwn(CIframeAppSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

/**
 * Name of template that will be bound to this JS-object.
 */
CIframeAppSettingsFormView.prototype.ViewTemplate = '%ModuleName%_IframeAppSettingsFormView';

/**
 * Returns array with all settings values wich is used for indicating if there were changes on the page.
 * 
 * @returns {Array} Array with all settings values;
 */
CIframeAppSettingsFormView.prototype.getCurrentValues = function ()
{
	return [
		this.login(),
		this.pass()
	];
};

/**
 * Reverts all settings values to global ones.
 */
CIframeAppSettingsFormView.prototype.revertGlobalValues = function ()
{
	this.login(Settings.Login);
	this.pass(Settings.HasPassword ? '******' : '');
};

/**
 * Returns Object with parameters for passing to the server while settings updating.
 * 
 * @returns Object
 */
CIframeAppSettingsFormView.prototype.getParametersForSave = function ()
{
	var
		sPass = $.trim(this.pass()),
		sLogin = $.trim(this.login())
	;
	if (sPass !== '******' && sLogin !== '')
	{
		return {
			'Login': sLogin,
			'Password': sPass
		};
	}
	else
	{
		return {};
	}
};

/**
 * Applies new settings values to global settings object.
 * 
 * @param {Object} oParameters Parameters with new values which were passed to the server.
 */
CIframeAppSettingsFormView.prototype.applySavedValues = function (oParameters)
{
	Settings.update(oParameters.Login, true);
};

module.exports = new CIframeAppSettingsFormView();
