# 数据状态定义 (Data Status Definitions)

本文件记录了会员管理系统中各项数据状态的呈现方式与定义。

## 1. 基础数据状态

| 状态名称 | 原始值范例 | UI 呈现设计 | 说明 |
| :--- | :--- | :--- | :--- |
| **空值 / 无数据** | `-`, `null`, `""`, `无数据`, `暂无数据` | `<span class="data-empty">-</span>` (灰色短横线) | 数据正常但没有值，或 API 明确告知无数据时，统一显示为短横线。 |
| **未绑定 / 未验证** | `未绑定`, `未验证` | `<span class="tag-unbound">未绑定</span>` (橘黄色外框标签) | 提示用户该资料（如手机号、银行卡）尚欠缺，需要进行绑定或验证。 |
| **无权限** | `无权限` | `<span class="tag-no-permission" title="无权限"><i class="ph-fill ph-lock"></i></span>` (单纯灰色锁头图示) | 该代理或管理员无法查看此敏感数据。滑鼠 Hover 时会有「无权限」标题提示。 |
| **获取失败** | `获取失败` | `<span class="data-error" title="获取失败"><i class="ph-fill ph-warning-circle"></i></span>` (单纯灰色警示图示) | API 请求超时或后端错误。滑鼠 Hover 时会有「获取失败」标题提示。 |
| **解析异常** | `NaN-NaN-NaN`, `解析异常` | `<span class="tag-parse-error" title="原数据异常，无法正确解析">解析异常</span>` (黄底红字标签) | 日期或数字格式错误，前端无法解析。 |
| **载入中** | `载入中` | `<span class="data-loading" title="载入中"><i class="ph ph-spinner ph-spin"></i></span>` (单纯灰色旋转图示) | 数据正在非同步获取中，请稍候。滑鼠 Hover 时会有「载入中」标题提示。 |

## 2. 表格载入状态 (Skeleton Loading)

当表格整批资料加载时（如初次载入、换页、切换排版模式），会采用**骨架屏 (Skeleton Loading)** 效果取代原本单一的载入图示。
- 显示符合当下栏位宽度的灰色闪烁骨块。
- 载入完成后渐进式替换为真实资料，提供更顺畅的视觉过渡。

## 3. 栏位互动效果

- **头像栏位**：预设的圆形灰色头像（`<div class="user-avatar-circle-grey">`），在滑鼠移入 (Hover) 时会平滑放大 1.5 倍，并带有微幅阴影，提升互动感。
- **使用者标签**：异常风险（红色）、VIP大户（黄色）、活跃正常（绿色），表格底色会同步整行提示。
