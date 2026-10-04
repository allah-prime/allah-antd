export const actionLogs = [
  {
    id: 1,
    operator: '张三',
    action: '提交了项目申请',
    status: 'success',
    remark: '申请内容完整',
    timestamp: '2025-06-01 09:00',
    details: [
      {
        id: 11,
        content: '填写申请表单',
        status: 'success',
        remark: '无遗漏',
        timestamp: '2025-06-01 08:50'
      },
      {
        id: 12,
        content: '上传附件',
        status: 'success',
        remark: '材料齐全',
        timestamp: '2025-06-01 08:55'
      }
    ]
  },
  {
    id: 2,
    operator: '李四',
    action: '审核通过',
    status: 'success',
    remark: '同意立项',
    timestamp: '2025-06-01 10:30',
    details: [
      {
        id: 21,
        content: '初审',
        status: 'success',
        remark: '无异议',
        timestamp: '2025-06-01 10:10'
      },
      {
        id: 22,
        content: '复审',
        status: 'success',
        remark: '通过',
        timestamp: '2025-06-01 10:25'
      }
    ]
  },
  {
    id: 3,
    operator: '王五',
    action: '分配任务',
    status: 'info',
    remark: '分配给开发组',
    timestamp: '2025-06-02 14:20',
    details: [
      {
        id: 31,
        content: '分配前端开发',
        status: 'info',
        remark: '已通知',
        timestamp: '2025-06-02 14:10'
      },
      {
        id: 32,
        content: '分配后端开发',
        status: 'info',
        remark: '已通知',
        timestamp: '2025-06-02 14:15'
      }
    ]
  },
  {
    id: 4,
    operator: '赵六',
    action: '开发中',
    status: 'processing',
    remark: '预计一周完成',
    timestamp: '2025-06-03 11:00',
    details: [
      {
        id: 41,
        content: '前端页面开发',
        status: 'processing',
        remark: '进行中',
        timestamp: '2025-06-03 11:00'
      },
      {
        id: 42,
        content: '后端接口开发',
        status: 'processing',
        remark: '进行中',
        timestamp: '2025-06-03 11:00'
      }
    ]
  },
  {
    id: 5,
    operator: '张三',
    action: '测试未通过',
    status: 'fail',
    remark: '发现2个bug',
    timestamp: '2025-06-10 16:45',
    details: [
      {
        id: 51,
        content: '功能A测试',
        status: 'fail',
        remark: '报错',
        timestamp: '2025-06-10 16:30'
      },
      {
        id: 52,
        content: '功能B测试',
        status: 'fail',
        remark: '数据异常',
        timestamp: '2025-06-10 16:35'
      }
    ]
  },
  {
    id: 6,
    operator: '李四',
    action: '修复bug',
    status: 'success',
    remark: '已修复并回归测试',
    timestamp: '2025-06-12 09:30',
    details: [
      {
        id: 61,
        content: '修复功能A',
        status: 'success',
        remark: '已验证',
        timestamp: '2025-06-12 09:10'
      },
      {
        id: 62,
        content: '修复功能B',
        status: 'success',
        remark: '已验证',
        timestamp: '2025-06-12 09:20'
      }
    ]
  }
];
