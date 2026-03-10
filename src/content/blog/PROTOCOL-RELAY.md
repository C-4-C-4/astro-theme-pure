---
title: 'PROTOCOL-RELAY 介紹' 
description: '一個基於 Astro + React 構建的磁帶未來主義（Cassette Futurism）風格 Git 加速工具，透過 CDN 邊緣節點轉發流量實現高速訪問。' 
publishDate: '2025-12-27 00:00:00' 
tags:
  - REPORT
  - Astro
  - React
heroImage: { src: 'https://img.scdn.io/i/694fb64ab695c_1766831690.webp', alt: 'PROTOCOL-RELAY 封面圖', color: '#1A1A1A', inferSize: true }
draft: false 
language: '繁體中文' 
comment: true 
---

# PROTOCOL-RELAY // GIT ACCELERATOR

> **/// BUREAU OF DATA TRANSPORT // SECURE CHANNEL**
>
> 一個基於 Astro + React 構建的磁帶未來主義（Cassette Futurism）風格 Git 加速工具。

![License](https://img.shields.io/badge/license-MIT-orange.svg)
![Style](https://img.shields.io/badge/style-Cassette_Futurism-black.svg)
![Deployed](https://img.shields.io/badge/deployed_on-EdgeOne_Pages-blue.svg)

## 📖 簡介 (Introduction)

**PROTOCOL-RELAY** 是一個極簡的 GitHub 文件與倉庫加速前端。它不存儲任何文件，而是作為一個「協議中繼」，透過 CDN 邊緣節點轉發流量，實現高速訪問 GitHub 資源。

項目採用了冷峻的工業復古設計風格（Project Nebula），模擬行政審批與數據終端的交互體驗。

### ✨ 核心特性
*   **0 存儲成本**：純前端頁面，利用 EdgeOne 進行回源加速。
*   **智能解析**：支持完整 URL 輸入，也支持 `user/repo` 簡寫模式。
*   **多協議支持**：一鍵生成 `Git Clone`、`Wget`、`cURL` 及 `Raw` 鏈接。
*   **直接下載**：提供 ZIP 源碼包或單文件的 Direct Download 按鈕。
*   **極致性能**：基於 Astro 構建，EdgeOne 邊緣分發。

---

## 📂 目錄結構 (Directory Structure)

```text
PROTOCOL-RELAY/
├── public/                 # 靜態資源文件
├── src/
│   ├── components/         # React 組件庫
│   │   └── ProtocolTerminal.jsx  # 核心交互終端（解析邏輯所在）
│   ├── layouts/            # 頁面佈局文件
│   │   └── Layout.astro    # 全局佈局（字體、背景網格）
│   └── pages/              # 路由頁面
│       └── index.astro     # 首頁組裝
├── astro.config.mjs        # Astro 配置文件 (集成 React & Tailwind)
├── tailwind.config.mjs     # Tailwind 樣式配置 (定義復古配色與字體)
├── package.json            # 項目依賴
└── README.md               # 說明文檔
```

---

## 🕹️ 使用方法 (Usage)

1.  **訪問終端**：打開部署好的網站。
2.  **輸入目標**：在輸入框中填入 GitHub 鏈接或倉庫名。
    *   *支持格式 1 (完整鏈接)*: `https://github.com/torvalds/linux`
    *   *支持格式 2 (簡寫)*: `torvalds/linux`
    *   *支持格式 3 (具體文件)*: `https://github.com/torvalds/linux/blob/master/README`
3.  **發起協議**：點擊橘色的 **INITIATE PROTOCOL // 提交申請** 按鈕。
4.  **獲取清單**：等待「蓋章」批准後，複製下方的加速命令：
    *   **GIT CLONE**: 用於克隆倉庫。
    *   **WGET**: 用於 `wget` 下載。
    *   **cURL**: 用於 `curl` 下載。
    *   **ACCELERATED RAW URL**: 原始文件的加速直鏈。
    *   **Direct Download**: 瀏覽器直接下載 ZIP 包或文件。

---

## 🚀 部署方法 (Deployment)

本項目分為 **前端托管** 和 **CDN 加速配置** 兩部分，推薦使用 **騰訊雲 EdgeOne** 一站式完成。

### 1. 本地環境準備
```bash
# 克隆項目
git clone https://github.com/C-4-C-4/PROTOCOL-RELAY.git
cd PROTOCOL-RELAY

# 安裝依賴 (推薦使用 npm)
npm install

# 本地調試
npm run dev
```

### 2. 前端部署 (EdgeOne Pages)
1.  將代碼推送到你的 GitHub 倉庫。
2.  登錄 [騰訊雲 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)，進入 **Pages (頁面托管)**。
3.  點擊 **新建項目**，連接你的 GitHub 倉庫。
4.  配置構建參數：
    *   **框架預設**: `Astro`
    *   **構建命令**: `npm run build`
    *   **構建目錄**: `dist`
5.  點擊部署，等待完成。

### 3. 加速通道配置 (核心步驟)
為了讓加速鏈接真正生效，你需要配置一個自定義域名作為「中繼隧道」。

1.  **添加站點**：在 EdgeOne 控制台添加你的域名（如 `example.com`）。
2.  **添加加速域名**：
    *   新增子域名（如 `git.example.com`）。
    *   **源站地址**: `github.com`
    *   **源站協議**: `HTTPS` (端口 443)
3.  **修改回源 Host (至關重要)**：
    *   進入該域名的配置頁面 -> **回源配置**。
    *   將 **回源 Host** 修改為 **自定義 Host**。
    *   填入：`github.com`
    *   *注意：不修改此項會導致 502 錯誤。*
4.  **配置 HTTPS**：
    *   在域名管理中申請免費證書並開啟強制 HTTPS。
5.  **修改前端代碼**：
    *   打開 `src/components/ProtocolTerminal.jsx`。
    *   修改 `const EDGE_DOMAIN` 的值為你剛才配置的加速域名（如 `https://git.example.com`）。
    *   重新推送代碼部署。

---

## 👤 作者 (Author)

**CCCC4444**

*   Github: [@C-4-C-4](https://github.com/C-4-C-4)
*   Project Repo: [PROTOCOL-RELAY](https://github.com/C-4-C-4/PROTOCOL-RELAY)

---

> */// SYSTEM STATUS: ONLINE*
> */// END OF TRANSMISSION*