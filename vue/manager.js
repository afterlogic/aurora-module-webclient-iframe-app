import settings from '../../IframeAppWebclient/vue/settings'

export default {
  moduleName: 'IframeAppWebclient',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },
  getAdminSystemTabs () {
    return [
      {
        tabName: 'iframe-app-webclient-system',
        title: 'IFRAMEAPPWEBCLIENT.LABEL_SETTINGS_TAB',
        component () {
          return import('./components/IframeAppAdminSettings')
        },
      },
    ]
  },
  getAdminUserTabs () {
    return [
      {
        tabName: 'iframe-app-webclient-user',
        paths: [
          'id/:id/iframe-app-webclient-user',
          'search/:search/id/:id/iframe-app-webclient-user',
          'page/:page/id/:id/iframe-app-webclient-user',
          'search/:search/page/:page/id/:id/iframe-app-webclient-user',
        ],
        title: 'AFTERLOGICDOWNLOADSWEBCLIENT.LABEL_SETTINGS_TAB',
        component () {
          return import('./components/IframeAppAdminSettingsPerUser')
        }
      }
    ]
  },
}
