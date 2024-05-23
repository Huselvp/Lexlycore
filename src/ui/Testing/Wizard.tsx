import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Button, Stepper, Step, StepLabel } from '@mui/material';
import * as Yup from 'yup';

const steps = ['Step 1', 'Step 2', 'Step 3'];

const validationSchemas = [
  Yup.object({
    firstName: Yup.string().required('Required'),
  }),
  Yup.object({
    lastName: Yup.string().required('Required'),
  }),
  Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
  }),
];

const Step1 = () => (
  <div>
    <Field name="firstName" type="text" placeholder="First Name" />
  </div>
);

const Step2 = () => (
  <div>
    <Field name="lastName" type="text" placeholder="Last Name" />
  </div>
);

const Step3 = () => (
  <div>
    <Field name="email" type="email" placeholder="Email" />
  </div>
);

const stepsContent = [<Step1 />, <Step2 />, <Step3 />];

const QuestionnaireWizard = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const isLastStep = activeStep === steps.length - 1;

  const handleNext = async (
    validateForm: Function,
    setTouched: Function,
    setSubmitting: Function
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
        if (isLastStep) {
            alert(JSON.stringify(values, null, 2));
            console.log('Form submitted successfully', values);
          }
      setActiveStep((prevStep) => prevStep + 1);
      setTouched({});
    } else {
      setSubmitting(false);
    }
  };

  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleSubmit = (values: any, { setSubmitting }: FormikHelpers<any>) => {
    if (isLastStep) {
      alert(JSON.stringify(values, null, 2));
      console.log('Form submitted successfully', values);
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '' }}
      validationSchema={validationSchemas[activeStep]}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, validateForm, setTouched, setSubmitting }) => (
        <Form>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {stepsContent[activeStep]}
          <div>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button
              type="button"
              onClick={() => handleNext(validateForm, setTouched, setSubmitting)}
              disabled={isSubmitting}
            >
              {isLastStep ? 'Submit' : 'Next'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default QuestionnaireWizard;
