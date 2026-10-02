import { CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { Drawer, Select } from 'antd';
import { useState } from 'react';

import './index.less';

const SettingDrawer = ({ ahServerList }: { ahServerList: { path: string; name: string }[] }) => {
  const [show, setShow] = useState(false);

  const saveTestServer = (path: string) => {
    sessionStorage.setItem('testServer', path);
    // 刷新页面
    window.location.reload();
  };

  return (
    <>
      <Drawer
        title="环境配置"
        open={show}
        size={300}
        onClose={() => setShow(false)}
        placement="right"
        rootStyle={{
          zIndex: 999
        }}
        getContainer={false}
      >
        <Select
          defaultValue={window.sessionStorage.getItem('testServer') || '请选择服务器地址'}
          style={{ width: '100%', marginBottom: 20 }}
          onChange={(checked: any) => saveTestServer(checked)}
        >
          {ahServerList &&
            ahServerList.map(item => (
              <Select.Option key={item.path} value={item.path}>
                {item.name}
              </Select.Option>
            ))}
        </Select>
      </Drawer>
      <div
        className="theling_setting_drawer_handle"
        onClick={() => setShow(!show)}
        style={{ right: show ? '300px' : 0 }}
      >
        {show ? (
          <CloseOutlined
            style={{
              color: '#fff',
              fontSize: 20
            }}
          />
        ) : (
          <SettingOutlined
            style={{
              color: '#fff',
              fontSize: 20
            }}
          />
        )}
      </div>
    </>
  );
};

export default SettingDrawer;
