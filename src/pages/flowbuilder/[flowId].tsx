import * as React from 'react'
import { DashboardLayout } from '../../components/dashboard-layout';
import { FlowBuilderChart } from '../../components/flowbuilder/flowbuilder-chart';




const Flowbuilder = () => {
    return <div style={{height: '100vh', overflowY: "hidden"}}>
        <FlowBuilderChart />
    </div>
}

Flowbuilder.getLayout = (page: any) => (
  <DashboardLayout>

    {page}
  </DashboardLayout>
);


export default Flowbuilder;