import React from 'react';
import Layout from '@theme/Layout';
import styles from './friends.module.css';

const friends = [
  {
    name: '二丫讲梵',
    url: 'https://wiki.eryajf.net/',
    icon: 'https://wiki.eryajf.net/img/logo.png'
  },
  {
    name: '运维咖啡吧',
    url: 'https://blog.ops-coffee.cn/',
    icon: 'https://blog.ops-coffee.cn/favicon.ico'
  },
  {
    name: 'SRE运维进阶之路',
    url: 'https://clay-wangzhi.com/',
    icon: 'https://clay-wangzhi.com/favicon.ico'
  }
];

export default function Friends(): JSX.Element {
  return (
    <Layout title="友情链接" description="友情链接页面">
      <div className={styles.container}>
        <h1 className={styles.title}>友情链接</h1>
        <div className={styles.friendsGrid}>
          {friends.map((friend) => (
            <a
              key={friend.name}
              href={friend.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.friendCard}
            >
              <div className={styles.icon}>
                <img src={friend.icon} alt={`${friend.name} icon`} />
              </div>
              <h2 className={styles.name}>{friend.name}</h2>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
} 