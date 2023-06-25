const useFormHandlers = () => {
  const handleAddInput = (setState) => {
    setState((prev) => [...prev, ""]);
  };

  const handleSingleInputChange = (setState, e) => {
    const value = e.target.value;
    setState(value);
  };

  const handleMultipleInputChange = (index, setState, e) => {
    const value = e.target.value;
    setState((prev) => {
      const newState = [...prev];
      newState[index] = value;
      return newState;
    });
  };

  const handleFileChange = (setState, e) => {
    const file = e.target.files[0];
    setState(file);
  };

  const handleFilesChange = (setState, e) => {
    const files = Array.from(e.target.files);
    setState(files);
  };

  const handleSelectChange = (setState, e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setState(selectedValues);
  };

  return {
    handleAddInput,
    handleSingleInputChange,
    handleMultipleInputChange,
    handleFileChange,
    handleFilesChange,
    handleSelectChange,
  };
};

export default useFormHandlers;
