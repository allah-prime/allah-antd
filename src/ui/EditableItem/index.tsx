import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { Component } from 'react';
import './index.less';

export interface EditableItemProps {
  onChange: (value?: string | string[] | number) => void;
  value?: string | string[] | number;
}

interface EditableItemState {
  value?: string | string[] | number;
  editable: boolean;
}

export default class EditableItem extends Component<EditableItemProps, EditableItemState> {
  constructor(props: EditableItemProps) {
    super(props);
    this.state = {
      value: props.value,
      editable: false
    };
  }

  handleChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    this.setState({ value });
  };

  check = () => {
    this.setState({ editable: false });
    const { value } = this.state;
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  edit = () => {
    this.setState({ editable: true });
  };

  render() {
    const { value, editable } = this.state;
    return (
      <div className="theling_editableItem">
        {editable ? (
          <div className="theling_wrapper">
            <Input value={value} onChange={this.handleChange} onPressEnter={this.check} />
            <CheckOutlined className="theling_icon" onClick={this.check} />
          </div>
        ) : (
          <div className="theling_wrapper">
            <span>{value || ' '}</span>
            <EditOutlined className="theling_icon" onClick={this.edit} />
          </div>
        )}
      </div>
    );
  }
}
