'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	Api = require('%PathToCoreWebclientModule%/js/Api.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	CAbstractSettingsFormView = ModulesManager.run('AdminPanelWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
* @constructor
*/
function CPerUserAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
	
	this.iUserId = 0;
	this.iAuthMode = Settings.AuthMode;
	
	/* Editable fields */
	this.enableModule = ko.observable(false);
	this.login = ko.observable('');
	this.password = ko.observable('');
	
	/*-- Editable fields */
}

_.extendOwn(CPerUserAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CPerUserAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_PerUserAdminSettingsView';

/**
 * Runs after routing to this view.
 */
CPerUserAdminSettingsView.prototype.onRoute = function ()
{
	this.requestPerUserSettings();
	this.iAuthMode = Settings.AuthMode;
};

/**
 * Requests per user settings.
 */
CPerUserAdminSettingsView.prototype.requestPerUserSettings = function ()
{
	Ajax.send(Settings.ServerModuleName, 'GetPerUserSettings', {'UserId': this.iUserId}, function (oResponse) {
		if (oResponse.Result)
		{
			this.enableModule(oResponse.Result.EnableModule);
			
			if (this.iAuthMode === Enums.IframeAppAuthMode.CustomCredentialsSetByAdmin)
			{
				this.login(oResponse.Result.Login);
				this.password(oResponse.Result.HasPassword ? '******' : '');
			}
		}
	}, this);
};

/**
 * Saves per user settings.
 */
CPerUserAdminSettingsView.prototype.savePerUserSettings = function()
{
	this.isSaving(true);
	
	var oSettingsData = {
		'UserId': this.iUserId,
		'EnableModule': this.enableModule()
	};
	
	if (this.iAuthMode === Enums.IframeAppAuthMode.CustomCredentialsSetByAdmin)
	{
		oSettingsData['Login'] = this.login();
		oSettingsData['Password'] = this.password();
	}
	
	Ajax.send(
		Settings.ServerModuleName,
		'UpdatePerUserSettings',
		oSettingsData,
		function (oResponse) {
			this.isSaving(false);
			if (!oResponse.Result)
			{
				Api.showErrorByCode(oResponse, TextUtils.i18n('COREWEBCLIENT/ERROR_SAVING_SETTINGS_FAILED'));
			}
			else
			{
				Screens.showReport(TextUtils.i18n('COREWEBCLIENT/REPORT_SETTINGS_UPDATE_SUCCESS'));
			}
		},
		this
	);
};

/**
 * Sets access level for the view via entity type and entity identifier.
 * This view is visible only for User entity type.
 * 
 * @param {string} sEntityType Current entity type.
 * @param {number} iEntityId Indentificator of current intity.
 */
CPerUserAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === 'User');
	if (this.iUserId !== iEntityId)
	{
		this.iUserId = iEntityId;
		this.requestPerUserSettings();
	}
};

module.exports = new CPerUserAdminSettingsView();
