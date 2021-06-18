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
          return import('src/../../../IframeAppWebclient/vue/components/IframeAppAdminSettings')
        },
      },
    ]
  },
}
