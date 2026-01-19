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
import type { LoginRequest } from '../../types/auth';

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo electrónico es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
});

const initialValues: LoginRequest = {
    email: '',
    password: '',
};

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
    const { login } = useAuth();
    const [serverError, setServerError] = useState<string>('');

    const handleSubmit = async (
        values: LoginRequest,
        { setSubmitting }: FormikHelpers<LoginRequest>
    ) => {
        setServerError(''); // Clear previous errors
        try {
            await login(values);
            onClose();
        } catch (error: any) {
            // Extract error message from axios response
            const errorMessage = error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Error al iniciar sesión';
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
            <DialogTitle>Iniciar Sesión</DialogTitle>
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
                                    label="Correo Electrónico"
                                    type="email"
                                    fullWidth
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    autoComplete="email"
                                />
                                <Field
                                    as={TextField}
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    fullWidth
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    autoComplete="current-password"
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={handleClose} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            >
                                {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default LoginModal;
