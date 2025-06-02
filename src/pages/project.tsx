import React, { useEffect, useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import styles from './project.module.css';

// 随机颜色生成函数
function getRandomColor() {
  // 生成柔和的随机色
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 20); // 60-80%
  const l = 55 + Math.floor(Math.random() * 20); // 55-75%
  return `hsl(${h},${s}%,${l}%)`;
}

const projects = [
  {
    name: 'gin-auto-redoc',
    url: 'https://github.com/Hargeek/gin-auto-redoc',
    description: '用于自动为已包含Swagger文档的Gin应用程序注册Redoc文档的Go包',
  },
  {
    name: 'argocd-ctx-prompt',
    url: 'https://github.com/Hargeek/argocd-ctx-prompt',
    description: 'argocd命令行提示上下文工具',
  },
  {
    name: 'knode-hosts-inject',
    url: 'https://github.com/Hargeek/knode-hosts-inject',
    description: 'k8s集群节点hosts文件注入工具',
  },
  {
    name: 'ssgeek-handbook',
    url: 'https://github.com/Hargeek/ssgeek-handbook',
    description: '博客源码',
  },
];

function getRepoFromUrl(url) {
  // 解析 https://github.com/owner/repo 结构
  const match = url.match(/github.com\/(.+?)\/(.+?)(\/|$)/);
  return match ? `${match[1]}/${match[2]}` : '';
}

function LanguageBar({ repo, colorMap }) {
  const [languages, setLanguages] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (!repo) return;
    fetch(`https://api.github.com/repos/${repo}/languages`)
      .then(res => res.json())
      .then(data => setLanguages(data));
  }, [repo]);

  if (!languages) return null;
  const total = Object.values(languages).reduce((a, b) => Number(a) + Number(b), 0);
  const entries = Object.entries(languages) as [string, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);

  // 新增：语言条状分布
  const barSegments = sorted.map(([lang, bytes], idx) => {
    const percent = (bytes / total) * 100;
    // 只有最左和最右的 segment 有圆角
    let borderRadius = '';
    if (idx === 0 && sorted.length === 1) {
      borderRadius = '4px';
    } else if (idx === 0) {
      borderRadius = '4px 0 0 4px';
    } else if (idx === sorted.length - 1) {
      borderRadius = '0 4px 4px 0';
    } else {
      borderRadius = '0';
    }
    return (
      <span
        key={lang}
        style={{
          display: 'inline-block',
          height: 8,
          width: `${percent}%`,
          background: colorMap[lang] || '#ccc',
          borderRadius,
          marginLeft: 0,
        }}
      />
    );
  });

  return (
    <div style={{ marginTop: 8 }}>
      {/* 条状分布 */}
      <div style={{ display: 'flex', width: '100%', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
        {barSegments}
      </div>
      {/* 语言列表 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {sorted.map(([lang, bytes]) => (
          <span key={lang} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: colorMap[lang] || '#ccc',
              marginRight: 4
            }} />
            {lang} {((bytes / total) * 100).toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  // 页面加载时为所有出现的语言分配随机颜色
  const colorMap = useMemo(() => {
    const allLangs = new Set<string>();
    // 这里只能预先遍历项目，实际以首次请求到的语言为准
    // 但为了保证同一次打开一致，采用全局 colorMap
    // 这里先分配常见语言，后续请求到新语言再补充
    const commonLangs = ['Go', 'Makefile', 'TypeScript', 'Python', 'JavaScript', 'Shell', 'HTML', 'CSS'];
    commonLangs.forEach(l => allLangs.add(l));
    const map: Record<string, string> = {};
    allLangs.forEach(lang => {
      map[lang] = getRandomColor();
    });
    return map;
  }, []);

  return (
    <Layout title="开源项目" description="我的开源项目">
      <div className={styles.container}>
        <h1 className={styles.title}>开源项目</h1>
        <div className={styles.projectsGrid}>
          {projects.map((project) => {
            const repo = getRepoFromUrl(project.url);
            return (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectCard}
              >
                <h2 className={styles.name}>{project.name}</h2>
                <p className={styles.desc}>{project.description}</p>
                <LanguageBar repo={repo} colorMap={colorMap} />
              </a>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
