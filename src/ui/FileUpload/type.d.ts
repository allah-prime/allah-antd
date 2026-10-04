import type { IFileObjVoBase } from '@allahjs/utils';
import type { fileUpload2Usage } from '@allahjs/utils';

/**
 * 文件的应用场景
 */
export type IUseType = fileUpload2Usage;

/**
 * 文件关联的对象
 */
export interface IFileRelevanceVo {
  /**
   * 需要关联的id
   */
  relId: string;
  /**
   * 文件的对象集合。可以是文件对象，也可以是文件的id
   */
  fileList: string[];
  /***
   * 文件的使用场景
   */
  useType: IUseType;
}

export interface IBuildKeysVo {
  /**
   * 文件对象
   */
  files: IFileObjVoBase[];

  /**
   * 关联的id，如果有就自动关联上了，当然也可以没有
   */
  relId?: string;

  /**
   * 文件的桶 | 如果是本地，就显示local，不传的话，由服务端根据用户角色来获取对应的桶
   */
  bucket?: string;
}

export interface IFileUpload {
  /**
   * 获取上传文件地址的回调方法
   */
  saveImgList?: (fileList: IFileObjVoBase[], fileType?: string) => void;
  saveFileList?: (fileList: IFileObjVoBase[], fileType?: string) => void;
  delFile?: (delFile: any) => void;
  /**
   * 文件的类型
   */
  fileType?: IFileUpload2UsageType;
  /**
   * 文件数量限制，KB为单位
   */
  maxNum?: number;
  /**
   * 上传列表的内建样式 text, picture 和 picture-card
   */
  boxType?: 'picture' | 'picture-card';
  /**
   * 文件的大小
   */
  fileSize?: number;
  defaultImgList?: any[];
  multiple?: boolean;
  disabled?: boolean;
  selectText?: string;
}
