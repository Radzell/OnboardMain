import * as React from 'react'

import Head from 'next/head';
import NextLink from 'next/link';
import { DashboardLayout } from '../components/dashboard-layout';
import { FlowBuilderChart } from '../components/flowbuilder/flowbuilder-chart';

const Flowbuilder = () => {
    return <div style={{height: '100%'}}>
        <FlowBuilderChart />
    </div>
}

Flowbuilder.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);


export default Flowbuilder;