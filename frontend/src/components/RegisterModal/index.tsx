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
        .email('Correo electrónico inválido')
        .required('El correo electrónico es requerido'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
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
                'Error al crear cuenta';
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
            <DialogTitle>Crear Cuenta</DialogTitle>
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
                                    autoComplete="new-password"
                                />
                                <Field
                                    as={TextField}
                                    name="name"
                                    label="Nombre (Opcional)"
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
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            >
                                {isSubmitting ? 'Creando...' : 'Crear Cuenta'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default RegisterModal;
