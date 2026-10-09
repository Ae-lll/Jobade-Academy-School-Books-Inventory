export const quickActions = [
  {
    id: "add-book",
    icon: "BookPlus",
    title: "Add Book",
    description: "Add new book to inventory",
    accent: "blue",
    path: "/class-books",
  },
  {
    id: "add-student",
    icon: "UserPlus",
    title: "Add Student",
    description: "Register a new student",
    accent: "green",
    path: "/students",
  },
  {
    id: "record-distribution",
    icon: "ArrowLeftRight",
    title: "Record Distribution",
    description: "Issue or return a book",
    accent: "purple",
    path: "/distribution",
  },
  {
    id: "view-reports",
    icon: "BarChart3",
    title: "View Reports",
    description: "See detailed reports",
    accent: "navy",
    path: "/reports",
  },
];

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/" },
  { id: "class-books", label: "Class Books", icon: "BookOpen", path: "/class-books" },
  { id: "inventory", label: "Inventory", icon: "Boxes", path: "/inventory" },
  { id: "students", label: "Students", icon: "Users", path: "/students" },
  { id: "distribution", label: "Distribution", icon: "ArrowLeftRight", path: "/distribution" },
  { id: "reports", label: "Reports", icon: "BarChart3", path: "/reports" },
  { id: "settings", label: "Settings", icon: "Settings", path: "/settings" },
];
