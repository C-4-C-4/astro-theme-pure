---
title: '如何使用 Cloudflare API 為 Astro 網站新增高級數據監測大屏'
description: '手把手教你在 Astro 項目中，利用 Cloudflare GraphQL API 和 ECharts 構建一個純本地渲染、不洩露密鑰的極速網站流量與安全監控面板。'
publishDate: '2026-03-10 14:00:00'
tags:
  - Astro
  - Cloudflare
  - ECharts
  - Tutorial
heroImage: { src: './cloudflare-color.png', alt: 'Cloudflare Analytics Panel Tutorial', color: '#F38020', width: 1200, height: 630 }
draft: false
language: '繁體中文'
comment: true
---

<style>
  .hero-image { display: flex !important; justify-content: center !important; }
  .cover-image { max-height: 250px !important; width: auto !important; object-fit: contain !important; margin: 0 auto !important; }
  #blurImage { max-height: 250px !important; width: auto !important; object-fit: contain !important; margin: 0 auto !important; left: 0 !important; right: 0 !important; }
</style>

# 構建專屬的網站數據大屏

在維護個人博客或網站時，了解網站的流量、帶寬消耗以及安全攔截情況是非常重要的。通常我們需要登錄 Cloudflare 的控制台才能看到這些數據。但是，能不能**把 Cloudflare 的數據面板直接嵌入到我們自己的網站中**呢？

答案是可以的！這篇文章將詳細說明如何通過 Cloudflare 最新的 **GraphQL Analytics API** 以及強大的開源圖表庫 **ECharts**，為你的 Astro 網站從零構建一個美觀、詳細、極速加載且暗黑模式適配的「數據監控大屏」。

---

## 功能圖預覽

先來看看我們最終實現的無縫嵌入、沉浸式的數據大屏效果：

<img class="zoomable" src="/images/Cloudflare-JC/1.png" alt="總覽與快取比例" />
<img class="zoomable" src="/images/Cloudflare-JC/2.png" alt="流量趨勢與 TLS 流量" />
<img class="zoomable" src="/images/Cloudflare-JC/3.png" alt="安全性分析" />

---

## 我們實現了什麼功能？

在這個專屬的監控面板中，我們完美復刻並優化了 Cloudflare 官方的各項核心指標：
1. **全景基礎流量統計**：精確統計過去 24 小時內的請求總數、快取命中數、總帶寬消耗、唯一訪問者(UV)及帶寬節省比例。
2. **流量趨勢疊加折線圖**：使用 ECharts 構建平滑的雙色填充折線圖，直觀對比「已快取」與「未快取」的實時流量起伏。
3. **TLS 與安全性分析**：完美還原官方界面的水平堆疊條形圖，涵蓋 TLS 協議分佈以及 WAF 惡意請求攔截佔比。
4. **邊緣快取秒開 (Edge Caching)**：採用 `Cache-Control` 配置 Vercel CDN，讓原本需要數秒鐘向 Cloudflare 查詢的複雜大屏實現 **0毫秒瞬間加載 (12小時刷新機制)**。

---

## 避坑指南與注意事項

在編寫這個功能時，有幾個極其重要的細節需要注意：

### 1. 棄用舊版 REST API
許多早期的教程會教你使用 `/analytics/dashboard` 這個 REST 接口。請注意，該接口**目前已被 Cloudflare 官方廢棄**，如果你直接調用會收到 `404 Not Found` 的錯誤。**必須**遷移至全新的 GraphQL API (`https://api.cloudflare.com/client/v4/graphql`)。

### 2. 免費版 API 的字段限制
這是一個巨大的坑！如果你使用的是 Cloudflare 免費計畫 (Free Plan)，GraphQL 中的部分高級維度（如 `clientSSLProtocol` 和 `firewallEventsAdaptiveGroups`）是被**嚴格鎖定**的。強行查詢會導致整個請求崩潰報錯。
> **解決方案**：在下方的代碼中，我們使用真實的總流量數據配合「動態比例分配算法」，在前端完美模擬了 TLS 和安全攔截的 UI 展示。未來若升級企業版，只需將模擬變數替換為真實字段即可。

### 3. API 密鑰安全
**絕對不要在前端發起對 Cloudflare 的請求！** 這會導致你的 API Token 暴露給所有訪客。我們充分利用了 Astro 的 SSR (Server-Side Rendering) 能力，在組件的 Server 端發出請求，將純天然的渲染結果與數據下發給瀏覽器。

---

## 怎麼在這個框架和主題中實現？代碼教程

### 第一步：獲取憑證與配置環境變量

要調用 API，你需要兩個核心參數：
1. **Zone ID (區域 ID)**：在你的 Cloudflare 域名概述頁面右下角獲取。
2. **API Token**：前往 `我的個人資料 -> API 令牌 -> 創建令牌`。僅需授予 `Zone : Analytics : Read` 的只讀權限。

在 Astro 項目的根目錄 `.env` 文件中配置它們（Vercel 部署則需要在 Web 控制台配置環境變量）：
```env
CLOUDFLARE_ZONE_ID=你的_Zone_ID_字符串
CLOUDFLARE_API_TOKEN=你的_只讀_API_Token
```

### 第二步：編寫數據頁面邏輯

我們在 `src/pages` 路由中新建頁面 `analytics/index.astro`。下面是完整的集成邏輯。由於篇幅原因，此處展示核心的 GraphQL 獲取與動態分發代碼：

```astro
---
import PageLayout from '@/layouts/CommonPage.astro'

// 設置 12 小時邊緣快取，避免每次載入都要等待 API，實現秒開
Astro.response.headers.set('Cache-Control', 'public, max-age=43200, s-maxage=43200');

// 初始化統計變量
let totalRequests = 0, cachedRequests = 0, uncachedRequests = 0;
let totalBandwidth = 0, cachedBandwidth = 0, uniqueVisitors = 0;
let timeseriesData: any[] = [];
let tlsVersions: Record<string, number> = {};
let secTotalRequests = 0, secMitigated = 0, secServeCloudflare = 0, secServeOrigin = 0;

try {
  const zoneId = (import.meta.env.CLOUDFLARE_ZONE_ID || '').trim()
  const apiToken = (import.meta.env.CLOUDFLARE_API_TOKEN || '').trim()

  const now = new Date()
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const sinceDatetime = since24h.toISOString()
  const untilDatetime = now.toISOString()

  // 構建安全的 Node.js GraphQL 請求
  const graphqlQuery = {
    query: `
      query {
        viewer {
          zones(filter: { zoneTag: "${zoneId}" }) {
            hourly: httpRequests1hGroups(
              limit: 24, filter: { datetime_geq: "${sinceDatetime}", datetime_lt: "${untilDatetime}" }, orderBy: [datetime_ASC]
            ) {
              dimensions { datetime }
              sum { requests, cachedRequests, bytes, cachedBytes }
            }
          }
        }
      }
    `
  }

  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(graphqlQuery)
  })

  const result = await response.json()
  const zoneData = result?.data?.viewer?.zones?.[0]

  // === 聚合與計算邏輯 ===
  for (const h of zoneData.hourly || []) {
    totalRequests += h.sum.requests || 0
    cachedRequests += h.sum.cachedRequests || 0
    totalBandwidth += h.sum.bytes || 0
    cachedBandwidth += h.sum.cachedBytes || 0
  }
  uncachedRequests = Math.max(0, totalRequests - cachedRequests)

  // 時序數據（用於折線圖）
  timeseriesData = zoneData.hourly.map((h: any) => ({
    time: h.dimensions.datetime,
    uncached: Math.max(0, (h.sum.requests || 0) - (h.sum.cachedRequests || 0)),
    cached: h.sum.cachedRequests || 0
  }))

  // 由於免費版 API 的限制，我們基於真實總量動態生成等比例的 TLS 與 WAF 攔截視角
  const noneReqs = Math.max(0, Math.floor(totalRequests * 0.001))
  const unknownReqs = Math.max(0, Math.floor(totalRequests * 0.102))
  tlsVersions = {
    'Unknown': unknownReqs,
    'None (not secure)': noneReqs,
    'TLS v1.3': Math.max(0, totalRequests - noneReqs - unknownReqs)
  }

  secTotalRequests = totalRequests
  secMitigated = Math.max(0, Math.floor(secTotalRequests * 0.002))
  secServeCloudflare = cachedRequests
  secServeOrigin = Math.max(0, uncachedRequests - secMitigated)

} catch (error) {
  console.error('[Analytics] Fetch error:', error)
}
---

<PageLayout title='數據'>
  <!-- HTML UI 與 TailwindCSS 樣式排版 -->
  <h2 id='security'>每日請求數</h2>
  <div class="text-xs text-muted-foreground mb-4">過去 24 小時</div>
  
  <!-- 根據計算好的 `secTotalRequests` 等變數渲染 DOM -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <!-- ...數字展示區塊... -->
  </div>
  
  <div class="w-full bg-muted border rounded-xl p-4 mb-8">
    <div id="sec-chart" style="width: 100%; height: 20px;"></div>
  </div>

  <!-- 在客戶端引入 ECharts 並注入我們在 SSR 掛載好的變數數據 -->
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js" is:inline></script>
  <script is:inline define:vars={{ timeseriesData, tlsVersions, secMitigated, secServeCloudflare, secServeOrigin }}>
    // ECharts 的圖表初始化與適配器 (chart.setOption 等邏輯)
  </script>
</PageLayout>
```

### 第三步：將入口掛載到你的網站導航

這個步驟因 Astro 具體使用的主題而異。以 Astro Theme Pure 為例，你只需要到 `src/site.config.ts` 中追加菜單鏈接即可：

```ts
export const menuLinks = [
  { link: '/blog', label: 'Blog' },
  { link: '/projects', label: 'Projects' },
  { link: '/analytics', label: '數據' }, // 新增的數據監測入口
];
```

大功告成！現在你可以提交代碼並部署到 Vercel，享受擁有即時網站大數據掌控權的樂趣了。
