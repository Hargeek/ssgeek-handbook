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

  onBrokenLinks: 'warn', // 避免路径引用错误导致编译失败
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        // docs: false,
        blog: {
          showReadingTime: true,
          routeBasePath: "/",
          path: "./blog",
          blogSidebarTitle: "最近更新",
          blogSidebarCount: 0,
          postsPerPage: 3,
          blogListComponent: '@theme/BlogListPage',
          blogPostComponent: '@theme/BlogPostPage',
          blogTagsListComponent: '@theme/BlogTagsListPage',
          blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
          blogArchiveComponent: '@theme/BlogArchivePage',
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
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-W3EV304GVH',
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
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
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
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
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh', 'en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
    [
      'docusaurus-plugin-baidu-tongji',
      {
        token: '4b826a92a3dc151a74693fa1942d3167',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/avatar.png',
    navbar: {
      title: '山山仙人博客',
      logo: {
        alt: 'SSgeek Handbook',
        src: 'img/avatar.png',
      },
      items: [
        {
          type: 'dropdown',
          label: 'Code',
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
        {
          type: 'docSidebar',
          sidebarId: 'tools',
          position: 'right',
          label: 'Tools',
        },
        {
          to: '/tags',
          label: '标签',
          position: 'right',
        },
        {
          to: '/archive',
          label: '归档',
          position: 'right',
        },
      ],
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
              label: '友情链接',
              to: '/friends',
            },
          ],
        },
        {
          title: '联系我',
          items: [
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
      copyright: `Copyright © ${new Date().getFullYear()} SSgeek. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.palenight,
      darkTheme: prismThemes.palenight,
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
  } satisfies Preset.ThemeConfig,
};

export default config;
