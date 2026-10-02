/**
 * 将 SSE 文本数据格式化为对象或字符串
 *
 * 输入示例：
 *   "data: {\"type\": \"tips\", \"content\": \"正在思考\"}"
 * 或多行：
 *   "data: {\"a\":1\n"
 *    + "data: \"b\"}"
 *
 * 处理规则：
 * - 提取每一行以 `data:` 开头的内容并拼接（按规范用换行连接）
 * - 若结果看起来是对象 JSON（以 `{` 开头并以 `}` 结尾），则解析为对象
 * - 返回数组：每个 `data:` 行或每个对象片段为一个元素
 */
export declare const sseDefaultFormat: (data: any) => any[];
