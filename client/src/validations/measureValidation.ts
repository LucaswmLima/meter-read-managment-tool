const validateAddFields = (
  customerCode: string,
  measureType: string,
  imageBase64: string
) => {
  if (!customerCode || !measureType || !imageBase64) {
    alert("Customer code, measure type, and image are required.");
    return;
  }
};

const validateConfirmFields = (measure_uuid: string, confirmValue: string) => {
  if (!measure_uuid || !confirmValue) {
    alert("Please provide a valid measure value to confirm.");
    return;
  }
};

const validateListFields = (customerCode: string) => {
    if (!customerCode) {
        alert("Customer code is required to list measurements.");
        return;
      }
};

export { validateAddFields, validateConfirmFields, validateListFields };
