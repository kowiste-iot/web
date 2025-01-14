// features/menu/application/menuService.ts
import { useTenant } from '@/composable/useTenant'
import type { IMenu } from '../domain/menu'
import { EIcon } from '@/features/shared/enum/EIcon'

export class MenuService {
  tenant: string
  constructor(id: string) {
    this.tenant = id
  }
  private getOrgPath(path: string): string {
    return path === '/' ? path : `/${this.tenant}${path}`
  }

  getMenuItems(): IMenu[] {
    return [
      {
        label: 'menu.dashboard',
        icon: EIcon.Dashboard,
        path: '/dashboard',
        isParent: true,
        requiresOrg: true,
      },
      {
        label: 'menu.asset',
        icon: EIcon.Asset,
        path: '/asset',
        isParent: true,
      },
      {
        label: 'menu.measure',
        icon: EIcon.Measure,
        path: '/measure',
        isParent: true,
      },
      {
        label: 'menu.device',
        icon: EIcon.Device,
        path: '/device',
        isParent: true,
      },
      {
        label: 'menu.process.parent',
        icon: EIcon.Process,
        path: '/process',
        isParent: true,
        subMenu: [
          {
            label: 'menu.process.alert',
            icon: EIcon.Alert,
            path: '/process/alert',
            isParent: false,
          },
          {
            label: 'menu.process.action',
            icon: EIcon.Action,
            path: '/process/action',
            isParent: false,
          },
        ],
      },
      {
        label: 'menu.admin.parent',
        icon: EIcon.Admin,
        path: '/admin',
        isParent: true,
        subMenu: [
          {
            label: 'menu.admin.user',
            icon: EIcon.User,
            path: '/admin/user',
            isParent: false,
          },
          {
            label: 'menu.admin.rol',
            icon: EIcon.Role,
            path: '/admin/rol',
            isParent: false,
          },
          {
            label: 'menu.admin.resource',
            icon: EIcon.Resource,
            path: '/admin/resource',
            isParent: false,
          },
        ],
      },
    ]
  }

  getProcessedMenuItems(): IMenu[] {
    const items = this.getMenuItems()
    return items.map((item) => this.processMenuItem(item))
  }

  private processMenuItem(item: IMenu): IMenu {
    const processed = { ...item }

    if (item.requiresOrg !== false) {
      processed.path = this.getOrgPath(item.path)
    }

    if (item.subMenu) {
      processed.subMenu = item.subMenu.map((subItem) =>
        this.processMenuItem({ ...subItem, requiresOrg: item.requiresOrg })
      )
    }

    return processed
  }
}
