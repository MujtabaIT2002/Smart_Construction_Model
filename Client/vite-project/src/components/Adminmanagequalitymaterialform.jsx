// src/components/QualityMaterialForm.js
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const QualityMaterialForm = ({ initialValues, onSubmit, onCancel, title }) => {
  const formik = useFormik({
    initialValues: {
      material: initialValues.material || '',
      quality: initialValues.quality || '',
      rate: initialValues.rate || '',
    },
    validationSchema: Yup.object({
      material: Yup.string().required('Required'),
      quality: Yup.string().required('Required'),
      rate: Yup.number().required('Required').typeError('Must be a number'),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...initialValues,
        material: values.material,
        quality: values.quality,
        rate: parseFloat(values.rate),
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
              formik.touched.material && formik.errors.material
                ? 'border-red-500'
                : ''
            }
          />
          {formik.touched.material && formik.errors.material && (
            <div className="text-red-500 text-sm">{formik.errors.material}</div>
          )}
        </div>

        {/* Quality Select */}
        <div>
          <Label htmlFor="quality">Quality</Label>
          <Select
            id="quality"
            name="quality"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.quality}
            className={
              formik.touched.quality && formik.errors.quality
                ? 'border-red-500'
                : ''
            }
          >
            <option value="" label="Select quality" />
            <option value="High" label="High" />
            <option value="Medium" label="Medium" />
            <option value="Low" label="Low" />
          </Select>
          {formik.touched.quality && formik.errors.quality && (
            <div className="text-red-500 text-sm">{formik.errors.quality}</div>
          )}
        </div>

        {/* Rate Input */}
        <div>
          <Label htmlFor="rate">Rate</Label>
          <Input
            id="rate"
            name="rate"
            type="number"
            step="0.01"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.rate}
            className={
              formik.touched.rate && formik.errors.rate ? 'border-red-500' : ''
            }
          />
          {formik.touched.rate && formik.errors.rate && (
            <div className="text-red-500 text-sm">{formik.errors.rate}</div>
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

QualityMaterialForm.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    material: PropTypes.string,
    quality: PropTypes.string,
    rate: PropTypes.number,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default QualityMaterialForm;
