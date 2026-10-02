import type { IOptions7 } from '../../theling-utils/@types/IZlData';
import React from 'react';

export type IListOptionsEvent = 'add' | 'del' | 'update' | 'move';

export interface IListOptionsProps {
  onChange?: (
    values: IOptions7<string>[],
    item: IOptions7<string>,
    index: number,
    type: IListOptionsEvent
  ) => void;
  onAdd?: (value: IOptions7<string>) => void;
  onDelete?: (value: IOptions7<string>, index: number) => void;
  value?: IOptions7<string>[];
  title?: React.ReactNode;
  tips?: string;
  titleRender?: () => React.ReactNode;
  classifyValue?: {};
  customValue?: boolean;
  placeholder?: string;
  search?: boolean;
  extraRender?: (item: IOptions7<string>) => React.ReactNode;
  inputRender?: boolean;
}
