import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import Giscus from '@giscus/react';

const defaultConfig = {
  id: 'comments',
  mapping: 'pathname',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  loading: 'lazy',
  strict: '0',
  lang: 'zh-CN',
};

export default function GiscusComment(): JSX.Element {
  const themeConfig = useThemeConfig();
  const giscus = {...defaultConfig, ...themeConfig.giscus};

  if (!giscus.repo || !giscus.repoId || !giscus.categoryId) {
    throw new Error(
      'You must provide `repo`, `repoId`, and `categoryId` to `themeConfig.giscus`.',
    );
  }

  return <Giscus {...giscus} />;
} 