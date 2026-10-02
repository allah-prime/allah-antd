import { useState } from 'react';
import { CardList, AhCardListPage, AhModal } from '../../index';

/**
 * 搜索
 */
const search = async (params: any) => {
  console.log(222, params);
  const res = await fetch('https://api.jyfwyun.com/cloud-service/cross/search', {
    method: 'POST',
    body: JSON.stringify({
      s: '1681786960136',
      searchType: 'item',
      pageNum: params.pageNum,
      busiCombosObj: {},
      pageSize: params.pageSize,
      keyword: params.keyword,
      searchSchema: 'nlp',
      ac: '210000',
      industryTypes: []
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const json = await res.json();
  return json.result.data;
};

const params = {
  pageNum: 1
};

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        height: 800
      }}
    >
      <AhCardListPage<any, any>
        request={search}
        defParams={{ ...params }}
        itemsRender={items => {
          return (
            <CardList
              data={items}
              itemRender={item => {
                return (
                  <div onClick={() => setOpen(true)} style={{ height: 200 }}>
                    {item.standardItem}
                  </div>
                );
              }}
            />
          );
        }}
      />
      <AhModal visible={open} onCancel={() => setOpen(false)}>
        大萨达撒
      </AhModal>
    </div>
  );
};
