type personViewAccess = 'public'
type orgViewAccess = 'restricted' | 'public'
type ViewAccess = personViewAccess | orgViewAccess

type ExpireType = 'forever' | '7d' | '15d'

type SimulatorType = 'device' | 'long_page' | 'outside_artboard'
type SimulatorTypeNoDevice = Exclude<SimulatorType, 'device'>
type CommentPermission = 'off' | 'org_member'

type CommonSharing = {
  access_token: string
  cid: string
  project_cid: string
  view_access: ViewAccess
  comment_permission: CommentPermission // canComment
  link_name: string
  creator_uid: string
  created_at: string
  expired_at: Date
  expire_type: ExpireType
  view_count: number
  view_prd: boolean // canViewPrd
  highlight: boolean // isHightlight
  wechat: boolean // isSkipMobileTip
}

type SharingWithPassowrd = {
  type: 'sharingWithPassword'
  password: string
} & CommonSharing

type SharingWithNoDevice = {
  type: 'sharingWithDevice'
  simulator_type: SimulatorTypeNoDevice
} & CommonSharing

type SharingWithScreenVisibleList = {
  type: 'sharingWithScreenVisibleList'
  screen_visible_list: string[]
  screen_visible_switch: true
} & CommonSharing

type SharingWithSticky = {
  type: 'sharingWithSticky'
  sticky: true
  view_sticky: boolean
} & CommonSharing

type SharingWithDefaultLink = {
  type: 'sharingWithDefaultLink'
  is_default_link: true
} & CommonSharing

//type Sharing =

type Sharing = {}
