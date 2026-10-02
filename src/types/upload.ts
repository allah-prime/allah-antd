import { IUploadRef } from '../theling-utils';
import type { IFileObjVoBase } from '../theling-utils/@types/IBase';
import { IEnumBusiType, IFileUpload2UsageType } from '../theling-utils/utils/fileUpload2Usage';
import type { UploadFile } from 'antd/lib/upload/interface';
import type { UploadProps } from 'antd/lib/upload/Upload';
import type { IProgressInfo } from './progress';

export type IFileObjVo = IFileObjVoBase & UploadFile;

/**
 * 文件上传组件的通用属性接口
 */
export interface IUploadProps {
  /**
   * 上传之前的钩子
   */
  uploadRef?: IUploadRef;

  style?: React.CSSProperties;
  /**
   * 文件列表
   */
  value?: IFileObjVoBase[];
  /**
   * 文件变化回调
   */
  onChange?: (fileList: IFileObjVoBase[]) => void;
  /**
   * 删除文件回调
   */
  delFile?: (uid: string) => void;
  /**
   * @deprecated 请使用 busiScene 代替
   */
  fileType?: IFileUpload2UsageType;
  /**
   * @deprecated 请使用 busiScene 代替
   */
  usage?: IFileUpload2UsageType;
  /**
   *  @deprecated 请使用 busiScene 代替
   */
  busiType?: IEnumBusiType;
  /**
   * 业务场景
   */
  busiScene?: string;
  /**
   * 文件数量限制
   */
  maxNum?: number;
  /**
   * 上传列表的内建样式 text, picture 和 picture-card
   */
  listType?: UploadProps['listType'];
  /**
   * 是否支持多选
   */
  multiple?: boolean;
  /**
   * 文件大小限制，单位字节，默认2MB
   */
  fileSize?: number;
  /**
   * 选择文件的提示文本
   */
  selectText?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 上传接口，点击提交按钮后，通过ref调用组件进行数据的上传。因为key已经定义好了，所以这个方法需要返回进度信息之类的就好了，是一个一个上传的
   * @param files
   */
  uploadRequest?: (
    files: IFileObjVoBase,
    onProgress?: (v: IProgressInfo) => void
  ) => Promise<string>;
  /**
   * 本地上传接口，当 bucket 为 'database' 时使用，传递 fileId 和文件流
   * @param fileData 包含 formData 和文件元数据的对象
   * @param onProgress 上传进度回调
   */
  uploadLocalRequest?: (
    fileData: IFileObjVoBase & {
      formData: FormData;
    },
    onProgress?: (v: IProgressInfo) => void
  ) => Promise<string>;
  /**
   * 申请文件key的接口
   * @param file
   */
  fileKeyRequest?: (files: IFileObjVoBase[]) => Promise<IFileObjVoBase[]>;
  /**
   * 文件下载
   */
  onDownload?: UploadProps['onDownload'];
  /**
   * 文件的权限 - 0 公开，1 私有，2 登录后可以查看
   */
  permission?: IFileObjVoBase['permission'];
  /**
   * 自定义上传按钮渲染
   */
  customUploadRender?: (disabled: boolean, fileList: IFileObjVoBase[]) => React.ReactNode;
  /**
   * 接受的文件类型
   */
  accept?: string;
  /**
   * 需要上传的桶
   */
  bucket?: string;
  /**
   * 文件上传的额外配置
   */
  uploadProps?: UploadProps;
  /**
   * 宽度的差值
   */
  widthDiff?: number;
}
