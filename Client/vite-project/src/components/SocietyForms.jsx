// src/components/SocietyForm.js

import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const SocietyForm = ({ initialValues, onSubmit, onCancel, title }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      society: '',
      city: '',
      latitude: '',
      longitude: '',
    },
    validationSchema: Yup.object({
      society: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      latitude: Yup.number()
        .required('Required')
        .typeError('Must be a number'),
      longitude: Yup.number()
        .required('Required')
        .typeError('Must be a number'),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...values,
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
      });
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Society Name Input */}
        <div>
          <Label htmlFor="society">Society Name</Label>
          <Input
            id="society"
            name="society"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.society}
            className={
              formik.touched.society && formik.errors.society ? 'border-red-500' : ''
            }
          />
          {formik.touched.society && formik.errors.society && (
            <div className="text-red-500 text-sm">{formik.errors.society}</div>
          )}
        </div>

        {/* City Input */}
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            className={formik.touched.city && formik.errors.city ? 'border-red-500' : ''}
          />
          {formik.touched.city && formik.errors.city && (
            <div className="text-red-500 text-sm">{formik.errors.city}</div>
          )}
        </div>

        {/* Latitude Input */}
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.latitude}
            className={
              formik.touched.latitude && formik.errors.latitude ? 'border-red-500' : ''
            }
          />
          {formik.touched.latitude && formik.errors.latitude && (
            <div className="text-red-500 text-sm">{formik.errors.latitude}</div>
          )}
        </div>

        {/* Longitude Input */}
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.longitude}
            className={
              formik.touched.longitude && formik.errors.longitude ? 'border-red-500' : ''
            }
          />
          {formik.touched.longitude && formik.errors.longitude && (
            <div className="text-red-500 text-sm">{formik.errors.longitude}</div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{initialValues ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </div>
  );
};

SocietyForm.propTypes = {
  /** Initial values for the form fields */
  initialValues: PropTypes.shape({
    id: PropTypes.number,
    society: PropTypes.string,
    city: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  /** Function to handle form submission */
  onSubmit: PropTypes.func.isRequired,
  /** Function to handle form cancellation */
  onCancel: PropTypes.func.isRequired,
  /** Title to display at the top of the form */
  title: PropTypes.string.isRequired,
};

export default SocietyForm;
