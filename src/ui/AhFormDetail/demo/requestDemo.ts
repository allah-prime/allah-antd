import { IFormColumns } from '@allahjs/utils';
import { FileUpload2BusiScene } from '@allahjs/utils';

export const dataRequest = async () => {
  // 模拟网络延迟
  return new Promise<any>(resolve => {
    setTimeout(() => {
      resolve({
        id: '1968262211751251969',
        title: 'ert',
        maintenanceType: 2,
        deviceName: '测试2',
        lastInspectionDate: 1758104795000,
        maintenanceContent: 'sss',
        cleanerName: 'fdz',
        operationStatus: 0,
        nextInspectionDate: 1758191209000,
        wasteCategory: null,
        storageAmount: null,
        fillingUnit: null,
        fillingUnitAddress: null,
        cylinderWeight: null,
        cylinderScrapDate: null,
        isFoodLadder: null,
        singleMaintenanceUnit: null,
        creTime: 1758105254000,
        updateTime: 1758856087000,
        mark: null,
        shopId: '45e4e0d8e711b9787da3f0187fd2933f',
        userId: 'ad1707e30d802937919889ccb1ad6e07',
        shopName: null,
        entName: null,
        userName: null,
        maintenanceTypeText: '三防设施'
      });
    }, 100); // 1.5秒延迟
  });
};

// 异步的 columns 数据
export const columnsReq = async () => {
  return new Promise<IFormColumns[]>(resolve => {
    setTimeout(() => {
      resolve([
        {
          title: '设备维护记录类型',
          dataIndex: 'maintenanceTypeText'
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '^(?!3$).*',
              required: true
            }
          ]
        },
        {
          title: '末次检验日期',
          dataIndex: 'lastInspectionDate',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '^(?!3$).*',
              required: true
            }
          ]
        },
        {
          title: '清理日期',
          dataIndex: 'lastInspectionDate',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '3',
              required: true
            }
          ]
        },
        {
          title: '维护内容',
          dataIndex: 'maintenanceContent',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '1|2',
              required: true
            }
          ]
        },
        {
          title: '运行状态',
          dataIndex: 'operationStatus',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '^(?!3$).*',
              required: true
            }
          ]
        },
        {
          title: '下次检验日期',
          dataIndex: 'nextInspectionDate'
        },
        {
          title: '废弃物分类',
          dataIndex: 'wasteCategory',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '3',
              required: true
            }
          ]
        },
        {
          title: '存放量',
          dataIndex: 'storageAmount',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '3',
              required: true
            }
          ]
        },
        {
          title: '清理人',
          dataIndex: 'cleanerName',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '3',
              required: true
            }
          ]
        },
        {
          title: '充装单位',
          dataIndex: 'fillingUnit',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '4',
              required: true
            }
          ]
        },
        {
          title: '充装单位地址',
          dataIndex: 'fillingUnitAddress',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '4',
              required: true
            }
          ]
        },
        {
          title: '气瓶重量(kg)',
          dataIndex: 'cylinderWeight',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '4',
              required: true
            }
          ]
        },
        {
          title: '设备照片',
          busiScene: FileUpload2BusiScene.CYCM_ADDITIVE_USE_REVIEW_SIGN,
          dataIndex: 'id',
          valueType: 'image',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '4',
              required: true
            }
          ]
        },
        {
          title: '气瓶报废时间',
          dataIndex: 'cylinderScrapDate',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '4',
              required: true
            }
          ]
        },
        {
          title: '是否食梯',
          dataIndex: 'isFoodLadder',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '5',
              required: true
            }
          ]
        },
        {
          title: '电梯维保单位',
          dataIndex: 'singleMaintenanceUnit',
          dependent: [
            {
              show: true,
              field: 'maintenanceType',
              regexp: '5',
              required: true
            }
          ]
        }
      ]);
    }, 100); // 1.5秒延迟
  });
};
