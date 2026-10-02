import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import type { ISysDisFilter, ISysDistrict } from '../../theling-utils/@types/ISystem';
import type { IOptions6, IOptions7 } from '../../theling-utils/@types/IZlData';
import { useRequest } from 'ahooks';
import { Button, Empty, message, Popover, Tag } from 'antd';
import lodash from 'lodash';
import React, { useEffect, useState } from 'react';
import ListSearch from '../ListGroup/ListSearch';
import AhAntdConfig from '../utils/AhAntdConfig';
import AsyncCascader from '../AsyncCascader';
import AhPageContent from '../AhPage/AhPageContent';
import { IAhPageContentProps } from '../ahAntdTypes';
import type { IAreaTableProps } from './interface';

export const AreaRenderItems: React.FC<{ data: ISysDistrict[] }> = ({ data }) => {
  const [showList, setShowList] = React.useState<IOptions7<string>[]>([]);

  const diffStr = data.length;

  useEffect(() => {
    const newShowList: IOptions7<string>[] = data.map((item) => ({
      label: item.disName,
      value: item.adminCode,
      key: item.adminCode
    }));
    setShowList(newShowList);
  }, [diffStr]);

  if (data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  return <ListSearch options={showList} optionsStyle={{ height: 140 }} />;
};
/**
 * 处理地区码
 * @param value 新的值
 */
export const handleAdminCode = (
  value: string[]
): { allowArea: string[]; selectKeyList: string[] } => {
  const allowArea = [];
  const selectKeyList = [];
  for (let i = 0; i < value?.length; i++) {
    if (value[i].endsWith('0000')) {
      // 禁用其他地区
      allowArea.push(value[i].substring(0, 2));
    }
    // 选择区域时 删除 已选择的全国
    if (selectKeyList.indexOf('000000') > -1) {
      // 删除 全国
      selectKeyList.splice(selectKeyList.indexOf('000000'), 1);
    }
    selectKeyList.push(value[i]);
  }
  return {
    allowArea,
    selectKeyList
  };
};

const emptyReq: () => Promise<IOptions6<string>[]> = () => Promise.resolve([]);

const defFilter: ISysDisFilter = {
  pageNum: 1,
  keyword: undefined,
  pcode: undefined,
  depType: undefined,
  otherProperty: undefined,
  searchType: undefined,
  adminCode: undefined
};

/**
 * 地区选择组件，这个地区选择，可以互斥数据
 * @constructor
 */
const AreaTable: React.FC<IAreaTableProps> = (props) => {
  const {
    disabledAdminCodes = [],
    value = [],
    onItemListChange,
    onChange,
    valueList = [],
    scrollY = 640,
    defAdminCode,
    mutex = true,
    showAreaSelector = true,
    single = false
  } = props;
  const [backupsParams, setBackupsParams] = React.useState<ISysDisFilter>({
    pageNum: 1
  });
  const [selectKeyList, setSelectKeyList] = React.useState<string[]>(value);
  const [selectObjList, setSelectObjList] = React.useState<ISysDistrict[]>(valueList);

  // 禁用的地区
  const [allowArea, setAllowArea] = React.useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const [selectAllLoading, setSelectAllLoading] = useState(false);

  // 页面的ref
  const pageRef: IAhPageContentProps<ISysDistrict, any>['pageRef'] = React.useRef(undefined);

  // 一些配置信息
  const selectAllData = props.selectAllData || AhAntdConfig.getAreaReq().selectAllData;
  const getTableData = props.selectTableData || AhAntdConfig.getAreaReq().getTableData;
  const asyncTreeData = props.asyncTreeData || AhAntdConfig.getAreaReq().asyncTreeData;
  const disTypeOptReq = props.disTypeOptReq || AhAntdConfig.getAreaReq().disTypeOptReq || emptyReq;

  const disTypeOpt = useRequest(disTypeOptReq);

  const effectStr = value?.join(',');

  useEffect(() => {
    // 当值发生变化的时候，重新设置值
    const res = handleAdminCode(value);
    setSelectKeyList(res.selectKeyList);
    setSelectObjList([...valueList]);
    setAllowArea(res.allowArea);
  }, [effectStr]);

  const removeItem = (item: ISysDistrict) => {
    if (item.adminCode.endsWith('0000') && mutex) {
      // 禁用其他地区
      lodash.pull(allowArea, item.adminCode.substring(0, 2));
      setAllowArea(allowArea);
    }
    const number = selectKeyList.indexOf(item.adminCode);
    // 再从selectKeyList中移除
    selectKeyList.splice(number, 1);
    selectObjList.splice(number, 1);
    setSelectKeyList([...selectKeyList]);
    setSelectObjList([...selectObjList]);
    onChange?.(selectKeyList);
    onItemListChange?.(selectKeyList, selectObjList);
  };

  const selectAll = async () => {
    if (isSelectAll) {
      // 取消全选
      setSelectKeyList([]);
      setSelectObjList([]);
      setIsSelectAll(false);
      setAllowArea([]);
      onChange?.([]);
    } else {
      const newParam = { ...backupsParams };
      newParam.pageNum = -1;
      if (Object.keys(backupsParams).length < 2) {
        message.warning('请筛选后，再进行全选操作');
        return;
      }
      setSelectAllLoading(true);
      let res = [];
      try {
        res = await selectAllData!(newParam);
      } catch (e) {
        message.error('全选失败');
        setSelectAllLoading(false);
        return;
      }
      // 如果res里面没有数据，就提示
      if (res.length === 0) {
        message.warning('没有任何数据可以添加');
        setSelectAllLoading(false);
        return;
      }
      const newList: string[] = [];
      const newObjList: ISysDistrict[] = [];
      // 对数据进行过滤，如果有省的数据，要禁用其他地区的！
      const newAllowArea = [...allowArea];
      // 先得到全部的省级数据
      res.forEach((item: any) => {
        // 如果是省级的
        if (item.adminCode.endsWith('0000') && mutex) {
          // 禁用其他地区
          newAllowArea.push(item.adminCode.substring(0, 2));
          newList.push(item.adminCode);
          newObjList.push(item);
        }
      });
      // 删除省下面的数据
      res.forEach((item: any) => {
        const s = item.adminCode.substring(0, 2);
        if (!newAllowArea.includes(s)) {
          newList.push(item.adminCode);
          newObjList.push(item);
        }
      });
      setAllowArea(allowArea);
      setSelectKeyList(newList);
      setSelectObjList(newObjList);
      onChange?.(newList);
      onItemListChange?.(newList, newObjList);
      message.success(`已添加全部${newList.length}个地区`);
      setSelectAllLoading(false);
      setIsSelectAll(true);
    }
  };

  const addItem = (item: ISysDistrict) => {
    if (selectAllLoading) {
      message.error('正在进行全选操作，请稍后');
      return;
    }

    if (single) {
      // 单选模式：直接替换现有选择
      const newList = [item.adminCode];
      const newObjList = [item];
      setSelectKeyList(newList);
      setSelectObjList(newObjList);
      setAllowArea(item.adminCode.endsWith('0000') ? [item.adminCode.substring(0, 2)] : []);
      onChange?.(newList);
      onItemListChange?.(newList, newObjList);
      return;
    }

    if (item.adminCode.endsWith('0000') && mutex) {
      // 禁用其他地区
      allowArea.push(item.adminCode.substring(0, 2));
      setAllowArea(allowArea);
    }
    // 选择区域时 删除 已选择的全国
    if (selectKeyList.indexOf('000000') > -1) {
      const number = selectKeyList.indexOf('000000');
      // 删除 全国
      selectKeyList.splice(number, 1);
      selectObjList.splice(number, 1);
    }
    const newList = [...selectKeyList, item.adminCode];
    const newObjList = [...selectObjList, item];
    setSelectKeyList(newList);
    setSelectObjList(newObjList);
    onChange?.(newList);
    onItemListChange?.(newList, newObjList);
  };

  // 判断是否禁用
  const openDisabledAdd = (item: ISysDistrict) => {
    if (!mutex) {
      return false;
    }
    let newAllowArea = [...allowArea];
    if (selectKeyList.length > 0 && allowArea.length === 0) {
      newAllowArea = selectKeyList
        .filter((s) => s.endsWith('0000'))
        .map((si) => si.substring(0, 2));
    }
    const subAc = item.adminCode.substring(0, 2);
    if (selectKeyList.length === 0 && allowArea.length > 0) {
      setAllowArea([]);
    }
    if (item.adminCode.endsWith('0000')) {
      // 先看看里面还有这个ac的不
      const subAcList = selectKeyList?.filter((ac) => ac.startsWith(subAc));
      // 如果没有的话，继续禁用
      return subAcList?.length !== 0;
    }
    return newAllowArea.includes(subAc);
  };

  return (
    <AhPageContent<ISysDistrict, ISysDisFilter>
      containerHeight={scrollY}
      defParams={{
        ...defFilter,
        pageNum: 1,
        pageSize: 20,
        adminCode: defAdminCode,
        pcode: props.defPcode
      }}
      searchLayout="card"
      style={{
        minHeight: 582,
        minWidth: 760
      }}
      tableProps={{
        autoPagination: false,
        pagination: false
      }}
      pageRef={pageRef}
      rowKey="adminCode"
      request={async (p2) => {
        if (p2.adminCodes) {
          p2.adminCode = p2.adminCodes[p2.adminCodes.length - 1];
        }
        const res = await getTableData!({
          ...p2,
          pageNum: p2.current!
        });
        setBackupsParams(p2);
        return res;
      }}
      searchContentProps={{
        showExpand: false
      }}
      searchForm={[
        showAreaSelector ? (
          <ProForm.Item name="adminCodes" key={0}>
            <AsyncCascader
              label="地区"
              key="adminCode"
              asyncReq={(v = defAdminCode) => asyncTreeData!(v)}
            />
          </ProForm.Item>
        ) : null,
        <ProFormSelect
          key="disType"
          label="层级"
          fieldProps={
            {
              popupMatchSelectWidth: 170,
              options: disTypeOpt.data || []
            } as any
          }
          name="disType"
        />,
        <ProFormSelect
          key="otherProperty"
          label="额外属性"
          fieldProps={{
            popupMatchSelectWidth: 170,
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '自贸区',
                value: 'fta'
              }
            ]
          }}
          name="otherProperty"
        />,
        <Popover
          key="click"
          content={<AreaRenderItems data={selectObjList} />}
          title="已选区域"
          trigger="click"
        >
          <Tag style={{ marginLeft: 2 }}>
            已选
            {selectKeyList?.length || 0}
            个区域
          </Tag>
        </Popover>,
        !single ? (
          <Tag key="selectAll" onClick={selectAll}>
            {selectAllLoading ? '获取数据中...' : isSelectAll ? '清除全部' : '全选'}
          </Tag>
        ) : null
      ]}
      columns={[
        {
          title: '地区编码',
          dataIndex: 'adminCode',
          width: 120
        },
        {
          title: '地区名称',
          dataIndex: 'disName'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          width: 100,
          render: (text, item) => (
            <>
              {selectKeyList.includes(item.adminCode) ? (
                <Button
                  danger
                  size="small"
                  onClick={() => removeItem(item)}
                  disabled={disabledAdminCodes.includes(item.adminCode)}
                >
                  移除
                </Button>
              ) : (
                <Button
                  disabled={openDisabledAdd(item) || item.adminCode === '000000'}
                  type="primary"
                  size="small"
                  onClick={() => addItem(item)}
                >
                  添加
                </Button>
              )}
            </>
          )
        }
      ]}
    />
  );
};

export default AreaTable;
