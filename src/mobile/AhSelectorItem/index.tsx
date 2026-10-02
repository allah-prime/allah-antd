import { IOptions7 } from '../../theling-utils';
import './index.less';

const AhSelectorItem = ({
  item,
  selected,
  onClick
}: {
  item: IOptions7<string>;
  selected: boolean;
  onClick: (item: IOptions7<string>) => void;
}) => {
  return (
    <div className="adm-ah-selector-item">
      <div
        className={`adm-selector-item adm-selector-item-active ${selected ? 'adm-selector-item-multiple-active' : ''}`}
        onClick={e => {
          e.stopPropagation();
          onClick(item);
        }}
        style={{
          color: selected ? '#1890ff' : '#000'
        }}
      >
        {item.label}
        <div
          className="ahWL_ah_ellipsis_1 ah-text-xs"
          style={{
            maxWidth: item.label.length * 24 + 16
          }}
        >
          {item.description}
        </div>
        <div className="adm-selector-check-mark-wrapper">
          <svg
            width="17px"
            height="13px"
            viewBox="0 0 17 13"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g transform="translate(-2832.000000, -1103.000000)" stroke="#FFFFFF" strokeWidth="3">
                <g transform="translate(2610.000000, 955.000000)">
                  <g transform="translate(24.000000, 91.000000)">
                    <g transform="translate(179.177408, 36.687816)">
                      <polyline points="34.2767388 22 24.797043 31.4796958 21 27.6826527"></polyline>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AhSelectorItem;
