'use strict';

module.exports = function (oAppData) {
	var
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),

		Settings = require('modules/%ModuleName%/js/Settings.js'),
		
		HeaderItemView = null
	;
	
	Settings.init(oAppData);
	
	require('modules/%ModuleName%/js/enums.js');
	
	var sAppHash = Settings.AppName ? TextUtils.getUrlFriendlyName(Settings.AppName) : Settings.HashModuleName; 
	
	if (App.isUserNormalOrTenant())
	{
		return {
			/**
			 * Registers settings tab before application start.
			 * 
			 * @param {Object} ModulesManager
			 */
			start: function (ModulesManager)
			{
				if (Settings.AuthMode === Enums.IframeAppAuthMode.CustomCredentialsSetByUser)
				{
					ModulesManager.run('SettingsWebclient', 'registerSettingsTab', [
						function () { return require('modules/%ModuleName%/js/views/IframeAppSettingsFormView.js'); },
						sAppHash,
						Settings.AppName || TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
					]);
				}
			},

			/**
			 * Returns list of functions that are return module screens.
			 * 
			 * @returns {Object}
			 */
			getScreens: function ()
			{
				var oScreens = {};
				
				if (Settings.AuthMode !== Enums.IframeAppAuthMode.CustomCredentialsSetByAdmin || (Settings.Login !== '' && Settings.HasPassword))
				{
					oScreens[sAppHash] = function () {
						return require('modules/%ModuleName%/js/views/MainView.js');
					};
				}
				
				return oScreens;
			},

			/**
			 * Returns object of header item view of the module.
			 * 
			 * @returns {Object}
			 */
			getHeaderItem: function ()
			{
				var 
					CHeaderItemView = require('%PathToCoreWebclientModule%/js/views/CHeaderItemView.js'),
					oHeaderEntry = 	{};
				;

				if (Settings.AuthMode !== Enums.IframeAppAuthMode.CustomCredentialsSetByAdmin || (Settings.Login !== '' && Settings.HasPassword))
				{
					if (HeaderItemView === null)
					{
						HeaderItemView = new CHeaderItemView(Settings.AppName || TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB'));
					}
					oHeaderEntry = {
						item: HeaderItemView,
						name: sAppHash
					};
				}
				
				return oHeaderEntry;
			}
		};
	}
	
	return null;
};
