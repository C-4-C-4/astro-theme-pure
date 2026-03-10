---
title: 'Nebula.SYS 介紹' 
description: '一個致敬《明日方舟：終末地》工業機能美學的現代化博客系統。' 
publishDate: '2025-12-02 00:00:00' 
tags:
  - REPORT
  - Next.js
  - 全棧
heroImage: { src: 'https://img.scdn.io/i/692dcd265ba3a_1764609318.webp', alt: 'Nebula.SYS 封面圖', color: '#1A1A1A', width: 1200, height: 630 }
draft: false 
language: '繁體中文' 
comment: true 
---

# 🌌 Project Nebula | Nebula Blog System

![Endfield Style](https://img.shields.io/badge/Style-Arknights%3A%20Endfield-FCEE21?style=for-the-badge&labelColor=000)
![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

> **"協議已啓動。正在建立安全連接..."**
>
> 一個致敬《明日方舟：終末地》工業機能美學的現代化博客系統。無需數據庫，基於 Git 的全棧內容管理。

---

## 🏗️ 1. 項目介紹 (Introduction)

**Nebula** 是一個高度定制化的個人博客系統，旨在還原極致的「終末地」UI 風格。它不僅僅是一個靜態頁面，更是一個擁有完整後台管理、3D 可視化交互、終端模擬系統的全棧應用。

### 👥 作者與維護
* **Author**: [C-4-C-4](https://github.com/C-4-C-4)
* **Repository**: [Nebula](https://github.com/C-4-C-4/Nebula)
* **Role**: Operator / Administrator

### 🛠️ 技術棧 (Tech Stack)
* **核心框架**: [Next.js 14/15 (App Router)](https://nextjs.org/) - 混合渲染 (SSG + SSR)。
* **樣式庫**: [Tailwind CSS](https://tailwindcss.com/) - 極速構建工業風佈局。
* **動畫引擎**: [Framer Motion](https://www.framer.com/motion/) - 負責所有 UI 轉場、進入動畫、蟲洞穿越效果。
* **3D 引擎**: [React Three Fiber (Three.js)](https://docs.pmnd.rs/react-three-fiber/) - 構建星雲（Nebula）與核心（Core）場景。
* **數據層**: **Git-based CMS** - 使用 GitHub API 直接讀寫倉庫中的 JSON 和 Markdown 文件，無需傳統數據庫。
* **鑑權**: **Jose (JWT)** + Middleware - 基於 Edge Runtime 的安全驗證。

---

## ✨ 2. 特色功能與實現原理 (Features)

### 🖥️ 沉浸式 UI (Immersive UI)
* **工業機能風**: 大量使用細邊框、直角、警示色（#FCEE21）、數據裝飾、毛玻璃效果。
* **全屏加載**: 實現了類似「系統冷啓動」的 CRT 關機/開機動畫，以及「蟲洞穿越」的頁面跳轉特效。
* **實現**: 透過 Framer Motion 的 `AnimatePresence` 和全局狀態管理實現無縫轉場。

### 🌌 3D 星雲可視化 (Nebula Visualization)
* **功能**: 將文章和友鏈具象化為宇宙中的「節點」，圍繞核心旋轉。支持鼠標拖拽查看。
* **終端交互**: 在星雲頁面底部集成了一個**可拖拽的 CLI 終端**。支持 `/ls`, `/cd`, `/sudo` 等指令，甚至可以透過命令行跳轉頁面或登錄後台。
* **實現**: 使用 R3F 的 `Canvas` 渲染場景，節點分佈採用斐波那契球算法。

### ⚡ Git-based CMS (無數據庫後台)
* **功能**: 擁有完整的後台管理界面 (/admin)。
    * **文章管理**: 增刪改查 Markdown 文章。
    * **配置管理**: 在線修改網站標題、Logo、備案號等，實時生效。
    * **友鏈管理**: 自動抓取對方網站 Icon (多級 fallback 機制：iowen -> uomg -> favicon.im)。
* **實現**: 利用 `Octokit` 調用 GitHub API，將修改後的數據直接 Commit 到倉庫，觸發 Vercel 自動重新構建。

### 💬 評論與互動
* **Giscus 集成**: 利用 GitHub Discussions 存儲評論，無縫融入深色主題。

---

### ⭐ Stargazers over time
[![Stargazers over time](https://starchart.cc/C-4-C-4/Nebula.svg?variant=adaptive)](https://starchart.cc/C-4-C-4/Nebula)

---

### ⚠️ 免責聲明
本項目設計靈感來源於《明日方舟：終末地》，僅供學習交流使用。美術素材版權歸鷹角網絡 (Hypergryph) 所有。

---

**Endfield.SYS // CONNECTION_TERMINATED.**