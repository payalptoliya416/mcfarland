"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { IoClose } from "react-icons/io5";
interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: {
    bank_name: string;
    beneficiary_name: string;
    beneficiary_address: string;
    account_number: string;
    routing_number: string;
    branch_address: string;
  }) => void;
  loading: boolean;
}

const Schema = Yup.object({
  bank_name: Yup.string().required("Bank name is required"),
  beneficiary_name: Yup.string().required("Beneficiary name is required"),
  beneficiary_address: Yup.string().required("Beneficiary address is required"),
  account_number: Yup.string()
    .min(6, "Account number must be at least 6 characters")
    .required("Account number is required"),
  routing_number: Yup.string()
    .min(5, "Routing number must be at least 5 characters")
    .required("Routing number is required"),
  branch_address: Yup.string().required("Branch address is required"),
});

export default function ApproveContractModal({
  open,
  onClose,
  onSubmit,
  loading,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-3 sm:px-6 pt-3 sm:pt-6 flex items-start justify-between mb-2">
          <h2 className="text-lg font-semibold">
            Add Bank Details Before Approval
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 transition duration-200 cursor-pointer"
          >
            <IoClose size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Scroll Area */}
        <div className="px-3 sm:px-6 pb-3 sm:pb-6 overflow-y-auto custom-scroll">
          <Formik
            initialValues={{
              bank_name: "",
              beneficiary_name: "",
              beneficiary_address: "",
              account_number: "",
              routing_number: "",
              branch_address: "",
            }}
            validationSchema={Schema}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                {/* Bank Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-lightblack">
                    Bank Name <sup className="text-redmark">*</sup>
                  </label>
                  <Field
                    name="bank_name"
                    className={`input w-full ${
                      errors.bank_name && touched.bank_name
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.bank_name && touched.bank_name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.bank_name}
                    </p>
                  )}
                </div>

                {/* Beneficiary Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-lightblack">
                    Beneficiary Name <sup className="text-redmark">*</sup>
                  </label>
                  <Field
                    name="beneficiary_name"
                    className={`input w-full ${
                      errors.beneficiary_name && touched.beneficiary_name
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.beneficiary_name && touched.beneficiary_name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.beneficiary_name}
                    </p>
                  )}
                </div>

                {/* Beneficiary Address */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-lightblack">
                    Beneficiary Address <sup className="text-redmark">*</sup>
                  </label>
                  <Field
                    name="beneficiary_address"
                    className={`input w-full ${
                      errors.beneficiary_address && touched.beneficiary_address
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.beneficiary_address &&
                    touched.beneficiary_address && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.beneficiary_address}
                      </p>
                    )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-lightblack">
                    Account Number <sup className="text-redmark">*</sup>
                  </label>
                  <Field
                    name="account_number"
                    className={`input w-full ${
                      errors.account_number && touched.account_number
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.account_number && touched.account_number && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.account_number}
                    </p>
                  )}
                </div>

                {/* Routing Number */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-lightblack">
                    Routing Number <sup className="text-redmark">*</sup>
                  </label>
                  <Field
                    name="routing_number"
                    className={`input w-full ${
                      errors.routing_number && touched.routing_number
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.routing_number && touched.routing_number && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.routing_number}
                    </p>
                  )}
                </div>

                {/* Branch Address */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-lightblack">
                    Branch Address <sup className="text-redmark">*</sup>
                  </label>
                  <Field
                    name="branch_address"
                    className={`input w-full ${
                      errors.branch_address && touched.branch_address
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.branch_address && touched.branch_address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.branch_address}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 border rounded-md text-sm cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="px-5 py-2 bg-[#FFBD34] text-white rounded-md text-sm flex items-center gap-2 cursor-pointer"
                  >
                    {loading && (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    Approve
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
