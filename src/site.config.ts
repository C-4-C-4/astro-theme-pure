import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // [基础配置]
  /** 网站标题。将用于元数据（Metadata）以及浏览器标签页的标题。 */
  title: 'CcoMm',
  /** 作者名称。将用于首页展示和底部的版权声明。 */
  author: 'CcoMm',
  /** 网站描述。用于网页的元数据（可以被搜索引擎抓取）。 */
  description: '這是C4的個人部落格網站',
  /** 网站的默认 favicon 图标，应该填写相对于 `public/` 目录的图片路径。 */
  favicon: '/favicon/favicon.ico',
  /** 网站默认的社交分享卡片预览图，同样是相对于 `public/` 目录的图片路径。 */
  socialCard: '/images/social-card.png',
  /** 指定本网站的默认语言。 */
  locale: {
    lang: 'zh-TW',
    attrs: 'zh_TW',
    // Date locale
    dateLocale: 'zh-TW',
    dateOptions: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  },
  /** Set a logo image to show in the homepage. */
  logo: {
    src: '/src/assets/avatar.png',
    alt: 'Avatar'
  },

  titleDelimiter: '•',
  prerender: true, // pagefind search is not supported with prerendering disabled
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // Still in test
  head: [
    {
      tag: 'script',
      attrs: {
        defer: true,
        src: 'https://cloud.umami.is/script.js',
        'data-website-id': '1a799544-e74d-40cd-98c9-640024d88d61'
      },
      content: ''
    }
  ],
  customCss: [],

  /** Configure the header of your site. */
  header: {
    menu: [
      { title: '部落格', link: '/blog' },
      { title: '專案', link: '/projects' },
      { title: '連結', link: '/links' },
      { title: '數據', link: '/analytics' },
      { title: 'AI 對話', link: '/chat' },
      { title: '關於', link: '/about' }
    ]
  },

  /** Configure the footer of your site. */
  footer: {
    // Year format
    year: '© 2022 - 2026',
    // year: `© 2019 - ${new Date().getFullYear()}`,
    links: [],
    /** Enable displaying a “Astro & Pure theme powered” link in your site’s footer. */
    credits: true,
    /** Optional details about the social media accounts for this site. */
    social: { github: 'https://github.com/C-4-C-4' }
  },

  // [Content]
  content: {
    /** External links configuration */
    externalLinks: {
      content: ' ↗',
      /** Properties for the external links element */
      properties: {
        style: 'user-select:none'
      }
    },
    /** Blog page size for pagination (optional) */
    blogPageSize: 8,
    // Currently support weibo, x, bluesky
    share: ['weibo', 'x', 'bluesky']
  }
}

export const integ: IntegrationUserConfig = {
  // [Links]
  // https://astro-pure.js.org/docs/integrations/links
  links: {
    // Friend logbook
    logbook: [
      { date: '2025-03-16', content: 'Is there a leakage?' },
      { date: '2025-03-16', content: 'A leakage of what?' },
      { date: '2025-03-16', content: 'I have a full seat of water, like, full of water!' },
      { date: '2025-03-16', content: 'Must be the water.' },
      { date: '2025-03-16', content: "Let's add that to the words of wisdom." }
    ],
    // Yourself link info
    applyTip: [
      { name: 'Name', val: theme.title },
      { name: 'Desc', val: theme.description || 'Null' },
      { name: 'Link', val: 'https://ccomm.top/' },
      { name: 'Avatar', val: 'https://avatars.githubusercontent.com/u/147143261' }
    ],
    // Cache avatars in `public/avatars/` to improve user experience.
    cacheAvatar: false
  },
  // [Search]
  pagefind: true,
  // Add a random quote to the footer (default on homepage footer)
  // See: https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  // [Quote]
  quote: {
    // - Hitokoto
    // https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%9C%B0%E5%9D%80
    // server: 'https://v1.hitokoto.cn/?c=i',
    // target: `(data) => (data.hitokoto || 'Error')`
    // - Quotable
    // https://github.com/lukePeavey/quotable
    // server: 'http://api.quotable.io/quotes/random?maxLength=60',
    // target: `(data) => data[0].content || 'Error'`
    // - DummyJSON
    server: 'https://dummyjson.com/quotes/random',
    target: `(data) => (data.quote.length > 80 ? \`\${data.quote.slice(0, 80)}...\` : data.quote || 'Error')`
  },
  // [Typography]
  // https://unocss.dev/presets/typography
  typography: {
    class: 'prose text-base',
    // The style of blockquote font `normal` / `italic` (default to italic in typography)
    blockquoteStyle: 'italic',
    // The style of inline code block `code` / `modern` (default to code in typography)
    inlineCodeBlockStyle: 'modern'
  },
  // [Lightbox]
  // A lightbox library that can add zoom effect
  // https://astro-pure.js.org/docs/integrations/others#medium-zoom
  mediumZoom: {
    enable: true, // disable it will not load the whole library
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // Comment system
  waline: {
    enable: false,
    server: ''
  },
  // @ts-ignore
  giscus: {
    repo: 'C-4-C-4/astro-theme-pure',
    repoId: 'R_kgDORhtAGw',
    category: 'Announcements',
    categoryId: 'DIC_kwDORhtAG84C4LWV',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'bottom',
    lang: 'zh-CN'
  }
}

export const terms: CardListData = {
  title: 'Terms content',
  list: [
    {
      title: 'Privacy Policy',
      link: '/terms/privacy-policy'
    },
    {
      title: 'Terms and Conditions',
      link: '/terms/terms-and-conditions'
    },
    {
      title: 'Copyright',
      link: '/terms/copyright'
    },
    {
      title: 'Disclaimer',
      link: '/terms/disclaimer'
    }
  ]
}

const config = { ...theme, integ } as Config
export default config
