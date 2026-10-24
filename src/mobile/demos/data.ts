/**
 * 表单组件演示用的模拟数据
 */

// 异步加载的模拟数据
export const mockAsyncData = [
  {
    label: '动态加载-北京',
    value: 'async_bj',
    key: 'async_bj',
    children: [
      { label: '朝阳区', value: 'async_cy', key: 'async_cy' },
      { label: '海淀区', value: 'async_hd', key: 'async_hd' },
      { label: '西城区', value: 'async_xc', key: 'async_xc' },
      { label: '东城区', value: 'async_dc', key: 'async_dc' }
    ]
  },
  {
    label: '动态加载-上海',
    value: 'async_sh',
    key: 'async_sh',
    children: [
      { label: '浦东新区', value: 'async_pd', key: 'async_pd' },
      { label: '黄浦区', value: 'async_hp', key: 'async_hp' },
      { label: '静安区', value: 'async_ja', key: 'async_ja' },
      { label: '徐汇区', value: 'async_xh', key: 'async_xh' }
    ]
  }
];

// 餐次枚举数据
export const valueEnum = {
  '0': { text: '早', value: '0' },
  '1': { text: '中', value: '1' },
  '2': { text: '晚', value: '2' }
};

// 完整的省市区三级级联数据
export const areaOptions = [
  {
    label: '浙江省',
    value: 'zj',
    key: 'zj',
    children: [
      {
        label: '杭州市',
        value: 'hz',
        key: 'hz',
        children: [
          { label: '西湖区', value: 'xh', key: 'xh' },
          { label: '余杭区', value: 'yh', key: 'yh' },
          { label: '拱墅区', value: 'gs', key: 'gs' },
          { label: '上城区', value: 'sc', key: 'sc' },
          { label: '下城区', value: 'xc', key: 'xc' },
          { label: '江干区', value: 'jg', key: 'jg' },
          { label: '滨江区', value: 'bj', key: 'bj' },
          { label: '萧山区', value: 'xs', key: 'xs' },
          { label: '临安区', value: 'la', key: 'la' },
          { label: '富阳区', value: 'fy', key: 'fy' },
          { label: '建德市', value: 'jd', key: 'jd' },
          { label: '桐庐县', value: 'tl', key: 'tl' },
          { label: '淳安县', value: 'ca', key: 'ca' }
        ]
      },
      {
        label: '宁波市',
        value: 'nb',
        key: 'nb',
        children: [
          { label: '海曙区', value: 'hs', key: 'hs' },
          { label: '江北区', value: 'jb', key: 'jb' },
          { label: '北仑区', value: 'bl', key: 'bl' },
          { label: '镇海区', value: 'zh', key: 'zh' },
          { label: '鄞州区', value: 'yz', key: 'yz' },
          { label: '奉化区', value: 'fh', key: 'fh' },
          { label: '余姚市', value: 'yy', key: 'yy' },
          { label: '慈溪市', value: 'cx', key: 'cx' },
          { label: '宁海县', value: 'nh', key: 'nh' },
          { label: '象山县', value: 'xsh', key: 'xsh' }
        ]
      },
      {
        label: '温州市',
        value: 'wz',
        key: 'wz',
        children: [
          { label: '鹿城区', value: 'lc', key: 'lc' },
          { label: '龙湾区', value: 'lw', key: 'lw' },
          { label: '瓯海区', value: 'oh', key: 'oh' },
          { label: '洞头区', value: 'dt', key: 'dt' },
          { label: '瑞安市', value: 'ra', key: 'ra' },
          { label: '乐清市', value: 'lq', key: 'lq' },
          { label: '永嘉县', value: 'yj', key: 'yj' },
          { label: '文成县', value: 'wc', key: 'wc' },
          { label: '平阳县', value: 'py', key: 'py' },
          { label: '泰顺县', value: 'ts', key: 'ts' },
          { label: '苍南县', value: 'cn', key: 'cn' }
        ]
      },
      {
        label: '嘉兴市',
        value: 'jx',
        key: 'jx',
        children: [
          { label: '南湖区', value: 'nh2', key: 'nh2' },
          { label: '秀洲区', value: 'xz', key: 'xz' },
          { label: '嘉善县', value: 'js2', key: 'js2' },
          { label: '海盐县', value: 'hy', key: 'hy' },
          { label: '海宁市', value: 'hn', key: 'hn' },
          { label: '平湖市', value: 'ph', key: 'ph' },
          { label: '桐乡市', value: 'tx', key: 'tx' }
        ]
      }
    ]
  },
  {
    label: '江苏省',
    value: 'js',
    key: 'js',
    children: [
      {
        label: '南京市',
        value: 'nj',
        key: 'nj',
        children: [
          { label: '玄武区', value: 'xw', key: 'xw' },
          { label: '秦淮区', value: 'qh', key: 'qh' },
          { label: '建邺区', value: 'jy', key: 'jy' },
          { label: '鼓楼区', value: 'gl', key: 'gl' },
          { label: '浦口区', value: 'pk', key: 'pk' },
          { label: '栖霞区', value: 'qx', key: 'qx' },
          { label: '雨花台区', value: 'yht', key: 'yht' },
          { label: '江宁区', value: 'jn', key: 'jn' },
          { label: '六合区', value: 'lh', key: 'lh' },
          { label: '溧水区', value: 'ls', key: 'ls' },
          { label: '高淳区', value: 'gc', key: 'gc' }
        ]
      },
      {
        label: '苏州市',
        value: 'sz',
        key: 'sz',
        children: [
          { label: '虎丘区', value: 'hq', key: 'hq' },
          { label: '吴中区', value: 'wz2', key: 'wz2' },
          { label: '相城区', value: 'xc2', key: 'xc2' },
          { label: '姑苏区', value: 'gs2', key: 'gs2' },
          { label: '吴江区', value: 'wj', key: 'wj' },
          { label: '昆山市', value: 'ks', key: 'ks' },
          { label: '太仓市', value: 'tc', key: 'tc' },
          { label: '常熟市', value: 'cs', key: 'cs' },
          { label: '张家港市', value: 'zjg', key: 'zjg' }
        ]
      },
      {
        label: '无锡市',
        value: 'wx',
        key: 'wx',
        children: [
          { label: '锡山区', value: 'xs2', key: 'xs2' },
          { label: '惠山区', value: 'hs2', key: 'hs2' },
          { label: '滨湖区', value: 'bh', key: 'bh' },
          { label: '梁溪区', value: 'lx', key: 'lx' },
          { label: '新吴区', value: 'xw2', key: 'xw2' },
          { label: '江阴市', value: 'jy2', key: 'jy2' },
          { label: '宜兴市', value: 'yx', key: 'yx' }
        ]
      }
    ]
  },
  {
    label: '广东省',
    value: 'gd',
    key: 'gd',
    children: [
      {
        label: '广州市',
        value: 'gz',
        key: 'gz',
        children: [
          { label: '荔湾区', value: 'lw2', key: 'lw2' },
          { label: '越秀区', value: 'yx2', key: 'yx2' },
          { label: '海珠区', value: 'hz2', key: 'hz2' },
          { label: '天河区', value: 'th', key: 'th' },
          { label: '白云区', value: 'by', key: 'by' },
          { label: '黄埔区', value: 'hp', key: 'hp' }
        ]
      },
      {
        label: '深圳市',
        value: 'sz2',
        key: 'sz2',
        children: [
          { label: '罗湖区', value: 'lh2', key: 'lh2' },
          { label: '福田区', value: 'ft', key: 'ft' },
          { label: '南山区', value: 'ns2', key: 'ns2' },
          { label: '宝安区', value: 'ba', key: 'ba' },
          { label: '龙岗区', value: 'lg', key: 'lg' }
        ]
      }
    ]
  }
];

// 简单的二级级联数据（部门职位）
export const simpleOptions = [
  {
    label: '技术部',
    value: 'tech',
    key: 'tech',
    children: [
      { label: '前端开发', value: 'frontend', key: 'frontend' },
      { label: '后端开发', value: 'backend', key: 'backend' },
      { label: '移动端开发', value: 'mobile', key: 'mobile' },
      { label: '测试工程师', value: 'test', key: 'test' }
    ]
  },
  {
    label: '产品部',
    value: 'product',
    key: 'product',
    children: [
      { label: '产品经理', value: 'pm', key: 'pm' },
      { label: 'UI设计师', value: 'ui', key: 'ui' },
      { label: 'UX设计师', value: 'ux', key: 'ux' }
    ]
  },
  {
    label: '运营部',
    value: 'operation',
    key: 'operation',
    children: [
      { label: '内容运营', value: 'content', key: 'content' },
      { label: '用户运营', value: 'user', key: 'user' },
      { label: '活动运营', value: 'activity', key: 'activity' }
    ]
  }
];

// 单级选项（无子级）
export const singleLevelOptions = [
  { label: '北京', value: 'beijing', key: 'beijing' },
  { label: '上海', value: 'shanghai', key: 'shanghai' },
  { label: '天津', value: 'tianjin', key: 'tianjin' },
  { label: '重庆', value: 'chongqing', key: 'chongqing' }
];

// 四级级联数据
export const deepOptions = [
  {
    label: '华东地区',
    value: 'east',
    key: 'east',
    children: [
      {
        label: '浙江省',
        value: 'zj_deep',
        key: 'zj_deep',
        children: [
          {
            label: '杭州市',
            value: 'hz_deep',
            key: 'hz_deep',
            children: [
              { label: '西湖街道', value: 'xh_street', key: 'xh_street' },
              { label: '北山街道', value: 'bs_street', key: 'bs_street' },
              { label: '灵隐街道', value: 'ly_street', key: 'ly_street' }
            ]
          }
        ]
      }
    ]
  },
  {
    label: '华南地区',
    value: 'south',
    key: 'south',
    children: [
      {
        label: '广东省',
        value: 'gd_deep',
        key: 'gd_deep',
        children: [
          {
            label: '广州市',
            value: 'gz_deep',
            key: 'gz_deep',
            children: [
              { label: '珠江新城', value: 'zjxc_street', key: 'zjxc_street' },
              { label: '天河北', value: 'thb_street', key: 'thb_street' },
              { label: '体育西', value: 'tyx_street', key: 'tyx_street' }
            ]
          }
        ]
      }
    ]
  }
];

// 大数据量级联选择器（用于性能测试）
export const largeDataOptions = [
  {
    label: '华北地区',
    value: 'north',
    key: 'north',
    children: Array.from({ length: 15 }, (_, i) => ({
      label: `城市${i + 1}`,
      value: `city_${i + 1}`,
      key: `city_${i + 1}`,
      children: Array.from({ length: 20 }, (_, j) => ({
        label: `区县${j + 1}`,
        value: `district_${i + 1}_${j + 1}`,
        key: `district_${i + 1}_${j + 1}`
      }))
    }))
  },
  {
    label: '华东地区',
    value: 'east_large',
    key: 'east_large',
    children: Array.from({ length: 12 }, (_, i) => ({
      label: `城市${i + 16}`,
      value: `city_${i + 16}`,
      key: `city_${i + 16}`,
      children: Array.from({ length: 18 }, (_, j) => ({
        label: `区县${j + 1}`,
        value: `district_${i + 16}_${j + 1}`,
        key: `district_${i + 16}_${j + 1}`
      }))
    }))
  },
  {
    label: '华南地区',
    value: 'south_large',
    key: 'south_large',
    children: Array.from({ length: 10 }, (_, i) => ({
      label: `城市${i + 28}`,
      value: `city_${i + 28}`,
      key: `city_${i + 28}`,
      children: Array.from({ length: 15 }, (_, j) => ({
        label: `区县${j + 1}`,
        value: `district_${i + 28}_${j + 1}`,
        key: `district_${i + 28}_${j + 1}`
      }))
    }))
  }
];

/**
 * 模拟异步加载数据的函数
 * @param delay 延迟时间（毫秒）
 * @returns Promise<any[]>
 */
export const loadAsyncData = (delay: number = 1000): Promise<any[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockAsyncData);
    }, delay);
  });
};

/**
 * 定义一个用餐人列表，10个人
 */
export const mealPeopleOptions = [
  { label: '张三', value: 'zhangsan', key: 'zhangsan' },
  { label: '李四', value: 'lisi', key: 'lisi' },
  { label: '王五', value: 'wangwu', key: 'wangwu' },
  { label: '赵六', value: 'zhaoliu', key: 'zhaoliu' },
  { label: '孙七', value: 'sunqi', key: 'sunqi' },
  { label: '周八', value: 'zhouba', key: 'zhouba' },
  { label: '吴九', value: 'wujiu', key: 'wujiu' },
  { label: '郑十', value: 'zhengshi', key: 'zhengshi' },
  { label: '陈十一', value: 'chenshi', key: 'chenshi' },
  { label: '钱十二', value: 'qianshi', key: 'qianshi' },
  { label: '孙十三', value: 'sunshi', key: 'sunshi' },
  { label: '李十四', value: 'lishi', key: 'lishi' },
  { label: '王十五', value: 'wangshi', key: 'wangshi' }
];

/**
 * 模拟菜品数据
 */
export const mockDishesData = [
  { label: '宫保鸡丁', value: 'gongbao_chicken', key: 'gongbao_chicken' },
  { label: '麻婆豆腐', value: 'mapo_tofu', key: 'mapo_tofu' },
  { label: '红烧肉', value: 'braised_pork', key: 'braised_pork' },
  { label: '糖醋里脊', value: 'sweet_sour_pork', key: 'sweet_sour_pork' },
  { label: '鱼香肉丝', value: 'yuxiang_pork', key: 'yuxiang_pork' },
  { label: '回锅肉', value: 'huiguo_pork', key: 'huiguo_pork' },
  { label: '水煮鱼', value: 'boiled_fish', key: 'boiled_fish' },
  { label: '口水鸡', value: 'saliva_chicken', key: 'saliva_chicken' },
  { label: '蒜蓉西兰花', value: 'garlic_broccoli', key: 'garlic_broccoli' },
  { label: '清炒小白菜', value: 'stir_fried_cabbage', key: 'stir_fried_cabbage' },
  { label: '番茄鸡蛋', value: 'tomato_egg', key: 'tomato_egg' },
  { label: '青椒土豆丝', value: 'pepper_potato', key: 'pepper_potato' },
  { label: '酸辣土豆丝', value: 'sour_spicy_potato', key: 'sour_spicy_potato' },
  { label: '蚂蚁上树', value: 'ants_climbing_tree', key: 'ants_climbing_tree' },
  { label: '白切鸡', value: 'white_cut_chicken', key: 'white_cut_chicken' },
  { label: '清蒸鲈鱼', value: 'steamed_bass', key: 'steamed_bass' },
  { label: '红烧茄子', value: 'braised_eggplant', key: 'braised_eggplant' },
  { label: '干煸豆角', value: 'dry_fried_beans', key: 'dry_fried_beans' },
  { label: '蒜蓉粉丝', value: 'garlic_vermicelli', key: 'garlic_vermicelli' },
  { label: '凉拌黄瓜', value: 'cold_cucumber', key: 'cold_cucumber' }
];

/**
 * 模拟菜品接口请求函数
 * @param params 请求参数，可以包含搜索关键词等
 * @returns Promise<any[]>
 */
export const requestDishesData = (params?: { keyword?: string }): Promise<any[]> => {
  return new Promise(resolve => {
    // 模拟网络延迟
    setTimeout(() => {
      let result = [...mockDishesData];

      // 如果有搜索关键词，进行过滤
      if (params?.keyword) {
        result = result.filter(dish =>
          dish.label.toLowerCase().includes(params.keyword!.toLowerCase())
        );
      }

      resolve(result);
    }, 800); // 800ms 延迟模拟网络请求
  });
};

/**
 * 模拟获取文件上传key的接口
 * @param files 文件列表
 * @returns Promise<any[]>
 */
export const mockFileKeyRequest = (files: any[]): Promise<any[]> => {
  return new Promise(resolve => {
    console.log('🔑 模拟获取文件上传key...', files);

    setTimeout(() => {
      const processedFiles = files.map(file => ({
        ...file,
        // 模拟生成的上传key
        cosKey: `uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`,
        // 模拟文件ID
        fileId: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dbFileId: `ah_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        // 模拟上传URL
        uploadUrl: `https://mock-upload.example.com/upload/${file.name}`,
        // 设置状态为待上传
        status: 'ready'
      }));

      console.log('✅ 文件key获取成功:', processedFiles);
      resolve(processedFiles);
    }, 500); // 500ms 延迟模拟网络请求
  });
};

/**
 * 模拟文件上传接口
 * @param file 文件对象
 * @param onProgress 上传进度回调
 * @returns Promise<void>
 */
export const mockUploadRequest = (
  file: any,
  onProgress?: (progress: any) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('📤 开始上传文件:', file.name);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20; // 随机增加进度

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // 模拟上传完成后的文件信息
        file.url = `https://mock-cdn.example.com/files/${file.cosKey}`;
        file.previewUrl = file.url;
        file.status = 'success';
        file.percent = 100;

        console.log('✅ 文件上传成功:', file.name, file.url);
        resolve(file.url);
      } else {
        // 调用进度回调
        onProgress?.({ percent: progress / 100 });
      }
    }, 200); // 每200ms更新一次进度

    // 模拟偶尔的上传失败（5%概率）
    setTimeout(() => {
      if (Math.random() < 0.05) {
        clearInterval(interval);
        console.error('❌ 文件上传失败:', file.name);
        reject(new Error('模拟上传失败'));
      }
    }, 1000);
  });
};

export const jyfwSearch = (params: { pageNum: any; pageSize: any; keyword: string }) =>
  fetch('https://api.jyfwyun.com/cloud-service/cross/search', {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    },
    referrer: 'https://jyfwyun.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: `{"s":"1649664274429","keyword": "${params.keyword}","searchType":"item","pageNum":${params.pageNum},"busiCombosObj":{},"pageSize": ${params.pageSize} ,"industryTypes":[],"searchSchema":"nlp","ac":"110000"}`,
    method: 'POST',
    mode: 'cors'
  }).then(async res => {
    const data = await res.json();
    return data.result.data;
  });
