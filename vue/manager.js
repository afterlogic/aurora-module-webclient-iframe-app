import settings from '../../IframeAppWebclient/vue/settings'

export default {
  name: 'IframeAppWebclient',
  init (appData) {
    settings.init(appData)
  },
  getAdminSystemTabs () {
    return [
      {
        name: 'iframe-app-webclient-system',
        title: 'IFRAMEAPPWEBCLIENT.LABEL_SETTINGS_TAB',
        component () {
          return import('src/../../../IframeAppWebclient/vue/components/IframeAppAdminSettings')
        },
      },
    ]
  },
}
