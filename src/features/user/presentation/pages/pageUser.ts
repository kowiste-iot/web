
import { EIcon } from '@/features/shared/enum/EIcon'
import { Columns } from '@/model/gui/column'
import type { Property } from '@/model/property'
import { useI18n } from 'vue-i18n'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/model/path'
import type { IUser } from '@/features/user/domain/user'

export class UserPage extends PageBase {
  showPreferencesForm: boolean
  showSettingsForm: boolean
  currentUser?: IUser

  constructor() {
    const { t } = useI18n()
    super(t('user.title'), new Array<Path>())

    this.showPreferencesForm = false
    this.showSettingsForm = false
  }

  reset() {
    this.showPreferencesForm = false
    this.showSettingsForm = false
    this.currentUser = undefined
  }
}
