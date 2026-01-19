import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Formik, Form, Field, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import type { RegisterRequest } from '../../types/auth';

interface RegisterModalProps {
    open: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    name: Yup.string().optional(),
});

const initialValues: RegisterRequest = {
    email: '',
    password: '',
    name: '',
};

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose }) => {
    const { register } = useAuth();
    const [serverError, setServerError] = useState<string>('');

    const handleSubmit = async (
        values: RegisterRequest,
        { setSubmitting }: FormikHelpers<RegisterRequest>
    ) => {
        setServerError(''); // Clear previous errors
        try {
            // Remove name if empty
            const data: RegisterRequest = {
                email: values.email,
                password: values.password,
            };
            if (values.name?.trim()) {
                data.name = values.name.trim();
            }

            await register(data);
            onClose();
        } catch (error: any) {
            // Extract error message from axios response
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Error creating account';
            setServerError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setServerError(''); // Clear errors when closing
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Account</DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {serverError && (
                                    <Alert severity="error" onClose={() => setServerError('')}>
                                        {serverError}
                                    </Alert>
                                )}
                                <Field
                                    as={TextField}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    autoComplete="email"
                                />
                                <Field
                                    as={TextField}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    autoComplete="new-password"
                                />
                                <Field
                                    as={TextField}
                                    name="name"
                                    label="Name (Optional)"
                                    type="text"
                                    fullWidth
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    autoComplete="name"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={handleClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Account'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default RegisterModal;
