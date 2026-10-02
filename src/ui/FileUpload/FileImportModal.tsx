import { ModalForm } from '@ant-design/pro-components';
import { FileUpload2Fun, fileUpload2Usage } from '../../theling-utils';
import type { IAsyncTaskScheduleVo } from '../../theling-utils/@types/IAsyncTaskScheduleVo';
import { Button, Progress, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import useScheduleRequest from '../hooks/useScheduleRequest';
import FileUpload2 from './FileUpload2';
import { ButtonType } from 'antd/lib/button/buttonHelpers';
import type { IUploadProps } from '../../types';

export type IFileImportModalProps = {
  /**
   * 文件上传完成后的回调
   */
  importReq: (fileId: string) => Promise<IAsyncTaskScheduleVo>;
  /**
   * 导入的按钮名称
   */
  label?: string;
  /**
   * 上传组件的配置
   */
  uploadProps?: IUploadProps;
  /**
   * 图标
   */
  icon?: React.ReactNode;
  /**
   * 样式类型
   */
  type?: ButtonType;
  /**
   * 上传按钮的点击事件 - 返回true就打开弹窗
   */
  onClick?: () => boolean;
};

const { Paragraph } = Typography;

/**
 * 文件导入弹窗
 */
const FileImportModal: React.FC<IFileImportModalProps> = ({
  importReq,
  label,
  uploadProps = {} as IUploadProps,
  icon,
  type,
  onClick
}) => {
  // 文件上传标签ref
  const uploadRef = useRef<FileUpload2Fun>(undefined);
  const [visible, setVisible] = useState(false);
  // 轮询
  const {
    pollingProgress,
    setPollingProgress,
    importLoading,
    setImportLoading,
    setImportDisabled,
    importDisabled,
    scheduleRequest,
    batch,
    setBatch
  } = useScheduleRequest({});

  // 开始导入
  const startSynchrony = async () => {
    // 开启导入loading
    setImportLoading(true);
    // 上传文件，拿到文件信息，本地上传和网络上传都会拿到文件信息，但是本地上传没有cosKey
    const files = await uploadRef.current?.startUpload();
    setBatch(files![0].zlFileId);
    // 得到上传文件的cosKey
    const res: IAsyncTaskScheduleVo = await importReq(files![0].zlFileId);
    scheduleRequest.run(res.redisKey);
  };

  return (
    <>
      <div>
        {type && icon ? (
          <Button
            type={type}
            icon={icon}
            onClick={() => {
              if (onClick) {
                const flag = onClick();
                if (!flag) {
                  return;
                }
              }
              setVisible(true);
            }}
          >
            {label}
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (onClick) {
                const flag = onClick();
                if (!flag) {
                  return;
                }
              }
              setVisible(true);
            }}
          >
            {label}
          </Button>
        )}
      </div>
      <ModalForm
        title="数据导入确认"
        width="35%"
        open={visible}
        onOpenChange={setVisible}
        submitter={{
          render: () => {
            return [
              <Button
                key="okBtn"
                onClick={() => {
                  scheduleRequest.cancel();
                  setVisible(false);
                  setImportLoading(false);
                }}
              >
                取消
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={importLoading}
                disabled={importDisabled}
                onClick={startSynchrony}
              >
                {importLoading ? '正在导入数据' : '开始导入数据'}
              </Button>
            ];
          }
        }}
      >
        <div style={{ height: 130, overflowY: 'auto' }}>
          <FileUpload2
            fileSize={8048000}
            uploadRef={uploadRef}
            onChange={(fileList) => {
              setImportDisabled(fileList.length === 0);
              pollingProgress.progress = 0;
              pollingProgress.statusText = '未创建';
              setBatch('未创建');
              if (fileList.length === 0) {
                setImportLoading(false);
                // 取消轮询
                scheduleRequest.cancel();
              }
              setPollingProgress(pollingProgress);
            }}
            {...uploadProps}
            usage={uploadProps.usage || fileUpload2Usage.DATA_IMPORT}
          />
        </div>
        <div style={{ paddingTop: 15 }}>
          当前数据批次：
          <Paragraph copyable>{batch}</Paragraph>
        </div>
        <div style={{ paddingTop: 15 }}>
          当前导入进度：
          {pollingProgress.statusText}
          <Progress
            percent={Math.floor((pollingProgress.current / pollingProgress.count) * 10000) / 100}
            status="active"
          />
        </div>
      </ModalForm>
    </>
  );
};

export default FileImportModal;
