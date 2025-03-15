// src/components/ui/Modal.js

import PropTypes from 'prop-types';

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
        <div className="p-4">
          {children}
        </div>
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  /** Content to be displayed inside the modal */
  children: PropTypes.node.isRequired,
  /** Function to close the modal */
  onClose: PropTypes.func.isRequired,
};

export default Modal;
