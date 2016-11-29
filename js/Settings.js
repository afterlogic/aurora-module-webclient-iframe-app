'use strict';

var ko = require('knockout');

module.exports = {
	ServerModuleName: 'IframeAppWebclient',
	HashModuleName: 'iframe-app',
	
	/**
	 * Setting indicates if module is enabled by user or not.
	 * The Core subscribes to this setting changes and if it is **true** displays module tab in header and its screens.
	 * Otherwise the Core doesn't display module tab in header and its screens.
	 */
	enableModule: ko.observable(false),
	
	Login: '',
	HasPassword: false,
	
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
			this.HasPassword = !!oAppDataSection.HasPassword;
		}
	},
	
	/**
	 * Updates module settings after editing.
	 * 
	 * @param {boolean} bEnableModule New value of setting 'EnableModule'
	 * @param {string} sLogin New value of setting 'Login'
	 * @param {boolean} bHasPassword Indicates if user has custom password
	 */
	update: function (bEnableModule, sLogin, bHasPassword) {
		this.enableModule(bEnableModule);
		this.Login = sLogin;
		this.HasPassword = bHasPassword;
	}
};
