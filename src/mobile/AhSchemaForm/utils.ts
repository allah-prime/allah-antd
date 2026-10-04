import { FileUpload2Fun, IFormColumns } from '@allahjs/utils';
import { Toast } from 'antd-mobile';
import { mbHandleSubmitError as defHandleSubmitError } from '../utils/errorHandler';
import { IFileObjVoBase } from '@allahjs/utils';

type IParams = {
  /** 表单提交时的所有字段值 */
  values: any;
  /** 当前表单的所有列配置 */
  currentColumns: IFormColumns[];
  /** 文件上传组件的 ref 集合，用于手动触发上传 */
  fileUploadRefs?: React.MutableRefObject<Map<string, FileUpload2Fun>>;
  /** 提交发生错误时的回调函数 */
  handleSubmitError?: (e: any) => void;
  /** 新增或更新数据的异步函数 */
  insertOrUpdate?: (values: any) => Promise<any>;
  /** 文件与业务资源关联的异步函数 */
  fileObjRelevanceResource2?: (params: {
    /** 业务主键 ID，用于关联文件 */
    relId: string;
    /** 待关联的文件列表 */
    fileList: IFileObjVoBase[];
    /** 业务场景标识 */
    busiScene?: string | undefined;
  }) => Promise<any | void>;
  // 主键的key
  idKey?: string;
};

/**
 * 移动端表单上传处理函数
 * @param params 参数
 */
export const mbFormFinish = async (params: IParams): Promise<string> => {
  const {
    values,
    currentColumns,
    fileUploadRefs,
    handleSubmitError = defHandleSubmitError,
    insertOrUpdate,
    fileObjRelevanceResource2,
    idKey = 'id'
  } = params;
  try {
    // 从表单配置中，找到所有的文件上传组件的key
    const fileKeys = currentColumns.filter(item => ['image', 'file'].includes(item.valueType!));
    // 从finalData中，找到这些key删了
    fileKeys.forEach(key => {
      delete values[key.dataIndex as string];
    });

    const fileRefKeys: string[] = [];
    console.log('表单提交成功:', values);
    values[idKey] = await insertOrUpdate!(values);
    // 如果有文件上传组件，先处理文件上传
    if (fileUploadRefs && fileUploadRefs.current) {
      console.log('开始处理文件上传...');
      for (const key of fileUploadRefs.current.keys()) {
        fileRefKeys.push(key);
      }
      for (let i = 0; i < fileRefKeys.length; i++) {
        const isLast = i === fileRefKeys.length - 1;
        const refKey = fileRefKeys[i];
        const nowUploadFile = fileUploadRefs.current.get(refKey);
        const fileList = await nowUploadFile!.startUpload(undefined, {
          tipsStart: i === 0,
          tipsEnd: isLast
        });
        // 从key找到配置
        const fileColumns = currentColumns.find(item => item.dataIndex === refKey);
        // 处理关联
        await fileObjRelevanceResource2!({
          relId: values[idKey],
          fileList,
          busiScene: fileColumns?.busiScene as string
        });
        values[refKey] = fileList;
        console.log('处理关联成功:', values);
      }
      console.log('文件上传完成:', values);
    }
  } catch (e) {
    handleSubmitError?.(e);
  } finally {
    Toast.clear();
  }
  return values[idKey];
};
