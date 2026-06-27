"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ModalsGenericModal as GenericModal,
  SelectInput,
} from "../../libs/react-ultimate-components/src";
import { authenticateWithGoogle, registerUser } from "../../services/auth";
import { setAuthToken } from "../../services/http";
import { useCities } from "../hooks/useCities";
import { useNeighborhoods } from "../hooks/useNeighborhoods";
import { useAuthStore } from "../stores/useAuthStore";

interface GoogleRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  name: string;
  photoUrl?: string;
}

interface RegistrationFormData {
  name: string;
  address: string;
  uf: string;
  cityId: string;
  neighborhood: string;
}

export default function GoogleRegistrationModal({
  open,
  onClose,
  email,
  name,
  photoUrl,
}: GoogleRegistrationModalProps) {
  const login = useAuthStore((state) => state.login);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    defaultValues: { name, address: "", uf: "", cityId: "", neighborhood: "" },
    mode: "onBlur",
  });

  const selectedUf = watch("uf");
  const selectedCityId = watch("cityId");

  const {
    ufOptions,
    citiesByUf,
    cityNameById,
    isLoading: isLoadingCities,
  } = useCities();
  const cityOptions = citiesByUf(selectedUf);
  const selectedCityName = cityNameById(selectedCityId);
  const { neighborhoods, isLoading: isLoadingNeighborhoods } =
    useNeighborhoods(selectedCityName);

  const neighborhoodOptions = neighborhoods.map((option) => ({
    label: option,
    value: option,
  }));

  async function onSubmit(data: RegistrationFormData) {
    setSubmitError(null);
    try {
      const newUser = await registerUser({
        name: data.name.trim(),
        email,
        password: crypto.randomUUID(),
        address: data.address.trim(),
        neighborhood: data.neighborhood.trim(),
        // Vincula o usuário ao tenant (cidade) selecionado no formulário.
        cityId: data.cityId,
        city: cityNameById(data.cityId),
        uf: data.uf,
        isCouncilman: false,
        isAdmin: false,
      });

      const { token } = await authenticateWithGoogle(newUser.email);
      setAuthToken(token);
      login({
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token,
        photoUrl,
      });
      onClose();
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : "Erro ao realizar cadastro. Tente novamente."
      );
    }
  }

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title="Complete seu cadastro"
      description={`Conta Google identificada como ${email}. Preencha os dados abaixo para continuar.`}
      size="lg"
      className="rounded-[1.75rem] border border-border-card/70 bg-bg-card"
      showCancelButton
      showConfirmButton
      cancelButtonLabel="Cancelar"
      confirmButtonLabel={isSubmitting ? "Cadastrando..." : "Criar conta"}
      confirmButtonDisabled={isSubmitting}
      onConfirm={handleSubmit(onSubmit)}
      cancelButtonClassName="rounded-2xl border border-foreground/15 bg-background px-5 py-3 font-semibold text-foreground hover:bg-foreground/5"
      confirmButtonClassName="rounded-sm bg-primary-500 px-5 py-3 font-medium text-white hover:bg-primary-600 disabled:opacity-50"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome completo" error={errors.name?.message}>
            <input
              id="reg-name"
              type="text"
              placeholder="Seu nome completo"
              className={inputClass(Boolean(errors.name))}
              {...register("name", {
                required: "Nome é obrigatório",
                minLength: { value: 2, message: "Nome deve ter ao menos 2 caracteres" },
              })}
            />
          </Field>

          <Field label="E-mail">
            <input
              id="reg-email"
              type="email"
              value={email}
              readOnly
              className={inputClass(false) + " cursor-not-allowed opacity-60"}
            />
          </Field>

          <Field label="Endereço" error={errors.address?.message} className="sm:col-span-2">
            <input
              id="reg-address"
              type="text"
              placeholder="Rua, número e complemento"
              className={inputClass(Boolean(errors.address))}
              {...register("address", { required: "Endereço é obrigatório" })}
            />
          </Field>

          <Controller
            control={control}
            name="uf"
            rules={{ required: "UF é obrigatória" }}
            render={({ field }) => (
              <SelectInput
                label="UF"
                options={ufOptions}
                value={
                  ufOptions.find((option) => option.value === field.value) ??
                  null
                }
                onSelectOption={(option) => {
                  field.onChange(String(option?.value ?? ""));
                  // Limpa as seleções dependentes ao trocar de UF
                  setValue("cityId", "");
                  setValue("neighborhood", "");
                }}
                placeholder={
                  isLoadingCities ? "Carregando UFs..." : "Selecione a UF"
                }
                isDisabled={isLoadingCities}
                errorMessage={errors.uf?.message}
                containerClassName="w-full"
              />
            )}
          />

          <Controller
            control={control}
            name="cityId"
            rules={{ required: "Cidade é obrigatória" }}
            render={({ field }) => (
              <SelectInput
                label="Cidade"
                options={cityOptions}
                value={
                  cityOptions.find((option) => option.value === field.value) ??
                  null
                }
                onSelectOption={(option) => {
                  field.onChange(String(option?.value ?? ""));
                  // Limpa o bairro ao trocar de cidade
                  setValue("neighborhood", "");
                }}
                placeholder={
                  !selectedUf
                    ? "Selecione a UF primeiro"
                    : isLoadingCities
                      ? "Carregando cidades..."
                      : "Selecione a cidade"
                }
                isDisabled={!selectedUf || isLoadingCities}
                errorMessage={errors.cityId?.message}
                containerClassName="w-full"
              />
            )}
          />

          <Controller
            control={control}
            name="neighborhood"
            rules={{ required: "Bairro é obrigatório" }}
            render={({ field }) => (
              <SelectInput
                label="Bairro"
                options={neighborhoodOptions}
                value={
                  neighborhoodOptions.find(
                    (option) => option.value === field.value
                  ) ?? null
                }
                onSelectOption={(option) =>
                  field.onChange(String(option?.value ?? ""))
                }
                placeholder={
                  !selectedCityId
                    ? "Selecione a cidade primeiro"
                    : isLoadingNeighborhoods
                      ? "Carregando bairros..."
                      : "Selecione o bairro"
                }
                isDisabled={!selectedCityId || isLoadingNeighborhoods}
                errorMessage={errors.neighborhood?.message}
                containerClassName="w-full sm:col-span-2"
              />
            )}
          />

        </div>

        {submitError && (
          <p className="rounded-sm border border-destructive-500/20 bg-destructive-500/10 px-4 py-3 text-sm text-destructive-500">
            {submitError}
          </p>
        )}
      </form>
    </GenericModal>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-sm border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition",
    "placeholder:text-foreground/40",
    "focus:ring-2 focus:ring-primary-500/30",
    hasError
      ? "border-destructive-500 focus:border-destructive-500"
      : "border-border-card focus:border-primary-500",
  ].join(" ");
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

function Field({ label, error, children, className }: FieldProps) {
  return (
    <div className={["flex flex-col gap-1.5", className].filter(Boolean).join(" ")}>
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive-500">{error}</p>}
    </div>
  );
}
