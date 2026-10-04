import React from 'react';
// @ts-ignore
import './index.less';

export interface FieldProps {
  label: React.ReactNode;
  value: React.ReactNode;
  style?: React.CSSProperties;
}

const Field: React.FC<FieldProps> = ({ label, value, ...rest }) => (
  <div className="fieldField" {...rest}>
    <span className="fieldlabel">{label}</span>
    <span className="fieldnumber">{value}</span>
  </div>
);

export default Field;
