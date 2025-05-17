import type { IMenu } from '../domain/menu'
import { EIcon } from '@/features/shared/enum/EIcon'

export class MenuService {
  constructor() {}
  private getOrgPath(path: string): string {
    return path
  }

  getMenuItems(): IMenu[] {
    return [
      {
        id: 'sidemenu-dashboard',
        label: 'menu.dashboard',
        icon: EIcon.Dashboard,
        path: '/dashboard',
        isParent: true,
        requiresOrg: true,
      },
      {
        id: 'sidemenu-asset',
        label: 'menu.asset',
        icon: EIcon.Asset,
        path: '/asset',
        isParent: true,
      },
      {
        id: 'sidemenu-process',
        label: 'menu.process.parent',
        icon: EIcon.Process,
        path: '/process',
        isParent: true,
      },
      {
        id: 'sidemenu-admin',
        label: 'Report',
        icon: EIcon.Report,
        path: '/test',
        isHeader: true,
        isParent: true,
        subMenu: [
          {
            id: 'sidemenu-admin-user',
            label: 'Alerts',
            icon: EIcon.Alert,
            path: '/report/alert',
            isParent: false,
          },
          {
            id: 'sidemenu-admin-role',
            label: 'Measure',
            icon: EIcon.Measure,
            path: '/report/measure',
            isParent: false,
          },
        ],
      },
      {
        id: 'sidemenu-admin',
        label: 'test',
        icon: EIcon.Admin,
        path: '/admin',
        isParent: true,
        subMenu: [
          {
            id: 'sidemenu-admin-user',
            label: 'one',
            icon: EIcon.User,
            path: '/premium',
            isParent: false,
          },
          {
            id: 'sidemenu-admin-role',
            label: 'two',
            icon: EIcon.Role,
            path: '/admin/role',
            isParent: false,
          },
          {
            id: 'sidemenu-admin-resource',
            label: 'three',
            icon: EIcon.Resource,
            path: '/admin/resource',
            isParent: false,
          },
        ],
      },
    ]
  }
  getMenuAdmin(): IMenu[] {
    return [
      {
        id: 'sidemenu-admin',
        label: 'menu.admin.parent',
        icon: EIcon.Admin,
        path: '/admin',
        isParent: true,
        subMenu: [
          {
            id: 'sidemenu-admin-user',
            label: 'menu.admin.user',
            icon: EIcon.User,
            path: '/admin/user',
            isParent: false,
          },
          {
            id: 'sidemenu-admin-role',
            label: 'menu.admin.role',
            icon: EIcon.Role,
            path: '/admin/role',
            isParent: false,
          },
          {
            id: 'sidemenu-admin-resource',
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
  getProcessedAdmin(): IMenu[] {
    const items = this.getMenuAdmin()
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
