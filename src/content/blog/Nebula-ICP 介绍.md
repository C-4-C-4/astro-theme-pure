---
title: 'Nebula.ICP 介紹' 
description: '一個基於 Cloudflare D1 的去中心化、賽博朋克風格的數字實體檔案庫系統。無服務器架構，邊緣秒級響應。' 
publishDate: '2025-12-05 00:00:00' 
tags:
  - REPORT
  - Astro
  - Cloudflare
heroImage: { src: 'https://img.scdn.io/i/693204c56ba60_1764885701.webp', alt: 'NEBULA.ICP 封面圖', color: '#1A1A1A', inferSize: true }
draft: false 
language: '繁體中文' 
comment: true 
---

# 🌌 NEBULA.ICP | Decentralized Filing System

![Style](https://img.shields.io/badge/Style-Neo--Brutalism-orange?style=for-the-badge&labelColor=000)
![Astro](https://img.shields.io/badge/Astro-4.0-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages%20%2B%20D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

> **"We are not filing domains; we are giving digital entities an identity."**
>
> 一個基於 Cloudflare D1 的去中心化、賽博朋克風格的數字實體檔案庫系統。無服務器架構，邊緣秒級響應。

---

## 🏗️ 1. 項目介紹 (Introduction)

**NEBULA.ICP** 是一個極簡主義、高可視化的模擬 ICP 備案系統。它不僅僅是一個表單，更是一個具有 **賽博朋克/黑客終端** 美學的數字檔案館。系統摒棄了傳統後台的繁瑣，採用「三要素驗證」機制（域名+備案號+私鑰）實現無賬戶的修改與註銷。

### 👥 作者與維護
* **Author**: [C-4-C-4](https://github.com/C-4-C-4)
* **Repository**: [NEBULA-ICP](https://github.com/C-4-C-4/NEBULA-ICP)
* **Role**: Architect / Operator

### 🛠️ 技術棧 (Tech Stack)
* **核心框架**: [Astro (SSR Mode)](https://astro.build/) - 極致的渲染性能與服務端渲染能力。
* **交互組件**: [React](https://react.dev/) - 處理複雜的後台管理、選號大廳、終端模擬動畫。
* **樣式庫**: [Tailwind CSS](https://tailwindcss.com/) - 快速構建工業機能風、新野獸派佈局。
* **數據庫**: **Cloudflare D1 (SQLite)** - 運行在邊緣節點的分佈式 SQL 數據庫。
* **托管**: **Cloudflare Pages** - 全球 CDN 加速與自動化構建。
* **鑑權**: **Admin Session (Cookie)** + **User Auth Code (Private Key)**。

---

## ✨ 2. 特色功能與實現原理 (Features)

### 🖥️ 沉浸式終端 UI (Immersive Terminal UI)
* **終端模擬**: 申請過程包含 4 秒的系統自檢與數據上鏈動畫，拒絕生硬的表單提交。
* **無感交互**: 全站移除原生彈窗 (`alert`)，採用自定義的 Toast 通知條與模態框。
* **視覺反饋**: 按鈕具備機械按壓感、懸停光效；列表頁支持隨機洗牌動畫。

### 🤖 自動化與智能化 (Automation)
* **自動快照**: 集成 WordPress mShots 服務，提交域名即刻生成高清網站截圖。
* **智能 Logo**: 集成 Favicon.im / Iowen API，多級容錯獲取網站圖標，防裂圖處理。
* **防重機制**: 內置域名查重、備案號防碰撞邏輯。

### 🔐 選號與安全系統 (Security & Selection)
* **選號大廳**: 用戶可在 `2025` 號段池中搜索心儀的靚號，或使用隨機推薦。
* **私鑰驗證**: 用戶申請成功後獲得唯一 8 位私鑰 (`Auth Code`)，憑此碼修改或註銷，無需註冊賬戶。
* **安全風控**:
    * **限流**: 單 IP 限制 1 小時內提交 6 次。
    * **黑名單**: 後台可一鍵拉黑惡意域名，前台提交時自動攔截並提示申訴郵箱。

### ⚡ ROOT_CONSOLE 後台 (Admin Panel)
* **功能**:
    * **全局搜索**: 支持按域名或備案號實時檢索。
    * **批量操作**: 支持多選後一鍵隱藏、一鍵刪除。
    * **審核流**: 支持 `Pending` (待審核) 狀態的通過與駁回。
    * **即時編輯**: 在卡片內直接翻轉編輯信息（含 Logo/快照/私鑰）。

---

## 🚀 3. 部署指南 (Deployment)

本項目專為 **Cloudflare Pages** 設計。請嚴格按照以下步驟操作，**不需要**傳統服務器。

### 第一步：Fork 倉庫
點擊右上角的 **Fork** 按鈕，將本項目複製到你的 GitHub 賬號下。

### 第二步：準備 Cloudflare D1 數據庫
1.  安裝 Wrangler CLI: `npm install -g wrangler`
2.  登錄 Cloudflare: `wrangler login`
3.  創建數據庫: `wrangler d1 create icp-db`
4.  **記錄控制台輸出的 `database_id`。**

### 第三步：配置 Cloudflare Pages
1.  登錄 [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**。
2.  選擇你的倉庫，配置如下：
    * **Framework preset**: `Astro`
    * **Build command**: `npm run build`
    * **Output directory**: `dist`
3.  **設置環境變量 (Environment Variables)**:
    * `ADMIN_PASSWORD`: 設置你的後台登錄密碼 (例如 `nebula-admin-888`)。

### 第四步：綁定數據庫 & 初始化
1.  部署完成後（第一次可能會失敗，不用管），進入項目 **Settings** -> **Functions**。
2.  找到 **D1 database bindings**。
3.  點擊 **Add binding**：
    * **Variable name**: `DB` (必須是大寫 DB)
    * **D1 database**: 選擇你在命令行創建的 `icp-db`。
4.  **重新部署**: 進入 **Deployments** -> 找到最新一次 -> 點擊 **Retry deployment**。
5.  **初始化表結構**: 在本地終端運行以下命令（將表結構推送到雲端）：
    ```bash
    npx wrangler d1 execute icp-db --remote --file=./db/schema.sql
    ```

---

## 📖 4. 操作手冊 (Operation Manual)

### 📝 用戶端
* **申請收錄**: 訪問首頁 -> 填寫信息 -> (可選)去選號大廳選號 -> 提交 -> 獲取 HTML 代碼與私鑰。
* **查詢檔案**: 訪問 `/archives` -> 瀏覽或搜索。
* **修改/註銷**: 點擊導航欄 `/// 修改` 或 `/// 註銷` -> 輸入域名、備案號、私鑰 -> 驗證通過後操作。

### 🛡️ 管理端
* **登錄**: 訪問 `/admin` -> 輸入環境變量中設置的密碼。
* **審核**: 在 `PENDING` 標籤頁查看待審核項目 -> 點擊 `PASS` 或 `REJECT`。
* **黑名單**: 在 `REJECTED` 標籤頁可點擊 `UNBAN` 解除封禁。
* **數據管理**: 可直接修改用戶的 Logo、快照鏈接，甚至重置用戶的私鑰。

---

## 📊 5. 項目統計 (Statistics)

### ⭐ Stargazers over time
[![Stargazers over time](https://starchart.cc/C-4-C-4/NEBULA-ICP.svg?variant=adaptive)](https://starchart.cc/C-4-C-4/NEBULA-ICP)

---

### ⚠️ 免責聲明
本項目僅供學習與娛樂使用，生成的「備案號」無法律效力，請勿用於非法用途。美術風格致敬 Project Echo。

---

**SYSTEM.ADMIN // END_OF_FILE**