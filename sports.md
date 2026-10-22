# 需求规格说明书 (PRD) - 体育/会员管理系统：权限配置与列表筛选

> **AI 开发者须知 (AI Developer Guidelines)**
> 1. **界面语系规范**：所有前端界面展示文案必须统一为**简体中文**。
> 2. **数据显示规范**：金额或数据无数据状态（如：获取失败、无数据、空值、无效数值等情境），皆统一显示为 `-` 符号，严禁出现 `null`、`undefined` 或异常文字。
> 3. **安全与审计**：涉及「查看会员解密信息」与敏感操作（如：清除稽核、修改余额、移除验证码）需具备二次确认或权限隔离设计。

---

## 1. 模块一：操作与权限开关配置 (Operation & Permission Switches)

### 1.1 权限控制概述
本节定义了会员管理模块中各功能操作的权限点。前端可依角色权限矩阵（RBAC）动态渲染对应按钮、开关或功能入口。

建议权限控制方式：
- 页面与列表级：通过路由守卫或权限指令（如 `v-permission` 或 `<Authorized>`）控制按钮与菜单可见性。
- 表单与行操作：细粒度控制行内操作按钮（查看、编辑、删除、解密等）。

---

### 1.2 权限清单与组件规格

#### 分组 A：基础会员与信息维护
| 权限功能项 | 建议权限标识符 (Key) | 组件类型 | UI 建议展示文案 | 交互与业务逻辑说明 |
| :--- | :--- | :--- | :--- | :--- |
| 查看会员列表 | `member:list:view` | Page / Menu | 查看会员列表 | 控制会员管理主列表的浏览权限 |
| 查看会员详情 | `member:detail:view` | Action Button | 查看详情 | 打开用户详情抽屉/页面（基础信息展示） |
| 新增会员 | `member:create` | Primary Button | 新增会员 | 顶部操作栏，点击弹出新增会员弹窗/表单 |
| 修改会员 | `member:update` | Row Action / Form | 修改会员 | 允许编辑会员基本信息、层级、等级等 |
| 删除会员 | `member:delete` | Danger Action | 删除会员 | 需弹出 Popconfirm 气泡二次确认，软删除/硬删除 |
| 备注 | `member:note:edit` | Action / TextArea | 备注 | 检视与修改会员管理备注/跟进记录 |
| 变更代理 | `member:agent:change` | Action Modal | 变更代理 | 弹出代理转让/变更归属弹窗，需校验代理链有效性 |
| 实名认证 | `member:kyc:verify` | Modal / Switch | 实名认证 | 审核或手动标记会员实名认证状态 |
| 校验用户任务 | `member:task:verify` | Button / Status | 校验用户任务 | 触发对用户新手任务/活动任务完成状态的后台校验 |

#### 分组 B：财务与资金相关权限
| 权限功能项 | 建议权限标识符 (Key) | 组件类型 | UI 建议展示文案 | 交互与业务逻辑说明 |
| :--- | :--- | :--- | :--- | :--- |
| 资金明细 | `member:fund:view` | Action / Tab | 资金明细 | 查看该会员的充提、转账流水列表（空值显示 `-`） |
| 注单明细 | `member:bet:view` | Action / Tab | 注单明细 | 查看该会员在体育/各场馆的下注记录详情 |
| 交易设定 | `member:trade:setting` | Form / Modal | 交易设定 | 设定出款费率、每日限额、单笔提款上下限等 |
| 编辑银行卡 | `member:bankcard:edit` | Action Modal | 编辑银行卡 | 维护会员绑定的提现银行卡/电子钱包信息 |
| 修改余额 | `member:balance:update` | Action Modal | 修改余额 | 人工调账（加扣款），需必填调整原因与凭证 |
| 批量更新用户余额 | `member:balance:batch` | Batch Action | 批量更新用户余额 | 批量调账入口，支持 Excel 模板导入与结果回执 |
| 解锁金额 | `member:amount:unlock` | Action Modal | 解锁金额 | 解除因风控或稽核冻结的特定锁定金额 |
| 积分调整 | `member:points:adjust` | Action Modal | 积分调整 | 增减会员商城/VIP积分，带变动记录 |
| 链上地址 | `member:crypto:address` | Action / View | 链上地址 | 查看/管理会员绑定的区块链钱包地址 (USDT/TRC20等) |
| 额度修改(链上充值) | `member:crypto:limit` | Action Modal | 额度修改(链上充值) | 手动补单或修改链上充值到账额度 |
| 清除稽核记录 | `member:audit:clear` | Danger Action | 清除稽核记录 | 高风险操作，清空流水稽核要求，需二次确认 |
| 查看会员提款信息 | `member:withdraw:view` | Action Drawer | 查看会员提款信息 | 查看会员绑定的出款通道、提款记录与风控审核记录 |

#### 分组 C：敏感数据与信息解密权限 (脱敏查看)
> ⚠️ **高敏感数据**：预设展示为掩码脱敏状态（如 `138****1234`、`te****@gmail.com`）。点击解密按钮需核验权限并记录审计日志。

| 权限功能项 | 建议权限标识符 (Key) | 组件类型 | UI 建议展示文案 | 交互与业务逻辑说明 |
| :--- | :--- | :--- | :--- | :--- |
| 查看会员解密详情 | `member:decrypt:all` | Action Button | 查看解密详情 | 一键解密该会员全部敏感资料（需特权） |
| 查看会员解密电话详情 | `member:decrypt:phone` | Decrypt Icon | 查看电话 | 点击小眼睛图标解密并显示完整手机号 |
| 查看会员解密邮箱详情 | `member:decrypt:email` | Decrypt Icon | 查看邮箱 | 点击解密并显示完整电子邮箱 |
| 查看会员解密QQ详情 | `member:decrypt:qq` | Decrypt Icon | 查看QQ | 点击解密并显示完整 QQ 账号 |
| 查看会员解密微信详情 | `member:decrypt:wechat` | Decrypt Icon | 查看微信 | 点击解密并显示完整微信微信号 |
| 查看会员解密zalo详情 | `member:decrypt:zalo` | Decrypt Icon | 查看Zalo | 点击解密并显示完整 Zalo 账号 |
| 查看会员解密facebook详情 | `member:decrypt:fb` | Decrypt Icon | 查看Facebook | 点击解密并显示完整 Facebook 绑定信息 |
| 查看会员解密whatsapp详情 | `member:decrypt:wa` | Decrypt Icon | 查看WhatsApp | 点击解密并显示完整 WhatsApp 账号 |
| 查看会员解密telegram详情 | `member:decrypt:tg` | Decrypt Icon | 查看Telegram | 点击解密并显示完整 Telegram 账号 |
| 查看会员解密安全问题 | `member:decrypt:qa` | Decrypt Icon | 查看安全问题 | 点击解密密保问题与设定答案 |

#### 分组 D：配置、安全与数据运维
| 权限功能项 | 建议权限标识符 (Key) | 组件类型 | UI 建议展示文案 | 交互与业务逻辑说明 |
| :--- | :--- | :--- | :--- | :--- |
| 返点设定 | `member:rebate:config` | Form / Modal | 返点设定 | 针对体育/真人等各游戏场馆设定个性化返点率 |
| 导出用户数据 | `member:export` | Export Button | 导出用户数据 | 导出筛选后的用户列表为 Excel/CSV，需限频防刷 |
| 批量更新用户联系方式 | `member:contact:batch` | Batch Action | 批量更新用户联系方式 | 通过模板批量更新会员联系方式 |
| 第三方游戏 | `member:game:thirdparty`| Action Modal | 第三方游戏 | 查询与维护会员在各游戏厂商（PG, 体育等）的子钱包状态 |
| 用户三方RTP配置 | `member:rtp:config` | Action Modal | 用户三方RTP配置 | 针对特定用户配置三方游戏 RTP (Return to Player) 胜率权重 |
| 会员谷歌验证码查看 | `member:2fa:view` | Action Modal | 查看谷歌验证码 | 查看用户当前 2FA 绑定状态与密钥密钥信息 |
| 移除会员谷歌验证码 | `member:2fa:remove` | Danger Action | 移除会员谷歌验证码 | 解绑用户 Google Authenticator，需主管级权限审核 |
| ES数据同步 | `member:es:sync` | Action Button | ES数据同步 | 强制同步当前会员数据至 Elasticsearch 检索引擎 |

---

## 2. 模块二：筛选列查询条件配置 (Filter Bar Specifications)

### 2.1 筛选区交互规范
- **布局形式**：顶部收纳式表单或多列栅格布局（Grid，每行 3~4 列），包含「查询」和「重置」按钮。
- **缺省与重置**：重置时清空所有输入与选择项，恢复默认排序。
- **数据回显**：各查询参数与 URL query parameters 或 Table State 保持双向绑定。

---

### 2.2 筛选字段规格表

| 字段名称 | 建议参数名 (Query Key) | 组件类型 (Component) | 占位符 / 选项内容 (Placeholder / Options) | 说明与联动规则 |
| :--- | :--- | :--- | :--- | :--- |
| 状态 | `status` | 下拉选择器 `Select` | 占位符：`请选择状态`<br>选项：`全部` / `正常` / `冻结` / `停用` | 过滤会员账号激活状态 |
| 用户层级 | `userTier` | 下拉选择器 `Select` | 占位符：`请选择用户层级`<br>选项：动态请求后台层级列表（如：默认层、VIP层） | 会员支付/充提层级 |
| 用户等级 | `userLevel` | 下拉选择器 `Select` | 占位符：`请选择用户等级`<br>选项：动态等级字典（VIP0 ~ VIP10、普通会员等） | 会员 VIP 成长等级 |
| 标签筛选 | `accountTags` | 多选下拉 `Select[multiple]` | 选项：`测试账号`、`风险账号`、`大客户` 等 | 必须包含「测试账号」筛选维度 |
| 用户标签 | `userLabels` | 下拉选择器 `Select` | 占位符：`请选择用户标签`<br>选项：动态业务标签（如：高潜付费、流失预警等） | 运营与用户生命周期标签 |
| 设备类型 | `deviceType` | 下拉选择器 `Select` | 占位符：`请选择设备类型`<br>选项：`全部` / `iOS` / `Android` / `H5` / `PC` | 注册或常登设备终端类型 |
| 国家 | `country` | 搜索下拉 `Select[filterable]`| 占位符：`请选择国家`<br>选项：国际化国家与地区代码及名称列表 | 用户 IP/号码归属国家 |
| 推广人账号 | `promoterAccount` | 输入框 `Input` | 占位符：`请输入推广人账号` | 支持模糊或精确搜索直属上级/代理账号 |
| 未登录天数 | `inactiveDays` | 数值输入框 `InputNumber` | 占位符：`未登录天数` (例如：>= 30) | 筛选大于等于设定未登录天数的沉睡用户 |
| 三方额度 | `thirdPartyAmount` | 带前后缀输入框 `Input[addonBefore/After]` | 前缀：`三方额度 大于` / 占位符：`请输入金额` / 后缀：`元` | 筛选三方游戏钱包余额大于设定金额的会员 |
| 注册时间范围 | `registerTimeRange` | 日期时间范围选择器 `RangePicker` | 预设显示：`开始时间 - 结束时间`<br>带快捷选项（今日、昨日、近7天、近30天） | 格式：`YYYY-MM-DD HH:mm:ss` |
| 账号精确匹配 | `matchField` + `accountKeyword` | 组合输入框 `Select + Input` | 下拉选项：`会员账号` / `用户ID` / `真实姓名` / `手机号`<br>输入框占位符：`请输入精确账号信息` | 针对核心标识的精准检索组合控件 |

---

## 3. 前端数据结构与 API 契约建议 (TypeScript Interfaces)

```typescript
// 1. 列表筛选请求参数
export interface MemberListQueryParams {
  status?: string;                  // 状态
  userTier?: string;                // 用户层级
  userLevel?: string;               // 用户等级
  accountTags?: string[];           // 标签筛选（含测试账号）
  userLabels?: string[];            // 用户标签
  deviceType?: string;              // 设备类型
  country?: string;                 // 国家
  promoterAccount?: string;         // 推广人账号
  inactiveDays?: number;            // 未登录天数
  thirdPartyAmount?: number;        // 三方额度大于
  registerStartTime?: string;       // 注册开始时间
  registerEndTime?: string;         // 注册结束时间
  matchField?: 'account' | 'uid' | 'realName' | 'phone'; // 精确匹配类型
  accountKeyword?: string;          // 匹配内容
  page: number;
  pageSize: number;
}

// 2. 权限点字典对照
export const PERMISSION_KEYS = {
  // 基础操作
  MEMBER_LIST_VIEW: 'member:list:view',
  MEMBER_CREATE: 'member:create',
  MEMBER_UPDATE: 'member:update',
  MEMBER_DELETE: 'member:delete',
  MEMBER_DETAIL_VIEW: 'member:detail:view',
  MEMBER_NOTE_EDIT: 'member:note:edit',
  MEMBER_AGENT_CHANGE: 'member:agent:change',
  MEMBER_KYC_VERIFY: 'member:kyc:verify',
  MEMBER_TASK_VERIFY: 'member:task:verify',

  // 资金与财务
  FUND_VIEW: 'member:fund:view',
  BET_VIEW: 'member:bet:view',
  TRADE_SETTING: 'member:trade:setting',
  BANKCARD_EDIT: 'member:bankcard:edit',
  BALANCE_UPDATE: 'member:balance:update',
  BALANCE_BATCH: 'member:balance:batch',
  AMOUNT_UNLOCK: 'member:amount:unlock',
  POINTS_ADJUST: 'member:points:adjust',
  CRYPTO_ADDRESS: 'member:crypto:address',
  CRYPTO_LIMIT: 'member:crypto:limit',
  AUDIT_CLEAR: 'member:audit:clear',
  WITHDRAW_VIEW: 'member:withdraw:view',

  // 敏感解密
  DECRYPT_ALL: 'member:decrypt:all',
  DECRYPT_PHONE: 'member:decrypt:phone',
  DECRYPT_EMAIL: 'member:decrypt:email',
  DECRYPT_QQ: 'member:decrypt:qq',
  DECRYPT_WECHAT: 'member:decrypt:wechat',
  DECRYPT_ZALO: 'member:decrypt:zalo',
  DECRYPT_FB: 'member:decrypt:fb',
  DECRYPT_WA: 'member:decrypt:wa',
  DECRYPT_TG: 'member:decrypt:tg',
  DECRYPT_QA: 'member:decrypt:qa',

  // 配置与运维
  REBATE_CONFIG: 'member:rebate:config',
  EXPORT_DATA: 'member:export',
  CONTACT_BATCH: 'member:contact:batch',
  THIRD_PARTY_GAME: 'member:game:thirdparty',
  RTP_CONFIG: 'member:rtp:config',
  GOOGLE_2FA_VIEW: 'member:2fa:view',
  GOOGLE_2FA_REMOVE: 'member:2fa:remove',
  ES_SYNC: 'member:es:sync',
} as const;
```
