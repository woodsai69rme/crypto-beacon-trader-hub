
import React from 'react';
import CryptoNewsHub from '@/components/news/CryptoNewsHub';

const NewsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Crypto News & Analysis</h1>
          <p className="text-muted-foreground">Stay updated with the latest cryptocurrency news and market sentiment</p>
        </div>
        
        <CryptoNewsHub />
      </div>
    </div>
  );
};

export default NewsPage;
