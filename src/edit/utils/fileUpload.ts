import { IFileObjVo } from '../../types';
import type { TFileUpload2Config } from '../../types';
import { cryptoUtils } from '@allahjs/utils';
import { message } from 'antd';
import type { IProgressInfo, IUploadProps } from '../../types';
import { IFileUpload2UsageType } from '@allahjs/utils';

/**
 * 富文本的文件上传
 * 成功返回可预览的临时签 URL；失败抛错，禁止写入假链接
 */
export const fileUpload = async (
  file: File,
  fileKeyRequest: TFileUpload2Config['fileKeyRequest'],
  uploadFile: TFileUpload2Config['uploadFile'],
  generateSignUrlReq: TFileUpload2Config['generateSignUrlReq'],
  usage: IFileUpload2UsageType,
  permission?: IUploadProps['permission'],
  bucket?: string,
  onProgress?: (v: IProgressInfo) => void
): Promise<{
  url: string;
  dbFileId: string;
}> => {
  if (!fileKeyRequest || !uploadFile || !generateSignUrlReq) {
    const err = new Error('文件上传配置缺失：fileKeyRequest / uploadFile / generateSignUrlReq');
    message.error('文件上传配置错误，请联系管理员');
    throw err;
  }

  const uuid = cryptoUtils.getUuid();
  const fileVo: IFileObjVo = {
    fileId: '',
    url: '',
    dbFileId: '',
    name: file.name,
    fileSize: file.size,
    bucket: bucket as string,
    cosKey: '',
    cosWaterKey: '',
    oldFile: false,
    previewUrl: '',
    response: undefined,
    uid: uuid,
    usage: usage as IFileUpload2UsageType,
    xhr: undefined,
    size: file.size,
    fileName: file.name,
    permission: permission
  };

  const newFiles = await fileKeyRequest([fileVo]);
  if (!bucket) {
    bucket = newFiles[0].bucket;
  }
  try {
    await uploadFile(newFiles[0].cosKey, file, bucket, onProgress);
    const url = await generateSignUrlReq(newFiles[0]);
    return {
      url,
      dbFileId: newFiles[0].dbFileId || ''
    };
  } catch (e) {
    message.error('文件上传失败，请稍后再试');
    throw e;
  }
};
