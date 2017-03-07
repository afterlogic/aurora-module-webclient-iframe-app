'use strict';

var
	_ = require('underscore'),
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
function CSettingsPaneView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.sAppName = Settings.AppName || TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB');
	this.login = ko.observable(Settings.Login);
	this.pass = ko.observable(Settings.HasPassword ? '******' : '');
}

_.extendOwn(CSettingsPaneView.prototype, CAbstractSettingsFormView.prototype);

/**
 * Name of template that will be bound to this JS-object.
 */
CSettingsPaneView.prototype.ViewTemplate = '%ModuleName%_SettingsPaneView';

/**
 * Returns array with all settings values wich is used for indicating if there were changes on the page.
 * 
 * @returns {Array} Array with all settings values;
 */
CSettingsPaneView.prototype.getCurrentValues = function ()
{
	return [
		this.login(),
		this.pass()
	];
};

/**
 * Reverts all settings values to global ones.
 */
CSettingsPaneView.prototype.revertGlobalValues = function ()
{
	this.login(Settings.Login);
	this.pass(Settings.HasPassword ? '******' : '');
};

/**
 * Returns Object with parameters for passing to the server while settings updating.
 * 
 * @returns Object
 */
CSettingsPaneView.prototype.getParametersForSave = function ()
{
	if (this.pass() !== '******' && this.login() !== '')
	{
		return {
			'Login': this.login(),
			'Password': this.pass()
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
CSettingsPaneView.prototype.applySavedValues = function (oParameters)
{
	Settings.update(oParameters.Login, true);
};

module.exports = new CSettingsPaneView();
