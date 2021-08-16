<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'IFRAMEAPPWEBCLIENT.HEADING_BROWSER_TAB'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'IFRAMEAPPWEBCLIENT.LABEL_APP_NAME'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="appName" @keyup.enter="save"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'IFRAMEAPPWEBCLIENT.LABEL_AUTH_MODE'"></div>
            <div class="col-5">
              <q-select outlined dense bg-color="white" v-model="currentModeAuth"
                        :options="authModeList"/>
            </div>
          </div>
          <div class="row q-mb-md" v-if="showTokenMode">
            <div class="col-2 q-my-sm" v-t="'IFRAMEAPPWEBCLIENT.LABEL_TOKEN_MODE'"></div>
            <div class="col-5">
              <q-select outlined dense bg-color="white" v-model="currentTokenMode"
                        :options="tokenModeList"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-my-sm" v-t="'IFRAMEAPPWEBCLIENT.LABEL_IFRAME_URL'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="url" @keyup.enter="save"/>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="save"
               :label="$t('COREWEBCLIENT.ACTION_SAVE')">
        </q-btn>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start;" :showing="saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

import enums from '../enums'
import settings from '../settings'

const IframeAppAuthMode = enums.getIframeAppAuthMode()
const IframeAppTokenMode = enums.getIframeAppTokenMode()

export default {
  name: 'IframeAppAdminSettings',

  data () {
    return {
      saving: false,
      authMode: 0,
      tokenMode: 0,
      authModeList: [],
      currentModeAuth: '',
      currentTokenMode: '',
      tokenModeList: [],
      appName: '',
      url: ''
    }
  },

  mounted() {
    this.populate()
  },

  beforeRouteLeave(to, from, next) {
    this.doBeforeRouteLeave(to, from, next)
  },

  computed: {
    showTokenMode() {
      return this.currentModeAuth.value !== IframeAppAuthMode.NoAuthentication
    }
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges() {
      const data = settings.getIframeAppSettings()
      return this.url !== data.url ||
          this.appName !== data.appName ||
          this.currentModeAuth.value !== data.authMode ||
          this.currentTokenMode.value !== data.tokenMode
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.populate()
    },

    save() {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          AppName: this.appName,
          AuthMode: this.currentModeAuth.value,
          TokenMode: this.currentTokenMode.value,
          Url: this.url
        }
        webApi.sendRequest({
          moduleName: 'IframeAppWebclient',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.saveIframeAppSettings({
              appName: this.appName,
              authMode: this.currentModeAuth.value,
              tokenMode: this.currentTokenMode.value,
              url: this.url
            })
            this.populate()
            notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
        })
      }
    },
    populate() {
      const data = settings.getIframeAppSettings()
      this.appName = data.appName
      this.url = data.url
      this.authMode = data.authMode
      this.tokenMode = data.tokenMode
      this.authModeList = this.getAuthModeList()
      this.currentModeAuth = this.getCurrentAuthMode()
      this.tokenModeList = this.getTokenModeList()
      this.currentTokenMode = this.getCurrentTokenMode()
    },
    getAuthModeList () {
      return [
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_NO_AUTH'),
          value: IframeAppAuthMode.NoAuthentication
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_AURORA_CREDS'),
          value: IframeAppAuthMode.AuroraUserCredentials
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_CUSTOM_CREDS_BY_USER'),
          value: IframeAppAuthMode.CustomCredentialsSetByUser
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_CUSTOM_CREDS_BY_ADMIN'),
          value: IframeAppAuthMode.CustomCredentialsSetByAdmin
        }
      ]
    },
    getCurrentAuthMode() {
      let currentMode = ''
      this.authModeList.forEach((mode) => {
        if (mode.value === this.authMode) {
          currentMode = mode
        }
      })
      return currentMode
    },
    getTokenModeList () {
      return [
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_COOKIE_ONLY'),
          value: IframeAppTokenMode.CookieOnly
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_GET_REQUEST'),
          value: IframeAppTokenMode.GETRequest
        },
        {
          label: this.$t('AFTERLOGICDOWNLOADSWEBCLIENT.OPTION_POST_REQUEST'),
          value: IframeAppTokenMode.POSTRequest
        }
      ]
    },
    getCurrentTokenMode() {
      let currentMode = ''
      this.tokenModeList.forEach((mode) => {
        if (mode.value === this.tokenMode) {
          currentMode = mode
        }
      })
      return currentMode
    }
  }
}
</script>
