import classNames from 'classnames';
import './index.less';
interface ILongTagProps {
  /**
   * 标签名
   */
  name: string;
  /**
   * 标签样式
   */
  style?: string;
}
const Index = ({ name, style }: ILongTagProps) => {
  return (
    <div className={classNames('theling_longTag', style)}>
      <p className="theling_longTagTitle">{name}</p>
      <span className="theling_triangle" />
    </div>
  );
};
export default Index;
