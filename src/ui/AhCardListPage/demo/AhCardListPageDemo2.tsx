import { Card } from 'antd';
import { CardList, AhCardListPage } from '../../index';

/**
 * 搜索
 */
const search = async (params: any) => {
  const res = await fetch('https://api.jyfwyun.com/theling-bot-service/sys/issueList/list', {
    method: 'POST',
    body: JSON.stringify({
      userId: '0f5f135ce6e2b6dae0052636ebfa3c9b',
      endDay: '2024-08-04 23:59:59',
      pageNum: 1,
      pageSize: 20,
      sort: {
        dueDate: false
      },
      startDay: '2024-07-29 00:00:00',
      ...params
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhcHBJZCI6Ind4N2Y2YWM2ZjExYmNlZWYwZiIsInVzZXJJZCI6ImVka0NwNURRemd4VXE3eUtiZEs0VENtVkNrYmJVYUNqbEhXV3ZxdE01STFNOUFETG5mSGRMdG5JZHV5NldMQllFMUdPQ0tzM1R3dm9HQTJVV0NtTXdVRlo2dFdpa1Y4WDkxNVBpaEdxRTZFUmJCRFdMd05ZZkd6VUxLM2R6Ulo3b1kzREkxdUNzUzFsL0tzdG5BM0p5MFg1MEVGWWFXWUJ0TUYzYlRicG9QbXREVkREanhGZmNiUmlxUVU4MjAvY01UeThCYU02VCtXMGN1c1Jja084QXYxR1dxbTA5cEZuZkszTk9QdzdTMWI0Nmd3MndBV0MyU0I3TGZBcXIxaUdhNU9kc2drZnN1anphMWtlb0g5MGVRUWsyZUduQVhKQ3ZVOFgySVF2MU4zSFJ5VXVJcm41UHc0VzhENG5sSkZhTHhwQzM3dDA1Wk1LSERLME5TVHZSZz09IiwiaWF0IjoxNzIxNzMwNDUyLCJleHAiOjE3NjMyMDI0NTJ9.SXatr1qH3cOMQP4Gb0eY35FX7qe5RVC7dmbmhADjqnFLc61_YdPD9E44UNRMcR4c3Jmfmxg7BB89FtLoLMfeeCT8A05AUZkalFRLtUmb5rkjA2a9jWqwAGv-YlVpUciaI4WEhpcVWhGfe_SEPmNsqITpk0Ah2UnVF_Ym1MMNAXD1HIEob5DXXEU6SyBk4ekuQJThie1Kt_ygTjHIFIm1nD8BvB63s-1TsCS8jiybOUZ3TOVg7IAUCc43tndcJ6lfuDnGpGsqs2TDbeRiDKRvtRDGSPnzHENX6dC_ubGtR4Zhw3tOyRY1zmar1ZgtHSG-XbrCA7z-hR7F6SUpL-Euag'
    }
  });
  const json = await res.json();
  return json.result;
};

export default () => (
  <Card
    style={{
      height: 800
    }}
  >
    <AhCardListPage<any, any>
      request={search}
      backgroundColor="#fff"
      searchLayout="plugin"
      searchContentProps={{
        showExpand: false
      }}
      itemsRender={items => {
        console.log('items', items);
        return (
          <CardList
            itemKey="code"
            data={items}
            itemRender={item => {
              return (
                <Card style={{ height: 200 }} title={item.issueName}>
                  {item.issueDescription}
                </Card>
              );
            }}
          />
        );
      }}
    />
  </Card>
);
