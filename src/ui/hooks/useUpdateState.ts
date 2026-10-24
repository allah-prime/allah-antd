import { useInterval, useRequest } from 'ahooks';
import { useEffect } from 'react';
import type { IUseUpdateStatue } from './interface';

export const UPDATE_KEY = 'jyfwboard_sys_upfirst';

/**
 * 系统更新状态检测
 * <br />
 * 该方法会在页面第一次打开的时候，检测系统是否有更新，如果有更新，就会弹出更新提示框
 * <br />
 * 方法会每隔一段时间，检测一下现在是几点，如果是五点以后的话，就会调用接口检测下今天是否有更新。
 * <br />
 * 接收到今天有更新的消息后，就会提示用户更新，然后停止检测。
 */
function useUpdateState({ autoCheckTime = [8, 18], checkUpdate, onCheckUpdate }: IUseUpdateStatue) {
  const checkUpdateReq = useRequest(checkUpdate, {
    pollingInterval: 60000,
    pollingWhenHidden: false,
    manual: true,
    onSuccess: data => {
      console.log(`检测更新~${data}`);
      if (data) {
        onCheckUpdate?.(data);
        // 停止更新轮训
        checkUpdateReq.cancel();
      }
    }
  });

  /**
   * 判断是否可以调用接口
   */
  const canCheck = () => {
    const now = new Date();
    const hour = now.getHours();
    // 时间必须小于autoCheckTime的第一个值，或者大于autoCheckTime的第二个值
    const flag = hour <= autoCheckTime[0] || hour >= autoCheckTime[1];
    // 如果需要检测更新，就调用接口开始轮训
    if (flag) {
      // 开启轮训
      checkUpdateReq.run();
      // 关闭定时器
      updateInter();
    }
  };

  const updateInter = useInterval(() => {
    canCheck();
  }, 60000);

  useEffect(() => {
    // 启动后，立马进行一次检测
    canCheck();
  }, []);

  return {
    checkUpdateReq,
    updateInter
  };
}

export default useUpdateState;
