import { LockOutlined, QuestionOutlined, UserOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, message, Row } from 'antd';
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import './index.less';
import { IPasswordLoginProps } from '../interface/component';

const PasswordLogin: React.FC<IPasswordLoginProps> = ({
  getVerCode,
  showVerCode = false,
  forgotPassword,
  spanStyle,
  style,
  pwdRef,
  rememberPwdTip = '记住密码',
  usernamePlaceholder = '用户名',
  inputStyle
}) => {
  const [verCode, setVerCode] = useState<string>('');

  /**
   * 获取新的验证码
   */
  const getNewVerCode = useCallback(async () => {
    if (showVerCode && getVerCode) {
      try {
        const res = await getVerCode();
        setVerCode(res);
      } catch (e) {
        message.error('获取验证码失败');
      }
    }
  }, [showVerCode, getVerCode]);

  useEffect(() => {
    getNewVerCode();
  }, [getNewVerCode]);

  useImperativeHandle(pwdRef, () => ({
    refreshVerCode: getNewVerCode
  }));

  return (
    <div style={style}>
      <Form.Item
        name="data1"
        rules={[{ required: true, message: `请输入您的${usernamePlaceholder}！` }]}
      >
        <Input
          style={inputStyle}
          prefix={<UserOutlined />}
          placeholder={usernamePlaceholder}
          size="large"
        />
      </Form.Item>
      <Form.Item name="data2" rules={[{ required: true, message: '请输入密码!' }]}>
        <Input
          style={inputStyle}
          prefix={<LockOutlined />}
          type="password"
          placeholder="密码"
          size="large"
        />
      </Form.Item>
      {showVerCode && (
        <Row gutter={8}>
          <Col flex="auto">
            <Form.Item name="data3" rules={[{ required: true, message: '请输入验证码!' }]}>
              <Input
                style={inputStyle}
                prefix={<QuestionOutlined />}
                placeholder="验证码"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col flex="none">
            <div
              onClick={getNewVerCode}
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <img
                style={{ width: 104, height: 40, display: 'block' }}
                alt="验证码"
                src={verCode}
              />
            </div>
          </Col>
        </Row>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Form.Item name="data4" valuePropName="checked" noStyle>
          <Checkbox>
            <span style={spanStyle}>{rememberPwdTip}</span>
          </Checkbox>
        </Form.Item>
        {forgotPassword && (
          <span onClick={forgotPassword} className="theling_login_form_forgot">
            忘记密码
          </span>
        )}
      </div>
    </div>
  );
};

export default PasswordLogin;
