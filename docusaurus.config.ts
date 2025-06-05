import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '山山仙人博客',
  tagline: '山山仙人博客',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.ssgeek.com', // 在线电子书的 url
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ssgeek', // Usually your GitHub org/user name.
  projectName: 'ssgeek-handbook', // Usually your repo name.

  onBrokenLinks: 'ignore', // 忽略
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        // docs: false,
        blog: {
          showReadingTime: true,
          showLastUpdateTime: true,
          routeBasePath: "/",
          path: "./blog",
          blogSidebarTitle: "最近更新",
          blogSidebarCount: 0,
          postsPerPage: 5,
          onUntruncatedBlogPosts: 'ignore',
          blogListComponent: '@theme/BlogListPage',
          blogPostComponent: '@theme/BlogPostPage',
          blogTagsListComponent: '@theme/BlogTagsListPage',
          blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
          blogArchiveComponent: '@theme/BlogArchivePage',
          feedOptions: {
            type: 'all',
            title: '山山仙人博客',
            description: '山山仙人的个人博客，分享技术、生活和爱好',
            copyright: `Copyright © ${new Date().getFullYear()} SSgeek. Built with Docusaurus.`,
            language: 'zh-Hans',
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**', '/archive/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-9Q435GTZPZ',
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 60,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/avatar.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#12affa',
          },
        ],
      },
    ],
    // [
    //   '@easyops-cn/docusaurus-search-local',
    //   {
    //     hashed: true,
    //     language: ['zh', 'en'],
    //     highlightSearchTermsOnTargetPage: true,
    //     explicitSearchResultPath: true,
    //   },
    // ],
    [
      'docusaurus-plugin-baidu-tongji',
      {
        token: '4b826a92a3dc151a74693fa1942d3167',
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    mermaid: {
      theme: {light: 'default', dark: 'forest'},
    },
    docs: {
      sidebar: {
        hideable: true, // 允许隐藏整个侧边栏
        autoCollapseCategories: true, // 展开一个类别时自动折叠其他类别
      },
    },
    // Replace with your project's social card
    image: 'img/avatar.png',
    navbar: {
      title: '山山仙人博客',
      logo: {
        alt: 'SSgeek Handbook',
        src: 'img/avatar.png',
      },
      hideOnScroll: true,
      items: [
        {
          to: '/tags',
          label: '🏷️ 标签',
          position: 'right',
        },
        {
          to: '/archive',
          label: '📚 归档',
          position: 'right',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tools',
          position: 'right',
          label: '🛠️ Tools',
        },
        {
          type: 'dropdown',
          label: '👨🏻‍💻Code',
          position: 'right',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'python',
              label: 'Python',
            },
            {
              type: 'docSidebar',
              sidebarId: 'golang',
              label: 'Golang',
            },
            {
              type: 'docSidebar',
              sidebarId: 'vue',
              label: 'Vue',
            },
          ],
        },
      ],
    },
    algolia: {
      apiKey: "837e7ac77be9c5036dff3fc19c9bb75e",
      indexName: "ssgeek",
      appId: "F3UGGDP6V8",
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '更多',
          items: [
            {
              label: '关于我',
              to: '/about',
            },
            {
              label: '公众号',
              to: '/gong-zhong-hao',
            },
            {
              label: '开源项目',
              to: '/project',
            },
            {
              label: '友情链接',
              to: '/friends',
            },
          ],
        },
        {
          title: '其他',
          items: [
            {
              label: 'RSS',
              to: '/rss.xml',
            },
            {
              label: 'Email',
              href: 'mailto:ssgeek@hotmail.com',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              html: '<a href="https://hub.docker.com/u/ssgeek" target="_blank" rel="noopener noreferrer"><img src="/img/icons/docker.svg" alt="Docker" width="24" height="24" /></a>',
            },
            {
              html: '<a href="https://github.com/hargeek" target="_blank" rel="noopener noreferrer"><img src="/img/icons/github.svg" alt="GitHub" width="24" height="24" /></a>',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SSgeek's Blog |
      <a href="https://home.ssgeek.com" target="_blank" rel="noopener noreferrer">Home</a> |
      <a href="https://status.ssgeek.com/status/home" target="_blank" rel="noopener noreferrer">Status</a> |
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">鄂ICP备18007156号-1</a>`,
    },
    prism: {
      theme: prismThemes.palenight,
      darkTheme: prismThemes.palenight,
      additionalLanguages: [
        'bash',
        'java',
        'json',
        'python',
        'php',
        'go',
        'groovy',
        'gradle',
        'docker',
        'sql',
        'ini',
        'nginx',
        'toml',
        'protobuf',
        'diff',
      ],
    },
    giscus: {
      repo: 'Hargeek/ssgeek-handbook',
      repoId: 'R_kgDOL0mh_A',
      category: 'General',
      categoryId: 'DIC_kwDOL0mh_M4Cp_ze',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      lang: 'zh-CN',
      loading: 'lazy',
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      config: {
        margin:0,
        background: {
            light: 'rgb(255, 255, 255)',
            dark: 'rgb(50, 50, 50)'
        }
      }
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
