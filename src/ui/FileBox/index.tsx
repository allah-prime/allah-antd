import { CloudDownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Image } from 'antd';
import Tooltip from 'antd/es/tooltip';

import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import Ellipsis from '../Ellipsis';
import { downloadFileUtil, openUrlDown } from '../utils/AhNetWork';
import './index.less';

import { buildFileType, IFileBoxProps, IFileItem, isImageFile } from './utils';

const FileBox: React.FC<IFileBoxProps> = props => {
  const [fileList, setFileList] = useState(props.fileList ? props.fileList : []);

  const { styles, showDelete, deleteFile, bodyStyles = {}, showNum } = props;

  useEffect(() => {
    if (!isEqual(props.fileList, fileList)) {
      const { fileObj = {} as IFileItem } = props;
      let newList = props.fileList || [];
      if (Object.keys(fileObj).length > 0) {
        newList = [fileObj];
      }
      setFileList(newList);
    }
  }, [props.fileList, fileList, props.fileObj]);

  // 文件下载
  const downFile = (item: IFileItem) => {
    // 父组件需要传递一个下载文件的方法
    const { downloadFile } = props;
    if (typeof downloadFile === 'function') {
      // 如果父组件传递了下载方法
      downloadFileUtil(downloadFile, item.fileId, item.fileName, item.suffix);
    } else {
      // 打开url进行下载
      openUrlDown(item.filePath);
    }
  };

  // 获取显示的zoomBox
  const zoomBox = () => {
    const list = showNum ? fileList.filter((it, num) => showNum > num) : fileList;

    return list.map((item, index) => {
      return (
        <div className="theling_ahImageBoxImageDiv" key={item.fileId}>
          <div className="theling_ahImageBoxImageBox" style={styles}>
            {isImageFile(item.suffix) ? (
              <Tooltip title={item.fileName}>
                <Image className="theling_ahImageBoxImages" src={item.filePath} alt="图片" />
              </Tooltip>
            ) : (
              <span
                className="theling_ahImageBoxImages"
                style={{
                  display: 'inline-block',
                  fontSize: '100px',
                  textAlign: 'center',
                  color: '#1890FF'
                }}
              >
                {buildFileType(item.suffix)}
              </span>
            )}
            {!showNum && (
              <div style={{ margin: 5 }}>
                {item.fileName.length > 5 ? (
                  <Ellipsis tooltip length={6}>
                    {item.fileName}
                  </Ellipsis>
                ) : (
                  <span>{item.fileName}</span>
                )}
                <Tooltip title="下载到本地">
                  <CloudDownloadOutlined
                    style={{ marginRight: 3, marginLeft: 3 }}
                    onClick={() => downFile(item)}
                  />
                </Tooltip>
                {showDelete && deleteFile && (
                  <Popconfirm
                    title="是否要删除此附件？"
                    onConfirm={() => deleteFile(item)}
                    okText="删除"
                    cancelText="取消"
                  >
                    <DeleteOutlined style={{ color: 'red' }} />
                  </Popconfirm>
                )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const renderHiddenImages = () => {
    if (!showNum || fileList.length <= showNum) return null;
    return fileList
      .filter((_, index) => index >= showNum)
      .filter(item => isImageFile(item.suffix))
      .map(item => <Image key={item.fileId} src={item.filePath} style={{ display: 'none' }} />);
  };

  return (
    <div style={bodyStyles}>
      <Image.PreviewGroup>
        {zoomBox()}
        {renderHiddenImages()}
      </Image.PreviewGroup>
      {props.suffixRender}
    </div>
  );
};

export default FileBox;
