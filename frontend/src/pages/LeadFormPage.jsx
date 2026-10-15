
import { useRef, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { FormField } from '../components/FormField';
import { maskPhone } from '../lib/masks';
import { fieldClasses } from '../lib/formField';
import { interestSchema } from '../lib/interestSchema';
import { sendGeneralLead } from '../features/vehicle/vehicleLeadApi';
import { getVehicleDetail } from '../features/vehicle/vehicleDetailsApi';

export function LeadFormPage() {
  const location = useLocation();
  const vehicleSlug = new URLSearchParams(location.search).get('vehicleSlug');
  const sending = useRef(false);
  const [result, setResult] = useState(null);

  const vehicleQuery = useQuery({
    queryKey: ['vehicles', 'lead-form', vehicleSlug],
    queryFn: (context) => getVehicleDetail(vehicleSlug, context),
    enabled: Boolean(vehicleSlug),
    retry: false,
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(interestSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      contactPreference: 'WHATSAPP',
      message: '',
      lgpdConsent: false,
    },
  });

  const values = useWatch({ control });
  const canSubmit = interestSchema.safeParse(values).success;

  async function submit(formValues) {
    if (sending.current) return;
    sending.current = true;

    try {
      const vehicle = vehicleQuery.data;
      setResult(
        await sendGeneralLead(
          formValues,
          vehicle?.id,
        ),
      );
    } catch (error) {
      const invalidParams = error.response?.data?.invalidParams;

      if (invalidParams && typeof invalidParams === 'object') {
        for (const key of [
          'name',
          'phone',
          'email',
          'contactPreference',
          'message',
          'lgpdConsent',
        ]) {
          if (typeof invalidParams[key] === 'string') {
            setError(key, {
              type: 'server',
              message: invalidParams[key],
            });
          }
        }
      }

      setError('root', {
        message:
          error.response?.status === 429
            ? 'Muitas solicitações. Aguarde um pouco e tente novamente.'
            : 'Não foi possível enviar seus dados. Tente novamente.',
      });
    } finally {
      sending.current = false;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Atendimento DriveLink
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
          Faça seu pré-cadastro
        </h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          Informe seus dados para que nossa equipe possa entrar em contato.
        </p>

        {vehicleSlug && (
          <p className="mt-3 text-sm text-slate-600">
            {vehicleQuery.isPending
              ? 'Carregando veículo relacionado...'
              : vehicleQuery.data
                ? `Veículo relacionado: ${vehicleQuery.data.brand} ${vehicleQuery.data.model}.`
                : 'Não foi possível identificar o veículo. Você ainda pode enviar seu pré-cadastro geral.'}
          </p>
        )}
      </header>

      <Card as="section" className="sm:p-7">
        {result ? (
          <div role="status" className="space-y-4 py-4">
            <CheckCircle2
              size={36}
              aria-hidden="true"
              className="text-brand"
            />
            <h2 className="text-xl font-bold text-slate-950">
              {result.simulated
                ? 'Pré-cadastro validado!'
                : 'Pré-cadastro recebido!'}
            </h2>
            <p className="text-slate-600">
              {result.simulated
                ? 'O envio foi simulado no ambiente de desenvolvimento; nenhum dado foi enviado ao backend.'
                : 'Nossa equipe poderá entrar em contato com você.'}
            </p>
            <Button to="/" variant="outline">
              Voltar à página inicial
            </Button>
          </div>
        ) : (
          <form
            aria-label="Pré-cadastro de atendimento"
            noValidate
            onSubmit={handleSubmit(submit)}
          >
            <fieldset
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="space-y-5"
            >
              <Input
                label="Nome completo"
                autoComplete="name"
                required
                maxLength={120}
                error={errors.name?.message}
                {...register('name')}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Telefone / WhatsApp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="(00) 00000-0000"
                    required
                    error={errors.phone?.message}
                    onChange={(event) =>
                      field.onChange(maskPhone(event.target.value))
                    }
                  />
                )}
              />

              <Input
                label="E-mail"
                type="email"
                autoComplete="email"
                required
                maxLength={150}
                error={errors.email?.message}
                {...register('email')}
              />

              <Select
                label="Como prefere o contato?"
                error={errors.contactPreference?.message}
                {...register('contactPreference')}
              >
                <option value="WHATSAPP">WhatsApp</option>
                <option value="TELEFONE">Telefone</option>
                <option value="EMAIL">E-mail</option>
              </Select>

              <FormField
                id="lead-message"
                label="Como podemos ajudar? (opcional)"
                error={errors.message?.message}
              >
                <textarea
                  id="lead-message"
                  rows={4}
                  maxLength={5000}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? 'lead-message-error' : undefined
                  }
                  className={fieldClasses(errors.message, 'resize-y')}
                  {...register('message')}
                />
              </FormField>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600">
                  <input
                    type="checkbox"
                    required
                    {...register('lgpdConsent')}
                    aria-invalid={Boolean(errors.lgpdConsent)}
                    aria-describedby={
                      errors.lgpdConsent
                        ? 'lead-consent-error'
                        : undefined
                    }
                    className="mt-1 h-5 w-5 shrink-0 accent-brand"
                  />
                  Autorizo o uso dos meus dados para receber contato,
                  conforme a LGPD.
                </label>

                {errors.lgpdConsent && (
                  <p
                    id="lead-consent-error"
                    className="mt-2 text-sm text-red-700"
                  >
                    {errors.lgpdConsent.message}
                  </p>
                )}
              </div>

              {errors.root && (
                <p role="alert" className="text-sm text-red-700">
                  {errors.root.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full"
              >
                <Send size={17} aria-hidden="true" />
                {isSubmitting ? 'Enviando...' : 'Solicitar atendimento'}
              </Button>
            </fieldset>
          </form>
        )}
      </Card>
    </div>
  );
}
