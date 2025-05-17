import { Tab } from '@/features/shared/domain/tab'
import { useI18n } from 'vue-i18n'
import { EIcon } from '@/features/shared/enum/EIcon'
import { PageBase } from '@/features/shared/presentation/pages/pageBase'
import { Path } from '@/features/shared/domain/path'
import {
  WidgetType,
  type IWidgetType,
} from '@/features/shared/domain/widgetType'

export class WidgetFormPage extends PageBase {
  selectedTab: number
  selectedWidget: IWidgetType
  tabs: Tab[]
  widgets: IWidgetType[]
  constructor() {
    const { t } = useI18n()
    super(t('widget.form.title'), new Array<Path>())
    this.selectedTab = 1
    this.selectedWidget = new WidgetType()
    this.tabs = [
      new Tab(1, t('widget.form.type'), true),
      new Tab(2, t('widget.form.options')),
    ]
    this.widgets = [
      {
        id: 1,
        name: t('widget.bool.title'),
        description: t('widget.bool.description'),
        icon: EIcon.WidgetBool,
      },
      {
        id: 2,
        name: t('widget.number.title'),
        description: t('widget.number.description'),
        icon: EIcon.WidgetNumeric,
      },
      {
        id: 3,
        name: t('widget.gauge.title'),
        description: t('widget.gauge.description'),
        icon: EIcon.WidgetGauge,
      },
      {
        id: 4,
        name: t('widget.line.title'),
        description: t('widget.line.description'),
        icon: EIcon.WidgetLineGraph,
      },
      {
        id: 5,
        name: t('widget.bar.title'),
        description: t('widget.bar.description'),
        icon: EIcon.WidgetBarGraph,
      },
      {
        id: 6,
        name: t('widget.pie.title'),
        description: t('widget.pie.description'),
        icon: EIcon.WidgetPieChart,
      },
      {
        id: 7,
        name: t('widget.text.title'),
        description: t('widget.text.description'),
        icon: EIcon.WidgetText,
      },
      {
        id: 8,
        name: t('widget.table.title'),
        description: t('widget.table.description'),
        icon: EIcon.WidgetTable,
      },
    ]
  }
  changeTab(tabID: number) {
    this.tabs.forEach((tab: Tab) => {
      if (tab.id == tabID) {
        tab.selected = true
        this.selectedTab = tab.id
      } else tab.selected = false
    })
  }
}
