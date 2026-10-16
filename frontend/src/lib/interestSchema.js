import { z } from 'zod';
import { unmaskPhone } from './masks';

export const interestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe seu nome.')
    .max(120, 'Use até 120 caracteres.'),
  phone: z
    .string()
    .transform(unmaskPhone)
    .refine(
      (value) => /^\d{10,11}$/.test(value),
      'Informe um telefone com DDD válido.',
    ),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .max(150, 'Use até 150 caracteres.')
    .email('Informe um e-mail válido.'),
  contactPreference: z.enum(['WHATSAPP', 'TELEFONE', 'EMAIL']),
  message: z.string().trim().max(5000, 'Use até 5.000 caracteres.'),
  lgpdConsent: z
    .boolean()
    .refine(
      (value) => value,
      'Autorize o uso dos seus dados para receber o contato.',
    ),
});
