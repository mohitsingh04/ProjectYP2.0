export const MENUITEMS = [
  {
    menutitle: "MAIN",
    role: ["Super Admin", "Editor", "Property Manager", "User"],
  },

  {
    path: `/dashboard`,
    title: "Dashboard",
    icon: "fe-home",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor", "Property Manager", "User"],
  },

  {
    menutitle: "Pages",
    role: ["Super Admin", "Editor", "Property Manager", "User"],
  },
  {
    title: "Users",
    icon: "fe-users",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin"],
    children: [
      {
        path: `/dashboard/user`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "User List",
      },
      {
        path: `/dashboard/user/create`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Create User",
      },
    ],
  },
  {
    path: `/dashboard/professionals`,
    title: "Professionals",
    icon: "fe-user-check",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor", "Property Manager", "User"],
  },
  {
    path: `/dashboard/searches`,
    title: "Searches",
    icon: "fe-search",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor", "Property Manager", "User"],
  },

  {
    title: "Status",
    icon: "fe-bar-chart",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor"],
    children: [
      {
        path: `/dashboard/status`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Status List",
      },
      {
        path: `/dashboard/status/create`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Create Status",
      },
    ],
  },
  {
    title: "Course",
    icon: "fe-cpu",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    role: ["Super Admin", "Editor"],
    dirchange: false,
    children: [
      {
        path: `/dashboard/course`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Course List",
      },
      {
        path: `/dashboard/course/create`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Create Course",
      },
      {
        path: `/dashboard/course/soft`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Deleted Courses",
      },
    ],
  },
  {
    title: "Category",
    icon: "fe-database",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor"],
    children: [
      {
        path: `/dashboard/category`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Category List",
      },
      {
        path: `/dashboard/category/create`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Create Category",
      },
    ],
  },
  {
    title: "Property",
    icon: "fe-grid",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor", "Property Manager"],
    children: [
      {
        path: `/dashboard/property`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Property List",
      },
      {
        path: `/dashboard/property/your`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Your Properties",
      },
      {
        path: `/dashboard/property/create`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Create Property",
      },
    ],
  },
  {
    title: "Enquiry",
    icon: "fe-list",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin"],
    children: [
      {
        path: `/dashboard/enquiry`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Enquiry",
      },
      {
        path: `/dashboard/enquiry/archive`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Archived Enquiry",
      },
    ],
  },
  {
    title: "Legal",
    icon: "fe-shield",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin"],
    children: [
      {
        path: `/dashboard/legal/privacy-policy`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Privacy Policy",
      },
      {
        path: `/dashboard/legal/terms-and-conditions`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Terms & Conditions",
      },
      {
        path: `/dashboard/legal/disclaimer`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Disclaimer",
      },
      {
        path: `/dashboard/legal/cancelation-policy`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Cancelation Policy",
      },
    ],
  },
  {
    title: "Blogs",
    icon: "fe-file-text",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor"],
    children: [
      {
        path: `/dashboard/blogs`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Blogs",
      },
      {
        path: `/dashboard/blogs/create`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Create Blog",
      },
      {
        path: `/dashboard/blogs/category`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Blog Category",
      },
      {
        path: `/dashboard/blogs/tags`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Blog Tags",
      },
    ],
  },
  {
    title: "Events",
    icon: "fe-calendar",
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor"],
    children: [
      {
        path: `/dashboard/events`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "All Events",
      },
      {
        path: `/dashboard/events/create`,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Create Events",
      },
    ],
  },

  {
    title: "Requirments",
    icon: "fe-clipboard",
    type: "link",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor"],
    path: `/dashboard/requirments`,
  },
  {
    title: "Key Outcomes",
    icon: "fe-target",
    type: "link",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    role: ["Super Admin", "Editor"],
    path: `/dashboard/key-outcomes`,
  },
];
