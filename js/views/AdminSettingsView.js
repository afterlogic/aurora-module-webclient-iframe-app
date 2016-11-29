'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
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
	
	/* Editable fields */
	this.showCredentials = ko.observable(Settings.ShowCredentials);
	/*-- Editable fields */
}

_.extendOwn(CAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_AdminSettingsView';

CAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.showCredentials()
	];
};

CAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.showCredentials(Settings.ShowCredentials);
};

CAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'ShowCredentials': this.showCredentials()
	};
};

/**
 * Applies saved values to the Settings object.
 * 
 * @param {Object} oParameters Parameters which were saved on the server side.
 */
CAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
	Settings.updateAdmin(oParameters.ShowCredentials);
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
