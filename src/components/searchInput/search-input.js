import React from 'react';
import { Input } from 'antd';
import { debounce } from 'lodash';

const SearchInput = ({ onUpdateInput }) => {
  const handleSearchInputChanges = (e) => {
    if (e.target.value.trim().length === 0) return;
    onUpdateInput(e.target.value);
  };
  return (
    <>
      <Input placeholder="Type to search..." type="text" onKeyUp={debounce(handleSearchInputChanges, 1000)} />
    </>
  );
};

export default SearchInput;
