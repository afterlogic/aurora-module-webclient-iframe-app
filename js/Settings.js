'use strict';

var ko = require('knockout');

module.exports = {
	ServerModuleName: 'IframeAppCustomCredentials',
	HashModuleName: 'iframe-app-custom-credentials',
	
	/**
	 * Setting indicates if module is enabled by user or not.
	 * The Core subscribes to this setting changes and if it is **true** displays module tab in header and its screens.
	 * Otherwise the Core doesn't display module tab in header and its screens.
	 */
	enableModule: ko.observable(false),
	
	Login: '',
	Password: '',
	
	/**
	 * Initializes settings of the module.
	 * 
	 * @param {Object} oAppDataSection module section in AppData.
	 */
	init: function (oAppDataSection) {
		if (oAppDataSection)
		{
			this.enableModule(!!oAppDataSection.EnableModule);
			this.Login = oAppDataSection.Login;
			this.Password = oAppDataSection.Password;
		}
	},
	
	/**
	 * Updates module settings after editing.
	 * 
	 * @param {boolean} bEnableModule New value of setting 'EnableModule'
	 * @param {string} sLogin New value of setting 'Login'
	 * @param {string} sPassword New value of setting 'Password'
	 */
	update: function (bEnableModule, sLogin, sPassword) {
		this.enableModule(bEnableModule);
		this.Login = sLogin;
		this.Password = sPassword;
	}
};
