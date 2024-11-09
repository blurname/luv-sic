const COLOR_TOKEN = {
  button: {
    bg: '#fff',
    hover: '#F2F2F2',
    active: '#ddd'
  },
  buttonPurple: {
    bg: '#fff',
    hover: 'rgba(135, 63, 234, 0.1)',
    active: 'rgba(135, 63, 234, 0.3)'
  },
  border: '#DBDBDB'
} as const

const COLOR_TOKEN_PROTO = {
  blue1: '#1684FC',
  blue2: '#E8F3FF',
  gray1: '#D2D9E4',
  primaryBtn: {
    normal: '#0077FF',
    hover: '#2693FF',
    active: '#005ED9',
    disable: '#B9DAFE',
    text: '#FFFFFF'
  },
  secondBtn: {
    normal: '#FFFFFF',
    hover: '#F0F2F7',
    active: '#E1E6EF',
    disable: '#FFFFFF',
    text: '#5D6F8F',
    disabledText: '#BEC5D2'
  }
} as const
export {
  COLOR_TOKEN,
  COLOR_TOKEN_PROTO
}
