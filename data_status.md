# 數據狀態定義 (Data Status Definitions)

本文件記錄了會員管理系統中各項數據狀態的呈現方式與定義。

## 1. 基礎數據狀態

| 狀態名稱 | 原始值範例 | UI 呈現設計 | 說明 |
| :--- | :--- | :--- | :--- |
| **空值 / 無數據** | `-`, `null`, `""`, `無數據`, `暫無數據` | `<span class="data-empty">-</span>` (灰色短橫線) | 數據正常但沒有值，或 API 明確告知無數據時，統一顯示為短橫線。 |
| **未綁定 / 未驗證** | `未綁定`, `未驗證` | `<span class="tag-unbound">未綁定</span>` (橘黃色外框標籤) | 提示用戶該資料（如手機號、銀行卡）尚欠缺，需要進行綁定或驗證。 |
| **無權限** | `無權限` | `<span class="tag-no-permission" title="無權限"><i class="ph-fill ph-lock"></i></span>` (單純灰色鎖頭圖示) | 該代理或管理員無法查看此敏感數據。滑鼠 Hover 時會有「無權限」標題提示。 |
| **獲取失敗** | `獲取失敗` | `<span class="data-error" title="獲取失敗"><i class="ph-fill ph-warning-circle"></i></span>` (單純灰色警示圖示) | API 請求超時或後端錯誤。滑鼠 Hover 時會有「獲取失敗」標題提示。 |
| **解析異常** | `NaN-NaN-NaN`, `解析異常` | `<span class="tag-parse-error" title="原數據異常，無法正確解析">解析異常</span>` (黃底紅字標籤) | 日期或數字格式錯誤，前端無法解析。 |
| **載入中** | `載入中` | `<span class="data-loading" title="載入中"><i class="ph ph-spinner ph-spin"></i></span>` (單純灰色旋轉圖示) | 數據正在非同步獲取中，請稍候。滑鼠 Hover 時會有「載入中」標題提示。 |

## 2. 表格載入狀態 (Skeleton Loading)

當表格整批資料加載時（如初次載入、換頁、切換排版模式），會採用**骨架屏 (Skeleton Loading)** 效果取代原本單一的載入圖示。
- 顯示符合當下欄位寬度的灰色閃爍骨塊。
- 載入完成後漸進式替換為真實資料，提供更順暢的視覺過渡。

## 3. 欄位互動效果

- **頭像欄位**：預設的圓形灰色頭像（`<div class="user-avatar-circle-grey">`），在滑鼠移入 (Hover) 時會平滑放大 1.5 倍，並帶有微幅陰影，提升互動感。
- **使用者標籤**：異常風險（紅色）、VIP大戶（黃色）、活躍正常（綠色），表格底色會同步整行提示。
