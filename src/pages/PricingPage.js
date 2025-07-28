import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Pricing from '../components/Pricing';

const PricingPage = () => {
  useEffect(() => {
    console.log('PricingPage mounted');
    return () => console.log('PricingPage unmounted');
  }, []);

  return (
    <Layout>
      <Pricing />
    </Layout>
  );
};

export default PricingPage;
