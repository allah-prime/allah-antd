import { CopyOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Card,
  Cascader,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tooltip
} from 'antd';
import { useEffect, useState } from 'react';
import SoleButton from '../../utils/SoleButton';
import AhEditModal from '../../AhEditModal';
import FormContent from '../../AhEditModal/FormContent';
import AhModal from '../../AhModal';
import { modelSize } from '../..';

const { Option } = Select;

const formRender = () => (
  <>
    <Space.Compact size="large">
      <Row gutter={8}>
        <Col span={5}>
          <Input defaultValue="0571" />
        </Col>
        <Col span={8}>
          <Input defaultValue="26888888" />
        </Col>
      </Row>
    </Space.Compact>
    <br />
    <Space.Compact>
      <Input style={{ width: '20%' }} defaultValue="0571" />
      <Input style={{ width: '30%' }} defaultValue="26888888" />
    </Space.Compact>
    <br />
    <Space.Compact>
      <Input style={{ width: 'calc(100% - 200px)' }} defaultValue="https://ant.design" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <br />
    <Space.Compact>
      <Input
        style={{ width: 'calc(100% - 200px)' }}
        defaultValue="git@github.com:ant-design/ant-design.git"
      />
      <Tooltip title="copy git url">
        <Button icon={<CopyOutlined />} />
      </Tooltip>
    </Space.Compact>
    <br />
    <Space.Compact>
      <Select defaultValue="Zhejiang">
        <Option value="Zhejiang">Zhejiang</Option>
        <Option value="Jiangsu">Jiangsu</Option>
      </Select>
      <Input style={{ width: '50%' }} defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <br />
    <Space.Compact>
      <Input.Search allowClear style={{ width: '40%' }} defaultValue="0571" />
      <Input.Search allowClear style={{ width: '40%' }} defaultValue="26888888" />
    </Space.Compact>
    <br />
    <Space.Compact>
      <Select defaultValue="Option1">
        <Option value="Option1">Option1</Option>
        <Option value="Option2">Option2</Option>
      </Select>
      <Input style={{ width: '50%' }} defaultValue="input content" />
      <InputNumber />
    </Space.Compact>
    <br />
    <Space.Compact>
      <Select defaultValue="Option1-1">
        <Option value="Option1-1">Option1-1</Option>
        <Option value="Option1-2">Option1-2</Option>
      </Select>
      <Select defaultValue="Option2-2">
        <Option value="Option2-1">Option2-1</Option>
        <Option value="Option2-2">Option2-2</Option>
      </Select>
    </Space.Compact>
    <br />
    <Space.Compact>
      <Select defaultValue="1">
        <Option value="1">Between</Option>
        <Option value="2">Except</Option>
      </Select>
      <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
      <Input
        className="site-input-split"
        style={{
          width: 30,
          borderLeft: 0,
          borderRight: 0,
          pointerEvents: 'none'
        }}
        placeholder="~"
        disabled
      />
      <Input
        className="site-input-right"
        style={{
          width: 100,
          textAlign: 'center'
        }}
        placeholder="Maximum"
      />
    </Space.Compact>
    <br />
    <Space.Compact>
      <Select defaultValue="Sign Up" style={{ width: '30%' }}>
        <Option value="Sign Up">Sign Up</Option>
        <Option value="Sign In">Sign In</Option>
      </Select>
      <AutoComplete
        style={{ width: '70%' }}
        placeholder="Email"
        options={[{ value: 'text 1' }, { value: 'text 2' }]}
      />
    </Space.Compact>
    <br />
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
    <Space.Compact>
      <Select style={{ width: '30%' }} defaultValue="Home">
        <Option value="Home">Home</Option>
        <Option value="Company">Company</Option>
      </Select>
      <Cascader style={{ width: '70%' }} placeholder="Select Address" />
    </Space.Compact>
  </>
);

const AhEditModalDemo = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [width, setWidth] = useState('75%');

  useEffect(() => {
    window.addEventListener('resize', () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 1300) {
        setWidth('75%');
      } else {
        setWidth('90%');
      }
    });
  }, []);

  const [loadingData, setLoadingData] = useState(false);

  const sizeObj = modelSize('middle');

  return (
    <div>
      <Card
        title="测试"
        extra={
          <Button
            onClick={() => {
              setLoadingData(true);
              setVisible(true);
              setTimeout(() => {
                setLoadingData(false);
              }, 3000);
            }}
          >
            弹窗展示
          </Button>
        }
      >
        <Form initialValues={{ title: '许可证名称统一管理' }} onValuesChange={e => console.log(e)}>
          <FormContent
            leftContentRender={null}
            rightRender={null}
            headerRender={null}
            linkButtonRender={[
              <Button size="small" key={1}>
                测试1
              </Button>
            ]}
          />
        </Form>
      </Card>

      <Form>
        <AhEditModal
          width={width}
          height="80vh"
          reqLoading={loadingData}
          onCancel={() => setVisible(false)}
          modalProps={{ open: visible }}
          leftContentRender={formRender()}
          rightRender={formRender()}
          headerRender={<div>sadsadasda</div>}
          linkButtonRender={
            <Space>
              <SoleButton size="small" key={1}>
                测试1
              </SoleButton>
              <SoleButton size="small" key={2}>
                测试1
              </SoleButton>
              <SoleButton size="small" key={3}>
                测试1
              </SoleButton>
              <Button>你好</Button>
            </Space>
          }
        />
      </Form>
      <Divider />
      <Button onClick={() => setVisible2(true)}>弹窗测试1</Button>
      <AhModal
        {...sizeObj}
        title="我是标题"
        scrollY
        open={visible2}
        onCancel={() => setVisible2(false)}
        rightFooter={
          <Space>
            <Button>你好</Button>
          </Space>
        }
      >
        <div
          style={{
            height: 2000,
            backgroundColor: 'red'
          }}
        >
          asdsda
        </div>
      </AhModal>
    </div>
  );
};

export default AhEditModalDemo;
