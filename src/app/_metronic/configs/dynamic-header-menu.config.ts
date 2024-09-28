export const DynamicHeaderMenuConfig = {
  items: [
    {
      title: 'Dashboards',
      root: true,
      alignment: 'left',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
    },
    {
      title: 'NgBootstrap',
      bullet: 'dot',
      icon: 'flaticon-web',
      page: '/ngbootstrap',
      mega: true,
      submenu: [
        {
          title: 'A ... C',
          submenu: [{
            title: 'Accordion',
            page: '/ngbootstrap/accordion'
          },
          {
            title: 'Alert',
            page: '/ngbootstrap/alert'
          },
          {
            title: 'Buttons',
            page: '/ngbootstrap/buttons'
          },
          {
            title: 'Carousel',
            page: '/ngbootstrap/carousel'
          }]
        },
        {
          title: 'C ... M',
          submenu: [{
            title: 'Collapse',
            page: '/ngbootstrap/collapse'
          },
          {
            title: 'Datepicker',
            page: '/ngbootstrap/datepicker'
          },
          {
            title: 'Dropdown',
            page: '/ngbootstrap/dropdown'
          },
          {
            title: 'Modal',
            page: '/ngbootstrap/modal'
          }]
        },
        {
          title: 'P ... R',
          submenu: [{
            title: 'Pagination',
            page: '/ngbootstrap/pagination'
          },
          {
            title: 'Popover',
            page: '/ngbootstrap/popover'
          },
          {
            title: 'Progressbar',
            page: '/ngbootstrap/progressbar'
          },
          {
            title: 'Rating',
            page: '/ngbootstrap/rating'
          }]
        },
        {
          title: 'T ... Z',
          submenu: [
            {
              title: 'Timepicker',
              page: '/ngbootstrap/timepicker'
            },
            {
              title: 'Tooltips',
              page: '/ngbootstrap/tooltip'
            },
            {
              title: 'Typehead',
              page: '/ngbootstrap/typehead'
            }
          ]
        }
      ]
    },
    {
      title: 'Custom',
      root: true,
      alignment: 'left',
      toggle: 'click',
      page: '',
      submenu: [
        {
          title: 'eCommerce',
          bullet: 'dot',
          icon: 'flaticon-business',
          permission: 'accessToECommerceModule',
          page: '/ecommerce',
          submenu: [
            {
              title: 'Customers',
              page: '/ecommerce/customers'
            },
            {
              title: 'Products',
              page: '/ecommerce/products'
            },
          ]
        },
        {
          title: 'User Management',
          bullet: 'dot',
          icon: 'flaticon-user',
          page: '/user-management',
          submenu: [
            {
              title: 'Users',
              page: '/user-management/users'
            },
            {
              title: 'Roles',
              page: '/user-management/roles'
            }
          ]
        },
        {
          title: 'Error Pages',
          bullet: 'dot',
          icon: 'flaticon2-list-2',
          page: '/error',
          submenu: [
            {
              title: 'Error 1',
              page: '/error/error-1'
            },
          ]
        },
        {
          title: 'Wizards',
          bullet: 'dot',
          icon: 'flaticon2-mail-1',
          page: '/wizards',
          submenu: [
            {
              title: 'Wizard 1',
              page: '/wizards/wizard-1'
            },
            {
              title: 'Wizard 2',
              page: '/wizards/wizard-2'
            },
            {
              title: 'Wizard 3',
              page: '/wizards/wizard-3'
            },
            {
              title: 'Wizard 4',
              page: '/wizards/wizard-4'
            },
          ]
        }
      ]
    }
  ]
};
