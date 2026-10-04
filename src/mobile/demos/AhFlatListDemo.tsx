import React, { useRef } from 'react';
import { Card, Button, Space } from 'antd';
import { Card as MobileCard } from 'antd-mobile';
import AhFlatList from '../AhFlatList';
import MobileShell from '../MobileShell';
import type { IAhFlatListFunc } from '../AhFlatList/types';

/**
 * 模拟数据接口
 */
interface IListItem {
  id: number;
  title: string;
  content: string;
  createTime: string;
  status: 'pending' | 'processing' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

/**
 * 模拟搜索请求函数
 */
const search = async (params: any): Promise<any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));

  const { pageNum = 1, pageSize = 20, keyword = '' } = params;

  // 模拟数据
  const allData: IListItem[] = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    title: `任务标题 ${index + 1}${keyword ? ` - 包含关键词: ${keyword}` : ''}`,
    content: `这是第 ${index + 1} 个任务的详细内容描述，包含了任务的基本信息和执行要求。`,
    createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: ['pending', 'processing', 'completed'][Math.floor(Math.random() * 3)] as any,
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
  }));

  // 模拟搜索过滤
  const filteredData = keyword
    ? allData.filter(
        item =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.content.toLowerCase().includes(keyword.toLowerCase())
      )
    : allData;

  // 分页处理
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const records = filteredData.slice(startIndex, endIndex);

  return {
    records,
    total: filteredData.length,
    pageNum,
    pageSize,
    pages: Math.ceil(filteredData.length / pageSize)
  };
};

/**
 * 获取状态标签样式
 */
const getStatusStyle = (status: string) => {
  const statusMap = {
    pending: { color: '#faad14', backgroundColor: '#fff7e6', border: '1px solid #ffd666' },
    processing: { color: '#1890ff', backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' },
    completed: { color: '#52c41a', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }
  };
  return statusMap[status as keyof typeof statusMap] || statusMap.pending;
};

/**
 * 获取优先级标签样式
 */
const getPriorityStyle = (priority: string) => {
  const priorityMap = {
    low: { color: '#52c41a', backgroundColor: '#f6ffed' },
    medium: { color: '#faad14', backgroundColor: '#fff7e6' },
    high: { color: '#ff4d4f', backgroundColor: '#fff2f0' }
  };
  return priorityMap[priority as keyof typeof priorityMap] || priorityMap.medium;
};

/**
 * 获取状态中文名称
 */
const getStatusText = (status: string) => {
  const statusTextMap = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成'
  };
  return statusTextMap[status as keyof typeof statusTextMap] || '未知';
};

/**
 * 获取优先级中文名称
 */
const getPriorityText = (priority: string) => {
  const priorityTextMap = {
    low: '低',
    medium: '中',
    high: '高'
  };
  return priorityTextMap[priority as keyof typeof priorityTextMap] || '中';
};

export default () => {
  const pageRef = useRef<IAhFlatListFunc<IListItem, any>>();
  const [refreshData, setRefreshData] = React.useState<IListItem[]>([]);

  /**
   * 手动刷新列表
   */
  const handleRefresh = () => {
    pageRef.current?.refresh();
  };

  /**
   * 获取列表数据
   */
  const handleGetData = () => {
    const data = pageRef.current?.getListData() || [];
    setRefreshData(data);
    console.log('当前列表数据:', data);
  };

  /**
   * 更新单条数据示例
   */
  const handleUpdateItem = () => {
    const data = pageRef.current?.getListData() || [];
    if (data.length > 0) {
      const updatedItem = {
        ...data[0],
        title: `${data[0].title} - 已更新`,
        status: 'completed' as const
      };
      pageRef.current?.updateOneData(updatedItem);
    }
  };

  return (
    <div>
      {/* 控制按钮区域 */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 500 }}>列表操作控制</div>
        <Space>
          <Button type="primary" onClick={handleRefresh}>
            刷新列表
          </Button>
          <Button onClick={handleGetData}>获取数据</Button>
          <Button onClick={handleUpdateItem}>更新首项</Button>
        </Space>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          backgroundColor: '#f5f5f5'
        }}
      >
        {/* 左侧手机壳 */}
        <MobileShell title="列表示例">
          <AhFlatList
            containerHeight={600}
            pageRef={pageRef}
            request={search}
            defParams={{ pageSize: 10, pageNum: 1 }}
            searchForm={{
              show: true,
              placeholder: '搜索任务标题或内容...',
              showCancelButton: true
            }}
            itemRender={(item: IListItem, index: number) => (
              <MobileCard
                key={item.id}
                style={{
                  margin: '8px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ padding: '12px' }}>
                  {/* 标题和状态 */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: 500,
                        flex: 1,
                        marginRight: '8px'
                      }}
                    >
                      {item.title}
                    </h4>
                    <span
                      style={{
                        ...getStatusStyle(item.status),
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>

                  {/* 内容 */}
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      color: '#666',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}
                  >
                    {item.content}
                  </p>

                  {/* 底部信息 */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12px',
                      color: '#999'
                    }}
                  >
                    <span>创建时间: {item.createTime}</span>
                    <span
                      style={{
                        ...getPriorityStyle(item.priority),
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      优先级: {getPriorityText(item.priority)}
                    </span>
                  </div>
                </div>
              </MobileCard>
            )}
            backgroundColor="#f5f5f5"
            debounceTime={300}
            showSearchInput
          />
        </MobileShell>

        {/* 右侧数据预览区域 */}
        <div
          style={{
            flex: 1,
            maxWidth: '450px',
            height: '822px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* 列表数据预览 */}
          <Card
            title="📋 列表数据预览"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
            styles={{
              body: {
                flex: 1,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column'
              }
            }}
          >
            <div
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                padding: '12px',
                overflow: 'auto',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '12px',
                lineHeight: '1.5',
                height: 300
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {refreshData.length > 0
                  ? JSON.stringify(refreshData, null, 2)
                  : '// 点击"获取数据"按钮，当前列表数据将在此处显示\n{\n  "message": "等待获取数据..."\n}'}
              </pre>
            </div>
          </Card>

          {/* 使用说明 */}
          <Card
            title="📖 使用说明"
            styles={{
              body: {
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.6'
              }
            }}
          >
            <div
              style={{
                height: 300,
                overflow: 'auto'
              }}
            >
              <p>
                <strong>功能特性：</strong>
              </p>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>支持下拉刷新和上拉加载更多</li>
                <li>支持搜索功能，实时过滤数据</li>
                <li>支持手动刷新和数据更新</li>
                <li>移动端优化的交互体验</li>
              </ul>
              <p>
                <strong>操作提示：</strong>
              </p>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                <li>在搜索框中输入关键词进行搜索</li>
                <li>下拉列表可以刷新数据</li>
                <li>滚动到底部自动加载更多</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
