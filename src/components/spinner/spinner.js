import React from 'react';
import { Alert, Spin } from 'antd';

const Spinner = () => (
  <Spin tip="Loading...">
    <Alert message="It's a moment please" description="Further details about the context of this alert." type="info" />
  </Spin>
);

export default Spinner;
