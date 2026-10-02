/* eslint-disable @typescript-eslint/no-explicit-any */
export const dataRequest = async () => {
  // 模拟网络延迟
  return new Promise<any>(resolve => {
    setTimeout(() => {
      resolve({
        mealTimes: '2',
        quantity: 51,
        remarks: '留样完整，符合标准要求',
        mealPeople: 'lisi',
        dishes: 'sweet_sour_pork',
        sampleDate: '2024-01-15',
        sampleTime: '18:30',
        recordDateTime: '2024-01-15 18:30:00',
        isQualified: 'ok',
        area: ['beijing', 'chaoyang', 'sanlitun'],
        temperature: '6.5',
        dinnerNote: '今日晚餐为特色菜品，请注意保温',
        uploadedFiles: []
      });
    }, 1500); // 1.5秒延迟
  });
};

// 异步的 columns 数据
export const columnsReq = async () => {
  return new Promise<any[]>(resolve => {
    setTimeout(() => {
      resolve([
        {
          title: '基础信息',
          attrInfo: {
            id: '7ef0b759acdada46f4a9d01a0a85b20629fe',
            attType: 'title',
            attLabel: '基础信息',
            verRules: null,
            filedName: null,
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: '7ef0b759acdada46f4a9d01a0a85b20629fe',
          valueType: 'title',
          fieldProps: {
            placeholder: '请输入基础信息'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: []
          }
        },
        {
          title: '设备维护记录类型',
          attrInfo: {
            id: 'maintenanceType',
            attType: 'select',
            attLabel: '设备维护记录类型',
            verRules: [
              {
                type: 'array',
                required: true
              }
            ],
            filedName: 'maintenanceType',
            dicGroupMap: 'cycm_device_maintenance_record_maintenance_type_5432'
          },
          busiScene: null,
          dataIndex: 'maintenanceType',
          valueType: 'select',
          fieldProps: {
            options: [
              {
                key: '1',
                icon: null,
                text: '防尘设施',
                color: null,
                label: '防尘设施',
                other: null,
                value: '1',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '2',
                icon: null,
                text: '三防设施',
                color: null,
                label: '三防设施',
                other: null,
                value: '2',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '3',
                icon: null,
                text: '废弃物存放设施',
                color: null,
                label: '废弃物存放设施',
                other: null,
                value: '3',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '4',
                icon: null,
                text: '液化气瓶',
                color: null,
                label: '液化气瓶',
                other: null,
                value: '4',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '5',
                icon: null,
                text: '电梯',
                color: null,
                label: '电梯',
                other: null,
                value: '5',
                checked: false,
                disabled: false,
                description: null
              }
            ],
            showSearch: false,
            placeholder: '请选择设备维护记录类型'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '设备名称',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['3'],
                  operator: 'eq'
                }
              ],
              event: 'hide'
            }
          ],
          attrInfo: {
            id: 'deviceName',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['3'],
                    operator: 'eq'
                  }
                ],
                event: 'hide'
              }
            ],
            attType: 'text',
            attLabel: '设备名称',
            verRules: [
              {
                type: 'string',
                required: true
              }
            ],
            filedName: 'deviceName',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'deviceName',
          valueType: 'text',
          fieldProps: {
            placeholder: '请输入'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '末次检验日期',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['3'],
                  connect: 'and',
                  operator: 'eq'
                }
              ],
              event: 'hide'
            }
          ],
          attrInfo: {
            id: 'lastInspectionDate',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['3'],
                    connect: 'and',
                    operator: 'eq'
                  }
                ],
                event: 'hide'
              }
            ],
            attType: 'date',
            attLabel: '末次检验日期',
            verRules: [
              {
                required: true
              }
            ],
            filedName: 'lastInspectionDate',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'lastInspectionDate',
          valueType: 'date',
          fieldProps: {
            placeholder: '请选择'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '用途',
          attrInfo: {
            id: 'c36a475922d0f24cba288272f17aabfd56d3',
            rules: null,
            attType: 'checkbox',
            attLabel: '用途',
            verRules: [
              {
                type: 'array',
                required: true
              }
            ],
            filedName: 'purpose',
            dicGroupMap: 'cycm_additive_usage_purpose_1651'
          },
          busiScene: null,
          dataIndex: 'purpose',
          valueType: 'checkbox',
          fieldProps: {
            options: [
              {
                key: '1',
                icon: null,
                text: '增稠剂',
                color: null,
                label: '增稠剂',
                other: null,
                value: '1',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '2',
                icon: null,
                text: '着色剂',
                color: null,
                label: '着色剂',
                other: null,
                value: '2',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '3',
                icon: null,
                text: '甜味剂',
                color: null,
                label: '甜味剂',
                other: null,
                value: '3',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '4',
                icon: null,
                text: '增味剂',
                color: null,
                label: '增味剂',
                other: null,
                value: '4',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '5',
                icon: null,
                text: '乳化剂',
                color: null,
                label: '乳化剂',
                other: null,
                value: '5',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '6',
                icon: null,
                text: '被膜剂',
                color: null,
                label: '被膜剂',
                other: null,
                value: '6',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '7',
                icon: null,
                text: '抗结剂',
                color: null,
                label: '抗结剂',
                other: null,
                value: '7',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '8',
                icon: null,
                text: '面粉处理剂',
                color: null,
                label: '面粉处理剂',
                other: null,
                value: '8',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '9',
                icon: null,
                text: '防腐剂',
                color: null,
                label: '防腐剂',
                other: null,
                value: '9',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '10',
                icon: null,
                text: '酸度调节剂',
                color: null,
                label: '酸度调节剂',
                other: null,
                value: '10',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '11',
                icon: null,
                text: '稳定剂',
                color: null,
                label: '稳定剂',
                other: null,
                value: '11',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '12',
                icon: null,
                text: '凝固剂',
                color: null,
                label: '凝固剂',
                other: null,
                value: '12',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '13',
                icon: null,
                text: '水分保持剂',
                color: null,
                label: '水分保持剂',
                other: null,
                value: '13',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '14',
                icon: null,
                text: '抗氧化剂',
                color: null,
                label: '抗氧化剂',
                other: null,
                value: '14',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '15',
                icon: null,
                text: '膨松剂',
                color: null,
                label: '膨松剂',
                other: null,
                value: '15',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '16',
                icon: null,
                text: '漂白剂',
                color: null,
                label: '漂白剂',
                other: null,
                value: '16',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '17',
                icon: null,
                text: '护色剂',
                color: null,
                label: '护色剂',
                other: null,
                value: '17',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '18',
                icon: null,
                text: '胶姆糖基础剂',
                color: null,
                label: '胶姆糖基础剂',
                other: null,
                value: '18',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '19',
                icon: null,
                text: '固化剂',
                color: null,
                label: '固化剂',
                other: null,
                value: '19',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '20',
                icon: null,
                text: '其他',
                color: null,
                label: '其他',
                other: null,
                value: '20',
                checked: false,
                disabled: false,
                description: null
              }
            ],
            showSearch: false,
            placeholder: '请选择用途'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '维护内容',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['1', '2'],
                  connect: 'start',
                  operator: 'in'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'maintenanceContent',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['1', '2'],
                    connect: 'start',
                    operator: 'in'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'textarea',
            attLabel: '维护内容',
            verRules: [
              {
                type: 'string',
                required: true
              }
            ],
            filedName: 'maintenanceContent',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'maintenanceContent',
          valueType: 'textarea',
          fieldProps: {
            placeholder: '请输入'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '充装单位',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['4'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'fillingUnit',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['4'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'textarea',
            attLabel: '充装单位',
            verRules: [
              {
                type: 'string',
                required: true
              }
            ],
            filedName: 'fillingUnit',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'fillingUnit',
          valueType: 'textarea',
          fieldProps: {
            placeholder: '请输入'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '充装单位地址',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['4'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'fillingUnitAddress',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['4'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'textarea',
            attLabel: '充装单位地址',
            verRules: [
              {
                type: 'string',
                required: true
              }
            ],
            filedName: 'fillingUnitAddress',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'fillingUnitAddress',
          valueType: 'textarea',
          fieldProps: {
            placeholder: '请输入'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '气瓶重量（kg）',
          zlRules: [
            {
              all: [
                {
                  fact: '23262c0a91c4294ae2986f29a6372dc67bad',
                  type: 'select',
                  value: ['4'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'cylinderWeight',
            rules: [
              {
                all: [
                  {
                    fact: '23262c0a91c4294ae2986f29a6372dc67bad',
                    type: 'select',
                    value: ['4'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'digit',
            attLabel: '气瓶重量（kg）',
            verRules: [
              {
                type: 'number',
                required: true
              }
            ],
            filedName: 'cylinderWeight',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'cylinderWeight',
          valueType: 'digit',
          fieldProps: {
            placeholder: '请填写气瓶重量（kg）'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '是否食梯',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['5'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'isFoodLadder',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['5'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'radio',
            attLabel: '是否食梯',
            verRules: [
              {
                required: true
              }
            ],
            filedName: 'isFoodLadder',
            dicGroupMap: 'boolean'
          },
          busiScene: null,
          dataIndex: 'isFoodLadder',
          valueType: 'radio',
          fieldProps: {
            options: [
              {
                key: '1',
                icon: null,
                text: '是',
                color: null,
                label: '是',
                other: null,
                value: '1',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '0',
                icon: null,
                text: '否',
                color: null,
                label: '否',
                other: null,
                value: '0',
                checked: false,
                disabled: false,
                description: null
              }
            ],
            showSearch: false,
            placeholder: '请选择是否食梯'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '电梯维保单位',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['5'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'singleMaintenanceUnit',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['5'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'textarea',
            attLabel: '电梯维保单位',
            verRules: [
              {
                type: 'string',
                required: true
              }
            ],
            filedName: 'singleMaintenanceUnit',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'singleMaintenanceUnit',
          valueType: 'textarea',
          fieldProps: {
            placeholder: '请输入'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '废弃物分类',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['3'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'wasteCategory',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['3'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'radio',
            attLabel: '废弃物分类',
            verRules: [
              {
                required: true
              }
            ],
            filedName: 'wasteCategory',
            dicGroupMap: 'cycm_device_maintenance_record_waste_category'
          },
          busiScene: null,
          dataIndex: 'wasteCategory',
          valueType: 'radio',
          fieldProps: {
            options: [
              {
                key: '1',
                icon: null,
                text: '一般',
                color: null,
                label: '一般',
                other: null,
                value: '1',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '0',
                icon: null,
                text: '危险',
                color: null,
                label: '危险',
                other: null,
                value: '0',
                checked: false,
                disabled: false,
                description: null
              }
            ],
            showSearch: false,
            placeholder: '请选择废弃物分类'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '存放量',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['3'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'storageAmount',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['3'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'digit',
            attLabel: '存放量',
            verRules: [
              {
                type: 'number',
                required: true
              }
            ],
            filedName: 'storageAmount',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'storageAmount',
          valueType: 'digit',
          fieldProps: {
            placeholder: '请输入'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '清理日期',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['3'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'lastInspectionDate',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['3'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'date',
            attLabel: '清理日期',
            verRules: [
              {
                required: true
              }
            ],
            filedName: 'lastInspectionDate',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'lastInspectionDate',
          valueType: 'date',
          fieldProps: {
            placeholder: '请选择'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '清理人',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['3'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'cleanerName',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['3'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'textarea',
            attLabel: '清理人',
            verRules: [
              {
                type: 'string',
                required: true
              }
            ],
            filedName: 'cleanerName',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'cleanerName',
          valueType: 'textarea',
          fieldProps: {
            placeholder: '请输入'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '气瓶报废时间',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['4'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'cylinderScrapDate',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['4'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'date',
            attLabel: '气瓶报废时间',
            verRules: [
              {
                required: true
              }
            ],
            filedName: 'cylinderScrapDate',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'cylinderScrapDate',
          valueType: 'date',
          fieldProps: {
            placeholder: '请选择'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '设备照片',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['4'],
                  connect: 'start',
                  operator: 'eq'
                }
              ],
              event: 'show'
            }
          ],
          attrInfo: {
            id: 'c_40',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['4'],
                    connect: 'start',
                    operator: 'eq'
                  }
                ],
                event: 'show'
              }
            ],
            attType: 'image',
            attLabel: '设备照片',
            verRules: [
              {
                required: true
              }
            ],
            filedName: 'c_40',
            dicGroupMap: null
          },
          busiScene: 'c_40',
          dataIndex: 'c_40',
          valueType: 'image',
          fieldProps: {
            accept: 'image/jpg,image/jpeg,image/png',
            fileSize: 10485760,
            multiple: true,
            busiScene: 'c_40',
            permission: 2,
            placeholder: '请确认上传的文件资料的非涉密文件资料'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '运行状态',
          zlRules: [
            {
              all: [
                {
                  fact: 'maintenanceType',
                  type: 'select',
                  value: ['3'],
                  connect: 'and',
                  operator: 'eq'
                }
              ],
              event: 'hide'
            }
          ],
          attrInfo: {
            id: 'operationStatus',
            rules: [
              {
                all: [
                  {
                    fact: 'maintenanceType',
                    type: 'select',
                    value: ['3'],
                    connect: 'and',
                    operator: 'eq'
                  }
                ],
                event: 'hide'
              }
            ],
            attType: 'radio',
            attLabel: '运行状态',
            verRules: [
              {
                required: true
              }
            ],
            filedName: 'operationStatus',
            dicGroupMap: 'cycm_device_maintenance_record_operation_status'
          },
          busiScene: null,
          dataIndex: 'operationStatus',
          valueType: 'radio',
          fieldProps: {
            options: [
              {
                key: '1',
                icon: null,
                text: '正常',
                color: null,
                label: '正常',
                other: null,
                value: '1',
                checked: false,
                disabled: false,
                description: null
              },
              {
                key: '2',
                icon: null,
                text: '异常',
                color: null,
                label: '异常',
                other: null,
                value: '2',
                checked: false,
                disabled: false,
                description: null
              }
            ],
            showSearch: false,
            placeholder: '请选择运行状态'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        },
        {
          title: '下次检验日期',
          attrInfo: {
            id: 'nextInspectionDate',
            attType: 'date',
            attLabel: '下次检验日期',
            verRules: [
              {
                required: true
              }
            ],
            filedName: 'nextInspectionDate',
            dicGroupMap: null
          },
          busiScene: null,
          dataIndex: 'nextInspectionDate',
          valueType: 'date',
          fieldProps: {
            placeholder: '请选择'
          },
          defaultValue: null,
          renderFunKey: null,
          formItemProps: {
            rules: [
              {
                required: true
              }
            ]
          }
        }
      ]);
    }, 1500); // 1.5秒延迟
  });
};
