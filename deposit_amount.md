# 存取款資料卡片 UI/UX 規格書 (單卡雙欄對比版)

**最後更新日期:** 2026-09-25
**適用場景:** 企業級後台 - 會員列表的「表格展開列 (Expanded Row)」內的高密度財務數據展示。

---

## 1. 模組概述

為了解決原先設計中「多幣種彈窗干擾心流」以及「拆分雙卡片導致空間浪費」的問題，本組件採用 **「共用標籤、單卡雙視角、限制高度自動換欄」** 的設計模式。
讓使用者能在單一視圖中，無縫對比「單一錢包(可切換幣種)」與「全域匯總(固定 USDT)」的財務數據。

---

## 2. 業務與交互邏輯 (Business & Interaction Logic)

### 2.1 雙重數據視角分離
組件內包含兩組獨立的資料流：
*   **主錢包 (動態)：** 透過右上角的下拉選單切換幣種（如 RMB、VND、PHP）。切換時，僅更新主錢包欄位的數值與微型表頭的單位標示。
*   **匯總 (靜態綁定)：** 定義為「所有錢包餘額折算成 USDT 的總和」。此數據為全域固定，**絕對不會**因為主錢包的幣種切換而產生變動。

### 2.2 數值格式化規則
*   **USDT 幣種：** 無論是主錢包或匯總，預設保留兩位小數 (例如: `5,000.00`)。
*   **非 USDT 幣種 (RMB, VND, PHP 等)：** 由於面額特性，主錢包顯示為 **整數** 格式，去除小數點 (例如: RMB `27,270`)。
*   **零值弱化：** 若數值為 `0` 或 `0.00`，字體顏色自動降級為灰色 (Slate-400)，降低視覺噪音。
*   **正負值高亮：** 標籤包含「加款」的項目顯示為綠色 (Emerald)；包含「扣款」的項目顯示為紅色 (Red)。

---

## 3. 核心佈局與排版 (Layout Structure)

### 3.1 高度控制與自動換欄 (Data Chunking)
為避免在展開列中卡片過高，實施嚴格的高度控制演算法：
*   **單欄最大行數 (Max Rows)：** `4` 行。
*   **換欄機制：** 當資料項目超過 4 筆時，組件內部會將資料進行切塊 (Chunking)，並透過 CSS Grid 強制將第 5 筆資料排列至右側形成第二個區塊。

### 3.2 結構化微型表頭 (Micro-Headers)
當資料被拆分到多個欄位時，每一個欄位頂部都必須帶有獨立的微型表頭，確保使用者視線移動到右側時不會迷失數據定義。
*   格式：`[ 項目空白 ]` | `主錢包 ({當前選擇幣種})` | `匯總 (USDT)`

---

## 4. 視覺與 CSS 規範 (Tailwind 樣式對照)

本組件基於 Tailwind CSS 開發，以下為關鍵結構的樣式設定：

### 4.1 頂部控制區 (Header & Controls)
*   **卡片容器 (Card Container):** 
    *   `rounded-xl flex flex-col bg-white border border-slate-200 shadow-sm min-w-max`
    *   備註: `min-w-max` 確保內部表格文字不會因為外層擠壓而被迫換行。
*   **標題列 (Header Bar):** 
    *   `px-5 py-3.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/80 rounded-t-xl gap-8`
*   **互動下拉選單 (主錢包):** 
    *   `text-[13px] font-medium px-2.5 py-1.5 rounded-md border text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100` (選中主幣種時的狀態)
*   **靜態標籤 (匯總 USDT):** 
    *   `text-[13px] font-medium px-2.5 py-1.5 rounded-md bg-indigo-50/50 text-indigo-700 border border-indigo-100/50 cursor-not-allowed`

### 4.2 數據網格區 (Body & Grid)
*   **外層網格 (Wrapper Grid):** 
    *   `grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8` (控制換欄間距)
*   **微型表頭 (Micro-Header):** 
    *   `flex text-[11px] font-bold text-slate-400 mb-3 pb-2 border-b border-slate-100`
*   **資料列 (Data Row):**
    *   `flex items-center justify-between text-[13px]`
*   **對齊與寬度控制 (Alignment & Width - 關鍵):**
    *   **標籤 (Label):** `w-[100px] shrink-0 text-slate-500 font-medium whitespace-nowrap`
    *   **數值群組 (Values Flex):** `flex flex-1 justify-end items-center gap-2 sm:gap-6 pl-2`
    *   **個別數值容器 (Value Cell):** `w-[90px] text-right font-mono font-semibold`
    *   **匯總數值底色 (Summary Cell Highlight):** `bg-indigo-50/40 py-0.5 rounded border border-indigo-50/50` (透過微弱底色區分兩種數據)

---

## 5. 建議資料結構 (JSON Model)

為了符合上述視圖邏輯，前端接收的資料應將「全域總和」與「單一錢包」徹底解耦：

```json
{
  "financials": {
    "globalSummary": {
      "存款總額": "41,100.00",
      "存款次數": "120",
      // ... 其他匯總數據
    },
    "wallets": {
      "USDT": {
        "data": [
          { "label": "存款總額", "wallet": "5,000.00" },
          // ... USDT 錢包獨立數據
        ]
      },
      "VND": {
        "data": [
          { "label": "存款總額", "wallet": "22,326,998" },
          // ... VND 錢包獨立數據 (整數)
        ]
      }
    }
  }
}
```