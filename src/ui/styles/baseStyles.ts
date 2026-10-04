import type React from 'react';

const basePielValue = 2;

/**
 * 常用布局
 */
export const ahWL = {
  /**
   * 均匀布局
   */
  ah_jy: {
    display: 'flex',
    justifyContent: 'space-around'
  } as React.CSSProperties,
  /**
   * 横向从左往右
   */
  ah_czwy: {
    display: 'flex',
    flexDirection: 'row'
  } as React.CSSProperties,
  /**
   * 一左一右
   */
  ah_sb: {
    display: 'flex',
    justifyContent: 'space-between'
  } as React.CSSProperties,
  /**
   * 水平居中
   */
  ah_r_jz: {
    display: 'flex',
    justifyContent: 'center'
  } as React.CSSProperties,
  /**
   * 垂直布局
   */
  ah_cz: {
    display: 'flex',
    flexFlow: 'column'
  } as React.CSSProperties,
  /**
   * 居中
   */
  ah_jz: {
    display: 'flex',
    alignItems: 'center'
  } as React.CSSProperties,
  ah_f1: {
    flex: 1
  } as React.CSSProperties,
  /**
   * 填充
   */
  ah_f: {
    display: 'flex'
  } as React.CSSProperties,
  /**
   * 内容颜色
   */
  ah_text2: {
    color: '#808080'
  } as React.CSSProperties,
  /**
   * 主标题字号
   */
  ah_title1: {
    fontWeight: '600',
    fontSize: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 主背景色
   */
  ah_main_background_color1: {
    backgroundColor: '#fff'
  } as React.CSSProperties,
  /**
   * 背景色2
   */
  ah_main_background_color2: {
    backgroundColor: '#edf1f6'
  } as React.CSSProperties,
  /**
   * 垂直的一个竖线
   */
  verticalBar: {
    width: 4,
    marginRight: 6,
    marginLeft: 2,
    borderRadius: 2
  } as React.CSSProperties,
  /**
   * 区域滚动的布局 - 最外层的容器需要使用这个
   */
  scrollCon: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16
  } as React.CSSProperties,
  /**
   * 固定在底部
   */
  ah_fixed_bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flex: 1
  } as React.CSSProperties
};
/**
 * 外边距
 */
export const ahWM = {
  /**
   * 所有外边距
   */
  a_1: {
    margin: basePielValue * 2
  } as React.CSSProperties,
  a_2: {
    margin: basePielValue * 4
  } as React.CSSProperties,
  a_3: {
    margin: basePielValue * 6
  } as React.CSSProperties,
  a_4: {
    margin: basePielValue * 8
  } as React.CSSProperties,
  /**
   * X轴：上、下外边距
   */
  x_1: {
    marginRight: basePielValue * 2,
    marginLeft: basePielValue * 2
  } as React.CSSProperties,
  x_2: {
    marginRight: basePielValue * 4,
    marginLeft: basePielValue * 4
  } as React.CSSProperties,
  x_3: {
    marginLeft: basePielValue * 6,
    marginRight: basePielValue * 6
  } as React.CSSProperties,
  x_4: {
    marginRight: basePielValue * 8,
    marginLeft: basePielValue * 8
  } as React.CSSProperties,
  /**
   * Y轴：左、右外边距
   */
  y_1: {
    marginBottom: basePielValue * 2,
    marginTop: basePielValue * 2
  } as React.CSSProperties,
  y_2: {
    marginBottom: basePielValue * 4,
    marginTop: basePielValue * 4
  } as React.CSSProperties,
  y_3: {
    marginBottom: basePielValue * 6,
    marginTop: basePielValue * 6
  } as React.CSSProperties,
  y_4: {
    marginBottom: basePielValue * 8,
    marginTop: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 右外边距
   */
  r_1: {
    marginRight: basePielValue * 2
  } as React.CSSProperties,
  r_2: {
    marginRight: basePielValue * 4
  } as React.CSSProperties,
  r_3: {
    marginRight: basePielValue * 6
  } as React.CSSProperties,
  r_4: {
    marginRight: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 左外边距
   */
  l_1: {
    marginLeft: basePielValue * 2
  } as React.CSSProperties,
  l_2: {
    marginLeft: basePielValue * 4
  } as React.CSSProperties,
  l_3: {
    marginLeft: basePielValue * 6
  } as React.CSSProperties,
  l_4: {
    marginLeft: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 上外边距
   */
  t_1: {
    marginTop: basePielValue * 2
  } as React.CSSProperties,
  t_2: {
    marginTop: basePielValue * 4
  } as React.CSSProperties,
  t_3: {
    marginTop: basePielValue * 6
  } as React.CSSProperties,
  t_4: {
    marginTop: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 下外边距
   */
  b_1: {
    marginBottom: basePielValue * 2
  } as React.CSSProperties,
  b_2: {
    marginBottom: basePielValue * 4
  } as React.CSSProperties,
  b_3: {
    marginBottom: basePielValue * 6
  } as React.CSSProperties,
  b_4: {
    marginBottom: basePielValue * 8
  } as React.CSSProperties
};
/**
 * 内边距
 */
export const ahWP = {
  /**
   * 所有内边距
   */
  a_1: {
    padding: basePielValue * 2
  } as React.CSSProperties,
  a_2: {
    padding: basePielValue * 4
  } as React.CSSProperties,
  a_3: {
    padding: basePielValue * 6
  } as React.CSSProperties,
  a_4: {
    padding: basePielValue * 8
  } as React.CSSProperties,
  /**
   * X轴：上、下内边距
   */
  x_1: {
    paddingRight: basePielValue * 2,
    paddingLeft: basePielValue * 2
  } as React.CSSProperties,
  x_2: {
    paddingRight: basePielValue * 4,
    paddingLeft: basePielValue * 4
  } as React.CSSProperties,
  x_3: {
    paddingLeft: basePielValue * 6,
    paddingRight: basePielValue * 6
  } as React.CSSProperties,
  x_4: {
    paddingRight: basePielValue * 8,
    paddingLeft: basePielValue * 8
  } as React.CSSProperties,
  /**
   * Y轴：左右内边距
   */
  y_1: {
    paddingBottom: basePielValue * 2,
    paddingTop: basePielValue * 2
  } as React.CSSProperties,
  y_2: {
    paddingBottom: basePielValue * 4,
    paddingTop: basePielValue * 4
  } as React.CSSProperties,
  y_3: {
    paddingBottom: basePielValue * 6,
    paddingTop: basePielValue * 6
  } as React.CSSProperties,
  y_4: {
    paddingBottom: basePielValue * 8,
    paddingTop: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 右内边距
   */
  r_1: {
    paddingRight: basePielValue * 2
  } as React.CSSProperties,
  r_2: {
    paddingRight: basePielValue * 4
  } as React.CSSProperties,
  r_3: {
    paddingRight: basePielValue * 6
  } as React.CSSProperties,
  r_4: {
    paddingRight: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 左内边距
   */
  l_1: {
    paddingLeft: basePielValue * 2
  } as React.CSSProperties,
  l_2: {
    paddingLeft: basePielValue * 4
  } as React.CSSProperties,
  l_3: {
    paddingLeft: basePielValue * 6
  } as React.CSSProperties,
  l_4: {
    paddingLeft: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 上内边距
   */
  t_1: {
    paddingTop: basePielValue * 2
  } as React.CSSProperties,
  t_2: {
    paddingTop: basePielValue * 4
  } as React.CSSProperties,
  t_3: {
    paddingTop: basePielValue * 6
  } as React.CSSProperties,
  t_4: {
    paddingTop: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 下内边距
   */
  b_1: {
    paddingBottom: basePielValue * 2
  } as React.CSSProperties,
  b_2: {
    paddingBottom: basePielValue * 4
  } as React.CSSProperties,
  b_3: {
    paddingBottom: basePielValue * 6
  } as React.CSSProperties,
  b_4: {
    paddingBottom: basePielValue * 8
  } as React.CSSProperties
};
/**
 * 圆角
 */
export const ahWR = {
  /**
   * 所有圆角弧度
   */
  a_1: {
    borderRadius: basePielValue * 2
  } as React.CSSProperties,
  a_2: {
    borderRadius: basePielValue * 4
  } as React.CSSProperties,
  a_3: {
    borderRadius: basePielValue * 6
  } as React.CSSProperties,
  a_4: {
    borderRadius: basePielValue * 8
  } as React.CSSProperties,
  /**
   * 左上角弧度
   */
  tl_1: {
    borderTopLeftRadius: basePielValue * 2
  } as React.CSSProperties,
  tl_2: {
    borderTopLeftRadius: basePielValue * 4
  } as React.CSSProperties,
  tl_3: {
    borderTopLeftRadius: basePielValue * 6
  } as React.CSSProperties,
  tl_4: {
    borderTopLeftRadius: basePielValue * 8
  } as React.CSSProperties,

  /**
   * 右上角弧度
   */
  tr_1: {
    borderTopRightRadius: basePielValue * 2
  } as React.CSSProperties,
  tr_2: {
    borderTopRightRadius: basePielValue * 4
  } as React.CSSProperties,
  tr_3: {
    borderTopRightRadius: basePielValue * 6
  } as React.CSSProperties,
  tr_4: {
    borderTopRightRadius: basePielValue * 8
  } as React.CSSProperties,

  /**
   * 左下角弧度
   */
  bl_1: {
    borderBottomLeftRadius: basePielValue * 2
  } as React.CSSProperties,
  bl_2: {
    borderBottomLeftRadius: basePielValue * 4
  } as React.CSSProperties,
  bl_3: {
    borderBottomLeftRadius: basePielValue * 6
  } as React.CSSProperties,
  bl_4: {
    borderBottomLeftRadius: basePielValue * 8
  } as React.CSSProperties,

  /**
   * 右下角弧度
   */
  br_1: {
    borderBottomRightRadius: basePielValue * 2
  } as React.CSSProperties,
  br_2: {
    borderBottomRightRadius: basePielValue * 4
  } as React.CSSProperties,
  br_3: {
    borderBottomRightRadius: basePielValue * 6
  } as React.CSSProperties,
  br_4: {
    borderBottomRightRadius: basePielValue * 8
  } as React.CSSProperties
};
