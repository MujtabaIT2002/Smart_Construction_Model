// src/components/QualityMaterialQuantityForm.js
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const QualityMaterialQuantityForm = ({ initialValues, onSubmit, onCancel, title }) => {
  const formik = useFormik({
    initialValues: {
      material: initialValues.material || '',
      quantity: initialValues.quantity || '',
    },
    validationSchema: Yup.object({
      material: Yup.string().required('Required'),
      quantity: Yup.number().required('Required').typeError('Must be a number'),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...initialValues,
        material: values.material,
        quantity: parseFloat(values.quantity),
      });
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Material Name Input */}
        <div>
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            name="material"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.material}
            className={
              formik.touched.material && formik.errors.material ? 'border-red-500' : ''
            }
          />
          {formik.touched.material && formik.errors.material && (
            <div className="text-red-500 text-sm">{formik.errors.material}</div>
          )}
        </div>

        {/* Quantity Input */}
        <div>
          <Label htmlFor="quantity">Quantity (units/sqft)</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="0.0001"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.quantity}
            className={
              formik.touched.quantity && formik.errors.quantity ? 'border-red-500' : ''
            }
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <div className="text-red-500 text-sm">{formik.errors.quantity}</div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
};

QualityMaterialQuantityForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    material: PropTypes.string,
    quantity: PropTypes.number,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default QualityMaterialQuantityForm;
