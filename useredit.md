# 产品需求文档 (PRD) - 用户详情与会员设置模块

## 💡 给 AI 开发助手的提示 (AI Developer Context)
- **目标组件**：这是一个后台管理系统中的「侧边抽屉 (Drawer)」组件。
- **UI 框架建议**：请使用标准的后台 UI 库组件（如 Ant Design, Element Plus, MUI 等），包含 `Drawer`, `Tabs`, `Form`, `Input`, `Select`, `Switch`, `Table`, `Collapse` 等。
- **表单状态**：请为表单配置完整的受控状态 (Controlled State) 。

---

## 1. 模块概述
本模块定义了后台管理系统中「修改用户详情」抽屉（Drawer）的功能规格与介面配置。主要提供管理员检视并编辑特定会员的基础账户资讯、绑定资料，以及各项系统权限与费率设定。

---

## 2. 抽屉全局配置 (Global Drawer Configuration)

### 2.1 标头区块 (Header)
- **标题与操作对象**：显示 `修改用户详情 · {username}`（例：修改用户详情 · mingv0717001）。
- **身分标签 (Tags)**：显示会员身分标签（例：`<Tag>代理会员</Tag>` · `<Tag>VIP会员</Tag>`）。
- **账户状态 (Status Badge)**：显示目前账户状态（例：冻结、正常、停用，建议搭配颜色标示）。

### 2.2 全局操作按钮 (Footer Actions)
- **取消 (Cancel)**：关闭抽屉且不保存修改。
- **保存修改 (Submit/Save)**：提交并储存所有页签 (Tabs) 中的变更。

### 2.3 页签结构 (Tabs)
采用 `Tabs` 组件切换两大区块：
1. **基本信息 (Basic Information)**：管理会员基础账户资料。
2. **会员设置 (Member Settings)**：管理会员相关费率、权限开关与次数限制。

---

## 3. 分页规格：基本信息 (Tab: Basic Information)

### 3.1 基本信息表单栏位配置 (25个字段)

| 序号 | 栏位名称 | 建议变数名 | 组件类型 | 说明 / 预设值 |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 状态 | `status` | 下拉选单 (Select) | 选项：待审核、正常、冻结、停用 |
| 2 | 登录密码 | `password` | 文字输入框 (Input) | |
| 3 | 真实姓名 | `realName` | 文字输入框 (Input) | |
| 4 | 生日 | `birthday` | 年月日下拉选单 (YYYY、MM、DD) | 包含年、月、日联动选单 |
| 5 | 昵称 | `nickname` | 文字输入框 (Input) | 预设带有 `ad***13` |
| 6 | 会员层级 | `payLevel` | 下拉选单 (Select) | 预设为 `默认层` |
| 7 | 电话前缀国码 | `phonePrefix` | 下拉选单 (Select) | 预设为 `+86` |
| 8 | 手机号 | `phone` | 文字输入框 (Input) | |
| 9 | CPF | `cpf` | 文字输入框 (Input) | |
| 10 | 邮箱 | `email` | 文字输入框 (Input) | |
| 11 | 地址 | `address` | 文字输入框 (Input) | |
| 12 | 省 | `province` | 文字输入框 (Input) | |
| 13 | 城市 | `city` | 文字输入框 (Input) | |
| 14 | 邮递区号 | `zipCode` | 文字输入框 (Input) | |
| 15 | QQ | `qq` | 文字输入框 (Input) | |
| 16 | 微信 | `wechat` | 文字输入框 (Input) | |
| 17 | zalo | `zalo` | 文字输入框 (Input) | |
| 18 | whatsapp | `whatsapp` | 文字输入框 (Input) | |
| 19 | telegram | `telegram` | 文字输入框 (Input) | |
| 20 | facebook | `facebook` | 文字输入框 (Input) | |
| 21 | line | `line` | 文字输入框 (Input) | |
| 22 | instagram | `instagram` | 文字输入框 (Input) | |
| 23 | tiktok | `tiktok` | 文字输入框 (Input) | |
| 24 | twitter | `twitter` | 文字输入框 (Input) | |
| 25 | 谷歌帐号 | `googleAccount` | 状态显示区块 | 统一显示「暂未绑定」 |

### 3.2 提现信息 (Withdrawal Information)
这是一个**动态列表 (Dynamic List/Table)**，支援增删改查。
- **列表栏位**：
  1. 出款类型（银行卡 / 支付宝 / 虚拟币等）
  2. 卡号 / 钱包账号
  3. 银行 / 币种
  4. 银行地址 / 备注
  5. 状态（启用 / 禁用）
- **操作支援 (Actions)**：
  - 顶部/底部提供「新增 (Add)」按钮。
  - 针对单笔纪录操作：删除 (Delete)、储存 (Save)、禁用/启用切换 (Disable/Enable)。

---

## 4. 分页规格：会员设置 (Tab: Member Settings)

### 4.1 费率与备注 (Rates & Notes)
| 栏位名称 | 建议变数名 | 组件类型 | 说明 / 预设提示 |
| :--- | :--- | :--- | :--- |
| 提现费率 | `withdrawalRate` | 数值输入框 (InputNumber) | 支援输入至三位小数（Placeholder: 0.015） |
| 备注 | `internalNote` | 多行文本框 (TextArea) | 提供管理员填写内部备忘（例如：大户需关注） |

### 4.2 权限与限制 (Permissions & Limits)
采用 **开关 (Switch / Checkbox)** 形式进行快速管控，建议以网格 (Grid) 或列表 (List) 布局：

| 权限项目 | 建议变数名 | 说明 |
| :--- | :--- | :--- |
| 停止第三方返水 | `stopThirdPartyRebate` | 开启后该用户将无法获得第三方游戏返水。 |
| 限制转入第三方 | `restrictThirdPartyTransfer`| 开启后限制用户资金转入第三方游戏平台。 |
| 停止彩票返水 | `stopLotteryRebate` | 开启后该用户将无法获得彩票游戏返水。 |
| 邀请码注册 | `allowInviteCodeRegister` | 控制该用户的邀请码注册权限（附带 Tooltip 提示图标支援说明）。 |
| 停止成长值和等级更新 | `lockGrowthAndLevel` | 锁定该用户当前的成长值与 VIP 等级，不随后续行为变更。 |
| 能否修改下级赔率 | `canModifySubordinateOdds`| 控制该代理/会员是否有权限修改其下级的赔率。 |

### 4.3 每日次数限制 (Daily Limits)
| 栏位名称 | 建议变数名 | 组件类型 | 说明 / 预设提示 |
| :--- | :--- | :--- | :--- |
| 当天最大提款次数 | `maxDailyWithdrawals` | 数值输入框 (InputNumber)| 为空或未设置即代表不限制 (No limit) |
| 当天最大充值返利次数| `maxDailyRebateCount` | 数值输入框 (InputNumber)| 为空或未设置即代表不限制 (No limit) |

---

## 5. 附加纪录与自订区块 (Additional Records - 全局底部显示)
此区块显示于页签下方或 Drawer 底部区域，建议使用折叠面板 (`Collapse` / `Accordion`) 呈现以节省空间。

### 5.1 自订栏位 (Custom Fields)
- **功能**：提供针对该用户新增额外客制化属性的区块。
- **操作按钮**：关闭 (Close)、保存 (Save Custom Fields)。

### 5.2 代理变更纪录 (Proxy Change Logs)
- **UI 组件**：折叠面板 (Collapse) 内嵌 数据列表 (Data Table)。
- **功能**：支援折叠/展开查看历史变更轨迹。
- **表格栏位**：
  - 变更前代理 (Previous Proxy)
  - 变更后代理 (New Proxy)
  - 操作者 (Operator)
  - 操作时间 (Operation Time, 例：`2026-08-11 09:25:24`)

### 5.3 备注详情 (Note Details History)
- **UI 组件**：折叠面板 (Collapse) 或 时间轴 (Timeline)。
- **功能**：支援折叠/展开查看针对该用户的详细历史备注纪录与时间戳 (Timestamp)。
