---
title: '熬了一晚上给网站新增了几个小功能' 
description: '2025年12月7日熬夜为网站新增了GitHub仓库、B站追番列表、音乐播放器、时间线以及RSS订阅列表等功能，并优化了友链页面。' 
publishDate: '2025-12-07 00:00:00' 
tags:
  - REPORT
heroImage: { src: 'https://img.scdn.io/i/6934b8de4a244_1765062878.webp', alt: '网站新增功能封面图', color: '#1A1A1A', inferSize: true }
draft: false 
language: '中文' 
comment: true 
---


**2025年12月7日，我好困，凌晨2点一直到现在的7点18分，给网站加了几个小功能，虽然感觉没啥特别大的用处就是了 ;m; **

# 一、新增内容
#### 1、github仓库内容页面
**这个功能的实现核心在于 利用 GitHub 官方 API 动态获取数据，配合 Next.js 的 服务端组件 (Server Components) 和 增量静态再生 (ISR) 技术。**

*简单来说，它的工作流程是：*

> 你的服务器 -> 向 GitHub 发请求 -> 拿到数据 -> 渲染成漂亮的卡片 -> 展示给用户。

**· 数据获取层 (The Data Fetcher)**

    // 核心代码片段
    export const fetchGithubRepos = cache(async () => {
      const { data } = await octokit.request("GET /users/{username}/repos", { ... });
      // ... 数据清洗逻辑 ...
      return filtered.map(repo => ({ ... }));
    });

**· 页面渲染层 (The Page)**

    export const revalidate = 3600;
    const isActive = (new Date().getTime() - lastUpdate.getTime()) < 90 * 24 * 60 * 60 * 1000;

**页面展示图片：**

<img src="https://img.scdn.io/i/6934b8f7b99ba_1765062903.webp" class="zoomable" />

------------

#### 2、bilibili追番列表页面

**·  数据源：公开的 B 站 API**

    原理：利用 B 站接口 https://api.bilibili.com/x/space/bangumi/follow/list。
    参数：
    vmid: 你的 UID。
    type: 1 代表追番。
    pn: 页码。
    ps: 每页数量。

**· 服务端数据抓取 (Server-Side Fetching)**

    在 src/lib/bilibili.ts 中，定义了 fetchBangumiList 函数

**页面展示图片：**

<img src="https://img.scdn.io/i/6934b90fc3c49_1765062927.webp" class="zoomable" />

------------

#### 3、音乐播放页面

    graph TD
        User[用户访问页面] --> Page[读取 songs.json]
        Page --> Player[渲染播放器组件]
        
        Player --1. 播放音频--> NeteaseMP3[网易云 MP3 接口]
        
        Player --2. 请求歌词--> MyAPI[你的 API (/api/music/lyric)]
        MyAPI --3. 伪造请求头--> NeteaseLRC[网易云歌词接口]
        NeteaseLRC --4. 返回歌词数据--> MyAPI
        MyAPI --5. 转发歌词--> Player
        
        Player --6. 解析并同步显示--> UI[界面展示]

**页面展示图片：**

<img src="https://img.scdn.io/i/6934b91a06c13_1765062938.webp" class="zoomable" />

------------

#### 4、时间线页面

    graph TD
        A[数据源: src/data/timeline.json] -->|读取| B(服务端页面: src/app/timeline/page.tsx)
        
        subgraph Server_Side_Rendering [服务端处理]
        B -->|1. fetchJsonData| B1[获取 JSON 数据]
        B1 -->|2. sort| B2[按日期倒序排列]
        end
        
        B2 -->|传递数据 Props| C(客户端组件: TimelineItem.tsx)
        
        subgraph Client_Side_Rendering [客户端渲染]
        C -->|Framer Motion| D[执行进入动画]
        C -->|CSS Styling| E[根据 Type 渲染不同颜色]
        end
        
        D & E --> F[最终页面展示]

**页面展示图片：**

<img src="https://img.scdn.io/i/6934b925ac4ab_1765062949.webp" class="zoomable" />

------------

#### 5、RSS订阅列表页面

    graph TD
        A[你的通讯录] -->|读取列表| B(信号接收塔)
        B -->|并发请求| C{外部好友的博客}
        C -->|返回 XML 数据| B
        B -->|翻译/解析| D[标准化数据包]
        D -->|发送给| E[你的朋友圈页面]

**页面展示图片：**

<img src="https://img.scdn.io/i/6934b9321aa43_1765062962.webp" class="zoomable" />

------------

# 二、优化内容
**为友联新增随机传送和搜索功能**
**页面展示图片：**

<img src="https://img.scdn.io/i/6934b940611f8_1765062976.webp" class="zoomable" />

# 三、想说的话
**好困，写完这篇文章都7点51了，熬了一晚上，实在顶不住了！**