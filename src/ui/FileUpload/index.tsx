import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Upload } from 'antd';
import React from 'react';
import './index.less';
import type { IFileUpload } from './type';

/**
 * @author tangbin
 * @date 2018/11/2-14:13
 * @descriptions: 图片上传组件
 */
class FileUpload extends React.Component<IFileUpload> {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    imgList: []
  };
  static defaultProps = {
    maxNum: 6,
    saveImgList: () => console.log('无效的方法'),
    boxType: 'picture-card',
    fileSize: 2048000
  };

  componentDidMount(): void {
    const { defaultImgList } = this.props;
    if (defaultImgList) {
      this.setState({ imgList: defaultImgList });
    }
  }

  // 弹窗关闭
  handleCancel = () => this.setState({ previewVisible: false });

  // 当文件发生变化的时候
  handleChange = ({ fileList }: any) => {
    const { saveImgList, fileType, saveFileList } = this.props;
    // 保存自己在状态中
    this.setState({ fileList });
    // 传递给父组件
    if (saveFileList) {
      saveFileList(fileList, fileType);
    }
    if (saveImgList) {
      saveImgList(fileList, fileType);
    }
  };

  buildUploadButton = (boxType: IFileUpload['boxType']) => {
    if (boxType === 'picture') {
      return (
        <div>
          <Button>
            <UploadOutlined />
            点击上传
          </Button>
        </div>
      );
    }
    return (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">{this.props.selectText}</div>
      </div>
    );
  };

  render() {
    const { previewVisible, previewImage } = this.state;

    const {
      disabled,
      saveImgList,
      saveFileList,
      delFile,
      fileType,
      boxType,
      fileSize = 2048000,
      maxNum = 10,
      multiple = true,
      selectText = '选择图片'
    } = this.props;

    const uploadButton = this.buildUploadButton(boxType);

    const options = {
      // 上传钩子
      beforeUpload: (file: any) => false,
      // 变化监听
      // eslint-disable-next-line
      onChange: ({ fileList, file }: any): any => {
        const newFile = file;
        // 判断文件大小
        if (file.size > fileSize) {
          Modal.error({
            title: '文件（照片）过大',
            content: `系统建议使用小于${
              fileSize / 1024 / 1024
            }M的文件（照片）进行上传，如果超出，请进行压缩或者拆分`
          });
          return false;
        }
        if (file.status === 'removed') {
          return false;
        }

        // 给文件新增属性
        newFile.fileType = new Date().getTime();
        const imgList = [...fileList].map(item => {
          item.status = 'done';
          return item;
        });
        // eslint-disable-next-line
        this.setState(({ fileList }: any) => {
          // 把文件给父组件
          if (saveFileList) {
            saveFileList([...fileList, newFile], fileType);
          }
          if (saveImgList) {
            saveImgList([...fileList, newFile], fileType);
          }
          return {
            fileList: [...fileList, newFile],
            imgList
          };
        });
      },
      // 点击链接的回调
      onPreview: (file: any) => {
        console.log('点击链接的回调file', file);
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true
        });
      },
      // 移除时的监听
      onRemove: (file: any) => {
        this.setState(({ fileList, imgList }: any) => {
          const newFileList = fileList.filter((item: { uid: any }) => item.uid !== file.uid);
          const newImgList = imgList.filter((item: { uid: any }) => item.uid !== file.uid);
          if (saveFileList) {
            saveFileList(newFileList, fileType);
          }
          if (saveImgList) {
            saveImgList(newFileList, fileType);
          }
          if (delFile) {
            delFile(file);
          }
          return {
            fileList: newFileList,
            imgList: newImgList
          };
        });
      },
      // eslint-disable-next-line
      fileList: this.state.imgList,
      listType: boxType || 'picture-card',
      multiple,
      disabled: disabled,
      selectText: selectText || '选择文件'
    };
    return (
      <div className="theling_upload">
        <Upload {...options}>{this.state.imgList.length >= maxNum ? null : uploadButton}</Upload>
        <Modal open={previewVisible} footer={null} onCancel={this.handleCancel} width="60%">
          <img alt="预览" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default FileUpload;
