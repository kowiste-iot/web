export enum EBreakpoint {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

export enum RowAlignment {
  START = 'start',
  CENTER = 'center',
  END = 'end',
  BETWEEN = 'between',
  AROUND = 'around',
  EVENLY = 'evenly',
}

export enum RowVerticalAlignment {
  START = 'start',
  CENTER = 'center',
  END = 'end',
  BASELINE = 'baseline',
  STRETCH = 'stretch',
}


export type ColSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto'
export type ColOffset = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
export type ColOrder = 0 | 1 | 2 | 3 | 4 | 5 | 'first' | 'last'
