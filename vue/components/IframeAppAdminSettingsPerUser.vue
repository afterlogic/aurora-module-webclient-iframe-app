<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5">{{ $t('IFRAMEAPPWEBCLIENT.HEADING_SETTINGS_TAB') }}</div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-my-sm">
            <q-checkbox dense v-model="enableIframeApp">
              <q-item-label v-t="'IFRAMEAPPWEBCLIENT.LABEL_ALLOW_IFRAMEAPP'"/>
            </q-checkbox>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
               :label="saving ? $t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS') : $t('COREWEBCLIENT.ACTION_SAVE')"
               @click="updateSettingsForEntity"/>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start;" :showing="loading || saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import cache from 'src/cache'

export default {
  name: 'IframeAppAdminSerringsPerUser',

  data () {
    return {
      saving: false,
      loading: false,
      enableIframeApp: false,
      enableIframeAppFromServer: false
    }
  },

  watch: {
    $route (to, from) {
      this.parseRoute()
    },
  },

  mounted () {
    this.parseRoute()
    this.getPerUserSettings()
  },

  beforeRouteLeave (to, from, next) {
    this.doBeforeRouteLeave(to, from, next)
  },

  methods: {
    /**
     * Method is used in doBeforeRouteLeave mixin
     */
    hasChanges () {
      return this.enableIframeApp !== this.enableIframeAppFromServer
    },

    /**
     * Method is used in doBeforeRouteLeave mixin,
     * do not use async methods - just simple and plain reverting of values
     * !! hasChanges method must return true after executing revertChanges method
     */
    revertChanges () {
      this.enableIframeApp = this.enableIframeAppFromServer
    },

    parseRoute () {
      const userId = typesUtils.pPositiveInt(this.$route?.params?.id)
      if (this.user?.id !== userId) {
        this.user = {
          id: userId,
        }
        this.populate()
      }
    },
    populate () {
      const currentTenantId = this.$store.getters['tenants/getCurrentTenantId']
      cache.getUser(currentTenantId, this.user.id).then(({ user, userId }) => {
        if (userId === this.user.id) {
          if (user && _.isFunction(user?.getData)) {
            this.user = user
          } else {
            this.$emit('no-user-found')
          }
        }
      })
    },
    updateSettingsForEntity () {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          UserId: this.user?.id,
          TenantId: this.user.tenantId,
          EnableModule: typesUtils.pBool(this.enableIframeApp),
        }
        webApi.sendRequest({
          moduleName: 'IframeAppWebclient',
          methodName: 'UpdatePerUserSettings',
          parameters
        }).then(result => {
          this.saving = false
          if (result) {
            this.getPerUserSettings()
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
    getPerUserSettings () {
      this.loading = true
      const parameters = {
        UserId: this.user?.id,
        TenantId: this.user.tenantId,
      }
      webApi.sendRequest({
        moduleName: 'IframeAppWebclient',
        methodName: 'GetPerUserSettings',
        parameters
      }).then(result => {
        this.loading = false
        if (result) {
          this.enableIframeApp = result.EnableModule
          this.enableIframeAppFromServer = result.EnableModule
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response))
      })
    }
  }
}
</script>

<style scoped>

</style>
