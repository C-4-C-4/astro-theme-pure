---
title: '如何使用 Cloudflare API 為 Astro 網站新增高級數據監測大屏'
description: '手把手教你在 Astro 項目中，利用 Cloudflare REST API 和 ECharts 構建一個純本地渲染、不洩露密鑰的網站流量與安全監控面板。'
publishDate: '2026-03-10 14:00:00'
tags:
  - Astro
  - Cloudflare
  - ECharts
  - Tutorial
heroImage: { src: 'https://img.cdn1.vip/i/69afb4c2dd936_1773122754.webp', alt: 'Cloudflare Analytics Panel Tutorial', color: '#F38020', width: 1200, height: 630 }
draft: false
language: '繁體中文'
comment: true
---

# 構建專屬的網站數據大屏

<div style="text-align: center; margin: 2rem 0;">
  <img src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/cloudflare-color.png" alt="Cloudflare Icon" style="max-height: 120px; width: auto; margin: 0 auto; display: block;" />
</div>

在維護個人博客或網站時，了解網站的流量、帶寬消耗以及安全攔截情況是非常重要的。通常我們需要登錄 Cloudflare 的控制台才能看到這些數據。但是，能不能**把 Cloudflare 的數據面板直接嵌入到我們自己的網站中**呢？

答案是可以的！這篇文章將詳細說明如何通過 Cloudflare 提供的 REST API 以及強大的開源圖表庫 **ECharts**，為你的 Astro 網站從零構建一個美觀、詳細且暗黑模式適配的“數據監控大屏”。

---

## 為什麼這樣做？

1. **無需頻繁登錄**：直接在自己網站的 `/analytics` 路徑即可查看流量。
2. **數據隱私與安全**：我們將利用 Astro 的 **SSR（服務端渲染）** 能力。在服務器端發起 API 請求，前端只負責繪製圖表。**用戶的瀏覽器永遠不會知道你的 Cloudflare API 密鑰**。
3. **完全自定義的 UI**：借助 ECharts，我們可以完美復刻 Cloudflare 的官方 UI，並結合我們自己的網站主題進行樣式微調。

---

## 準備工作：獲取 Cloudflare 憑證

要調用 API，你需要兩個核心參數：

1. **Zone ID (區域 ID)**：在你的 Cloudflare 網站域名的“概述”頁面右下角。
2. **API Token**：前往 `我的個人資料 -> API 令牌 -> 創建令牌`。權限要求非常低，只需要授予 `Zone : Analytics : Read` 的只讀權限即可，確保了極高的安全性。

---

## 第一步：配置環境變量

在 Astro 項目的根目錄，我們新增一個 `.env` 文件來存儲密鑰，並通過 `.env.example` 來記錄所需字段。

**新建或編輯 `.env`：**
```env
CLOUDFLARE_ZONE_ID=你的_Zone_ID_字符串
CLOUDFLARE_API_TOKEN=你的_只讀_API_Token
```

*注意：如果你將代碼部署到 Vercel，請務必在 Vercel 項目設置的 Environment Variables 中添加這兩個值。*

---

## 第二步：編寫數據監控中心頁面

我們在 `src/pages` 路由庫中新建一個獨立的頁面文件 `analytics/index.astro`。這個文件包含了**後端獲取數據**和**前端渲染圖表**的完整邏輯。

### 1. 後端數據請求 (Server-side)

在 Astro 文件的 Frontmatter (`---` 之間) 區域，我們編寫 Node.js 執行代碼：

```astro
---
// 引入你的頁面佈局組件
import PageLayout from '@/layouts/CommonPage.astro'

// 1. 定義數據變量
let totalRequests = 0, cachedRequests = 0, uncachedRequests = 0;
let totalBandwidth = 0, cachedBandwidth = 0, uncachedBandwidth = 0;
let timeseriesData = [];
// ... 其他 HTTP 和安全相關變量

// 2. 嘗試獲取變數庫並請求 Cloudflare 接口
try {
  const zoneId = import.meta.env.CLOUDFLARE_ZONE_ID;
  const apiToken = import.meta.env.CLOUDFLARE_API_TOKEN;

  // 使用 since=-1440 獲取過去 24 小時的數據
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard?since=-1440`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const result = await response.json();
  if (result.success && result.result) {
    const data = result.result;
    
    // 解析返回的 JSON 並賦值給我們的變量
    totalRequests = data.totals.requests.all;
    totalBandwidth = data.totals.bandwidth.all;
    timeseriesData = data.timeseries.map(ts => ({
      time: ts.since,
      uncached: ts.requests.uncached,
      cached: ts.requests.cached
    }));
    // ... 處理其他你需要展示的字段
  }
} catch (error) {
  console.error('獲取數據失敗:', error);
}
---
```

### 2. 前端 UI 組件佈局

接著，構建 HTML 結構。我們使用 TailwindCSS 來創建漂亮的網格卡片（Grid Cards）來顯示總結的數字。

```html
<PageLayout title='數據大屏'>
  <!-- 摘要卡片網格 -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div class="bg-muted p-4 rounded-xl border">
      <div class="text-sm text-muted-foreground mb-1">請求總數</div>
      <div class="text-3xl font-bold">{totalRequests}</div>
    </div>
    <div class="bg-muted p-4 rounded-xl border">
      <div class="text-sm text-muted-foreground mb-1">已緩存的請求</div>
      <div class="text-3xl font-bold">{cachedRequests}</div>
    </div>
    <!-- 更多卡片... -->
  </div>

  <!-- ECharts 圖表容器 -->
  <div class="w-full bg-muted border rounded-xl p-4 mb-8">
    <div id="echarts-container" style="width: 100%; height: 400px;"></div>
  </div>
</PageLayout>
```

### 3. 引入 ECharts 並渲染圖表 (Client-side)

在頁面底部，我們通過 CDN 引入 ECharts 庫，並編寫在瀏覽器運行的 JS 腳本。

```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js" is:inline></script>

<!-- define:vars 允許我們把服務器端抓取到的變量傳遞給瀏覽端的 JS -->
<script is:inline define:vars={{ timeseriesData }}>
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('echarts-container');
    const chart = echarts.init(container);
    
    // 將數據格式化為 ECharts 需要的數組
    const times = timeseriesData.map(d => new Date(d.time).toLocaleTimeString());
    const uncached = timeseriesData.map(d => d.uncached);
    const cached = timeseriesData.map(d => d.cached);

    // 核心繪圖配置
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['未緩存', '已緩存'] },
      xAxis: [{ type: 'category', data: times }],
      yAxis: [{ type: 'value' }],
      series: [
        {
          name: '未緩存',
          type: 'line',
          stack: 'Total',
          areaStyle: {}, // 啟用面積填色
          data: uncached,
          itemStyle: { color: '#3b82f6' }
        },
        {
          name: '已緩存',
          type: 'line',
          stack: 'Total',
          areaStyle: {}, 
          data: cached,
          itemStyle: { color: '#10b981' }
        }
      ]
    });

    // 兼顧響應式佈局
    window.addEventListener('resize', () => chart.resize());
  });
</script>
```

---

## 第三步：將新頁面加入全局導航

圖表頁寫好後，為了方便訪問，我們需要修改網站的首頁導航配置。

打開 `src/site.config.ts`：

```ts
export const menuLinks = [
  { link: '/blog', label: 'Blog' },
  { link: '/projects', label: 'Projects' },
  // 新增下面這行
  { link: '/analytics', label: '數據' },
];
```
（具體的菜單配置數組形式取決於你的 Astro 主題配置，本次我們在 `site.config.ts` 的 `menu` 數組中進行了追加）。

---

## 避坑總結與額外優化

1. **圖表 Fallback 機制**：如果你處於本地開發環境但沒有配置 `.env`，可以寫一段 `if (import.meta.env.DEV)` 邏輯來自動生成模擬 (Mock) 數據。這能幫助你在不發送真實請求的情況下專心調試 UI 佈局。
2. **主題自適應**：Astro 主題通常會動態切換 `<html>` 的 `.dark` 類。在 ECharts 配置中，你可以使用 `MutationObserver` 監聽 `.dark` 類的變化，並動態調用 `chart.setOption()` 來修改文字顏色和網格線的顏色，以實現像素級的日夜間模式完美過渡。
3. **API 額度**：雖然 Cloudflare 的 Analytics API 調用限制比較寬鬆，但在高頻訪問的情況下，SSR 會讓伺服器頻繁請求 Cloudflare。在後續，如果你的網站流量很大，建議引入 KV 或 Redis 進行短暫的數據快取緩存。

現在，每次進入你的網站點開“數據”選單，你都會看到一塊專屬於你、實時更新且極具極客精神的流量大屏了！
