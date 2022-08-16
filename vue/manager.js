import settings from './settings'
import store from 'src/store'

import IframeAppAdminSettingsPerUser from './components/IframeAppAdminSettingsPerUser'

export default {
  moduleName: 'IframeAppWebclient',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  getAdminSystemTabs () {
    return [
      {
        tabName: 'iframe-app',
        tabTitle: 'IFRAMEAPPWEBCLIENT.LABEL_SETTINGS_TAB',
        tabRouteChildren: [
          { path: 'iframe-app', component: () => import('./components/IframeAppAdminSettings') },
        ],
      },
    ]
  },

  getAdminUserTabs () {
    const isUserSuperAdmin = store.getters['user/isUserSuperAdmin']
    if (isUserSuperAdmin) {
      return [
        {
          tabName: 'iframe-app',
          tabTitle: 'IFRAMEAPPWEBCLIENT.LABEL_SETTINGS_TAB',
          tabRouteChildren: [
            { path: 'id/:id/iframe-app', component: IframeAppAdminSettingsPerUser },
            { path: 'search/:search/id/:id/iframe-app', component: IframeAppAdminSettingsPerUser },
            { path: 'page/:page/id/:id/iframe-app', component: IframeAppAdminSettingsPerUser },
            { path: 'search/:search/page/:page/id/:id/iframe-app', component: IframeAppAdminSettingsPerUser },
          ],
        },
      ]
    }
    return []
  },
}
