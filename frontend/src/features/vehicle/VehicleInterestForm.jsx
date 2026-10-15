import { useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { CheckCircle2, Send } from 'lucide-react';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { FormField } from '../../components/FormField';
import { maskPhone } from '../../lib/masks';
import { fieldClasses } from '../../lib/formField';
import { interestSchema } from '../../lib/interestSchema';
import { sendVehicleInterest } from './vehicleLeadApi';

export function VehicleInterestForm({ vehicle }) {
  const [result, setResult] = useState(null);
  const sending = useRef(false);
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

  async function submit(values) {
    if (sending.current) return;
    sending.current = true;
    try {
      setResult(await sendVehicleInterest(vehicle, values));
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
          if (typeof invalidParams[key] === 'string')
            setError(key, { type: 'server', message: invalidParams[key] });
        }
      }
      setError('root', {
        message:
          error.response?.status === 429
            ? 'Muitas solicitações. Aguarde um pouco antes de tentar novamente.'
            : 'Não foi possível enviar seu interesse. Seus dados foram mantidos; tente novamente.',
      });
    } finally {
      sending.current = false;
    }
  }

  return (
    <Card
      as="section"
      aria-labelledby="vehicle-interest-title"
      className="sm:p-6"
    >
      <h2
        id="vehicle-interest-title"
        className="text-xl font-bold text-slate-950"
      >
        Tenho interesse neste veículo
      </h2>
      {vehicle.status !== 'DISPONIVEL' ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-600">
            Esta unidade não está disponível para novas solicitações. Confira as
            outras opções do modelo ou visite o estoque.
          </p>
          <Button to="/estoque" variant="outline">
            Ver estoque
          </Button>
        </div>
      ) : result ? (
        <div role="status" className="mt-5 space-y-3">
          <CheckCircle2 size={30} aria-hidden="true" className="text-brand" />
          <p className="font-semibold text-slate-900">
            {result.simulated
              ? 'Formulário de teste validado.'
              : 'Recebemos seu interesse!'}
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            {result.simulated
              ? 'Nenhum dado foi enviado. O envio real depende da conexão com o atendimento.'
              : 'Nossa equipe entrará em contato sobre o veículo escolhido.'}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-5 mt-2 text-sm leading-relaxed text-slate-600">
            Preencha seus dados e nossa equipe entra em contato com você.
          </p>
          <form
            aria-label="Interesse no veículo"
            noValidate
            onSubmit={handleSubmit(submit)}
          >
            <fieldset
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="space-y-4"
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
                id="vehicle-interest-message"
                label="Mensagem (opcional)"
                error={errors.message?.message}
              >
                <textarea
                  id="vehicle-interest-message"
                  rows={3}
                  maxLength={5000}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message
                      ? 'vehicle-interest-message-error'
                      : undefined
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
                        ? 'vehicle-interest-consent-error'
                        : undefined
                    }
                    className="mt-1 h-5 w-5 shrink-0 accent-brand"
                  />
                  Autorizo o uso dos meus dados para receber contato sobre este
                  veículo, conforme a LGPD.
                </label>
                {errors.lgpdConsent && (
                  <p
                    id="vehicle-interest-consent-error"
                    className="mt-2 text-sm text-red-700"
                  >
                    {errors.lgpdConsent.message}
                  </p>
                )}
              </div>
              {errors.root && (
                <p
                  role="alert"
                  className="text-sm leading-relaxed text-red-700"
                >
                  {errors.root.message}
                </p>
              )}
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full"
              >
                <Send size={17} aria-hidden="true" />
                {isSubmitting ? 'Enviando…' : 'Quero atendimento'}
              </Button>
              <Link
                to={`/atendimento?${new URLSearchParams({ vehicleSlug: vehicle.slug })}`}
                className="block text-center text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand-hover"
              >
                Fazer pré-cadastro
              </Link>
              <p className="text-center text-xs leading-relaxed text-slate-500">
                Seus dados estão seguros com a Drivelink.
              </p>
            </fieldset>
          </form>
        </>
      )}
    </Card>
  );
}
