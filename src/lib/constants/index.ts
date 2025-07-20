export const APP_CONFIG = {
  name: 'Scaler Internal Tools',
  description: 'Internal tools platform for Scaler operations',
  version: '1.0.0',
  author: 'Scaler Technology',
} as const

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  tickets: {
    list: '/tickets',
    create: '/tickets',
    update: (id: string) => `/tickets/${id}`,
    delete: (id: string) => `/tickets/${id}`,
  },
  transport: {
    bookings: '/transport/bookings',
    create: '/transport/bookings',
    update: (id: string) => `/transport/bookings/${id}`,
    cancel: (id: string) => `/transport/bookings/${id}/cancel`,
  },
  documents: {
    list: '/documents',
    upload: '/documents/upload',
    download: (id: string) => `/documents/${id}/download`,
    delete: (id: string) => `/documents/${id}`,
  },
  mess: {
    menu: '/mess/menu',
    bookings: '/mess/bookings',
    create: '/mess/bookings',
    cancel: (id: string) => `/mess/bookings/${id}/cancel`,
  },
  commonDrive: {
    files: '/common-drive/files',
    upload: '/common-drive/upload',
    download: (id: string) => `/common-drive/files/${id}/download`,
    delete: (id: string) => `/common-drive/files/${id}`,
  },
} as const

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  tickets: '/tickets',
  transport: '/transport',
  documents: '/documents',
  mess: '/mess',
  commonDrive: '/common-drive',
  admin: {
    tickets: '/tickets-admin',
    transport: '/transport-admin',
    documents: '/documents-admin',
    mess: '/mess-admin',
    commonDrive: '/common-drive-admin',
  },
} as const

export const PERMISSIONS = {
  tickets: {
    read: 'tickets:read',
    write: 'tickets:write',
    admin: 'tickets:admin',
  },
  transport: {
    read: 'transport:read',
    write: 'transport:write',
    admin: 'transport:admin',
  },
  documents: {
    read: 'documents:read',
    write: 'documents:write',
    admin: 'documents:admin',
  },
  mess: {
    read: 'mess:read',
    write: 'mess:write',
    admin: 'mess:admin',
  },
  commonDrive: {
    read: 'common-drive:read',
    write: 'common-drive:write',
    admin: 'common-drive:admin',
  },
} as const

export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'],
  maxFiles: 5,
} as const

export const documentFilters = ['All', 'Academic', 'Events', 'Administrative', 'Important'] as const

export const badgeStyles = {
  PDF: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  DOC: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  XLS: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  IMG: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
} as const

export const documentBadgeStyles = {
  Important: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300'
  },
  Events: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300'
  },
  Administrative: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-300'
  },
} as const
