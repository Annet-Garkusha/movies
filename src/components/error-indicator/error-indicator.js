import { useState } from 'react';
import { Alert } from 'antd';

const ErrorIndicator = () => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div>
      {visible ? (
        <Alert message="OHHHH....IT'S PROBLEM" type="success" closable afterClose={handleClose} centered />
      ) : null}
      <p>DON'T WARRY BE HAPPY</p>
    </div>
  );
};

export default ErrorIndicator;