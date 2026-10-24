import type { IAsyncTaskScheduleVo } from '@allahjs/utils';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import AhAntdConfig from '../utils/AhAntdConfig';
import type { IUseScheduleRequestReq } from './interface';

type IParams = {
  /**
   * 获取同步进度信息 如果不指定的话，会使用全局的配置
   * @param key 同步进度的key
   * @returns
   */
  asyncTaskSchedule?: (key: string) => Promise<IAsyncTaskScheduleVo>;
  /**
   * 进度信息更新回调
   * @param data 进度信息
   */
  onChange?: (data: IAsyncTaskScheduleVo) => void;
  /**
   * 调用接口获取进度信息
   * @param key 同步进度的key
   */
  request?: () => Promise<IAsyncTaskScheduleVo>;
};

/**
 * 进度信息获取的hook
 * asyncTaskSchedule 如果不指定的话，会使用全局的配置
 */
function useScheduleRequest({
  asyncTaskSchedule,
  onChange,
  request
}: IParams): IUseScheduleRequestReq {
  /**
   * 轮询次数
   */
  const [reqCount, setReqCount] = useState(0);
  const [importLoading, setImportLoading] = useState(false);
  const [importDisabled, setImportDisabled] = useState(false);
  // 批次
  const [batch, setBatch] = useState('未创建');
  // 轮训进度
  const [pollingProgress, setPollingProgress] = useState<IAsyncTaskScheduleVo>({
    status: 0
  } as IAsyncTaskScheduleVo);

  if (!asyncTaskSchedule && AhAntdConfig.getCommReq().asyncTaskSchedule) {
    asyncTaskSchedule = AhAntdConfig.getCommReq().asyncTaskSchedule;
  } else {
    console.error('无效的asyncTaskSchedule配置');
  }

  useEffect(() => {
    onChange?.(pollingProgress);
  }, [pollingProgress]);

  // 轮询方法
  const scheduleRequest = useRequest((key: string) => asyncTaskSchedule!(key), {
    manual: true,
    pollingInterval: 3000,
    pollingWhenHidden: false,
    onError: () => {
      scheduleRequest.cancel(); // 结束轮询，结束当此轮询后是立马会发起下一次轮询还是3s后
      // 重置
      reset();
    },
    onSuccess: data => {
      if (data.status === 0) {
        setReqCount(reqCount + 1);
        setImportLoading(true);
        if (reqCount === 5) {
          data.statusText = '任务创建失败，请重试！';
          data.status = 4;
          setImportLoading(false);
          scheduleRequest.cancel();
        }
      } else if (data.status === 1 || data.status === 2) {
        setImportLoading(true);
      } else if (data.status === 3) {
        // 结束轮训
        scheduleRequest.cancel();
        setImportLoading(false);
        // 禁用开始导入按钮
        setImportDisabled(true);
      } else if (data.status === 4) {
        scheduleRequest.cancel();
        setImportLoading(false);
        data.statusText = `${data.statusText}-${data.errorMessage}！`;
      }
      setPollingProgress(data);
    }
  });

  // 重置
  const reset = () => {
    setReqCount(0);
    setImportLoading(false);
    setImportDisabled(false);
    setBatch('未创建');
    setPollingProgress({
      status: 0,
      statusText: '未创建',
      progress: 0,
      type: 1,
      count: 0,
      current: 0
    } as IAsyncTaskScheduleVo);
  };

  // 重启
  const restart = () => {
    const key = pollingProgress.redisKey;
    reset();
    start(key);
  };

  /**
   * 获取进度
   */
  const getProgress = async (key?: string) => {
    if (!key && pollingProgress.redisKey) {
      key = pollingProgress.redisKey;
    }
    if (!key) {
      console.error('无效的key');
      return;
    }
    scheduleRequest.run(key);
  };

  /**
   * 开始轮询 - 如果指定了key，会使用指定的key，否则会尝试调用接口获取key
   * @param key 缓存的key
   */
  const start = async (key?: string) => {
    let data: IAsyncTaskScheduleVo = {
      status: 0,
      redisKey: key,
      statusText: '未创建',
      progress: 0,
      type: 1,
      count: 0,
      current: 0
    } as IAsyncTaskScheduleVo;
    if (!key && request) {
      data = await request();
      setPollingProgress(data);
    }
    setReqCount(0);
    setImportLoading(true);
    setImportDisabled(true);
    // 开始轮询
    scheduleRequest.run(data.redisKey);
  };

  /**
   * 取消操作
   */
  const cancel = () => {
    setReqCount(0);
    setImportLoading(false);
    setImportDisabled(false);
    scheduleRequest.cancel();
  };

  return {
    pollingProgress,
    setPollingProgress,
    importLoading,
    running: importLoading,
    importDisabled,
    setImportDisabled,
    setImportLoading,
    scheduleRequest,
    batch,
    setBatch,
    reset,
    start,
    cancel,
    restart,
    getProgress
  };
}

export default useScheduleRequest;
